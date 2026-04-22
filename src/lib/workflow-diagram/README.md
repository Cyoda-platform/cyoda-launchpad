# Workflow Diagram Library

Small internal SVG workflow-diagram system for the Cyoda website.

It is intentionally not a generic graph package. It handles the site's workflow style: lanes, a left-to-right main flow, branch states, terminals, loopbacks, process annotations, and edge labels.

## Data Flow

There are now two supported data paths:

1. Curated presentation specs:

`WorkflowDiagramSpec` -> `computeWorkflowDiagramLayout()` -> `<WorkflowDiagram />`

2. Valid Cyoda workflow JSON:

`Cyoda workflow JSON` -> `normalize/validate` -> `parse/classify` -> `ELK layout` -> `<CyodaWorkflowDiagram />`

- Specs live in `src/workflows/`.
- JSON-backed workflow examples live in `src/data/workflows/`.
- Layout logic lives in `src/lib/workflow-diagram/layout.ts` and `routing.ts`.
- Cyoda JSON parsing and ELK layout live in `src/lib/workflow-diagram/cyoda/`.
- Rendering primitives live in `nodes/`, `edges/`, and `lanes/`.
- Shared visual choices live in `tokens.ts`.

## Key Modules

- `types.ts`: spec model and computed layout types.
- `tokens.ts`: spacing, size variants, tone classes, and default legend.
- `geometry.ts`: box, port, wrapping, and text-width helpers.
- `layout.ts`: lane-aware node placement, lane bounds, label anchors.
- `routing.ts`: edge path generation from routing strategies.
- `WorkflowDiagram.tsx`: public renderer component.
- `cyoda/normalizeCyodaInput.ts`: accepts single workflows, import/export envelopes, and UI wrappers.
- `cyoda/parseCyodaWorkflow.ts`: turns Cyoda states and transitions into display nodes and edges.
- `cyoda/classifyCyodaGraph.ts`: detects initial, terminal, manual, processing, conditional, and loop semantics.
- `cyoda/layoutWithElk.ts`: computes read-only presentation layout with ELK.
- `cyoda/CyodaWorkflowDiagram.tsx`: public renderer for valid Cyoda workflow JSON.

## Editing Existing Workflows

For wording, states, edges, and labels, edit the spec file in `src/workflows/`.

Use semantic IDs for references:

```ts
{ id: 'kycCheck', title: 'KYC check', ... }
{ from: 'kycCheck', to: 'kycPassed', ... }
```

Do not reference visible text in edges or labels. Text changes should not break routing.

## Editing Style

Use `tokens.ts` for shared color/tone/size changes. Avoid one-off Tailwind classes inside workflow specs.

Use node `tone` values such as `default`, `active`, `success`, `warning`, `danger`, `human`, `ai`, and `muted`.

## Editing Layout

Prefer layout hints in a spec:

- `layout.mainLaneId`
- `layout.mainNodeIds`
- `node.layout.order`
- `node.layout.row`
- `node.layout.alignXWith`
- `node.layout.branchOf`
- `edge.layout.routing`
- `edge.layout.fromPort` / `toPort`
- `edge.layout.labelPlacement`
- `label.nearNodeId` / `laneId`

Use `node.layout.row` to split crowded lanes into stacked computed rows before changing spacing. Use `node.layout.offset` only as a documented last-resort nudge when semantic alignment is not enough.

Transition labels are placed from the edge route and then nudged away from node and label collisions. Use `edge.layout.labelPlacement` only for edges that need a stable side or start/middle/end preference.

## Creating A New Workflow

For a real Cyoda workflow JSON file, prefer the JSON-driven renderer:

1. Add the workflow object in `src/data/workflows/` as a typed `CyodaWorkflowConfig`.
2. Render it with `<CyodaWorkflowDiagram input={workflowConfig} />`.
3. Keep raw Cyoda state and transition IDs intact.
4. Disabled transitions are hidden by default. Pass `showDisabledTransitions` only for diagnostics.
5. Criteria and processors are summarized as badges, not expanded into the main diagram.
6. Use `direction="DOWN"` for workflows that are too wide as a left-to-right graph.

For a curated non-JSON presentation diagram:

1. Create `src/workflows/myWorkflow.ts`.
2. Define lanes top-to-bottom with semantic IDs.
3. Define main-flow nodes with `layout.baseline: true` and increasing `order`.
4. Set `layout.mainLaneId` and `layout.mainNodeIds`.
5. Add branch, process, and terminal nodes with `alignXWith` or `branchOf`.
6. Add edges with routing strategies such as `horizontal`, `vertical`, `orthogonal`, `loop-above`, `loop-left`, `right-detour`, or `bottom-corridor`.
7. Render with `<WorkflowDiagram spec={myWorkflow} />`.
8. Run `npx tsc --noEmit` and `npm run build`.

## Common Pitfalls

- Nodes overlap: move crowded nodes into a separate `node.layout.row`, add or fix `alignXWith`, increase `layout.nodeGap`, or use a wider size variant.
- Text does not fit: use a larger `size`, shorten text, or add a body line.
- Loop crosses content: try `loop-above`, `loop-left`, or move the target with alignment hints.
- Labels collide: set `edge.layout.labelPlacement` for the stubborn edge, shorten long transition text, or anchor diagram labels to `nearNodeId`.
- Lanes too tight: check the node size variants and avoid hiding content in very long subtitles.
- Cyoda JSON diagram missing a transition: check whether the transition has `disabled: true`; disabled transitions are hidden by default.
- Cyoda JSON labels feel crowded: keep raw IDs, but tune `wrapRawIdentifier`, ELK spacing, or label collision behavior in `cyoda/layoutWithElk.ts`.

Keep content in specs, shared behavior in layout/routing, and shared style in tokens.
