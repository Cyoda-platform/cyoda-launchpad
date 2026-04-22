# Design System — Cyoda Website Improvements

## The Existing System
CSS-variable-based design in `src/index.css`. Montserrat font. Dark/light themes.
Brand tokens: `--cyoda-teal`, `--cyoda-orange`, `--cyoda-purple`, `--cyoda-green`.
Full shadcn/ui token set. **Do not replace. Extend and refine only.**

---

## Audit Findings: Visual Problems to Fix

The audit identified four specific visual problems (Look & Feel scored 6/10):

1. **Hero background** — generic 3D node/tunnel animation reads as consumer SaaS, not fintech
2. **EcosystemSection icons** — warm orange/amber colour signals developer productivity tool,
   not financial infrastructure. The colour clash between teal and amber is jarring.
3. **Entity model code block** — shows warehouse/inventory JSON (SKUs, hazardous materials).
   Directly contradicts the fintech positioning. Must be replaced with a financial entity.
4. **Use-case sub-pages** — text-only. A CTO doing due diligence needs to see state diagrams,
   not just bullets. Add state machine visualisations to each use-case detail page.

---

## CSS Token Additions (`src/index.css`)
Add to `:root` and `.dark` blocks without removing existing tokens:

```css
:root {
  --proof-bar-bg: 175 30% 96%;
  --proof-bar-border: 175 30% 88%;
  --section-alt-bg: 210 40% 97%;
  --state-node-bg: 175 67% 95%;
  --state-node-border: 175 67% 70%;
}
.dark {
  --proof-bar-bg: 220 14% 12%;
  --proof-bar-border: 220 10% 20%;
  --section-alt-bg: 220 14% 10%;
  --state-node-bg: 175 20% 15%;
  --state-node-border: 175 40% 30%;
}
```

---

## Hero Background (`src/components/HeroSection.tsx`)
Replace the 3D node animation background with a static diagrammatic alternative:
- Option A (preferred): render a simplified SVG state machine diagram as the hero visual.
  Show nodes: Application → UnderReview → Approved → Active → Settled with connecting arrows.
  Style: dark bg, teal nodes with white labels, thin arrow connectors. Semi-transparent.
- Option B (fallback): replace the image with a clean gradient only:
  `bg-gradient-to-br from-slate-900 via-[hsl(220,14%,10%)] to-[hsl(175,40%,8%)]`
  No image, no particles, no animation.
- Do NOT use the `.texture-overlay` class.
- Keep the headline, sub-text, and CTA buttons as they are.

---

## EcosystemSection Icons (`src/components/EcosystemSection.tsx`)
The six feature icons use `bg-icon` (orange). Change them to use `bg-primary/10` (teal tint)
with `text-primary` for the icon colour. Do not change the icon shapes or labels.

Before: `className="bg-icon text-icon-foreground ..."`
After:  `className="bg-primary/10 text-primary ..."`

Apply this change to all icon containers in EcosystemSection only.
Do NOT change icon styling in ThreeStepSection or ThreeBenefitsSection (leave those as-is).

---

## Entity Model Replacement (`src/components/DeveloperReliabilitySection.tsx`)
Replace the `complexEntityJson` string with this financial loan entity.
This is the single most damaging content problem on the site — an ICP fintech CTO will
immediately dismiss the product if the demo code is a warehouse inventory schema.

```json
{
  "loanId": "string",                      // required, unique
  "borrowerId": "string",                  // required
  "borrowerName": "string",                // required
  "principalAmount": 0,                    // required: GBP
  "interestRate": 0.0,                     // required: annual %, e.g. 0.085

  "currentState": "Application",          // state machine current state
  "stateHistory": [
    {
      "state": "Application",
      "transitionedAt": "ISO8601",
      "transitionedBy": "string",          // userId of actor
      "reason": "string",
      "snapshotRef": "string"              // consistency-time snapshot pointer
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

Valid states for `currentState`:
`Application → UnderReview → Approved → Active → Settled | Defaulted | Restructured`

Also update the section heading from "Built for Developers Who Demand Reliability" to
"Built for Developers Who Demand Correctness" (audit found "Correctness" is stronger for
the ICP — it references the exact language of financial system requirements).

---

## State Machine Diagrams (Use-Case Sub-Pages)
Each use-case detail page needs a visual state transition diagram. Build these as React
components using Tailwind only — no external diagram library (e.g. no Mermaid, no D3).

### StateMachineNode component pattern
```tsx
// Render each state as a styled pill/box connected by arrows
<div className="flex flex-wrap items-center gap-2">
  {states.map((state, i) => (
    <>
      <div className="px-3 py-1.5 rounded-full border
                      bg-[hsl(var(--state-node-bg))]
                      border-[hsl(var(--state-node-border))]
                      text-primary text-sm font-medium">
        {state}
      </div>
      {i < states.length - 1 && (
        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
      )}
    </>
  ))}
</div>
```

### State sequences per page:
- **Loan Lifecycle**: Application → Under Review → Approved → Active → Settled / Defaulted
- **Trade Settlement**: Pending → Matched → Affirmed → Settled / Failed / Cancelled
- **KYC Onboarding**: Initiated → ID Verification → Sanctions Check → Approved / Rejected
- **Agentic AI**: Action Proposed → Validated → Executing → Completed / Rolled Back

Place each diagram in a card (shadcn `Card`) with label "Entity State Machine" above it,
immediately after the "How Cyoda Solves It" section on each use-case page.

---

## EDBMS Definition (Homepage)
The acronym EDBMS (Entity Database Management System) is used in the comparison diagram
but is not defined in readable body text anywhere on the site. Add one sentence to the
homepage Three-System Problem section:

> "The Cyoda EDBMS (Entity Database Management System) unifies transactional storage,
>  event-driven processing, and workflow orchestration in a single consistency model."

---

## Section Conventions (for any new or modified sections)
```tsx
// Standard section
<section className="py-16 md:py-24 bg-background">
  <div className="container mx-auto px-4 max-w-6xl">...</div>
</section>

// Alternating section
<section className="py-16 md:py-24 bg-[hsl(var(--section-alt-bg))]">

// SectionHeader inline pattern
<p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">OVERLINE</p>
<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Heading</h2>
<p className="text-lg text-muted-foreground max-w-2xl mx-auto">Sub-text.</p>

// ProofPoint bullet
<div className="flex items-start gap-3">
  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
  <p className="text-muted-foreground">Text here</p>
</div>
```

## Responsive Rules
- All new/modified sections: fully functional at 375px, no horizontal scroll
- Grids: 1 col (<640px) → 2 col (≥640px) → 3 col (≥1024px)
- Do not refactor working responsive code in existing sections
