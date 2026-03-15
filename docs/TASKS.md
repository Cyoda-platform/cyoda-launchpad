# Build Tasks — Cyoda Website Improvements

Execute tasks in order. Run `npm run build && npm run typecheck` after each phase.
"MODIFY" = edit existing file. "CREATE" = new file. Do not skip verification steps.

Tasks are ordered by audit impact (SEO first — scored 4/10, the biggest gap).

---

## PHASE 1 — SEO Infrastructure (Critical — scored 4/10)

### T01 · [MODIFY] Fix SEO component — remove auto-append
**File**: `src/components/SEO.tsx`
**Instructions**: The component currently does `const fullTitle = \`${title} | ${siteName}\``.
Change it to `const fullTitle = title`. This makes every page responsible for its own complete
title string. Do not change any other logic. The canonical tag generation already exists
(`{currentUrl && <link rel="canonical" href={currentUrl} />}`) — verify it is present.

**Acceptance Criteria**:
- [ ] `fullTitle = title` (no auto-append of siteName)
- [ ] Canonical `<link>` tag is generated when `url` prop is provided
- [ ] `npm run typecheck` passes

---

### T02 · [MODIFY] Add unique titles, meta descriptions, and canonical URLs to all pages
**Files**: All page files in `src/pages/` + `src/components/SEO.tsx`
**Instructions**: For every page listed in REQ-META (REQUIREMENTS.md), add or update
`<SEO title="..." description="..." url="..." />`. Pass the complete title string exactly as
written in the requirements table (titles already include "| Cyoda" where appropriate).
Pages to update: Index, Products, Pricing, Blog, Support, Dev, Cto, About, UseCases,
UseCaseLoanLifecycle, UseCaseTradeSettlement, UseCaseKycOnboarding, UseCaseAgenticAi, Contact.

**Acceptance Criteria**:
- [ ] Homepage `<title>` is `"Cyoda | Unified Platform for Stateful Workflows in Financial Services"`
- [ ] Every page in REQ-META has a unique title ≤60 chars
- [ ] Every page has a unique meta description 150–160 chars
- [ ] Every page passes a `url` prop matching its canonical URL
- [ ] `npm run build` passes

---

### T03 · [MODIFY] Fix duplicate H1 on `/cto`
**File**: `src/pages/Cto.tsx`
**Instructions**: There are two `<h1>` elements on this page. Change the second one to `<h2>`.
Do not change any other content, layout, or styling on the page.

**Acceptance Criteria**:
- [ ] Only one `<h1>` renders on `/cto`
- [ ] Page content and layout unchanged otherwise
- [ ] `npm run build` passes

---

### T04 · [MODIFY] Add missing URLs to sitemap.xml
**File**: `public/sitemap.xml`
**Instructions**: Add the 7 missing `<url>` entries from REQ-SITEMAP (REQUIREMENTS.md).
These are: `/use-cases`, `/use-cases/loan-lifecycle`, `/use-cases/trade-settlement`,
`/use-cases/kyc-onboarding`, `/use-cases/agentic-ai`, `/about`, `/contact`.
Use the exact `<loc>`, `<changefreq>`, and `<priority>` values from the requirements.

**Acceptance Criteria**:
- [ ] All 7 URLs appear in `public/sitemap.xml`
- [ ] XML is valid (no parse errors)
- [ ] All existing entries unchanged

---

### T05 · [MODIFY] Update llms.txt
**File**: `public/llms.txt`
**Instructions**: Replace the entire file contents with the new description from REQ-LLMS
(REQUIREMENTS.md). Copy it verbatim — do not paraphrase.

**Acceptance Criteria**:
- [ ] File leads with `"Cyoda is the unified platform that replaces Postgres + Kafka + Camunda..."`
- [ ] EDBMS definition is present
- [ ] All four use case categories are listed
- [ ] Company founding date (2012) and first production date (2017, VC Trade) are included

---

## PHASE 2 — Structured Data (Zero JSON-LD currently on site)

### T06 · [MODIFY] Add jsonLd prop to SEO component + Organization schema to all pages
**File**: `src/components/SEO.tsx` + all page files
**Instructions**:
1. Add optional `jsonLd?: object` prop to the SEO component.
2. When `jsonLd` is provided, render:
   `<script type="application/ld+json">{JSON.stringify(jsonLd, null, 2)}</script>`
   inside the `<Helmet>` block.
3. Pass the Organization schema (from REQ-STRUCTURED-DATA) as `jsonLd` on every page.
   The schema is the same object on every page — define it as a shared constant in a new file
   `src/data/schemas.ts` and import it into each page.

**Acceptance Criteria**:
- [ ] `SEO.tsx` accepts and renders `jsonLd` prop
- [ ] Every page renders `<script type="application/ld+json">` with Organization schema
- [ ] `src/data/schemas.ts` exists and exports `organizationSchema`
- [ ] `npm run typecheck` passes (no TypeScript errors)

---

### T07 · [MODIFY] Add FAQPage schema to Pricing page
**File**: `src/pages/Pricing.tsx`
**Instructions**: Import `faqSchema` from `src/data/schemas.ts` (create the export in that file).
Pass it as `jsonLd` to the SEO component on the pricing page.
The FAQPage schema content is defined in REQ-STRUCTURED-DATA (REQUIREMENTS.md).

**Acceptance Criteria**:
- [ ] `src/data/schemas.ts` exports `faqSchema` with correct FAQPage structure
- [ ] `/pricing` page renders FAQPage JSON-LD in `<head>`
- [ ] `npm run typecheck` passes

---

### T08 · [MODIFY] Add BreadcrumbList schema to use-case detail pages
**Files**: The 4 use-case detail pages
**Instructions**: Each detail page gets a BreadcrumbList schema per REQ-STRUCTURED-DATA.
Define each as a constant in `src/data/schemas.ts` and pass via `jsonLd` prop to SEO.
The breadcrumb has 3 levels: Home → Use Cases → [page name].

**Acceptance Criteria**:
- [ ] Each of the 4 use-case detail pages renders a BreadcrumbList JSON-LD
- [ ] `position`, `name`, and `item` values are correct for each page
- [ ] `npm run typecheck` passes

---

## PHASE 3 — Content Fixes (AI Readability + Marketing)

### T09 · [MODIFY] Replace warehouse entity model with financial loan entity
**File**: `src/components/DeveloperReliabilitySection.tsx`
**Instructions**: Replace the `complexEntityJson` string constant with the loan entity JSON
from REQ-ENTITY-MODEL (REQUIREMENTS.md). Copy the JSON exactly as written.
Also update the section heading to "Built for Developers Who Demand Correctness".

**Acceptance Criteria**:
- [ ] No field names from the warehouse model remain (`sku`, `warehouseId`, `hazards`, `UN3481`)
- [ ] `loanId`, `borrowerId`, `currentState`, `stateHistory`, `covenants`, `counterparty` are present
- [ ] Section heading reads "Built for Developers Who Demand Correctness"
- [ ] `npm run build` passes

---

### T10 · [MODIFY] Fix Pricing page copy
**File**: `src/pages/Pricing.tsx`
**Instructions**:
1. Change H1 from `"Get Building for Free"` to `"Start Your Evaluation for Free"`
2. Remove all "Coming Soon" badges from Developer and Professional plan cards
3. Replace "TBD /month" with "Contact Us" on Developer and Professional cards
4. Change Developer and Professional CTA buttons to "Join the Waitlist" → `/contact`
5. Change Enterprise CTA `href` to `/contact`
6. Add FAQ section using shadcn `Accordion` with 4 Q&As from REQ-PRICING-FAQ

**Acceptance Criteria**:
- [ ] H1 reads "Start Your Evaluation for Free"
- [ ] No "Coming Soon" badge renders on any pricing card
- [ ] No "TBD" text renders on any pricing card
- [ ] Developer and Professional CTAs say "Join the Waitlist" and link to `/contact`
- [ ] Enterprise CTA links to `/contact`
- [ ] FAQ Accordion renders with 4 questions
- [ ] `npm run build` passes

---

### T11 · [MODIFY] Remove "Available to all" from Products page
**File**: `src/pages/Products.tsx`
**Instructions**: Find and remove the text "Available to all" and its surrounding element
(likely a badge or span). Add the EDBMS definition sentence from REQ-COPY to the page
(preferably after the first mention of Cyoda EDBMS in the copy).

**Acceptance Criteria**:
- [ ] "Available to all" does not appear anywhere on the rendered Products page
- [ ] EDBMS definition sentence is present on the page
- [ ] `npm run build` passes

---

### T12 · [MODIFY] Update HeroPhrases data
**File**: `src/data/HeroPhrases.ts`
**Instructions**: Replace all non-financial entries per REQ-HEROS-DATA.
Keep the file structure identical — only change the string values.

**Acceptance Criteria**:
- [ ] No entry contains "Order & Inventory Tracking" or "Customer Onboarding Portal"
- [ ] File includes: "Loan Origination Lifecycle", "KYC Onboarding with Audit Trail",
  "Trade Settlement Reporting", "Secondary Loan Transfer Workflow"
- [ ] `npm run typecheck` passes

---

## PHASE 4 — New Components

### T13 · [CREATE] ProofBar component (if not already created)
**File**: `src/components/ProofBar.tsx`
**Instructions**: Skip this task if the component already exists. Otherwise create it per DESIGN.md.
- Background: `hsl(var(--proof-bar-bg))`
- Borders: `border-y border-[hsl(var(--proof-bar-border))]`
- Layout: `flex items-center justify-center gap-3 flex-wrap py-4`
- Content: ShieldCheck icon (teal) + "In production in the European private-debt market since 2017" + "·" separator + "VC Trade"
- Add CSS tokens to `src/index.css` (`:root` and `.dark` blocks) if missing

**Acceptance Criteria**:
- [ ] Component renders proof text with ShieldCheck icon
- [ ] Renders correctly on light and dark themes
- [ ] CSS tokens are present in `src/index.css`
- [ ] `npm run typecheck` passes

---

### T14 · [CREATE] ArchitectureDiagram component (if not already created)
**File**: `src/components/ArchitectureDiagram.tsx`
**Instructions**: Skip if component already exists. Otherwise create per DESIGN.md.
Two-column layout: left = "Without Cyoda" (3 stacked boxes), right = "With Cyoda" (single Cyoda EDBMS box).
No external diagram library — Tailwind only.

**Acceptance Criteria**:
- [ ] Two columns at ≥768px; stacked at <768px
- [ ] Left column: PostgreSQL, Apache Kafka, Camunda with pain note
- [ ] Right column: Cyoda EDBMS with benefit note
- [ ] `npm run typecheck` passes

---

### T15 · [CREATE] UseCaseCard component (if not already created)
**File**: `src/components/UseCaseCard.tsx`
**Instructions**: Skip if component already exists. Create per DESIGN.md.
Props: `title: string`, `description: string`, `href: string`, `icon: LucideIcon`.
Use shadcn `Card` as base. "Learn more →" link using react-router-dom `<Link>`.

**Acceptance Criteria**:
- [ ] Renders icon, title, description, "Learn more →" link
- [ ] Hover: border `border-primary/40`, shadow lifts
- [ ] No TypeScript `any`
- [ ] `npm run typecheck` passes

---

## PHASE 5 — New and Modified Pages

### T16 · [MODIFY] Rebuild Hero Section
**File**: `src/components/HeroSection.tsx`
**Instructions**: Remove the chatbot `<Textarea>` input widget, form submit handler, and
typewriter animation. Replace with static layout per REQ-HOMEPAGE:
H1 + sub-text + two CTA buttons (Primary: "Start Evaluating for Free", Ghost: "See How It Works").
Replace the 3D node animation background with the static SVG state machine or clean gradient
from DESIGN.md. Do NOT add `.texture-overlay`.
Check `getPageVariant()` logic — ensure `/dev`, `/cto`, `/products`, `/pricing` still render
correctly after this change.

**Acceptance Criteria**:
- [ ] No `<Textarea>` or chatbot input in the hero
- [ ] H1 reads "Financial-Grade Systems For Enterprise Backends"
- [ ] Sub-text references "Postgres + Kafka + Camunda" and "financial services"
- [ ] "Start Evaluating for Free" opens `https://ai.cyoda.net` in a new tab
- [ ] "See How It Works" scrolls to `#how-it-works`
- [ ] Background is not the 3D node animation
- [ ] `/dev` and `/cto` hero still renders (test both routes)
- [ ] `npm run build` passes

---

### T17 · [MODIFY] Add ProofBar + Problem/Architecture sections to homepage
**File**: `src/pages/Index.tsx`
**Instructions**:
1. Import and place `<ProofBar />` directly after `<HeroSection />`
2. Add new section with `id="how-it-works"` per REQ-HOMEPAGE (Problem section)
3. Add mission quote pull-quote section between EcosystemSection and Use Cases preview (see REQ-COPY)
4. Add CSS tokens to `src/index.css` if not already present (see DESIGN.md)

**Acceptance Criteria**:
- [ ] ProofBar renders below the hero
- [ ] Problem section has `id="how-it-works"` and H2 "The Three-System Problem"
- [ ] Three pain points render with AlertCircle icons
- [ ] ArchitectureDiagram renders below pain points
- [ ] EDBMS definition sentence is present
- [ ] Mission quote section renders with attribution
- [ ] `npm run build` passes

---

### T18 · [MODIFY] Add Use Cases preview + fix EcosystemSection icons
**File**: `src/pages/Index.tsx` + `src/components/EcosystemSection.tsx`
**Instructions**:
1. Add 2×2 UseCaseCard grid after EcosystemSection per REQ-HOMEPAGE
2. Fix EcosystemSection icon class: `bg-icon text-icon-foreground` → `bg-primary/10 text-primary`
   (all 6 icon containers in that component only — do NOT touch ThreeStepSection or ThreeBenefitsSection)

**Acceptance Criteria**:
- [ ] Four UseCaseCards render in 2×2 grid (1 col mobile, 2 col ≥640px)
- [ ] Each card links to correct `/use-cases/[slug]` route
- [ ] "See all use cases →" renders and links to `/use-cases`
- [ ] Section overline "USE CASES", H2 "Built for Problems That Other Platforms Can't Solve"
- [ ] EcosystemSection icons are teal (not orange)
- [ ] `npm run build` passes

---

### T19 · [MODIFY] Add Use Cases and About to Header nav
**File**: `src/components/Header.tsx`
**Instructions**: Add "Use Cases" → `/use-cases` after "Products" and "About" → `/about` after
"Blog" in both the desktop nav and the mobile hamburger drawer. Follow the exact same JSX
pattern as existing nav items.

**Acceptance Criteria**:
- [ ] Desktop nav order: Products, Use Cases, Pricing, Docs, Blog, About
- [ ] Mobile drawer includes both new links
- [ ] Active link styling works for new routes
- [ ] `npm run build` passes

---

### T20 · [MODIFY] Fix Footer
**File**: `src/components/Footer.tsx`
**Instructions**: Replace tagline and restructure links per REQ-FOOTER.
New tagline: "The unified platform for stateful, auditable workflows in financial services.
In production in European private-debt markets since 2017."
Platform column: Products, Use Cases, Pricing, Docs, Blog
Company column: About, Support, Contact

**Acceptance Criteria**:
- [ ] New tagline renders correctly
- [ ] "Use Cases", "About", and "Contact" all appear in footer and link correctly
- [ ] All existing footer links still work
- [ ] `npm run build` passes

---

### T21 · [CREATE] About page
**File**: `src/pages/About.tsx` — also add route to `src/App.tsx`
**Instructions**: Create per REQ-ABOUT. Structure: Header, container div, Footer.
Sections: opening paragraph, two founder bio Cards (with initial avatars), vertical timeline,
mission statement. Use shadcn `Card`. Timeline: `border-l` with circular dot markers.

**Acceptance Criteria**:
- [ ] Route `/about` renders without 404
- [ ] H1: "Built by People Who Lived the Problem"
- [ ] Both founder bios include institutions from requirements
- [ ] Timeline shows all 4 milestones (2012, 2015, 2017, 2025)
- [ ] Mission statement renders
- [ ] SEO title, description, and url in place
- [ ] `npm run build` passes

---

### T22 · [CREATE] Use Cases hub and 4 detail pages
**Files**: `src/pages/UseCases.tsx` and 4 detail pages — add all 5 routes to `src/App.tsx`
**Instructions**: Create all 5 files per REQ-USECASES. Detail pages share a common structure:
H1 → Problem → Solution → State Machine diagram (Card, DESIGN.md pattern) → Feature checkpoints
→ Bottom CTA. Use the StateMachineNode pattern from DESIGN.md (Tailwind only, no external library).
Add `--state-node-bg` and `--state-node-border` CSS tokens to `src/index.css` if not present.

**Acceptance Criteria**:
- [ ] All 5 routes render without 404
- [ ] Hub page has correct H1 and lists 4 UseCaseCards
- [ ] Each detail page: correct H1, problem, solution, state machine diagram, ≥4 checkpoints, CTAs
- [ ] State machine diagrams use `--state-node-bg` and `--state-node-border` tokens
- [ ] All 5 pages have correct SEO title, description, url
- [ ] Bottom CTAs link to `https://ai.cyoda.net` (new tab) and `/contact`
- [ ] `npm run build` passes

---

### T23 · [CREATE] Contact page
**File**: `src/pages/Contact.tsx` — add route to `src/App.tsx`
**Instructions**: Create per REQ-CONTACT. Use `react-hook-form`, shadcn `Input`, `Textarea`,
`Select`, `Label`, `Button`. Two-column layout at ≥768px (form left, contact info right).
On submit: `console.log(data)` + show success message.

**Acceptance Criteria**:
- [ ] Route `/contact` renders without 404
- [ ] H1: "Talk to the Team"
- [ ] All 6 fields present; required fields show validation error if empty
- [ ] Submit shows: "Thanks — we'll be in touch within one business day."
- [ ] Patrick Stanton name, title, LinkedIn link visible beside form
- [ ] SEO title, description, url in place
- [ ] `npm run build && npm run typecheck` pass

---

## PHASE 6 — Final Verification

### T24 · Full audit and build verification
**Instructions**: After all tasks are complete:
1. Run `npm run build && npm run typecheck` — fix all errors
2. Run `npm run lint` — fix all lint warnings
3. Verify every route in the app renders correctly at 375px, 768px, and 1440px:
   `/`, `/products`, `/pricing`, `/use-cases`, `/use-cases/loan-lifecycle`,
   `/use-cases/trade-settlement`, `/use-cases/kyc-onboarding`, `/use-cases/agentic-ai`,
   `/about`, `/contact`, `/blog`, `/dev`, `/cto`
4. Check dark mode toggle on all new pages
5. Verify "See How It Works" scrolls to `#how-it-works`
6. Verify all external links (`ai.cyoda.net`, `docs.cyoda.net`, LinkedIn) open in new tab
7. Confirm `/dev` and `/cto` pages are unchanged and functional

**Acceptance Criteria**:
- [ ] `npm run build` exits 0 with no errors or warnings
- [ ] `npm run typecheck` exits 0
- [ ] `npm run lint` exits 0
- [ ] No horizontal scroll at 375px on any page
- [ ] Dark mode works on all new pages
- [ ] No 404s on any route
- [ ] `/cto` has exactly one `<h1>` element

---

## Task Summary

| ID  | Type   | File(s)                                  | Phase | Audit Issue           |
|-----|--------|------------------------------------------|-------|-----------------------|
| T01 | MODIFY | `src/components/SEO.tsx`                 | 1-SEO | Title auto-append bug |
| T02 | MODIFY | All `src/pages/` + SEO.tsx               | 1-SEO | Identical titles/metas|
| T03 | MODIFY | `src/pages/Cto.tsx`                      | 1-SEO | Duplicate H1          |
| T04 | MODIFY | `public/sitemap.xml`                     | 1-SEO | Missing 7 pages       |
| T05 | MODIFY | `public/llms.txt`                        | 1-AI  | Weak description      |
| T06 | MODIFY | SEO.tsx + all pages                      | 2-SD  | Zero structured data  |
| T07 | MODIFY | `src/pages/Pricing.tsx`                  | 2-SD  | FAQPage schema        |
| T08 | MODIFY | 4 use-case detail pages                  | 2-SD  | BreadcrumbList        |
| T09 | MODIFY | `DeveloperReliabilitySection.tsx`        | 3-AI  | Warehouse entity model|
| T10 | MODIFY | `src/pages/Pricing.tsx`                  | 3-Mkt | Coming Soon / TBD     |
| T11 | MODIFY | `src/pages/Products.tsx`                 | 3-Mkt | "Available to all"    |
| T12 | MODIFY | `src/data/HeroPhrases.ts`                | 3-Mkt | Non-fintech examples  |
| T13 | CREATE | `src/components/ProofBar.tsx`            | 4-Cmp | Missing component     |
| T14 | CREATE | `src/components/ArchitectureDiagram.tsx` | 4-Cmp | Missing component     |
| T15 | CREATE | `src/components/UseCaseCard.tsx`         | 4-Cmp | Missing component     |
| T16 | MODIFY | `src/components/HeroSection.tsx`         | 5-Vis | Gaming hero bg        |
| T17 | MODIFY | `src/pages/Index.tsx` (ProofBar+Problem) | 5-Pg  | Missing sections      |
| T18 | MODIFY | Index.tsx + EcosystemSection.tsx         | 5-Vis | Orange icons / UC grid|
| T19 | MODIFY | `src/components/Header.tsx`              | 5-Nav | Missing nav links     |
| T20 | MODIFY | `src/components/Footer.tsx`              | 5-Nav | Wrong tagline         |
| T21 | CREATE | `src/pages/About.tsx`                    | 5-Pg  | Page missing          |
| T22 | CREATE | 5 Use Case pages                         | 5-Pg  | Pages missing         |
| T23 | CREATE | `src/pages/Contact.tsx`                  | 5-Pg  | Page missing          |
| T24 | VERIFY | All routes                               | 6-QA  | Final check           |
|     |        | **Total**                                |       | **24 tasks**          |

**Note**: Tasks T13–T15 (ProofBar, ArchitectureDiagram, UseCaseCard) and T21–T23 (About,
Use Cases, Contact) were completed in a previous Claude Code session. Re-run acceptance
criteria before skipping — verify files exist and typecheck passes before marking done.
