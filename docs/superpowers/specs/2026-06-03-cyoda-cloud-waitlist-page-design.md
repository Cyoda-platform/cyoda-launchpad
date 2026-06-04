# Cyoda Cloud Waitlist Page & ai.cyoda.net De-emphasis

**Date:** 2026-06-03
**Status:** Approved (design) — pending implementation plan
**Repo:** cyoda-launchpad (cyoda.com marketing site)
**Source material:** `docs/cyoda-go-paas-design.md` (PRD draft v0.1 for the new PaaS)

## Problem

The top-nav "Cyoda Cloud" item links out to `ai.cyoda.net` — the current hosted
SaaS, which is being wound down in favor of a new self-service multi-tenant
PaaS built on `cyoda-go` (see PRD). The site needs a "coming soon / join the
waitlist" page for the new offering, and the existing site copy tells a
try-it-today story around the old SaaS (AI assistant, free tier, prototype in
one session) that must not survive the transition.

Traffic context: the site currently sees on the order of a dozen visitors —
all decisions below are deliberately proportionate to that.

## Decisions (settled during brainstorm)

| Decision | Choice |
|---|---|
| Product name | **"Cyoda Cloud"** — the new PaaS inherits the name; nav label unchanged |
| Scope of de-emphasis | **Full** — `ai.cyoda.net` disappears from the entire site (nav, footer, all CTAs, all copy, llms.txt, project docs) |
| Page shape | **Focused conversion page** (~1.5 viewports): hero with inline form, 4 value-prop cards, early-access strip, anonymous star block. No "how it works" section (add later as PRD firms up). No note about the old Cyoda Cloud |
| Public promises | Value prop + early-access tiers (cohort invitations, founding-customer pricing, direct line to the team). **No dates, no prices, no feature lists** |
| Signup model | **Email capture** via branded form → Google Forms `formResponse` endpoint (free, in Cyoda's Workspace). **The product-IdP decision is deliberately NOT made here** (PRD §2.7 keeps Clerk/Kinde/WorkOS open). Clerk's native waitlist mode is the documented upgrade path *if* Clerk is later chosen — the form component boundary makes that a one-component swap |
| Anti-spam | Honeypot + minimum-time check (silent fake success on both). Proportionate to traffic; DDoS is not a real exposure (GitHub Pages/Fastly fronts the site; Google fronts the form endpoint). Escalation path if junk materializes: Cloudflare Turnstile + verifying Worker |
| Form fields | Email (required) + Company (optional) + "What are you building?" (optional **pre-selection** — option strings defined in the Google Form are the source of truth; the site mirrors them exactly, since POSTed values must match byte-for-byte) + "Anything you'd like to tell us?" (optional free text) |
| Secondary CTA | Star `Cyoda-platform/cyoda-cloud-cli` on GitHub, framed as the anonymous alternative ("not ready to share your email?") — explicitly subordinate to the waitlist CTA so it captures rather than cannibalizes |
| Try-it-now story | **OSS is the on-ramp**: "Self-host open-source Cyoda from cyoda.dev today; the fully managed Cyoda Cloud is coming — join the waitlist." All live-SaaS capability claims (AI assistant, prototype-in-first-session, free tier) are retired until the new Cloud ships |

## Page: `/cloud`

### Route & SEO

- `src/routes.tsx` entry above the catch-all:
  `{ path: "/cloud", component: lazy(() => import("./pages/CyodaCloud")), prerender: true }`
  The prerender pipeline automatically produces the real-200 HTML, the `.md`
  sibling, and the sitemap entry.
- Title: `Cyoda Cloud — Coming Soon | Join the Waitlist`
- Description: `The new Cyoda Cloud: a fully managed platform for regulated
  workflows. Prototype to production without re-architecting. Join the
  waitlist for early access.`
- `url="https://cyoda.com/cloud"`, `type="website"`, default OG image,
  breadcrumb JSON-LD via `src/data/schemas.ts` helpers.

### Files

- `src/pages/CyodaCloud.tsx` — the page: `Header`/`Footer`, hero in the site's
  established style (badge → h1 → subhead), shadcn `Card` for value props.
- `src/components/CloudWaitlistForm.tsx` — the form, a discrete component with
  one job. This is the swap boundary for a future IdP pre-registration CTA.

### Approved copy

**Hero** — badge `COMING SOON`; h1 **The new Cyoda Cloud**; subhead:
"A fully managed platform that runs your regulated workflows on Cyoda — start
with a prototype, reach production without re-architecting." The waitlist form
sits in/directly under the hero (no scrolling to convert).

**Value props (4 cards):**

1. **Production architecture from day one** — Prototype on the same
   entity-database core a regulated institution would run. When real volume
   arrives, you change infrastructure — not your code or your data model.
2. **An audit trail by construction** — Every entity state change is committed
   with its full history, queryable at any point in time. The artifact
   auditors and investors ask for, built in — not bolted on.
3. **Fully managed, zero ops** — We run the platform, the storage, and the
   upgrades. You never patch a server or carry a pager.
4. **Your code stays yours** — Business logic runs in compute nodes you own:
   your repository, your pipeline, your artifact. The platform never holds
   your source.

**Early-access strip:** "Early access in invitation cohorts · Founding-customer
pricing · A direct line to the engineers building it"

**Star block (quiet, bottom):** "**Not ready to share your email?** Star
[`cyoda-cloud-cli`](https://github.com/Cyoda-platform/cyoda-cloud-cli) on
GitHub instead — every star is a vote to ship this sooner." Button:
`★ Star on GitHub` (external link, new tab is acceptable here — it is GitHub,
not a Cyoda property; follow existing external-link styling).

Form labels: "Work email" (required), "Company" (optional), "What are you
building?" (optional select — options mirrored from the Google Form), and
"Anything you'd like to tell us?" (optional textarea). Submit: "Join the
waitlist". Success state
(replaces form inline): "You're on the list. We'll be in touch when early
access opens." Error state (fetch rejection only): "Something went wrong — try
again, or reach us via the contact page."

### Form mechanics (`CloudWaitlistForm`)

- POST `https://docs.google.com/forms/d/e/<FORM_ID>/formResponse`,
  `mode: 'no-cors'`, URL-encoded `entry.<id>` fields. Fire-and-forget: success
  on fetch resolve; error state only on fetch rejection.
- `FORM_ID` and `entry` IDs are commented constants in the component (they are
  public-by-nature; no env ceremony).
- **Honeypot:** visually hidden input (off-screen, `tabIndex={-1}`,
  `aria-hidden`, decoy name e.g. `website`). Filled → show success WITHOUT
  sending.
- **Min-time:** timestamp on mount; submit < 3s after mount → success WITHOUT
  sending.
- Client-side validation: required + email format on the email field only.
- Analytics: one consent-gated `waitlist_signup` conversion event via the
  existing analytics utils; no PII in the payload.
- No Google scripts, no cookies, no iframes → no cookie-consent changes.
- Unit tests: honeypot suppression, min-time suppression, email validation,
  success/error states (mocked fetch).

### Nav changes

- `Header.tsx` desktop (~:222-231) and mobile (~:367-372): external
  `<a href="https://ai.cyoda.net/" target="_blank">` → internal
  `<Link to="/cloud">`, label "Cyoda Cloud" + small "Soon" badge.
- `Footer.tsx` (~:25): same swap, no badge.

## Site-wide `ai.cyoda.net` removal

**Acceptance criterion: `grep -r "ai.cyoda.net" src/ public/ tests/` returns
nothing.** (References in `docs/superpowers/` history and the PRD draft are
exempt — they are records, not site content.)

### Category A — mechanical (link/target swaps)

| File | Change |
|---|---|
| `src/components/Header.tsx`, `Footer.tsx` | Nav swaps above |
| `src/pages/About.tsx` | Estate mention `(ai.cyoda.net)` → "(coming soon — waitlist at cyoda.com/cloud)" |
| `src/utils/analytics.ts`, `src/utils/conversion-tracking.ts` | Conversion classification re-targeted: outbound-`ai.cyoda.net` detection becomes internal-`/cloud`-CTA tracking + the `waitlist_signup` event. Doc comments updated |
| `tests/unit/utils/conversion-tracking.test.ts` | Tests follow the utils' new contract |
| `public/llms.txt` | Estate line → `ai.cyoda.net` removed; "Cyoda Cloud — fully managed platform, coming soon: waitlist at https://cyoda.com/cloud" |
| `CLAUDE.md`, `AGENTS.md`, `README.md` | Three-site estate descriptions and the CTA same-tab convention updated (convention becomes: CTAs to cyoda.dev open same tab; `/cloud` is internal) |

### Category B — narrative copy (OSS-on-ramp rewrite)

Replacement story everywhere: *"Self-host open-source Cyoda from cyoda.dev
today; the fully managed Cyoda Cloud is coming — join the waitlist."*

| File | Current story | Replacement guidance |
|---|---|---|
| `ThreeStepSection.tsx` | AI assistant generates models; "running prototype from the first session" on ai.cyoda.net | Re-anchor the three steps on the OSS path (cyoda.dev) and/or working with the Cyoda team; CTA → `/cloud` waitlist. Retire first-session/AI-generation claims |
| `PersonaSwitcher.tsx` | "Get a prototype at ai.cyoda.net, clone into your IDE" | Developer persona points at cyoda.dev self-host; buyer persona at `/cloud` waitlist |
| `AINativeSection.tsx` | AI-native pitch proven by the live assistant | Keep the AI-native positioning only where it describes Cyoda itself (e.g. MCP/agent-readiness of the platform); CTA → `/cloud` |
| `Comparison.tsx` | "free tier at ai.cyoda.net. No credit card required." | Closing CTA → "Join the Cyoda Cloud waitlist" (no free-tier/no-credit-card claims) |
| `Dev.tsx` | "Run it yourself from cyoda.dev or hosted at ai.cyoda.net" | Two paths: self-host (cyoda.dev) today, managed Cyoda Cloud waitlist (`/cloud`) |
| `Support.tsx` | "ai.cyoda.net and try the AI Assistant" | Point to docs.cyoda.net and cyoda.dev for self-serve; mention the waitlist where the hosted product was referenced |
| `UseCaseGovernedAiActions.tsx` | "Start an evaluation" → ai.cyoda.net | "Start an evaluation" → `/contact` (sales-led), or "Join the waitlist" → `/cloud` — implementer picks per surrounding copy, both acceptable |

Exact replacement copy per file is plan-level detail; the rule that binds it:
**no surviving sentence may promise live, self-serve hosted capability.**
Untouched: all `cyoda.dev` and `docs.cyoda.net` links.

## Verification

- Vitest: `CloudWaitlistForm` unit tests (above); existing route-table guard
  extends naturally (no change needed — `/cloud` is a plain static route).
- Repo sweep: the grep acceptance criterion above, enforced in the
  implementation plan as a checked step (and a trivial unit test asserting
  the conversion utils no longer match `ai.cyoda.net` URLs).
- Full pipeline: `npm run build:static` green; `/cloud` present in `dist/`
  (`cloud.html`, `cloud.md`, sitemap `<loc>`).
- Manual: submit the form once against the real Google Form and confirm the
  row arrives in the response sheet (the one check automation cannot do).

## Prerequisites (Paul, outside this repo)

1. **Google Form** with four questions — Work email (short answer, required),
   Company (short answer), What are you building? (multiple choice/dropdown),
   Anything you'd like to tell us? (paragraph) — settings: workspace
   restriction OFF, limit-to-1-response OFF, collect-email OFF. Share the form
   URL; the implementer extracts `FORM_ID`, `entry` IDs, and the option
   strings from the public form page. *Blocks implementation of the form
   component.*
2. **Groom `Cyoda-platform/cyoda-cloud-cli`**: add a description and a README
   stating the vision. *Blocks launch, not implementation* (0 stars + empty
   README undercuts the star CTA).
3. **Privacy-policy line** (legal check, non-blocking): waitlist submissions
   are stored in Google Forms within Cyoda's Workspace.

## Sequencing

This work depends on `src/routes.tsx` and the prerender pipeline, which live
on the unmerged `feat/prerender` branch. Decision (Paul, 2026-06-03): **stack
this work onto `feat/prerender`** and ship both in a single PR — the changes
are largely orthogonal but the waitlist page consumes the route
table/prerender machinery, so one PR keeps the dependency reviewable.

## Out of scope

- The product IdP decision (PRD §2.7 stays open; Clerk waitlist mode is the
  documented upgrade if Clerk is chosen).
- Shutting down or redirecting `ai.cyoda.net` itself.
- Privacy-policy legal wording (flagged above).
- Any "how it works" / architecture content on the page (deliberately
  deferred until the PRD settles).
