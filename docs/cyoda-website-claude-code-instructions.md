# Cyoda Homepage — Implementation Instructions

**Project path:** `/Users/patrick/dev/cyoda-launchpad`
**Scope:** Homepage copy and layout changes only. No dependency changes, no config changes, no new routes.
**How to work:** Find each component by filename using the project's `src/` tree. Where exact replacement strings are provided, use them verbatim. Where a description is given, match the intent precisely.

---

## Global Rules — Apply to Every File You Touch

1. Do not name Postgres, Kafka, Temporal, Camunda, or RabbitMQ in comparison context anywhere on the page. Generic descriptions only ("a transactional database", "a message broker", "a workflow engine").
2. Do not use any of these words or phrases: "unprecedented", "seamlessly", "robust", "innovative", "streamlined", "transformative", "cutting-edge", "leverage" (as verb), "ecosystem" (as loose filler), "AI-powered development platform", "modern application development", "production-ready from day one", "think of it as", "imagine a world where", "game-changing", "going forward", "at the end of the day".
3. Do not use em dashes (—) in new or revised copy. Use commas, parentheses, or a full stop instead.
4. Do not reformat, refactor, or restyle any component you are not explicitly instructed to change. Touch only what this document describes.
5. Where a section says "keep as is" or "no change", do not touch the file at all.

---

## Changes by Component

### 1. `HeroSection.tsx`

**Find the main heading.** Replace its text content with:

```
Build Enterprise-Grade Systems at AI Speed
```

**Find the subheading / hero description.** Replace its text content with:

```
Cyoda gives agentic AI the platform-level consistency, audit history, and workflow state it needs to build production systems in regulated industries. Without a platform team.
```

**Find the secondary CTA button** (currently "See How It Works" or similar). Replace its label with:

```
See the Architecture
```

**Leave unchanged:** The primary CTA button ("Start Evaluating for Free"), the state machine SVG background overlay (Application > UnderReview > Approved > Active > Settled), the hero background image, all animation or transition logic, all layout and spacing.

---

### 2. `ProofBar.tsx`

**Find the existing proof text.** It currently reads something like:
`In production in the European private-debt market since 2017 · VC Trade`

**Replace with:**

```
In production in the European private-debt market since 2017 · VC Trade  ·  Used by a global KYC platform for 4+ years prior to launch
```

If the proof bar component renders items from an array, add the second item as a new array entry with the same styling as the first. Do not change the component's layout, font, or spacing.

---

### 3. Problem Section — `Index.tsx` (section id `how-it-works`)

**Find the section body paragraph** that currently names Postgres, Kafka, and Temporal. Replace the entire paragraph with:

```
Every team building stateful financial backends hits the same wall. A transactional database, a message broker, a workflow engine, a reporting layer, an audit mechanism — each individually correct, assembled by hand, held together by glue code that does not survive a partial failure. The full list of components is closer to nine than three. The hardest problem is not picking the tools. It is keeping them consistent across every seam, and that problem grows every time you add a state.

The other thing nobody mentions: that architecture is opaque to AI coding agents. The more heterogeneous the stack, the harder it is for AI to reason across it without introducing inconsistencies at the boundaries.
```

**Find the pain point list** (the bullet/card items that describe failure modes). Replace all items with:

```
Most of the engineering effort goes into keeping components consistent, not into the product

Partial progress failure modes at every seam: one system commits, another fails mid-transaction, and now you are reconciling across logs

When a regulator asks for entity state from three months ago, reconstructing it from disparate audit logs takes days, not seconds

Adding a new workflow state requires coordinated changes across multiple systems, and something always breaks

AI coding agents cannot reason coherently across a heterogeneous stack. Inconsistencies at component boundaries compound
```

**Find the architecture diagram caption.** It currently contains text referencing the EDBMS and audit trail. Replace with:

```
The Cyoda EDBMS ships all nine capabilities in a single consistency model. Transactions, workflows, and point-in-time queries share one source of truth. The audit trail is the storage mechanism: write-only, immutable, available for regulatory reconstruction at any point in time.
```

**Leave unchanged:** The section heading "You're Not Assembling Three Systems. You're Assembling Nine.", the `THE PROBLEM` label, the architecture diagram image or SVG itself, all layout and spacing.

---

### 4. New Section — AI-Native Infrastructure (INSERT after the Problem section, before `ThreeBenefitsSection`)

This section does not currently exist. Create a new component file `AINativeSection.tsx` in the same directory as the other section components, and render it in `Index.tsx` between the problem section and the benefits section.

**Component content:**

Section label (small eyebrow text, match the style of "THE PROBLEM"):
```
AI-NATIVE INFRASTRUCTURE
```

Heading:
```
Agentic AI needs a platform that can keep up
```

Body (two paragraphs):
```
AI agents can get to a working demo in hours. Getting from that demo to something a financial services client will trust is a different problem: audit trails, transactional consistency, point-in-time state reconstruction. None of that is in the model. It has to be in the platform.

Cyoda was designed for the class of system where state transitions are the product. That makes it a natural foundation for agentic AI. Agent actions are entity transitions, they are transactional, they are immutably recorded, and they can be reconstructed at any moment. No custom state management code. No separate audit pipeline.
```

Closing CTA line (plain text, not a button):
```
Start at ai.cyoda.net and describe what you want to build.
```

Style the closing CTA line as a muted link or plain text inline link to `https://ai.cyoda.net`. Match the visual weight and style of similar inline links elsewhere on the page.

**Layout:** Match the visual style and padding of the Problem section. This is not a card or a modal. It is a standard full-width content section.

---

### 5. `ThreeBenefitsSection.tsx`

**Add a section label above the three cards** (if no label currently exists). Use the small eyebrow text style:

```
Why teams building on Cyoda ship faster and stay lean
```

**Find Benefit 1** (currently titled something like "Innovate Heavyweight Systems at AI Speed"). Replace the title and description:

Title:
```
Build and ship stateful systems at AI speed
```

Description:
```
Cyoda gives AI agents a consistent, auditable foundation to work from. Complex data models, workflow state, and transactional guarantees are platform-level — not things the AI has to generate and maintain in application code.
```

Wait — remove the em dash in the above. Rewrite as:

```
Cyoda gives AI agents a consistent, auditable foundation to work from. Complex data models, workflow state, and transactional guarantees are platform-level. Not things the AI has to generate and maintain in application code.
```

**Find Benefit 2** (currently "Smaller Teams, Fewer Skills, Faster Delivery"). Replace the title and description:

Title:
```
Smaller teams, fewer moving parts
```

Description:
```
Eliminate the platform engineering overhead of assembling and operating a heterogeneous stack. The Kafka specialist, the Temporal specialist, the audit pipeline engineer: those are hires you do not need to make. One architecture handles what would otherwise require three separate engineering specialisms.
```

**Find Benefit 3** (currently "Built-In Compliance and Audit"). Keep the title exactly as is. Keep the description exactly as is.

**Leave unchanged:** All card layout, icons, background styles, spacing, and animation.

---

### 6. `ThreeStepSection.tsx`

**Find the section heading.** If it currently reads "Focus on the solution, not infrastructure", replace with:

```
From prototype to production without a platform team
```

**Find the subheading / description paragraph.** Replace with:

```
Describe your application. Cyoda generates the data model, workflow configuration, and API. The platform handles consistency, audit, and state. Your code handles the business logic.
```

**Find Step 1 description.** Replace with:

```
Describe your application requirements in natural language at ai.cyoda.net. The AI generates entity models, state machine configurations, and API scaffolding. You get a running prototype with full workflow state from the first session.
```

**Find Step 2 description.** Replace with:

```
Clone the generated project into your IDE. Business logic runs in your code, in your language, via gRPC. The platform handles the rest: transactions, sharding, workflow orchestration, audit history.
```

**Find Step 3 description.** Replace with:

```
Deploy to Cyoda Cloud or your own Kubernetes cluster. Horizontal scalability, point-in-time queryable audit history, and serializable snapshot isolation are platform features. Not things you build before your first enterprise client asks for them.
```

**Leave unchanged:** Step titles/labels, step numbers or icons, all layout and spacing, any footnotes about enterprise licensing (keep them where they are, do not remove).

---

### 7. `EcosystemSection.tsx`

**Find the main section heading** (currently "Discover the Cyoda Ecosystem"). Replace with:

```
What's in the platform
```

**Find the subheading** (currently "A platform designed for modern application development"). Replace with:

```
Nine capabilities. One consistency model. No glue code between them.
```

**Find the feature tile for "Entity-First Data Models".** Replace its description with:

```
Every business object in the platform has a data model, a lifecycle, and an immutable history. You configure the schema in JSON. The platform enforces it.
```

**Find the feature tile for "Event-Driven Architecture".** Replace its description with:

```
Events drive state transitions. State transitions are transactional. No application-level event deduplication, no compensating transactions, no out-of-order processing to handle.
```

**Find the feature tile for "AI Co-Builder"** (or similar AI tile if present). Replace its description with:

```
Describe your application at ai.cyoda.net. The AI generates entity models, workflow configurations, and gRPC processor scaffolding. You get a working prototype, not a skeleton.
```

**Leave unchanged:** All other feature tile titles and descriptions, tile layout, icons, grid structure, spacing.

---

### 8. `DeveloperReliabilitySection.tsx`

**Find the section heading** (currently "Built for Developers Who Demand Correctness"). Replace with:

```
How the platform models a business entity
```

**Insert a new block of text directly above the JSON code panel.** This block is for non-technical visitors. Style it as a distinct sub-section with a smaller heading and body text, visually separated from the JSON panel below. Suggested styling: light background, readable body font, same horizontal padding as the section.

Sub-heading:
```
Evaluating Cyoda without an engineer in the room?
```

Body:
```
The short version: Cyoda replaces several years of platform engineering work with configuration. Every business entity (a loan, a trade, a KYC record) is modeled with its own lifecycle, its own history, and its own transition rules. Your team defines the business logic. Cyoda handles consistency, audit, and scale.

For the technical detail, the architecture is below. For a working prototype, go to ai.cyoda.net.
```

**Leave unchanged:** The JSON code panel, the six bullet points describing entity modeling features, all layout beyond the insertion described above.

---

### 9. Use Cases Section — `Index.tsx`

**Find the use cases section heading** (currently "Built for Problems That Other Platforms Can't Solve"). Replace with:

```
Where Cyoda fits
```

**Find the Agentic AI use case card description** (currently something like "Platform-level consistency for AI agent actions — deterministic, auditable, and recoverable."). Replace with:

```
AI agents that take actions on behalf of businesses need more than model inference. Cyoda provides the transactional consistency, ordered state transitions, and audit history that make agent actions recoverable when something goes wrong.
```

**Leave unchanged:** All other use case card titles and descriptions (Loan Lifecycle, Trade Settlement, KYC Onboarding), card layout, icons, grid.

---

### 10. Mission Quote Section — `Index.tsx`

**No changes.** Do not touch this section. The quote and attribution are correct as written.

---

### 11. `Header.tsx` — Audience Navigation

**Find the main navigation links array.** Add two new navigation items:

```
For CTOs      →  links to /cto
For engineers →  links to /dev
```

Style both items with reduced visual weight compared to primary nav links (e.g., smaller font, muted color, or placed as a secondary group). They should be visible on desktop without being dominant. On mobile, include them in the hamburger menu.

If `/cto` and `/dev` routes already exist as pages in the project, link to them directly. Do not create new pages.

---

## What Not to Touch

The following must not be modified in any way:

- The state machine SVG overlay in the hero background
- The proof bar layout and styling (only the text content changes, per section 2 above)
- The founder quote and its attribution in the Mission Quote section
- The JSON entity model panel in `DeveloperReliabilitySection.tsx`
- Any page other than the homepage (`index.tsx` / `page.tsx` and the components it imports)
- `/cto` and `/dev` route page files (link to them, do not edit them)
- `package.json`, `tsconfig.json`, or any config files
- Any CSS/Tailwind classes not directly associated with copy being changed
- Any test files

---

## Verification

When all changes are complete, do the following:

1. Run the development server (`npm run dev` or equivalent) and confirm the page loads without errors.
2. Check the browser console for any component errors introduced by the new `AINativeSection.tsx`.
3. Confirm the following strings do NOT appear anywhere in the rendered homepage:
   - "Postgres"
   - "Kafka"
   - "Temporal"
   - "Camunda"
   - "unprecedented"
   - "seamlessly"
   - "AI-powered development platform"
   - "modern application development"
   - "production-ready from day one"
4. Confirm the following strings DO appear:
   - "Build Enterprise-Grade Systems at AI Speed"
   - "AI-NATIVE INFRASTRUCTURE"
   - "What's in the platform"
   - "Nine capabilities. One consistency model."
   - "Where Cyoda fits"
   - "global KYC platform"
   - "For CTOs" (in navigation)
5. Run `npm run build` (or `npm run type-check` if available) to confirm no TypeScript errors were introduced.

---

*Based on working session notes dated 13 March 2026. Reviewed and updated 15 March 2026.*
