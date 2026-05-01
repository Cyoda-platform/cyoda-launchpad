# Cyoda Website Navigation & Dual-Audience Redesign
**Change Document for Claude Code**
**Project:** `/Users/patrick/dev/cyoda-launchpad`
**Framework:** Vite + React + TypeScript (`src/main.tsx` entry point)
**Date:** 2026-03-20

---

## Executive Summary

The draft Cyoda website has 18 items in its navigation bar — logo, 11 links/buttons, 4 social media icons, a dark mode toggle, plus two CTAs. This is approximately three times the number a top-performing B2B SaaS site should carry. The dual-audience problem (buyer vs. developer) is handled by putting "For CTOs" and "For engineers" as standalone nav links, which is a bolted-on solution that clutters the nav and creates orphaned pages with duplicated content.

MongoDB solves the same dual-audience problem with a clean 5-item top nav and a prominent "Select Experience: Builder / Business Leader" toggle embedded directly on the homepage. The homepage content switches in place. The nav itself stays clean and neutral.

These changes implement that approach for Cyoda.

---

## Current State Inventory

### Current Navigation Items (18 total)

| Position | Item | Type | Destination |
|----------|------|------|-------------|
| Left | CYODA logo | Link | `/` |
| Left | Products | Link | `/products` |
| Left | Use Cases | Link | `/use-cases` |
| Left | Compare | Link | `/comparison` |
| Left | Pricing | Link | `/pricing` |
| Left | Docs | Dropdown button | (submenu) |
| Left | Blog | Link | `/blog` |
| Left | About | Link | `/about` |
| Left | Support | Link | `/support` |
| Left | For CTOs | Link | `/cto` |
| Left | For engineers | Link | `/dev` |
| Right | LinkedIn icon | External link | linkedin.com/company/cyoda |
| Right | X (Twitter) icon | External link | twitter.com/cyodaops |
| Right | YouTube icon | External link | youtube.com/@cyoda934 |
| Right | GitHub icon | External link | github.com/Cyoda-platform/ |
| Right | Dark mode toggle | Button | (theme toggle) |
| Right | Contact | Link | `/support#contact` |
| Right | Try Now | Button/CTA | (modal or `/pricing`) |

### Current Pages

- `/` — Homepage
- `/products` — Products overview (3 sub-products: AI Assistant, Cyoda Application Platform, Cyoda Cloud)
- `/cto` — "For Engineering Leaders" (buyer persona)
- `/dev` — "For Developers" (developer persona)
- `/comparison` — Head-to-head comparison table vs. Temporal, Camunda, Kafka, Axoniq, XTDB
- `/use-cases` — 4 use cases: Loan Origination, Trade Settlement, KYC, Agentic AI
- `/pricing` — 4 tiers: Trial (free), Developer, Professional, Enterprise
- `/about`, `/blog`, `/support` — (not individually inspected but linked in footer)

### Current Footer (for reference, no changes required)

Footer columns: Platform (Products, Use Cases, Pricing, Docs, Blog) | Company (About, Support, Contact) | Social icons (LinkedIn, X, YouTube, GitHub)

---

## Problems to Fix

### 1. Navigation overload
18 nav items is unusable. At normal viewport widths several items wrap to a second line or compress illegibly. A first-time visitor sees noise, not structure.

### 2. Wrong pattern for dual audience
"For CTOs" and "For engineers" as flat top-level nav links signals that these are two separate products or websites. They're not. They're two ways of reading the same product. The pages they link to (/cto and /dev) are also inconsistently titled and partially duplicate homepage content.

### 3. Social icons don't belong in the nav
LinkedIn, Twitter, YouTube, GitHub are already in the footer. Having them in the primary nav takes up 4 slots and signals that a tweet is as important a destination as Pricing.

### 4. "About" and "Support" in the main nav
These are not acquisition-path pages. First-time visitors don't come to a product website to read About. These live correctly in the footer and optionally in a Company dropdown; they should not occupy nav real-estate.

### 5. "Compare" as a top-level item
The comparison page is mid-funnel content, not a primary navigation destination. It belongs inside a Platform or Products dropdown.

### 6. "Contact" and "Support" are duplicated and ambiguous
`/support` and `/support#contact` link to nearly the same destination. One of them should go.

---

## Target State

### New Navigation Structure (8 items + 2 CTAs)

```
[CYODA logo]  |  Platform ▾  |  Solutions ▾  |  Pricing  |  Docs ▾  |  Blog  |  |  Contact  [Try Now]
```

| Position | Item | Type | Details |
|----------|------|------|---------|
| Left | CYODA logo | Link | `/` |
| Left | Platform | Dropdown | See Platform Dropdown below |
| Left | Solutions | Dropdown | See Solutions Dropdown below |
| Left | Pricing | Link | `/pricing` |
| Left | Docs | Dropdown | Existing Docs submenu (unchanged) |
| Left | Blog | Link | `/blog` |
| Right | Contact | Link | `/support#contact` |
| Right | Try Now | CTA Button | Existing behaviour (modal or `/pricing`) |

**Remove entirely from nav:** Use Cases, Compare, About, Support, For CTOs, For engineers, LinkedIn, X, YouTube, GitHub, dark mode toggle.

---

### Platform Dropdown Content

Triggered by clicking "Platform" in the nav. Two-column dropdown.

**Column 1 — Product**

| Label | Sublabel | Link |
|-------|----------|------|
| EDBMS Platform | Unified data + workflow + audit | `/products` |
| AI Assistant | Prototype in natural language | `/products#ai-assistant` |
| Cyoda Cloud | Managed cloud service, free tier | `/products#cyoda-cloud` |
| On-Premise (CPL) | Self-hosted on Kubernetes | `/products#on-premise` |

**Column 2 — Learn**

| Label | Sublabel | Link |
|-------|----------|------|
| Architecture | How the EDBMS works | `/#how-it-works` (existing anchor) |
| Compare vs. alternatives | Temporal, Camunda, Kafka, XTDB | `/comparison` |
| Documentation | Full docs at docs.cyoda.net | `https://docs.cyoda.net` (external) |
| Quickstart | Start at ai.cyoda.net | `https://ai.cyoda.net` (external) |

---

### Solutions Dropdown Content

Triggered by clicking "Solutions" in the nav. Two-column dropdown.

**Column 1 — By Use Case**

| Label | Sublabel | Link |
|-------|----------|------|
| Loan Origination & Lifecycle | State machine from application to settlement | `/use-cases/loan-origination` |
| Trade Settlement & Reporting | Point-in-time queryable trade states | `/use-cases/trade-settlement` |
| KYC & Customer Onboarding | Durable retry with full audit | `/use-cases/kyc` |
| Agentic AI for Regulated Industries | Transactional, auditable agent actions | `/use-cases/agentic-ai` |

**Column 2 — By Role**

| Label | Sublabel | Link |
|-------|----------|------|
| For Engineering Leaders | Architecture, team size, compliance | `/cto` |
| For Developers | Build, integrate, deploy | `/dev` |

Note: The `/cto` and `/dev` pages remain as-is. They are now accessed via the Solutions dropdown rather than the main nav.

---

### Homepage: Persona Switcher Component

Add a role-toggle component to the homepage. Placement: directly below the two primary CTA buttons ("Start Evaluating for Free" and "See the Architecture"), above the "THE PROBLEM" section.

**Component behaviour:**

- Two toggle options: `Engineering Leader` and `Developer`
- Default state: `Engineering Leader`
- Toggling switches the visible content of one targeted section below the hero (the "Why teams building on Cyoda ship faster and stay lean" section, currently showing 3 numbered benefit cards)
- The hero headline, subheadline, and CTAs do NOT change — they are audience-neutral
- Only the benefit cards section switches

**Engineering Leader view (default) — 3 cards:**

1. **Avoid building a platform team** — The Kafka specialist, the Temporal specialist, the audit pipeline engineer: those are hires you do not need to make. Cyoda replaces what would otherwise require three separate engineering specialisms.

2. **Audit-ready from day one** — Every entity transition is an immutable event with full data lineage. When an enterprise client or regulator asks for historical state reconstruction, the answer is seconds, not a sprint.

3. **Add workflow states without a rewrite** — New lifecycle states are configuration changes, not coordinated schema migrations across three systems.

**Developer view — 3 cards:**

1. **Your business logic, the platform's consistency** — Processors run in your code, in your language, via gRPC. Transactions, sharding, workflow orchestration, and audit history are platform-level. Not things you generate and maintain in application code.

2. **One consistency model, nine capabilities** — Distributed transactional store, finite state machine enforcement, SSI transaction manager, immutable audit store, point-in-time queries — shipped as a single consistency contract with no glue code between them.

3. **Start at ai.cyoda.net, clone into your IDE** — Describe your application. The AI generates entity models, state machine config, and gRPC scaffolding. Deploy to Cyoda Cloud or your own Kubernetes cluster.

**Toggle visual design:** Match the existing site's design language. Two pill-shaped buttons inside a single container. Active state uses the existing teal/cyan accent colour (`#00FFCC` or equivalent from the current stylesheet). Inactive state is muted/dark. No dropdown — single-click toggle only.

**Component label above the toggle:** Small uppercase label, same style as existing "THE PROBLEM" and "USE CASES" section labels: `YOUR ROLE`

---

## Implementation Instructions for Claude Code

### Step 1: Find the navigation component

Search for the primary navigation component. It is most likely at one of:

```
src/components/Navigation.tsx
src/components/Navbar.tsx
src/components/Header.tsx
src/layout/Header.tsx
```

Search for the string `"For CTOs"` or `href="/cto"` to locate it precisely.

### Step 2: Restructure the nav

In the navigation component:

1. **Remove** these items entirely:
   - The link to `/use-cases` (text: "Use Cases")
   - The standalone link to `/comparison` (text: "Compare")
   - The link to `/about` (text: "About")
   - The link to `/support` (text: "Support")
   - The link to `/cto` (text: "For CTOs")
   - The link to `/dev` (text: "For engineers")
   - All four social icon links (LinkedIn, X/Twitter, YouTube, GitHub)
   - The dark mode toggle button

2. **Add** a "Platform" dropdown item (new, see dropdown spec above). Insert it as the first item after the logo, before "Pricing".

3. **Add** a "Solutions" dropdown item (new, see dropdown spec above). Insert it after "Platform".

4. **Keep** these items unchanged:
   - CYODA logo
   - Pricing link
   - Docs dropdown (existing — do not change its contents)
   - Blog link
   - Contact link
   - Try Now CTA button

5. **Reorder** the final nav to match this sequence:
   `Logo | Platform ▾ | Solutions ▾ | Pricing | Docs ▾ | Blog | [spacer] | Contact | Try Now`

### Step 3: Build the Platform dropdown

Create a new dropdown component (e.g. `src/components/PlatformDropdown.tsx`) using the same dropdown pattern already used for the Docs dropdown. Use the content from the "Platform Dropdown Content" table above.

If the Docs dropdown uses a `DropdownMenu` or similar component from a UI library (inspect the existing Docs dropdown implementation to confirm), use the same library component for consistency.

### Step 4: Build the Solutions dropdown

Create a new dropdown component (e.g. `src/components/SolutionsDropdown.tsx`) using the same pattern. Use the content from the "Solutions Dropdown Content" table above.

The two-column layout inside the dropdown should use CSS grid or flexbox. Match the visual styling of the Platform dropdown.

### Step 5: Add persona switcher to the homepage

Find the homepage component. It is most likely at:

```
src/pages/Home.tsx
src/pages/index.tsx
src/app/page.tsx
```

Search for the string `"Start Evaluating for Free"` or `"THE PROBLEM"` to locate it precisely.

1. Create a new component: `src/components/PersonaSwitcher.tsx`

2. The component manages a single piece of state: `persona: 'leader' | 'developer'`, defaulting to `'leader'`.

3. It renders:
   - A small uppercase label: `YOUR ROLE`
   - Two toggle buttons: `Engineering Leader` and `Developer`
   - A content block that conditionally renders the appropriate 3 cards based on `persona`

4. Use React `useState` for the toggle state. No external state management needed.

5. Insert `<PersonaSwitcher />` in the homepage JSX, between the hero CTA buttons section and the "THE PROBLEM" section.

6. The persona switcher replaces the existing "Why teams building on Cyoda ship faster and stay lean" section (the 3 numbered benefit cards currently labelled "1. Build and ship stateful systems at AI speed", "2. Smaller teams, fewer moving parts", "3. Built-In Compliance and Audit"). Those cards become the Engineering Leader view. The Developer view uses the new content specified above.

### Step 6: Verify the footer still has social links

The social media icons (LinkedIn, X, YouTube, GitHub) should already be in the footer. Confirm they remain there. If they are only rendered via the nav component, move the social links JSX into the footer component before removing them from the nav.

The footer is most likely at:

```
src/components/Footer.tsx
src/layout/Footer.tsx
```

Search for the string `"linkedin.com/company/cyoda"` to locate the current social link JSX.

### Step 7: Verify routing for use-case sub-pages

The Solutions dropdown links to individual use-case URLs (e.g. `/use-cases/loan-origination`). Check whether these routes exist. If the current router only has `/use-cases` as a single page with all four use cases on it, either:

- (a) Keep the Solutions dropdown links pointing to `/use-cases` for all four items and add a hash anchor for each section (e.g. `/use-cases#loan-origination`), or
- (b) Create individual route pages for each use case

Option (a) is sufficient for this change. Option (b) is better long-term. Use whichever is faster to implement without introducing routing regressions.

---

## Out of Scope for This Change

- Content changes to any page other than the homepage persona switcher section
- Changes to the Docs dropdown contents
- Changes to the `/cto` or `/dev` page content
- Dark mode implementation (the toggle is being removed, not replaced — dark mode is the current default and should remain so)
- Mobile/responsive nav (a separate task; do not break the existing mobile nav behaviour)
- Any changes to `/pricing`, `/comparison`, `/products`, `/use-cases`, `/about`, `/support`, `/blog`

---

## Acceptance Criteria

After implementation, verify the following:

- [ ] The navigation renders exactly 8 items: Logo, Platform, Solutions, Pricing, Docs, Blog, Contact, Try Now
- [ ] No social media icons appear in the nav bar
- [ ] No dark mode toggle appears in the nav bar
- [ ] "For CTOs" and "For engineers" do not appear as standalone nav items
- [ ] Clicking "Platform" opens a dropdown with the 8 items specified (4 Product + 4 Learn)
- [ ] Clicking "Solutions" opens a dropdown with the 6 items specified (4 use cases + 2 by role)
- [ ] The "For Engineering Leaders" and "For Developers" links inside the Solutions dropdown navigate to `/cto` and `/dev` respectively
- [ ] Social icons (LinkedIn, X, YouTube, GitHub) remain visible in the footer
- [ ] The homepage has a persona switcher component between the hero CTAs and "THE PROBLEM" section
- [ ] The switcher defaults to "Engineering Leader" view
- [ ] Clicking "Developer" switches the benefit cards to the developer-specific content
- [ ] Clicking "Engineering Leader" switches back
- [ ] All existing page routes (`/`, `/products`, `/cto`, `/dev`, `/comparison`, `/use-cases`, `/pricing`, `/about`, `/blog`, `/support`) continue to resolve without 404 errors
- [ ] The Docs dropdown still works as before
