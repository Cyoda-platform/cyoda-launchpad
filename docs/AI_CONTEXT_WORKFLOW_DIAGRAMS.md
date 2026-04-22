# AI Context: Workflow Diagrams

This repo has a small internal workflow-diagram system for the Cyoda website.

It is a spec-driven SVG renderer, not an external package. Future AI coding agents should use it to modify existing workflow graphs and create new ones without hand-editing raw SVG coordinates.

## What The System Is

- Internal library: `src/lib/workflow-diagram/`
- Workflow specs: `src/workflows/`
- Renderer: `<WorkflowDiagram spec={...} />`
- Data flow: spec -> computed layout -> SVG render

The system supports the current site pattern:

- multiple lanes
- a main deterministic left-to-right row
- branch paths
- exception paths
- terminals
- loopbacks
- process annotations
- edge-label pills
- collision-aware transition labels
- lane and node anchored labels
- stacked rows inside a lane using `node.layout.row`

## What Future AI Agents Should Modify

Modify workflow spec files for:

- node wording
- lane titles
- edge labels
- adding/removing states
- changing branch meaning
- adding labels or callouts
- per-diagram layout hints

Modify `tokens.ts` for:

- shared colors
- tones
- node size defaults
- spacing defaults
- legend defaults

Modify `layout.ts` or `routing.ts` for:

- behavior that should affect all diagrams
- new layout rules
- new routing strategies
- better label placement behavior

Modify renderer components only when changing how all diagrams draw shared primitives.

## What Future AI Agents Should Avoid

- Do not hard-code random coordinates in pages.
- Do not duplicate node, edge, or lane components for one diagram.
- Do not fork `WorkflowDiagram.tsx` for one workflow unless absolutely necessary.
- Do not patch generated SVG output directly.
- Do not reintroduce iframe `srcDoc` workflow artifacts.
- Do not hide workflow content in page JSX when it belongs in a spec.
- Do not reference visible text as an ID. Use semantic IDs.

## Editing Rules

- Content changes belong in `src/workflows/*.ts`.
- Shared style changes belong in `src/lib/workflow-diagram/tokens.ts`.
- Shared layout behavior belongs in `layout.ts`.
- Shared edge path behavior belongs in `routing.ts`.
- One-off exceptions must be documented in the relevant workflow spec.
- Preserve semantic IDs unless all references are updated.
- Keep content, layout, rendering, and design tokens separate.

## How To Add A New Workflow

1. Create a new file in `src/workflows/`, for example `customerReviewWorkflow.ts`.
2. Import `WorkflowDiagramSpec` from `@/lib/workflow-diagram`.
3. Define lanes with semantic IDs and `order`.
4. Define main-flow nodes with semantic IDs, `laneId`, `kind`, labels, `layout.row`, and `layout.order`.
5. Mark the main lane with `layout.mainLaneId`.
6. List main nodes in `layout.mainNodeIds`.
7. Add branch/terminal/process nodes using `alignXWith` or `branchOf`.
8. Add edges using semantic `from` and `to` IDs.
9. Choose routing strategies:
   - `horizontal` for same-row flow
   - `vertical` for top/bottom attachments
   - `orthogonal` for branch turns
   - `curve` for soft non-critical arcs
   - `loop-above` for top feedback loops
   - `loop-left` for re-entry loops
   - `right-detour` for far terminal paths
   - `bottom-corridor` for low exception paths
10. Add labels using `nearNodeId`, `laneId`, or edge labels.
11. Export the spec from `src/workflows/index.ts`.
12. Render it in a page with `<WorkflowDiagram spec={myWorkflow} />`.
13. Run `npx tsc --noEmit` and `npm run build`.

Use existing specs as templates:

- `loanLifecycleWorkflow.ts`
- `tradeSettlementWorkflow.ts`
- `kycOnboardingWorkflow.ts`
- `agenticAiRegulatedActionWorkflow.ts`

## How To Debug Layout Issues

Nodes overlap:

- Check `layout.mainNodeIds` order.
- Move crowded same-lane nodes into separate semantic rows with `node.layout.row`.
- Add or fix `alignXWith`.
- Increase `layout.nodeGap`.
- Use `wide` or `persistent` size variants.
- Use a small `layout.offset` only after row and alignment hints are exhausted.

Labels collide:

- Prefer edge `label` for transition labels.
- Add `edge.layout.labelPlacement` for a stable side or start/middle/end preference.
- Check whether the route should change before adding one-off layout hints.
- For diagram callouts, anchor with `nearNodeId` or `laneId`.
- Shorten long labels or set `maxChars`.

Lanes are too small:

- Node height controls lane height.
- Use a larger size variant if text is cramped.
- Avoid very long subtitles.

Loopbacks cross content awkwardly:

- Try `loop-above` for monitoring/reassessment loops.
- Try `loop-left` for re-entry into an earlier state.
- Check `fromPort` and `toPort`.
- If necessary, adjust the target node alignment in the spec.

Text does not fit nodes:

- Use `wide`, `persistent`, or `terminal`.
- Move supporting copy into `body`.
- Shorten process labels.
- Only change size defaults in `tokens.ts` if all diagrams benefit.

## Safe Extension Guidelines

Adding a node kind:

- Add the kind in `types.ts`.
- Add rendering in `nodes/WorkflowNode.tsx`.
- Add tokens if it needs a new shared visual treatment.
- Verify all existing diagrams still render.

Adding a size variant:

- Add the variant in `types.ts`.
- Add defaults in `tokens.ts`.
- Use it in a single spec first.
- Run build and visually inspect the affected diagram.

Adding a routing strategy:

- Add the strategy in `types.ts`.
- Implement it in `routing.ts`.
- Keep it semantic, not diagram-specific.
- Document when to use it in the README and this file.

Adding label behavior:

- Add data shape in `types.ts` only if existing anchors are insufficient.
- Implement placement in `layout.ts`.
- Keep `WorkflowDiagram.tsx` render-only where possible.

## Final Reminder

If the user asks for a content change, start in `src/workflows/`.

If the user asks for a visual-system change, start in `tokens.ts`.

If the user asks for overlap, routing, or layout fixes, start in `layout.ts` or `routing.ts`.

Do not make a new one-off SVG renderer unless the current library genuinely cannot support the requested diagram and the limitation is documented.
