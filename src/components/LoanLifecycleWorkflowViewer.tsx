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
import EntityDataModelCard from '@/components/EntityDataModelCard';
import workflowJson from '@/data/workflows/LoanLifecycleWorkflow.json?raw';
import enhancedLoanApplicationJson from '@/data/examples/corporate-loan-application-enhanced.json?raw';

const loanApplicationEntityModel = {
  title: 'What the entity contains',
  body:
    'This illustrative LoanApplication example uses a more realistic corporate credit model: borrower identity, multiple facilities, financials, collateral, beneficial owners, guarantors, covenants, reporting requirements, and conditions precedent all sit on the same governed entity record.',
  snippet: enhancedLoanApplicationJson,
};

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
          <CardTitle className="text-base">Entity workflow could not be rendered</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            The supplied LoanApplication entity workflow JSON did not pass the viewer parser.
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
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              ENTITY WORKFLOW
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">LoanApplication</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Lifecycle in a corporate lending system
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Pan to explore the entity lifecycle and select a state or transition for details.
            </p>
          </div>
          <div className="h-[clamp(42rem,72vh,78rem)] min-h-[42rem] w-full bg-background">
            <WorkflowViewer
              graph={graph}
              layout={layout ?? undefined}
              selectedId={selectedId ?? undefined}
              onSelectionChange={setSelectedId}
              className="h-full w-full"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(320px,24rem)_minmax(0,1fr)]">
        <Card className="h-full min-h-[24rem] border-border/60 bg-card/80 shadow-sm xl:sticky xl:top-20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Entity lifecycle detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {!selected && (
              <>
                <p className="text-muted-foreground">
                  Select a state or transition to inspect the entity lifecycle semantics.
                </p>
                <div className="rounded-lg border border-primary/20 bg-primary/[0.03] p-4">
                  <p className="font-medium text-foreground">LoanApplication entity workflow JSON</p>
                  <p className="mt-1 text-muted-foreground">
                    This viewer is driven directly from the LoanApplication entity workflow file,
                    including borrower intake, KYC, credit assessment, approval committee review,
                    drawdown, servicing, arrears, and terminal outcomes.
                  </p>
                </div>
              </>
            )}

            <div className="rounded-lg border border-border/60 bg-background p-4">
              <p className="font-medium text-foreground">{loanApplicationEntityModel.title}</p>
              <p className="mt-1 text-muted-foreground">{loanApplicationEntityModel.body}</p>
            </div>

            {selected?.kind === 'node' && selected.node.kind === 'state' && (
              <StateDetail node={selected.node} />
            )}

            {selected?.kind === 'node' && selected.node.kind === 'startMarker' && (
              <>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  ENTITY ENTRY
                </p>
                <p className="text-lg font-semibold text-foreground">Lifecycle start</p>
                <p className="text-muted-foreground">
                  This marks the initial entry into the LoanApplication entity lifecycle.
                </p>
              </>
            )}

            {selected?.kind === 'edge' && (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    ENTITY TRANSITION
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

        <EntityDataModelCard
          title=""
          body=""
          snippet={loanApplicationEntityModel.snippet}
          className="border-border/60 bg-card/80 shadow-sm"
          codeClassName="min-h-[18rem]"
          jsonTitle="LoanApplication.json"
          jsonBadge="JSON entity"
          jsonMaxHeight="26rem"
          dialogTitle="Illustrative corporate loan application model"
          dialogDescription="A larger view of the illustrative LoanApplication entity example used on this page."
          dialogTriggerLabel="Open larger model window"
        />
      </div>
    </div>
  );
}

function StateDetail({ node }: { node: StateNode }) {
  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          ENTITY STATE
        </p>
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
