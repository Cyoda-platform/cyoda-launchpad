# Content & Functional Requirements — Cyoda Website

Requirements use EARS format: "When/Where [condition], the system shall [behaviour]."
Exact copy is quoted in backticks or block-quotes. Do not substitute placeholder text.

---

## REQ-SEO: Page Titles, Meta Descriptions, and Canonical Tags

### Critical background
`src/components/SEO.tsx` auto-appends `| Cyoda` to every title:
`const fullTitle = \`${title} | ${siteName}\``
This creates titles >60 chars and means every page with the same `title` prop renders identically.

**Required SEO.tsx fix first**: Change to `const fullTitle = title` (no auto-append).
Then each page must pass its own complete title string. Every page must also pass an explicit
`url` prop so the canonical tag has a value (the component already generates the tag from `currentUrl`).

### Required title/description/canonical per page

| Page | Title (pass as-is — include "| Cyoda" where shown) | Meta Description (150–160 chars) | Canonical URL |
|---|---|---|---|
| `/` | `Cyoda \| Unified Platform for Stateful Workflows in Financial Services` | `The unified platform that replaces Postgres + Kafka + Camunda for teams building stateful, auditable workflows in regulated financial services.` | `https://cyoda.com/` |
| `/use-cases` | `Use Cases \| Cyoda` | `See how Cyoda powers loan lifecycle management, trade settlement, KYC onboarding, and agentic AI in financial services.` | `https://cyoda.com/use-cases` |
| `/use-cases/loan-lifecycle` | `Loan Origination & Lifecycle Management \| Cyoda` | `Manage multi-stage loan approval, drawdown, repayment, and default states with immutable audit and serialized concurrent writes.` | `https://cyoda.com/use-cases/loan-lifecycle` |
| `/use-cases/trade-settlement` | `Trade Settlement & Regulatory Reporting \| Cyoda` | `Every trade state is a regulatory event. Cyoda gives you point-in-time reconstruction — no ETL pipeline or separate data warehouse required.` | `https://cyoda.com/use-cases/trade-settlement` |
| `/use-cases/kyc-onboarding` | `KYC & Customer Onboarding \| Cyoda` | `Model KYC as entity state transitions with durable retry. Point-in-time storage answers what you knew at decision time — with no custom audit code.` | `https://cyoda.com/use-cases/kyc-onboarding` |
| `/use-cases/agentic-ai` | `Agentic AI for Regulated Industries \| Cyoda` | `AI agent actions need platform-level consistency. Cyoda gives every agent action an immutable audit trail within the same entity consistency model.` | `https://cyoda.com/use-cases/agentic-ai` |
| `/about` | `About \| Cyoda` | `Built by engineers who spent careers at LCH, Dresdner Kleinwort, Macquarie, and Westpac. Cyoda reflects what financial back-office systems actually need.` | `https://cyoda.com/about` |
| `/contact` | `Contact \| Cyoda` | `Talk to the Cyoda team about your use case. We respond within one business day.` | `https://cyoda.com/contact` |
| `/blog` | `Blog \| Cyoda` | `Technical articles on stateful systems, entity databases, and financial workflow engineering from the Cyoda team.` | `https://cyoda.com/blog` |
| `/dev` | `For Developers \| Cyoda` | `A developer-first platform for building stateful, event-driven applications. Free tier at ai.cyoda.net — no credit card required.` | `https://cyoda.com/dev` |
| `/cto` | `For Engineering Leaders \| Cyoda` | `Replace the Postgres + Kafka + Camunda patchwork with one consistency model. Built for teams where correctness and audit are non-negotiable.` | `https://cyoda.com/cto` |

---

## REQ-CTO-H1: Fix Duplicate H1 on `/cto`

`src/pages/Cto.tsx` renders two `<h1>` elements — a hard HTML and SEO error.
Change the second `<h1>` to `<h2>`. Do not change any other content on the page.

---

## REQ-SITEMAP: Add Missing URLs to `public/sitemap.xml`

The sitemap is a static file (`public/sitemap.xml`) — manually maintained.
Add the following `<url>` entries. Use `<changefreq>monthly</changefreq>` and `<priority>` as shown.

```xml
<url>
  <loc>https://cyoda.com/use-cases</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://cyoda.com/use-cases/loan-lifecycle</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
<url>
  <loc>https://cyoda.com/use-cases/trade-settlement</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
<url>
  <loc>https://cyoda.com/use-cases/kyc-onboarding</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
<url>
  <loc>https://cyoda.com/use-cases/agentic-ai</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
<url>
  <loc>https://cyoda.com/about</loc>
  <changefreq>monthly</changefreq>
  <priority>0.6</priority>
</url>
<url>
  <loc>https://cyoda.com/contact</loc>
  <changefreq>yearly</changefreq>
  <priority>0.5</priority>
</url>
```

---

## REQ-LLMS: Update `public/llms.txt`

Replace the current description with:

```
# Cyoda

Cyoda is the unified platform that replaces Postgres + Kafka + Camunda for fintech teams
building stateful, auditable workflows in regulated financial services.
In production in the European private-debt market since 2017 (VC Trade).

## What Cyoda Is

Cyoda is an EDBMS — Entity Database Management System — that unifies transactional storage,
event-driven processing, and workflow orchestration in a single consistency model.

Core capabilities:
- Serializable Snapshot Isolation across asynchronous distributed workflows
- Immutable state history: every entity state transition is a durable, queryable event
- Point-in-time entity queries — not time-limited like Snowflake time-travel
- Durable retry for external API calls modelled as entity state transitions
- Deploys on Kubernetes or as managed service (ai.cyoda.net — free tier available)

## Who It Is For

Financial services engineering teams building:
- Loan origination and full lifecycle management
- Trade settlement with point-in-time regulatory reporting
- KYC and customer onboarding with full audit trail
- Agentic AI with deterministic, auditable action execution

## What It Replaces

Teams typically run Cyoda instead of: Postgres + Apache Kafka + Camunda/Temporal.
The glue code between those systems — and the partial-failure modes it introduces —
is eliminated when the same consistency model governs storage, events, and workflows.

## Company

Founded: 2012. Full-time: 2015, London.
First production deployment: 2017 (VC Trade, European private-debt market).
Free cloud beta: https://ai.cyoda.net
```

---

## REQ-STRUCTURED-DATA: JSON-LD Schemas

### Organization schema (add to every page via SEO component)

Add a new optional prop `jsonLd?: object` to `src/components/SEO.tsx`.
When provided, render: `<script type="application/ld+json">{JSON.stringify(jsonLd)}</script>`

Add the following Organization schema to every page (pass via `jsonLd` prop in each page):

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Cyoda",
  "url": "https://cyoda.com",
  "description": "The unified platform that replaces Postgres + Kafka + Camunda for teams building stateful, auditable workflows in regulated financial services.",
  "foundingDate": "2012",
  "sameAs": [
    "https://www.linkedin.com/company/cyoda"
  ]
}
```

### BreadcrumbList schema (add to use-case detail pages only)

Each use-case detail page gets a BreadcrumbList. Example for `/use-cases/loan-lifecycle`:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://cyoda.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Use Cases",
      "item": "https://cyoda.com/use-cases"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Loan Origination & Lifecycle Management",
      "item": "https://cyoda.com/use-cases/loan-lifecycle"
    }
  ]
}
```

Adapt `name` and `item` at position 3 for each detail page accordingly.

---

## REQ-ENTITY-MODEL: Replace Warehouse JSON in DeveloperReliabilitySection

`src/components/DeveloperReliabilitySection.tsx` currently shows a warehouse/inventory entity
(fields: `sku`, `warehouseId`, hazmat codes). This directly contradicts fintech positioning.

Replace the `complexEntityJson` constant with the following loan entity:

```json
{
  "loanId": "string",
  "borrowerId": "string",
  "borrowerName": "string",
  "principalAmount": 0,
  "interestRate": 0.0,

  "currentState": "Application",
  "stateHistory": [
    {
      "state": "Application",
      "transitionedAt": "ISO8601",
      "transitionedBy": "string",
      "reason": "string",
      "snapshotRef": "string"
    }
  ],

  "terms": {
    "drawdownDate": "ISO8601",
    "maturityDate": "ISO8601",
    "repaymentSchedule": "monthly|quarterly|bullet",
    "facility": "revolving|term"
  },

  "covenants": [
    {
      "type": "financial|informational",
      "description": "string",
      "breached": false,
      "nextTestDate": "ISO8601"
    }
  ],

  "counterparty": {
    "lenderId": "string",
    "agentBankId": "string|null",
    "jurisdiction": "GB|EU|US"
  }
}
```

Also update the section heading from:
`"Built for Developers Who Demand Reliability"`
to:
`"Built for Developers Who Demand Correctness"`

Valid `currentState` values: `Application → UnderReview → Approved → Active → Settled | Defaulted | Restructured`

---

## REQ-COPY: Copy Fixes

### EDBMS definition — add to homepage
Add this sentence to the homepage Three-System Problem section:
> "The Cyoda EDBMS (Entity Database Management System) unifies transactional storage,
>  event-driven processing, and workflow orchestration in a single consistency model."

### Mission quote — add to homepage
Add a pull-quote section between EcosystemSection and the Use Cases preview:
> "We built Cyoda because we were tired of rebuilding the same infrastructure at every bank
>  we worked at. The problem was always the same — state management, audit, consistency under
>  failure — and the solution was always duct tape. Cyoda is the solution we would have paid for."
Attribution line: `Patrick Stanton & Paul Schleger PhD, Co-Founders`

---

## REQ-NAV: Header Navigation

`src/components/Header.tsx` shall be updated:
- Keep Platform and Solutions dropdowns focused on active routes
- Include use-case links under Solutions
- Both links must also appear in the mobile hamburger drawer
- All other existing nav links remain unchanged

Product and pricing pages have been removed; do not link to those routes.

---

## REQ-FOOTER: Footer

`src/components/Footer.tsx` shall be updated:
- Replace current tagline with: `"The unified platform for stateful, auditable workflows in financial services. In production in European private-debt markets since 2017."`
- Platform column: Use Cases, Docs, Blog
- Company column: About, Support, Contact
- All links route correctly; Contact → `/contact`

---

## REQ-HOMEPAGE: Homepage Sections

### Hero Section (`src/components/HeroSection.tsx`)
Remove the AI chatbot `<Textarea>` widget, form submit handler, and typewriter animation.
Replace with:
1. H1: `"Financial-Grade Systems For Enterprise Backends"` (already correct — keep it)
2. Sub-text: `"The unified platform that replaces Postgres + Kafka + Camunda for teams building stateful, auditable workflows in regulated financial services."`
3. Two CTA buttons:
   - Primary: `"Start Evaluating for Free"` → `https://ai.cyoda.net` (new tab)
   - Ghost: `"See How It Works"` → scrolls to `#how-it-works`
4. Replace 3D node animation with static SVG state machine or clean gradient (see DESIGN.md)
5. Do NOT use `.texture-overlay` class.

### ProofBar
Insert `<ProofBar />` directly below the hero.
Copy: `"In production in the European private-debt market since 2017 · VC Trade"`

### Problem / Architecture Section
Add after ProofBar. `id="how-it-works"` on the `<section>` element.
- Overline: `"THE PROBLEM"`
- H2: `"The Three-System Problem"`
- Body: `"Most teams building stateful financial systems end up stitching together the same stack: Postgres for consistency, Kafka for events, Camunda for workflows. It works — until the DB commits and the event fails to publish. Or the workflow advances incorrectly. Or the regulator asks you to reconstruct entity state from three months ago."`
- Three pain points (AlertCircle icon):
  1. `"Glue code between systems that delivers zero business value"`
  2. `"Partial failure modes: the DB commits, the event doesn't publish"`
  3. `"Audit trails reconstructed from disparate logs — painful under regulatory review"`
- EDBMS definition sentence (see REQ-COPY)
- `<ArchitectureDiagram />` below pain points

### Use Cases Preview Section
Add after EcosystemSection.
- Overline: `"USE CASES"`
- H2: `"Built for Problems That Other Platforms Can't Solve"`
- Four UseCaseCards in 2×2 grid:
  1. "Loan Origination & Lifecycle" → `/use-cases/loan-lifecycle` (icon: `Building2`)
  2. "Trade Settlement & Regulatory Reporting" → `/use-cases/trade-settlement` (icon: `BarChart3`)
  3. "KYC & Customer Onboarding" → `/use-cases/kyc-onboarding` (icon: `UserCheck`)
  4. "Agentic AI for Regulated Industries" → `/use-cases/agentic-ai` (icon: `Bot`)
- `"See all use cases →"` link below grid → `/use-cases`

### EcosystemSection Icons
Change all 6 icon containers in `src/components/EcosystemSection.tsx`:
Before: `className="bg-icon text-icon-foreground ..."`
After: `className="bg-primary/10 text-primary ..."`
Do NOT change icon styling in ThreeStepSection or ThreeBenefitsSection.

---

## REQ-ABOUT: About Page (`src/pages/About.tsx`)

H1: `"Built by People Who Lived the Problem"`

Opening paragraph:
> "Cyoda was not designed from first principles. It was designed by engineers who spent careers
> building the back-office systems that needed it — at LCH, Dresdner Kleinwort, Westpac,
> Macquarie, and Intesa Sanpaolo. The platform reflects what those systems actually needed."

Founder — Patrick Stanton, CEO & Co-Founder:
> "30+ years building core systems for global investment banks. LCH Automated Brokerage Service.
> Dresdner Kleinwort fixed income settlement (Frankfurt). Westpac FX (Sydney). Macquarie treasury
> and equity derivatives — live during the GFC. Intesa Sanpaolo (Milan). Co-founded Cyoda in 2012.
> Mechanical Engineering, University of Leeds."

Founder — Paul Schleger PhD, CTO & Co-Founder:
> "Experimental physicist background. 25 years in financial software. Co-architect of the Entity
> Database Management System concept. Based in Vancouver."

Avatar style: circle with initials (`"PS"` / `"PSch"`), `bg-primary/10 text-primary rounded-full`. No images.

Company timeline (vertical list with `border-l` and dot markers):
- 2012 — Cyoda founded
- 2015 — Full-time operations, London
- 2017 — First production deployment (VC Trade, European private-debt market)
- 2025 — Cyoda Cloud live beta launched (free tier at ai.cyoda.net)

Mission statement:
> "We built Cyoda because we were tired of rebuilding the same infrastructure at every bank
> we worked at. The problem was always the same — state management, audit, consistency under
> failure — and the solution was always duct tape. Cyoda is the solution we would have paid for."

SEO: `<SEO title="About | Cyoda" description="Built by engineers who spent careers at LCH, Dresdner Kleinwort, Macquarie, and Westpac. Cyoda reflects what financial back-office systems actually need." url="https://cyoda.com/about" />`

---

## REQ-USECASES: Use Cases Pages

### Hub Page (`src/pages/UseCases.tsx`)
H1: `"Built for Systems Where Correctness Is Not Optional"`
Sub-text: `"Cyoda is purpose-built for domains where entities have complex lifecycles, where history must be queryable for compliance, and where concurrent writes create consistency challenges."`
Four UseCaseCards linking to detail pages.

### Detail Page Structure (all 4 detail pages)
1. H1 (specific to use case)
2. "THE PROBLEM" overline + problem paragraph
3. "HOW CYODA SOLVES IT" overline + solution paragraph
4. State machine diagram in a `Card` labelled "Entity State Machine" (see DESIGN.md)
5. Feature checkpoints: 4–6 × CheckCircle icon + text
6. Bottom CTA: "Start Your Evaluation" → `https://ai.cyoda.net` + "Talk to the Team" → `/contact`

### Loan Lifecycle (`src/pages/UseCaseLoanLifecycle.tsx`)
H1: `"Loan Origination and Full Lifecycle Management"`
Problem: `"Multi-stage approval workflows, drawdown, repayment, and default states require concurrent consistency and full state history. Most teams patch this with status flags, event logs, and fragile glue code between their database and workflow engine."`
Solution: `"The loan is a Cyoda entity with its own state machine: Submitted → Under Review → Approved → Active → Settled / Defaulted. Every transition is an immutable event. Concurrent updates are serialized per entity. There is no separate audit table and no glue code."`
State machine: `Application → Under Review → Approved → Active → Settled / Defaulted`
Feature checkpoints (minimum 4):
- "Immutable state transitions — every change is a durable, queryable event"
- "Serialized concurrent writes per loan entity — no optimistic locking hacks"
- "Full audit trail without a separate audit table or ETL pipeline"
- "Point-in-time entity queries — reconstruct loan state as of any moment in history"
- "Durable retry on external API calls (credit bureau, KYC) modelled as state transitions"

### Trade Settlement (`src/pages/UseCaseTradeSettlement.tsx`)
H1: `"Trade Settlement and Regulatory Reporting"`
Problem: `"Every trade state — matched, affirmed, settled, failed — is a regulatory event. Regulators expect point-in-time reconstruction. Most teams cannot provide it without a separate data warehouse and ETL pipeline."`
Solution: `"Each trade is a Cyoda entity. Every state transition is an immutable, timestamped event queryable at any consistency time. Distributed reporting runs directly against transactional data — no ETL pipeline, no warehouse copy required."`
State machine: `Pending → Matched → Affirmed → Settled / Failed / Cancelled`
Feature checkpoints:
- "Every trade state transition is an immutable, timestamped, queryable event"
- "Point-in-time entity queries — no separate data warehouse required"
- "Regulatory reporting runs against live transactional data, not a warehouse copy"
- "Concurrent settlement updates serialized per trade entity"
- "Failed states captured with full event context — reconciliation without guesswork"

### KYC Onboarding (`src/pages/UseCaseKycOnboarding.tsx`)
H1: `"KYC and Customer Onboarding with Full Audit Trail"`
Problem: `"External API calls for identity verification and sanctions screening are asynchronous, occasionally fail, and must be retried with full logging. Every decision must capture the exact data available at decision time."`
Solution: `"External calls are modelled as entity state transitions with durable retry. Point-in-time storage answers 'what did we know when we made this decision' — without a line of custom audit code."`
State machine: `Initiated → ID Verification → Sanctions Check → Approved / Rejected`
Feature checkpoints:
- "Durable retry for asynchronous identity and sanctions API calls"
- "Every decision captures the exact entity state at decision time"
- "Regulatory-grade audit trail with zero custom audit code"
- "Concurrent onboarding workflows serialized per customer entity"
- "Failed verification attempts logged as immutable state events — fully reconstructible"

### Agentic AI (`src/pages/UseCaseAgenticAi.tsx`)
H1: `"Reliable Infrastructure for Agentic AI in Regulated Industries"`
Problem: `"AI agents that take actions on behalf of businesses need platform-level consistency guarantees. A model inference is probabilistic. The actions it triggers must be deterministic, auditable, and recoverable."`
Solution: `"Agent actions are modelled as entity state transitions. Every action is an immutable event within the same consistency model that governs all entity state. Actions can be audited and recovered without custom state management."`
State machine: `Action Proposed → Validated → Executing → Completed / Rolled Back`
Feature checkpoints:
- "Every agent action is an immutable event — fully auditable and recoverable"
- "Agent actions within the same consistency model as all other entity state"
- "Probabilistic model output → deterministic, serialized state transitions"
- "Human approval gates modelled as entity state transitions (Proposed → Validated)"
- "Full rollback capability — agent errors are state events, not silent side effects"

---

## REQ-CONTACT: Contact Page (`src/pages/Contact.tsx`)

H1: `"Talk to the Team"`

Form fields (all required unless noted):
- Name (text input)
- Company (text input)
- Work Email (email input)
- Message (textarea, min 3 rows)
- "How did you hear about us?" (select, optional): LinkedIn, Blog post, Google search, Word of mouth, GitHub, Conference/event, Other

Use `react-hook-form` for form state. On submit: `console.log(data)` + set `submitted` state.
Success message: `"Thanks — we'll be in touch within one business day."`

Beside the form (right column ≥768px, above form <768px):
- Patrick Stanton, CEO & Co-Founder
- LinkedIn: `https://www.linkedin.com/in/patrick-stanton-cyoda/`

Use shadcn `Input`, `Textarea`, `Select`, `Label`, `Button`.

---

## REQ-HEROS-DATA: Update HeroPhrases.ts

`src/data/HeroPhrases.ts` — replace all non-financial entries:
- Replace `"Order & Inventory Tracking"` → `"Loan Origination Lifecycle"`
- Replace `"Customer Onboarding Portal"` → `"KYC Onboarding with Audit Trail"`
- Add: `"Trade Settlement Reporting"`, `"Secondary Loan Transfer Workflow"`, `"Regulatory Capital Workflow"`
- Remove any remaining non-financial-services examples

---

## Copy Reference: Safe Proof Points (Use Only These)

- "Used in production in the European private-debt market since 2017"
- "VC Trade" (only named customer approved for use)
- "Free tier available at ai.cyoda.net"
- "Backed by Apache Cassandra and ZooKeeper — deploys on Kubernetes or as a managed service"
- "Serializable Snapshot Isolation across asynchronous distributed workflows"
- "Point-in-time querying across all entity history — not time-limited like Snowflake time-travel"

DO NOT claim specific throughput/latency figures, uptime percentages, or client names other
than VC Trade without explicit permission.
