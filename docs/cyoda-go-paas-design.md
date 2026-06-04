# Self-Service Multi-Tenant `cyoda-go` PaaS — PRD / Architecture / DevOps

**Document class:** Product Requirements + Technical Architecture + DevOps design (working draft)
**Target system:** Self-service, multi-tenant Platform-as-a-Service built on `cyoda-go` + PostgreSQL
**Operating constraint:** 2-person core engineering team, "zero-ops" posture
**Status:** DRAFT v0.1 — for collaborative iteration. Contains open questions and items flagged *(verify)*.
**Last updated:** 2025-06-02

---

## 0. How to read this document, and what changed

This draft consolidates the prior design conversation into a structured spec. Two corrections have been applied throughout, because both materially change the architecture. They are called out here so they are not lost in the detail.

### Correction A — The client owns and provides the compute-node code (the point you raised)

In the EDBMS model, bespoke business logic (KYC calls, scoring, criteria) lives **outside** `cyoda-go`, in *client compute nodes*. The earlier draft drifted between "the client provides this code" and "our dev team writes and deploys it for them." The correct, invariant position is:

> **The client owns the compute-node code, the repository, the build pipeline, and the artifact.** When the Cyoda organisation writes processor/criteria code for a non-technical client, it always does so **on behalf of** the client — operating *inside the client's own toolchain* (their repository, their pipeline, their isolated registry, their workload identity). The platform control plane never ingests, stores, or holds a privileged backdoor to client source.

This is not merely a contractual nicety; it is the load-bearing security and liability boundary of the whole platform (see §1.3 and §3.2).

### Correction B — Compute nodes *connect into* `cyoda-go`; `cyoda-go` does not call out to them

This is a technical correction sourced from Cyoda's own documentation (`docs.cyoda.net/build/client-compute-nodes`), and it is tightly coupled to Correction A.

The earlier draft described a "twin-engine" flow where `cyoda-go` fires an outbound gRPC request to a sleeping Cloud Run "processor" service that wakes on demand and returns a result. **That is the wrong direction.** The real model:

> A client compute node is a **calculation member**: an external gRPC client that opens a **persistent, bidirectional gRPC stream into the `cyoda-go` platform**, performs a Join handshake, and then receives *pushed* processor/criteria work over that stream, returning results on the same stream. The connection is kept alive with heartbeats.

Consequences that ripple through this document:

- `cyoda-go` is the gRPC **server**; the client compute node is the gRPC **client** that dials in. There is no "processor URL" for `cyoda-go` to call.
- A calculation member must hold an open stream to receive work, so it **cannot** scale-to-zero in the naive request-driven Cloud Run sense. The scale-to-zero story has to be reworked (see §2.5 and the open questions in Part IV).
- Provisioning therefore does **not** inject a processor endpoint into the core; instead the compute node is configured with the core's gRPC endpoint + a JWT, and it joins.

Everything below assumes Corrections A and B.

---

# PART I — PRODUCT REQUIREMENTS (PRD)

## 1.1 Vision and value proposition

A fully managed PaaS that lets fintech startups run production-grade regulatory and financial workflows on `cyoda-go` + PostgreSQL from day one, with a continuous path from prototype → MVP → production **without re-architecting**.

The wedge is not "a database." It is an **institutional-grade fintech core from day one, without the institutional price tag or operations team** — sold as software *plus* paid advisory and development resourcing. Because `cyoda-go` is an EDBMS (state machine, processors, and complete revision history committed atomically inside each entity), every application built on it has an immutable, point-in-time-queryable audit trail by construction — the single most useful artifact a pre-banking-partner fintech can show an auditor or VC.

**The promise to the founder:** *"We build your prototype in weeks on the exact architecture a regulated institution would use. When you go from 10 alpha users to live transaction volume, you change no backend architecture and no data model."*

## 1.2 ICP and personas

**ICP:** Early-stage fintech startups that are non-technical or light on in-house engineering, on a production/compliance path from the start (KYC, AML, ledgering, loan origination, escrow). They fear regulatory rejection and throwaway prototypes far more than they care about Go binaries or Postgres tuning.

| Persona | Role | What they touch |
| --- | --- | --- |
| **Founder (Tenant owner)** | Owns the business relationship, subscription, and regulatory liability. Non-technical. | Dashboard: workflow visualisation, live entities, audit timeline, system health. Never touches code. |
| **Tenant's engineer / agency** *(may be us, acting on their behalf)* | Authors compute-node code (processors/criteria), owns the repo + pipeline. | Their Git repo, their CI, their isolated registry, their workload identity. See §3.2. |
| **Platform team (us, 2 people)** | Operates the control plane and the managed `cyoda-go` core. Provides advisory + dev resourcing. | Control plane, core engine image, edge routing, provisioning automation. Never holds client source. |

> **The "on behalf of" rule made concrete:** when our dev resourcing writes a KYC processor for a non-technical founder, we commit to *the client's* repository and trigger *the client's* pipeline. We are a contributor inside their boundary, not an alternate, privileged path around it.

## 1.3 The ownership / responsibility boundary (load-bearing)

This table is the contract the rest of the architecture must enforce.

| Concern | Owned by | Notes |
| --- | --- | --- |
| Entity models, workflow JSON, state machines | Shared (platform authors on behalf of client; client owns) | Stored in client-controlled config; imported into the core. |
| Compute-node source code (processors/criteria) | **Client** | Platform may author *on behalf of*, inside client toolchain. Never stored by control plane. |
| Compute-node build pipeline + artifact | **Client** | Client's CI, client's isolated registry. |
| `cyoda-go` core engine image | **Platform** | Single official image, versioned, reused across tenants. |
| Storage (schema/instance), routing, secrets brokering | **Platform** | Provisioned per tenant by the control plane. |
| Regulatory liability for business logic | **Client** | Reinforced by the fact that the client owns and ships the code. |
| Infrastructure availability (compute/db/edge) | **Cloud vendors** (Google / Neon / Cloudflare) | The "zero-ops" lever — see §1.4. |

## 1.4 Non-functional requirements

- **Zero-ops:** No component may require the 2-person team to maintain a server, run an on-call rotation, or perform middle-of-the-night recovery. If a component cannot auto-heal and auto-scale unattended, it does not ship. Availability of compute, database, and edge is outsourced to Google Cloud Run, Neon, and Cloudflare respectively.
- **Cost-to-near-zero when idle:** Storage-only baseline for idle tenants. *(Note: Correction B complicates pure scale-to-zero for the compute member — see §2.5 and Part IV.)*
- **No-rewrite graduation:** Prototype → production must be an infrastructure change (schema → dedicated instance), never a code or data-model change.
- **Structural isolation:** Cross-tenant data access must be impossible at the database layer, not merely discouraged by application logic.
- **Compliance baseline:** Designed to support SOC 2 Type II and institutional vendor-risk review through enforced separation of duties (client owns code; platform owns infra; neither crosses) and the EDBMS's intrinsic immutable audit trail.

## 1.5 Functional requirements matrix

| Module | Feature | Requirement | Isolation rule |
| --- | --- | --- | --- |
| Onboarding | Programmatic provisioning | Signup / API call triggers isolated creation of DB schema, core service, routing, and the client's deploy identity. | Separate DB credentials and execution contexts per tenant. |
| Storage | Managed entity/event storage | Headless `cyoda-go` core mapped to an isolated Postgres schema per tenant. | Cross-tenant inspection structurally impossible. |
| Compute onboarding | Isolated client registry + deploy identity | Each tenant gets a private registry and a federated identity to push compute-node images **from their own pipeline**. | Tenant A cannot view, pull, or overwrite Tenant B's images. |
| Deployment | Self-service rollout | Client pipeline (not the platform) builds and ships the compute node; a tenant-scoped trigger requests a rolling update of the member runtime. | Trigger authenticated via tenant-scoped credentials. |
| Observability | Segmented logs | Core + compute-node logs surfaced in the tenant dashboard. | Filtered at the platform layer; no cross-tenant leakage. |
| Audit | Temporal timeline | Expose `cyoda-go`'s point-in-time history as an audit view. | Per-tenant scope enforced by core auth context. |

## 1.6 Scope

**In scope (v1):** managed core, schema-per-tenant storage, self-service client deploy path, edge routing, provisioning control plane, audit/observability surfaces, advisory + dev-resourcing service wrap.

**Out of scope (v1):** dedicated single-tenant production tier automation (manual runbook at first — §3.5), the `cassandra` commercial backend (Postgres only initially), high-frequency / low-latency trading workloads (ICP is low-volume, high-value regulatory).

---

# PART II — SYSTEM ARCHITECTURE

## 2.1 Context diagram

```
   [ Inbound client HTTPS / API traffic ]
                  │
                  ▼
   [ Cloudflare Worker — edge router ]
   (hostname → tenant core, KV-backed)
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
    Tenant 1            Tenant 2          ... (one column per tenant)
```

Per tenant (the data plane), three components:

```
   [ cyoda-go core ]            ◄── platform-owned
   Cloud Run, gRPC SERVER           (official image)
        ▲          │
        │          │ (3) core PUSHES processor /
   (1) member      │     criteria work down stream
   dials IN,       │
   (2) Join +      ▼
   keep-alive   [ compute member ]   ◄── CLIENT-OWNED
   holds the    Cloud Run / worker       (calculation member;
   stream open  gRPC CLIENT               client's image)

   [ cyoda-go core ]
        │
        ▼
   [ Neon: schema_<tenant> ]    ◄── serverless Postgres
                                    (isolated schema per tenant)
```

Read the core↔member link carefully (this is Correction B): the
**member opens and holds the bidirectional stream** (dials IN, sends
Join, sustains keep-alives); the **core pushes work down that stream**.
The core never dials out to the member.

## 2.2 Control plane vs data plane

- **Data plane:** the per-tenant `cyoda-go` core, the client's compute member, and the tenant's Postgres schema/instance. This is where regulated work happens.
- **Control plane:** a single Go service (the platform admin service) that handles tenant lifecycle, provisioning, routing config, secret brokering, billing hooks, and observability proxying. It is the only thing the 2-person team operates. It **never** contains client application source.

## 2.3 The `cyoda-go` compute model (authoritative)

`cyoda-go` is an EDBMS: the unit is an **entity** — a typed document carrying lifecycle state, full revision history, and transactional integrity. Workflows are state machines whose transitions can reference **processors** (actions) and **criteria** (boolean conditions). Both can be *externalized* to client compute nodes, declared in the workflow JSON.

**Calculation member protocol (per Cyoda docs — verify exact fields against `docs.cyoda.net`):**

1. Client compute node opens a bidirectional gRPC stream to the core and sends a **Join** event.
2. Core responds with a **Greet**.
3. Core **pushes** `EntityProcessorCalculationRequest` / `EntityCriteriaCalculationRequest` messages down the stream.
4. Member executes business logic and returns `...CalculationResponse` on the same stream.
5. **Keep-alive** heartbeats flow bidirectionally to maintain the connection.

Payloads are CloudEvents (Protobuf envelope, JSON payload). The stream is authenticated with a **JWT**. Official gRPC client libraries exist for Java, Python, Go, and Kotlin.

> **Design implication:** the platform configures each tenant's compute member with (a) the core's gRPC endpoint and (b) a tenant-scoped JWT. The member dials in and joins. There is no inbound HTTP "processor service" to route to, and nothing for the core to call out to.

## 2.4 Storage tier — Neon serverless Postgres

`cyoda-go` selects its backend via `CYODA_STORAGE_BACKEND` *(verified env var)*; we standardize on `postgres`, hosted on Neon for managed pooling (integrated PgBouncer), autoscaling, and point-in-time recovery.

**Multi-tenant model — schema-per-tenant with Postgres RBAC:**

```sql
-- Executed by the control plane during tenant setup (illustrative)
CREATE ROLE tenant_abc_runtime WITH LOGIN PASSWORD '<generated>';
CREATE SCHEMA tenant_abc_schema AUTHORIZATION tenant_abc_runtime;
ALTER ROLE tenant_abc_runtime SET search_path TO tenant_abc_schema;
REVOKE ALL ON DATABASE platform_main_db FROM PUBLIC;
GRANT CONNECT ON DATABASE platform_main_db TO tenant_abc_runtime;
GRANT USAGE, CREATE ON SCHEMA tenant_abc_schema TO tenant_abc_runtime;
```

Each core connects through Neon's pooler in transaction mode, with the connection string forcing schema routing:

```
CYODA_STORAGE_BACKEND=postgres
CYODA_DATABASE_URL=postgres://tenant_abc_runtime:<pw>@<pooler-host>.neon.tech/platform_main_db?sslmode=require&search_path=tenant_abc_schema
```

*(Verify exact `cyoda-go` Postgres connection/config variable names against `docs.cyoda.net/reference/configuration`.)*

**Operational walls to design out from day one:**

- *Connection exhaustion* under serverless fan-out → always route via Neon's pooler, never direct.
- *Migration fan-out* across many schemas → a control-plane Go migration runner that iterates tenant connections sequentially, validating each step and halting safely on failure.

## 2.5 Compute tier — Cloud Run

Two distinct Cloud Run services per tenant.

**Service A — `cyoda-core-<tenant>` (platform-owned).** The official `cyoda-go` image, stateless, connecting to the tenant's Neon schema, acting as the gRPC server for calculation members and exposing the tenant API. Auto-heals on panic via Cloud Run.

**Service B — `cyoda-compute-<tenant>` (client-owned calculation member).** The client's image, running their processors/criteria, dialing **into** Service A and joining as a calculation member.

> **Scale-to-zero, reconsidered (Correction B):** Service A (core/server) can sit at `min instances = 0` and wake on inbound traffic. Service B (the member) needs an open stream to receive pushed work, so a naive `min = 0` request-driven Cloud Run service will not stay connected while idle. This is an unresolved design point — candidate approaches in Part IV. For the ICP's low-volume KYC profile, a pragmatic v1 is **Service B at `min = 1`** (a single small always-connected member ≈ a few dollars/month) while we validate whether an event-woken connect-drain-disconnect pattern is viable against the core's dispatch semantics.

## 2.6 Edge routing — Cloudflare Workers

Wildcard DNS + SSL + DDoS at Cloudflare. A Worker reads the tenant from the hostname (`api.<tenant>.platform.com`), looks up the target in Cloudflare KV (`<tenant> → cyoda-core-<tenant> URL`), and proxies. No always-on custom proxy container to crash; Cloudflare owns this layer's uptime.

## 2.7 Authentication and identity

- **End-user / API auth into the tenant:** JWT, brokered via an external IdP (e.g. Clerk/Kinde) with `tenant_id` and roles in claims. *(Verify `cyoda-go`'s exact JWT configuration — flag the draft's `CYODA_IAM_MODE` / `CYODA_JWT_SIGNING_KEY_FILE` names as unconfirmed against current docs.)*
- **Compute-member auth:** the member presents a tenant-scoped JWT when opening its gRPC stream to the core.
- **Client deploy identity:** OIDC workload-identity federation, never long-lived keys (see §3.2).

## 2.8 Asynchronous and long-running workflows

KYC/AML are inherently slow (vendor callbacks, manual review). The pattern leans on the state machine, not on holding connections:

```
[User submits KYC]
        │
        ▼
   core wakes → transition writes
   state PENDING_VENDOR → entity
   parked durably (core can sleep)
        ┊
        ┊  (minutes / hours / days)
        ▼
[Vendor webhook arrives]
        │
        ▼
   core wakes → verify signature →
   transition → APPROVED / MANUAL_REVIEW
```

- Park slow work as durable entity state; do not hold a gRPC call open for hours.
- Front inbound webhooks with a managed durable queue (Cloud Tasks or Cloudflare Queues) for at-least-once delivery and automatic retry through migrations/restarts.
- Two schemas per tenant (`*_sandbox`, `*_production`) give an effortless demo/live split; the workflow JSON is identical, so promotion is config copy, not re-engineering.

## 2.9 Safeguards on the untrusted seam

Because compute-node code is client-owned and untrusted from the platform's perspective:

- **Hard deadlines** on processor/criteria execution; on timeout the core aborts the transaction boundary and moves the entity to a retry state.
- **Idempotency required** of client members (defend against re-delivery by keying on the transaction/request id). The docs reference idempotency, retry policies, reconnection, and graceful shutdown for members — adopt these as a published client contract.
- **Blast-radius isolation:** a buggy/looping client member degrades only that tenant's processing; the core, the database, and other tenants are unaffected. Cloud Run restarts the member on the next connection.

---

# PART III — DEVOPS, DEPLOYMENT & CLIENT CI/CD

## 3.1 Control-plane provisioning (Pulumi Automation API)

The control plane embeds Pulumi's Go SDK (Automation API) so a native Go function provisions a tenant's infrastructure on signup — no shell scripts, no separate orchestration server. Provisioning lifecycle:

1. **Database (Neon API):** create isolated schema + role + generated password; obtain pooled connection string.
2. **Core compute (Cloud Run):** deploy `cyoda-core-<tenant>` from the official image; inject `CYODA_STORAGE_BACKEND=postgres` and `CYODA_DATABASE_URL`; `min = 0`; gRPC ingress enabled.
3. **Client deploy surface:** provision the tenant's **isolated registry** and **workload-identity binding** (so the *client's* pipeline can push). The control plane does **not** build or supply the compute image — it only creates the place and the permission for the client to ship into. *(This is the structural expression of Correction A.)*
4. **Edge routing (Cloudflare API):** add `api.<tenant>.platform.com` and update the Worker KV map.

**Idempotent, saga-style provisioning (no 24/7 ops):** track tenant state (`PROVISIONING_DB → PROVISIONING_COMPUTE → PROVISIONING_ROUTING → READY`). On mid-way failure, run a compensating cleanup of partial resources and alert via Slack. Never leave dangling infra.

## 3.2 The self-service client deployment path (the heart of Correction A)

**Principle:** the platform team never accesses client codebases. Clients (or we, acting on their behalf inside their boundary) connect *their* pipeline to *their* isolated registry via asymmetric OIDC identity federation. No long-lived cloud credentials are ever shared.

**Workload-identity binding (control-plane side, illustrative):**

```shell
# Authorize ONLY this specific client repo to assume the tenant's uploader role
gcloud iam workload-identity-pools providers create-oidc "provider-${TENANT_ID}" \
  --location="global" --workload-identity-pool="client-ci-pool" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository"

gcloud iam service-accounts add-iam-policy-binding "sa-${TENANT_ID}-uploader@platform-prod.iam.gserviceaccount.com" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://.../attribute.repository/${CLIENT_GH_ORG}/${CLIENT_GH_REPO}"
```

**Client-side pipeline (lives in the client's repo, provided as a template):** authenticate via OIDC → build the compute-member image → push to the tenant's isolated registry → call the control-plane rollout endpoint with a tenant-scoped token.

```yaml
name: Deploy compute member to platform
on: { push: { branches: [ main ] } }
permissions: { id-token: write, contents: read }
jobs:
  build-and-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: 'projects/.../providers/provider-<tenant>'
          service_account: 'sa-<tenant>-uploader@platform-prod.iam.gserviceaccount.com'
      - run: gcloud auth configure-docker us-central1-docker.pkg.dev
      - run: |
          IMG="us-central1-docker.pkg.dev/platform-prod/tenant-<tenant>-compute/member:${{ github.sha }}"
          docker build -t "$IMG" . && docker push "$IMG"
      - run: |
          curl -X POST https://api.platform.com/v1/deployments/rollout \
            -H "Authorization: Bearer ${{ secrets.PLATFORM_TENANT_TOKEN }}" \
            -d '{"tenant_id":"<tenant>","commit_sha":"${{ github.sha }}"}'
```

> **When we build the processor for a non-technical client**, our engineers commit to *this* repo and let *this* pipeline run. We never push to a registry the client doesn't own, and we never feed source into the control plane. "Cyoda does it" always reduces to "Cyoda did it inside the client's toolchain."

**Rollout:** the control-plane endpoint updates `cyoda-compute-<tenant>` to the new image tag; Cloud Run performs a rolling restart; the new member re-establishes its stream to the core (reconnection is part of the member contract).

## 3.3 Workflow configuration management

Entity models and workflow JSON (state machines, externalized processor/criteria declarations) are version-controlled and imported into the core through `cyoda-go`'s model-import API. The core pulls structural rules from a controlled config source at boot — no SSH into running containers, ever.

## 3.4 Observability and log isolation

Core and compute-member containers log to stdout/stderr; Google Cloud Logging captures and indexes automatically. The control plane surfaces logs in the tenant dashboard via a *tokenized, tenant-scoped filter* (e.g. restricting to that tenant's two service names), so clients can debug without any path to cross-tenant data. No log-aggregation cluster for the team to run.

## 3.5 Tenant graduation runbook (prototype → production)

When a banking partner demands hardware/network-level isolation:

1. Provision a dedicated Neon project (or RDS) for the tenant.
2. Export the tenant's schema + data; import into the dedicated instance.
3. Repoint `cyoda-core-<tenant>`'s `CYODA_DATABASE_URL`; set core `min = 1` and dedicated CPU/RAM.
4. (If applicable) move the compute member to dedicated capacity.
5. No code change, no data-model change — the no-rewrite promise, kept.

v1: manual, checklist-driven. v2: automate behind a control-plane "graduate" action.

---

# PART IV — OPEN QUESTIONS / DECISIONS TO RESOLVE TOGETHER

1. **Compute-member scale-to-zero (highest priority).** Given members must hold a stream, how do we honor "near-zero idle cost"? Candidates: (a) `min = 1` tiny member per tenant; (b) a pooled shared member fleet keyed by tenant with per-message auth (weakens isolation — likely no); (c) an event-woken *connect → drain → disconnect* pattern, contingent on the core's dispatch/queueing semantics when no member is connected. **Need to confirm against `cyoda-go`: does the core durably queue pending processor/criteria work for a model that currently has no connected member, and re-dispatch on Join?** This single answer decides the cost model.
2. **PII handling.** Store raw PII in Postgres, or tokenize and store only vendor references + state outcomes? Affects compliance scope and the audit-trail design.
3. **Core multi-tenancy granularity.** One core service per tenant (clean isolation, more services to manage) vs. a shared core pool with tenant context from JWT + schema routing (cheaper, weaker isolation). Draft assumes per-tenant core; confirm cost/ops trade-off at scale.
4. **Verify against current Cyoda docs:** exact JWT/auth config variable names; exact Postgres connection variable names; calculation-member execution modes (sync vs async) and retry-policy fields; whether `cyoda-go` exposes the model-import and audit/temporal surfaces we assume.
5. **Billing trigger.** Stripe/Lemon Squeezy `checkout.session.completed` → provisioning saga. Define the metering basis (per active tenant, per workflow, per storage GB) once Q1 is resolved.
6. **Cyoda Cloud relationship.** Cyoda ships its own managed "Cyoda Cloud." Decide positioning: are we a thin reseller/value-add (advisory + fintech templates) on top of their cloud, or do we self-host the OSS core? This affects everything downstream and should be settled early.

---

## Appendix A — Glossary

- **EDBMS** — Entity Database Management System; storage where the first-class unit is a stateful entity with schema, lifecycle, history, and transactional integrity.
- **Entity** — typed document with lifecycle state + full revision history, committed atomically.
- **Processor** — externalized action run on a transition (client compute node).
- **Criteria** — externalized boolean condition gating a transition (client compute node).
- **Calculation member** — an external gRPC client that joins the core's processing stream and executes processors/criteria.
- **Control plane / Data plane** — the platform admin service vs. the per-tenant running system.

## Appendix B — References

- `cyoda-go` source: github.com/Cyoda-platform/cyoda-go
- Docs: docs.cyoda.net (see *Client compute nodes*, *Workflows and processors*, *Configuration*, *Authentication and identity*, *Cyoda Cloud*)
- Cyoda Cloud / platform: cyoda.com

## Appendix C — Correction log

- **A** — Client owns/provides compute-node code; platform acts only "on behalf of" via the client's toolchain. Applied in §0, §1.2, §1.3, §3.1, §3.2.
- **B** — Compute nodes are calculation members that dial into the core over a persistent bidirectional gRPC stream; the core does not call out to them. Applied in §0, §2.1, §2.3, §2.5, §3.2, Part IV.
