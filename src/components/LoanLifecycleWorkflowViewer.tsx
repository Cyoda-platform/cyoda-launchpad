import { useEffect, useMemo, useState } from 'react';
import { parseImportPayload } from '@cyoda/workflow-core';
import {
  projectToGraph,
  type CriterionSummary,
  type GraphNode,
  type StateNode,
  type TransitionEdge,
} from '@cyoda/workflow-graph';
import { layoutGraph, type LayoutResult as WorkflowLayoutResult } from '@cyoda/workflow-layout';
import { WorkflowViewer } from '@cyoda/workflow-viewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import workflowJson from '@/data/workflows/LoanLifecycleWorkflow.json?raw';

function asImportPayload(rawWorkflowJson: string) {
  const parsed = JSON.parse(rawWorkflowJson) as { workflows?: unknown };
  if (Array.isArray(parsed.workflows)) {
    return rawWorkflowJson;
  }

  return JSON.stringify({
    importMode: 'MERGE',
    workflows: [parsed],
  });
}

function formatExecution(kind?: 'sync' | 'asyncSameTx' | 'asyncNewTx') {
  switch (kind) {
    case 'sync':
      return 'Sync';
    case 'asyncSameTx':
      return 'Async same transaction';
    case 'asyncNewTx':
      return 'Async new transaction';
    default:
      return null;
  }
}

function describeCriterion(criterion?: CriterionSummary) {
  if (!criterion) return null;

  switch (criterion.kind) {
    case 'simple':
    case 'array':
      return `${criterion.path} ${criterion.op}`;
    case 'lifecycle':
      return `${criterion.field} ${criterion.op}`;
    case 'function':
      return criterion.name;
    case 'group':
      return `${criterion.operator} group (${criterion.count})`;
    default:
      return null;
  }
}

function stateLabel(node?: GraphNode) {
  if (!node) return 'Unknown';
  if (node.kind === 'state') return node.stateCode;
  return 'Start';
}

export default function LoanLifecycleWorkflowViewer() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [layout, setLayout] = useState<WorkflowLayoutResult | null>(null);

  const parsed = useMemo(() => {
    return parseImportPayload(asImportPayload(workflowJson));
  }, []);

  const graph = useMemo(() => {
    if (!parsed.document) {
      return null;
    }

    return projectToGraph(parsed.document);
  }, [parsed]);

  useEffect(() => {
    if (!graph) return;

    let cancelled = false;

    void layoutGraph(graph, {
      preset: 'opsAudit',
      orientation: 'horizontal',
      nodeSize: { width: 184, height: 92 },
    }).then((nextLayout) => {
      if (!cancelled) {
        setLayout(nextLayout);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [graph]);

  const nodesById = useMemo(
    () => new Map((graph?.nodes ?? []).map((node) => [node.id, node])),
    [graph],
  );

  const selected = useMemo(() => {
    if (!graph || !selectedId) return null;

    const node = graph.nodes.find((item) => item.id === selectedId);
    if (node) return { kind: 'node' as const, node };

    const edge = graph.edges.find(
      (item): item is TransitionEdge => item.kind === 'transition' && item.id === selectedId,
    );
    if (edge) return { kind: 'edge' as const, edge };

    return null;
  }, [graph, selectedId]);

  if (!graph) {
    return (
      <Card className="border-destructive/30 bg-card/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Workflow could not be rendered</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            The supplied loan lifecycle workflow JSON did not pass the viewer parser.
          </p>
          <div className="rounded-lg border border-border/60 bg-background p-4">
            <p className="font-medium text-foreground">Validation issues</p>
            <div className="mt-2 space-y-2 text-muted-foreground">
              {(parsed.issues ?? []).slice(0, 6).map((issue, index) => (
                <p key={`${issue.code}-${index}`}>{issue.message}</p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-border/60 bg-card/80 shadow-sm">
        <CardContent className="p-0">
          <div className="border-b border-border/60 px-5 py-4">
            <p className="text-sm font-medium text-foreground">Loan lifecycle workflow</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This dense lifecycle is rendered on a wide canvas. Scroll sideways, pan, or zoom to
              inspect the origination, servicing, rework, and terminal paths.
            </p>
          </div>
          <div className="w-full overflow-x-auto bg-background">
            <div className="h-[882px] min-w-[2556px] bg-background">
              <WorkflowViewer
                graph={graph}
                layout={layout ?? undefined}
                selectedId={selectedId ?? undefined}
                onSelectionChange={setSelectedId}
                className="h-full w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/80 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Selection detail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {!selected && (
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_320px]">
              <p className="text-muted-foreground">
                Select a state or transition to inspect the workflow semantics.
              </p>
              <div className="rounded-lg border border-primary/20 bg-primary/[0.03] p-4">
                <p className="font-medium text-foreground">Loan lifecycle JSON</p>
                <p className="mt-1 text-muted-foreground">
                  This viewer is driven directly from the loan lifecycle workflow file, including
                  document rework, KYC, underwriting, servicing, arrears, and terminal outcomes.
                </p>
              </div>
            </div>
          )}

          {selected?.kind === 'node' && selected.node.kind === 'state' && (
            <StateDetail node={selected.node} />
          )}

          {selected?.kind === 'node' && selected.node.kind === 'startMarker' && (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Start</p>
              <p className="text-lg font-semibold text-foreground">Workflow entry</p>
              <p className="text-muted-foreground">
                This marks the initial entry into the loan application lifecycle.
              </p>
            </>
          )}

          {selected?.kind === 'edge' && (
            <>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Transition
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {selected.edge.label}
                </p>
              </div>
              <p className="text-muted-foreground">
                Path:{' '}
                <span className="text-foreground">
                  {stateLabel(nodesById.get(selected.edge.sourceId))} to{' '}
                  {stateLabel(nodesById.get(selected.edge.targetId))}
                </span>
              </p>
              <p className="text-muted-foreground">
                Manual: <span className="text-foreground">{selected.edge.manual ? 'Yes' : 'No'}</span>
              </p>
              <p className="text-muted-foreground">
                Execution:{' '}
                <span className="text-foreground">
                  {formatExecution(selected.edge.summary.execution?.kind) ?? 'Default'}
                </span>
              </p>
              {describeCriterion(selected.edge.summary.criterion) && (
                <p className="text-muted-foreground">
                  Criterion:{' '}
                  <span className="text-foreground">
                    {describeCriterion(selected.edge.summary.criterion)}
                  </span>
                </p>
              )}
              {selected.edge.summary.processor?.kind === 'single' && (
                <p className="text-muted-foreground">
                  Processor:{' '}
                  <span className="text-foreground">{selected.edge.summary.processor.name}</span>
                </p>
              )}
              {selected.edge.summary.processor?.kind === 'multiple' && (
                <p className="text-muted-foreground">
                  Processors:{' '}
                  <span className="text-foreground">{selected.edge.summary.processor.count}</span>
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StateDetail({ node }: { node: StateNode }) {
  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">State</p>
        <p className="mt-1 text-lg font-semibold text-foreground">{node.stateCode}</p>
      </div>
      <p className="text-muted-foreground">
        Role: <span className="text-foreground">{node.role}</span>
      </p>
      <p className="text-muted-foreground">
        Category: <span className="text-foreground">{node.category}</span>
      </p>
      <p className="text-muted-foreground">
        Disabled outgoing transitions:{' '}
        <span className="text-foreground">{node.hasDisabledOutgoing ? 'Yes' : 'No'}</span>
      </p>
    </>
  );
}
