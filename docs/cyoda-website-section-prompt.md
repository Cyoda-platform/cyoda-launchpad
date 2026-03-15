# Claude Code Prompt: Replace the "Three-System Problem" Section

## Context

This is the Cyoda marketing website, a React + TypeScript + Tailwind + shadcn/ui SPA built with Vite. You are replacing the current "Three-System Problem" section with a more accurate and compelling version that shows Cyoda replaces a 9-component stack, not just 3.

The two files to change are:
- `src/pages/Index.tsx` — contains the section header, pain points array, and EDBMS description paragraph
- `src/components/ArchitectureDiagram.tsx` — contains the side-by-side comparison diagram

Do not change any other part of the page. Do not rename files. Do not change imports unless strictly necessary.

---

## File 1: `src/components/ArchitectureDiagram.tsx`

Replace the entire file with the following:

```tsx
const ArchitectureDiagram = () => {
  const leftSystems = [
    { name: 'Apache Cassandra', label: 'Distributed database' },
    { name: 'Apache ZooKeeper', label: 'Cluster coordination' },
    { name: 'Temporal / Conductor / Step Functions', label: 'Workflow orchestration' },
    { name: 'XState / Spring State Machine', label: 'Finite state machine enforcement' },
    { name: 'Custom SSI transaction manager', label: 'Cross-boundary consistency (most teams never fully solve this)' },
    { name: 'EventStoreDB / append-only tables', label: 'Immutable audit store' },
    { name: 'XTDB / custom event replay', label: 'Point-in-time query engine' },
    { name: 'Outbox pattern / dead-letter queues', label: 'Concurrency control and idempotency' },
    { name: 'gRPC / REST API layer', label: 'Client integration' },
  ];

  const rightCapabilities = [
    'Distributed database (Cassandra, built in)',
    'Cluster coordination (ZooKeeper, built in)',
    'Workflow orchestration engine',
    'Finite state machine enforcement',
    'SSI transaction manager across the DB-workflow boundary',
    'Immutable audit store (the storage mechanism itself, not a bolt-on)',
    'Point-in-time query engine, no retention window',
    'Event-context sharding and concurrency control',
    'gRPC API layer',
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left column — Without Cyoda */}
        <div className="bg-muted/50 rounded-xl p-6 border border-border">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Without Cyoda
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Nine components to assemble, wire, and keep consistent under failure
          </p>

          <div className="space-y-2">
            {leftSystems.map((system, index) => (
              <div key={system.name} className="bg-background border border-border rounded-lg p-3">
                <p className="text-sm font-semibold text-foreground">
                  <span className="text-muted-foreground/60 mr-2 font-mono text-xs">{index + 1}.</span>
                  {system.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 ml-5">{system.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm font-medium text-destructive">
            Glue code between every seam. The consistency guarantee only holds if you built it correctly across all nine.
          </p>
        </div>

        {/* Right column — With Cyoda */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            With Cyoda
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            One platform. One consistency model. All nine capabilities.
          </p>

          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-4">
            <p className="text-base font-bold text-foreground mb-1">Cyoda EDBMS</p>
            <p className="text-xs text-muted-foreground mb-3">Entity Database Management System</p>
            <ul className="space-y-1.5">
              {rightCapabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-primary mt-0.5 shrink-0">✓</span>
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            One consistency model. The audit trail is not added on top — it is how data is stored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
```

---

## File 2: `src/pages/Index.tsx`

Make the following three targeted changes inside the existing problem section. Do not touch any other part of the file.

### Change 1: Update the `painPoints` array

Find:
```tsx
const painPoints = [
  'Glue code between systems that delivers zero business value',
  'Partial failure modes: the DB commits, the event doesn\'t publish',
  'Audit trails reconstructed from disparate logs — painful under regulatory review',
];
```

Replace with:
```tsx
const painPoints = [
  'Most of the engineering effort goes into keeping nine components consistent, not into the product',
  'Partial progress failure modes at every seam: the DB commits, the event fails to publish, the workflow advances on stale data',
  'When a regulator asks for entity state from three months ago, the answer comes from log archaeology across disparate systems',
  'Adding a new workflow state requires coordinated changes across the database schema, the event schema, and the workflow engine',
];
```

### Change 2: Update the section header copy

Find this block:
```tsx
<p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
  THE PROBLEM
</p>
<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
  The Three-System Problem
</h2>
<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
  Most teams building stateful financial systems end up stitching together the same
  stack: Postgres for consistency, Kafka for events, Camunda for workflows. It
  works — until the DB commits and the event fails to publish. Or the workflow
  advances incorrectly. Or the regulator asks you to reconstruct entity state from
  three months ago.
</p>
```

Replace with:
```tsx
<p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
  THE PROBLEM
</p>
<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
  You're Not Assembling Three Systems. You're Assembling Nine.
</h2>
<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
  Every team building stateful financial backends eventually hits the same wall. Postgres for consistency, Kafka for events, Temporal for workflows (that's the shortlist). The full list is nine components, each individually correct, held together by glue code that only works until one of them fails mid-transaction. The hardest problem isn't picking the tools. It's making them consistent across the database-to-workflow boundary and most teams never fully solve it. It's hard for developers to build on and opaque to AI coding tools.
</p>
```

### Change 3: Update the EDBMS description paragraph at the bottom of the section

Find:
```tsx
<p className="text-center text-muted-foreground mt-10 max-w-3xl mx-auto">
  The Cyoda EDBMS (Entity Database Management System) unifies transactional storage,
  event-driven processing, and workflow orchestration in a single consistency model.
</p>
```

Replace with:
```tsx
<p className="text-center text-muted-foreground mt-10 max-w-3xl mx-auto">
  The Cyoda EDBMS (Entity Database Management System) ships all nine capabilities in a single consistency model. Transactions, workflows, and point-in-time queries share one source of truth. The audit trail is not a log added on top — it is the storage mechanism itself.
</p>
```

---

## After Making Changes

Run the dev server to verify the changes render correctly:
```bash
npm run dev
```

Check that:
1. The section heading updated to the new title
2. The pain points list shows all four new items
3. The architecture diagram shows 9 numbered components on the left and 9 checkmarked capabilities on the right
4. The bottom paragraph updated
5. No TypeScript errors or missing import errors

Do not modify anything else in the codebase.
