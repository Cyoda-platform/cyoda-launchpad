# Implementation Prompt: Cyoda Competitive Comparison Table

## Context

This prompt is for a developer (or AI coding agent) working inside the `cyoda-launchpad` repository. The repo is a **React + TypeScript + Tailwind CSS + shadcn/ui** application, currently serving the Cyoda marketing website at `localhost:8080`. The task is to add a new **competitive comparison section** — drawn from the existing battlecard HTML — in a style that is visually identical to the rest of the site.

---

## Design System Reference

Before writing any code, understand the design tokens already defined in `src/index.css`:

| Token | Dark mode value | Use |
|---|---|---|
| `--background` | `220 14% 8%` | Page background |
| `--card` | `220 14% 10%` | Card/panel backgrounds |
| `--border` | `220 10% 22%` | All borders |
| `--muted` | `220 10% 16%` | Subtle backgrounds |
| `--muted-foreground` | `220 10% 70%` | Secondary text |
| `--foreground` | `220 20% 96%` | Primary text |
| `--primary` / `--cyoda-teal` | `175 67% 52%` | Teal accent — Cyoda brand |
| `--cyoda-orange` | `32 95% 59%` | Icon backgrounds |
| `--section-alt-bg` | `220 14% 10%` | Alternate section background |
| `--radius` | `6px` | Border radius |

**Font**: `Montserrat` (already loaded globally via `font-montserrat` Tailwind class)

**Badge/status colours** (use Tailwind classes, no custom CSS):
- ✓ Win (Cyoda wins): `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`
- ✗ Lose (competitor wins): `bg-red-500/10 text-red-400 border border-red-500/20`
- ~ Partial: `bg-amber-500/10 text-amber-400 border border-amber-500/20`

**Existing section pattern to follow** (from `Index.tsx`):
```tsx
<section className="py-16 md:py-24 bg-[hsl(var(--section-alt-bg))]">
  <div className="container mx-auto px-4 max-w-6xl">
    <div className="text-center mb-12">
      <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
        SECTION LABEL
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        Section Title
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Subtitle text
      </p>
    </div>
    {/* content */}
  </div>
</section>
```

---

## What to Build

### Option A — Standalone page (recommended)
Create `src/pages/Comparison.tsx` and add a route for `/comparison` in the router. Add "Compare" as a nav link under Products or in the main nav.

### Option B — Section on Products page
Add the comparison section at the bottom of `src/pages/Products.tsx`.

**Go with Option A** unless the Products page is already long. A standalone `/comparison` page is better for SEO and linking.

---

## Component Structure

Create the following files:

```
src/components/ComparisonTable.tsx       ← Main matrix table
src/components/CompetitorTabs.tsx        ← Tabbed competitor deep-dives (optional)
src/pages/Comparison.tsx                 ← Page wrapper
```

---

## Part 1: ComparisonTable.tsx

This is the **head-to-head matrix** — the most important element. It should render a responsive scrollable table.

### Data

Use this exact capability data (extracted from the battlecard):

```ts
const COMPETITORS = ['Cyoda (EDBMS)', 'Temporal', 'Camunda', 'Confluent/Kafka', 'AxonIQ', 'XTDB'];

type Status = 'win' | 'lose' | 'partial';

interface Capability {
  label: string;
  ratings: [Status, Status, Status, Status, Status, Status]; // Cyoda, Temporal, Camunda, Confluent, AxonIQ, XTDB
  cyodaLabel: string;    // e.g. "Native"
  notes: [string, string, string, string, string, string]; // short label per competitor
}

const CAPABILITIES: Capability[] = [
  {
    label: 'Unified data + workflow (no glue code)',
    ratings: ['win', 'lose', 'lose', 'lose', 'partial', 'lose'],
    cyodaLabel: 'Native',
    notes: ['Native', 'Requires DB', 'Requires DB', 'No state', 'Partial', 'No workflow'],
  },
  {
    label: 'Point-in-time / bitemporal queries',
    ratings: ['win', 'lose', 'lose', 'lose', 'partial', 'win'],
    cyodaLabel: 'Intrinsic',
    notes: ['Intrinsic', 'No', 'No', 'No', 'Limited', 'Native'],
  },
  {
    label: 'ACID + distributed long-lived workflows',
    ratings: ['win', 'partial', 'partial', 'lose', 'partial', 'lose'],
    cyodaLabel: 'SSI',
    notes: ['SSI', 'Durable exec', 'Via ext DB', 'Not transactional', 'Framework only', 'No workflow'],
  },
  {
    label: 'Intrinsic audit trail (not bolt-on)',
    ratings: ['win', 'lose', 'lose', 'lose', 'partial', 'win'],
    cyodaLabel: 'Write-only store',
    notes: ['Write-only store', 'App-level', 'App-level', 'Log only', 'Event store', 'Immutable'],
  },
  {
    label: 'Finite state machine per entity',
    ratings: ['win', 'lose', 'partial', 'lose', 'partial', 'lose'],
    cyodaLabel: 'First-class',
    notes: ['First-class', 'Code-only', 'BPMN', 'No', 'Aggregates', 'No'],
  },
  {
    label: 'No external DB or broker required',
    ratings: ['win', 'lose', 'lose', 'lose', 'lose', 'lose'],
    cyodaLabel: 'All-in-one',
    notes: ['All-in-one', 'Needs DB', 'Needs DB', 'Broker only', 'Needs infra', 'DB only'],
  },
  {
    label: 'Horizontal scale + ACID',
    ratings: ['win', 'win', 'partial', 'win', 'partial', 'partial'],
    cyodaLabel: 'Cassandra-backed',
    notes: ['Cassandra-backed', 'Yes', 'Depends on DB', 'High throughput', 'Axon Server', 'Maturing'],
  },
  {
    label: 'Financial services production pedigree',
    ratings: ['win', 'partial', 'win', 'win', 'partial', 'lose'],
    cyodaLabel: 'Since 2017',
    notes: ['Since 2017', 'General use', 'Banking/Insurance', 'Widespread', 'General use', 'Early stage'],
  },
  {
    label: 'Managed cloud / SaaS option',
    ratings: ['win', 'win', 'win', 'win', 'partial', 'partial'],
    cyodaLabel: 'Cyoda Cloud',
    notes: ['Cyoda Cloud', 'Temporal Cloud', 'SaaS + self-mgd', 'Confluent Cloud', 'AxonIQ Cloud', 'Open source'],
  },
  {
    label: 'Language-agnostic (gRPC / multi-SDK)',
    ratings: ['win', 'win', 'win', 'win', 'partial', 'partial'],
    cyodaLabel: 'gRPC / any lang',
    notes: ['gRPC / any lang', 'Multi-SDK', 'REST/API', 'Multi-lang', 'JVM primary', 'Clojure/Java'],
  },
  {
    label: 'Regulatory-grade SSI consistency',
    ratings: ['win', 'lose', 'lose', 'lose', 'lose', 'partial'],
    cyodaLabel: 'Explicit SSI',
    notes: ['Explicit SSI', 'No ACID', 'Delegated to DB', 'Eventual only', 'Framework only', 'HTAP, maturing'],
  },
];
```

### Badge Component

```tsx
// StatusBadge.tsx (can be inline in ComparisonTable)
const statusConfig = {
  win:     { icon: '✓', classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  lose:    { icon: '✗', classes: 'bg-red-500/10 text-red-400 border border-red-500/20' },
  partial: { icon: '~', classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
};

function StatusBadge({ status, label }: { status: Status; label: string }) {
  const { icon, classes } = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${classes}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}
```

### Table Layout

```tsx
export function ComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-card border-b border-border">
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[220px]">
              Capability
            </th>
            {/* Cyoda column — highlighted */}
            <th className="text-left px-4 py-3 text-xs font-semibold text-primary uppercase tracking-wider bg-primary/5">
              Cyoda (EDBMS)
            </th>
            {/* Competitor columns */}
            {['Temporal', 'Camunda', 'Confluent/Kafka', 'AxonIQ', 'XTDB'].map(c => (
              <th key={c} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CAPABILITIES.map((cap, i) => (
            <tr
              key={cap.label}
              className={`border-b border-border hover:bg-muted/30 transition-colors ${i % 2 === 0 ? 'bg-background' : 'bg-card/50'}`}
            >
              <td className="px-4 py-3 text-muted-foreground font-medium text-sm leading-snug">
                {cap.label}
              </td>
              {cap.ratings.map((status, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 ${j === 0 ? 'bg-primary/5' : ''}`}
                >
                  <StatusBadge status={status} label={cap.notes[j]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Important visual detail**: The Cyoda column (`j === 0` in the loop) should have a subtle `bg-primary/5` tint and the header should use `text-primary` — mirroring the existing design pattern where teal signals Cyoda's brand.

---

## Part 2: Quick Win/Loss Summary Cards

Below the table, add a 2–3 column responsive grid of summary cards. Each card covers one competitor.

Pattern (match the existing `EcosystemSection` card style from the site):

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
  {WIN_LOSS_SUMMARY.map(({ competitor, cyodaWins, theyWin }) => (
    <div key={competitor} className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-bold text-foreground mb-4">vs. {competitor}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Cyoda Wins</p>
          <ul className="space-y-1">
            {cyodaWins.map(w => (
              <li key={w} className="text-xs text-muted-foreground border-b border-border pb-1 last:border-0">
                {w}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">{competitor} Wins</p>
          <ul className="space-y-1">
            {theyWin.map(w => (
              <li key={w} className="text-xs text-muted-foreground border-b border-border pb-1 last:border-0">
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ))}
</div>
```

Win/loss data to use:

```ts
const WIN_LOSS_SUMMARY = [
  {
    competitor: 'Temporal',
    cyodaWins: [
      'Audit trail built-in, not app logic',
      'Data + workflow in one consistency model',
      'No glue between DB and orchestrator',
      'Point-in-time queries without extra tooling',
      'ACID across distributed long-lived workflows',
    ],
    theyWin: [
      'Larger community & ecosystem',
      'More SDK language options',
      'Easier for general microservices',
      'Proven hyperscale deployments',
    ],
  },
  {
    competitor: 'Camunda',
    cyodaWins: [
      'No separate DB needed',
      'Regulatory audit trail is intrinsic',
      'ACID consistency out of the box',
      'Built for machine-to-machine workflows',
      'Designed for high-volume financial data',
    ],
    theyWin: [
      'Business analyst-friendly BPMN editor',
      'Human task management built-in',
      'Huge enterprise customer base',
      'DMN decision tables for business rules',
    ],
  },
  {
    competitor: 'Confluent/Kafka',
    cyodaWins: [
      'Transactional entity state (not just events)',
      'No app-level conflict resolution needed',
      'Workflow + data in one system',
      'Full audit history out of the box',
      'ACID, not just ordering guarantees',
    ],
    theyWin: [
      'Massive throughput at scale',
      'Industry-standard integration hub',
      'Ubiquitous ecosystem & connectors',
      'Ideal for pure stream analytics',
    ],
  },
  {
    competitor: 'AxonIQ',
    cyodaWins: [
      'All-in-one: no separate DB + broker needed',
      'JSON-configurable entity models',
      'Designed specifically for FS back-office',
      'ACID consistency with SSI guarantee',
      'Point-in-time queries native',
    ],
    theyWin: [
      'Pure DDD/CQRS pattern support',
      'Strong Java/Spring community',
      'Flexible for event-driven microservices',
      'More widely known in DDD circles',
    ],
  },
  {
    competitor: 'XTDB',
    cyodaWins: [
      'Built-in workflow engine',
      'ACID distributed transactions',
      'Financial services production track record',
      'Managed cloud available now',
      'Horizontal scale proven (Cassandra-backed)',
    ],
    theyWin: [
      'Standard SQL interface',
      'True bitemporal (valid time + system time)',
      'Open source / no license cost',
      'Simpler for pure data use cases',
    ],
  },
];
```

---

## Part 3: Page Wrapper (Comparison.tsx)

```tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { ComparisonTable } from '@/components/ComparisonTable';

export default function Comparison() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Cyoda vs Temporal, Camunda, Kafka — Platform Comparison"
        description="See how Cyoda's EDBMS compares to Temporal, Camunda, Confluent/Kafka, AxonIQ, and XTDB across the capabilities that matter in regulated financial services."
        url="https://cyoda.com/comparison"
      />
      <Header />
      <main>

        {/* Hero section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              PLATFORM COMPARISON
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Why Teams Choose Cyoda Over the Standard Stack
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Temporal for orchestration, Camunda for workflows, Kafka for events — each is excellent at what it does.
              The hard part is making them consistent with each other. Cyoda eliminates that problem.
            </p>
          </div>
        </section>

        {/* Comparison matrix */}
        <section className="py-12 md:py-20 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Head-to-Head Comparison
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Across the dimensions that matter in financial services and regulated back-office systems.
              </p>
            </div>
            <ComparisonTable />

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">✓ Native</span>
                Fully supported natively
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">~ Partial</span>
                Partial or via extension
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">✗ No</span>
                Not supported
              </div>
            </div>
          </div>
        </section>

        {/* Win/Loss summary cards */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                When to Choose Cyoda
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Cyoda is purpose-built for stateful, auditable, transactional entity workflows.
                Here's how the trade-offs break down by competitor.
              </p>
            </div>
            {/* Insert WIN_LOSS_SUMMARY grid here */}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to evaluate Cyoda?
            </h2>
            <p className="text-muted-foreground mb-8">
              Free tier available at ai.cyoda.net. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://ai.cyoda.net"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Start Evaluating for Free
              </a>
              <a
                href="/docs"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-border text-foreground font-semibold text-sm hover:bg-muted/40 transition-colors"
              >
                Read the Docs
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
```

---

## Routing

In `src/App.tsx` (or wherever routes are defined), add:

```tsx
import Comparison from '@/pages/Comparison';

// Inside <Routes>:
<Route path="/comparison" element={<Comparison />} />
```

And in `src/components/Header.tsx`, add a nav link (probably under Products dropdown or as a standalone link):

```tsx
<Link to="/comparison" className="...existing nav link classes...">
  Compare
</Link>
```

---

## Responsive behaviour

- On mobile (`< md`): the table should be horizontally scrollable. Wrap the table in `<div className="overflow-x-auto">`. Consider showing only Cyoda + 2 competitors on small screens using `hidden md:table-cell` on less critical columns.
- Win/loss cards: single column on mobile, 2 on tablet, 3 on desktop.

---

## Styling notes — DO and DON'T

| DO | DON'T |
|---|---|
| Use `hsl(var(--token))` or Tailwind semantic classes | Hardcode hex colours |
| Use `font-montserrat` (already global) | Import or change the font |
| Use `rounded-xl` for cards, `rounded-md` for smaller elements | Mix border radii randomly |
| Follow the section-label → h2 → subtitle pattern for every section | Skip the small uppercase label above headings |
| Use `text-primary` for Cyoda teal highlights | Use `text-teal-*` Tailwind classes (wrong shade) |
| Use `bg-primary/5` or `bg-primary/10` for subtle teal tints | Use heavy teal fills on backgrounds |
| Keep the Cyoda column visually distinct (subtle tint + teal header) | Treat Cyoda the same as competitors in the table |

---

## Summary of files to create/modify

| File | Action |
|---|---|
| `src/pages/Comparison.tsx` | Create — new page |
| `src/components/ComparisonTable.tsx` | Create — matrix table + badge component |
| `src/App.tsx` | Modify — add `/comparison` route |
| `src/components/Header.tsx` | Modify — add "Compare" nav link |
