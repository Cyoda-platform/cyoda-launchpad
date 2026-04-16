# Change Spec: ArchitectureDiagram Component

**File to edit:** `src/components/ArchitectureDiagram.tsx`
**Type of change:** Data-only. Do not modify JSX structure, Tailwind classes, or component layout. Replace content in two arrays only.

---

## Why this change is required

The current left column names specific third-party technologies (Apache Cassandra, Apache ZooKeeper, Temporal, XState, EventStoreDB, XTDB). Naming these tools on the homepage is counterproductive for two reasons:

1. Each named tool has a large user base of admirers. Framing them as "the problem" creates immediate resistance in the exact technical audience the page is targeting.
2. The comparison implies Cyoda is a replacement for those specific tools — which is not the product's positioning. Cyoda replaces the *architecture pattern*, not any individual tool.

The right column also names Cassandra and ZooKeeper as built-in implementation details. These references should be removed to maintain consistent generic positioning throughout the diagram.

The fix is to describe each capability generically — what the capability *does*, not which product a team might use to provide it.

---

## Change 1: Replace the `leftSystems` array

**Current code (lines 2–12):**

```tsx
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
```

**Replace with:**

```tsx
const leftSystems = [
  { name: 'Distributed transactional store', label: 'Reliable, consistent storage for entity state at scale' },
  { name: 'Cluster coordination', label: 'Metadata management, leader election, distributed locking' },
  { name: 'Workflow orchestration engine', label: 'Long-running, durable process execution across system boundaries' },
  { name: 'Finite state machine enforcement', label: 'Governed entity lifecycle with explicit transition rules' },
  { name: 'Cross-boundary consistency', label: 'Serialisable isolation across the database and workflow boundary — most teams never fully solve this' },
  { name: 'Immutable audit store', label: 'Write-only event log for compliance and point-in-time reconstruction' },
  { name: 'Point-in-time query engine', label: 'Historical state queries without retention windows or ETL pipelines' },
  { name: 'Concurrency control and idempotency', label: 'Safe parallel processing without duplicate side-effects' },
  { name: 'Client integration layer', label: 'Typed API surface for service and system integration' },
];
```

---

## Change 2: Replace the `rightCapabilities` array

**Current code (lines 14–24):**

```tsx
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
```

**Replace with:**

```tsx
const rightCapabilities = [
  'Distributed transactional store (built in)',
  'Cluster coordination (built in)',
  'Workflow orchestration engine',
  'Finite state machine enforcement',
  'SSI transaction manager across the database–workflow boundary',
  'Immutable audit store (the storage mechanism itself, not a bolt-on)',
  'Point-in-time query engine, no retention window',
  'Event-context sharding and concurrency control',
  'gRPC API layer',
];
```

---

## Constraints

- Do not modify any JSX, Tailwind classes, or structural markup.
- Do not change the column headings ("Without Cyoda" / "With Cyoda"), subheadings, or footer lines.
- Do not change the number of items in either array (both remain 9 items).
- The `name` / `label` object shape used in `leftSystems` must stay the same — the JSX renders `system.name` and `system.label` separately.

---

## Verification

After making the changes, run:

```bash
npm run build && npm run typecheck
```

Both must pass with zero errors before the task is complete.
