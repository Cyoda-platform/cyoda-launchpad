import type {
  CyodaDisplayEdge,
  CyodaDisplayEdgeKind,
  CyodaDisplayGraph,
  CyodaDisplayNode,
  CyodaDisplayNodeTone,
} from './cyodaTypes';

const getRanksFromInitialState = (graph: CyodaDisplayGraph) => {
  const ranks = new Map<string, number>();
  const queue: Array<{ id: string; rank: number }> = [{ id: graph.workflow.initialState, rank: 0 }];

  while (queue.length) {
    const current = queue.shift();
    if (!current) continue;

    const existingRank = ranks.get(current.id);
    if (existingRank !== undefined && existingRank <= current.rank) continue;
    ranks.set(current.id, current.rank);

    graph.edges
      .filter((edge) => edge.source === current.id && !edge.disabled && edge.target !== current.id)
      .forEach((edge) => queue.push({ id: edge.target, rank: current.rank + 1 }));
  }

  return ranks;
};

const getEdgeKind = (
  edge: CyodaDisplayEdge,
  targetNode: CyodaDisplayNode | undefined,
  ranks: Map<string, number>,
): CyodaDisplayEdgeKind => {
  if (edge.disabled) return 'disabled';
  if (edge.isSelfTransition || edge.isBackEdge) return 'loop';
  if (edge.manual) return 'manual';
  if (targetNode?.isTerminal) return 'terminal';
  if (edge.criterionSummary) return 'conditional';
  if (edge.processorSummary) return 'processing';

  const sourceRank = ranks.get(edge.source);
  const targetRank = ranks.get(edge.target);
  if (sourceRank !== undefined && targetRank !== undefined && targetRank <= sourceRank) return 'loop';

  return 'automated';
};

const getNodeTone = (
  node: CyodaDisplayNode,
  outgoingEdges: CyodaDisplayEdge[],
  incomingEdges: CyodaDisplayEdge[],
): CyodaDisplayNodeTone => {
  if (node.isTerminal) return 'terminal';
  if (node.isInitial) return 'initial';
  if (outgoingEdges.some((edge) => edge.manual) || incomingEdges.some((edge) => edge.manual)) return 'manual';
  if (node.hasProcessors) return 'processing';
  return 'default';
};

export const classifyCyodaGraph = (graph: CyodaDisplayGraph): CyodaDisplayGraph => {
  const ranks = getRanksFromInitialState(graph);
  const targetNodeById = new Map(graph.nodes.map((node) => [node.id, node]));

  const edges = graph.edges.map((edge) => {
    const sourceRank = ranks.get(edge.source);
    const targetRank = ranks.get(edge.target);
    const isBackEdge = edge.source !== edge.target &&
      sourceRank !== undefined &&
      targetRank !== undefined &&
      targetRank <= sourceRank;

    const nextEdge = {
      ...edge,
      isBackEdge,
    };

    return {
      ...nextEdge,
      kind: getEdgeKind(nextEdge, targetNodeById.get(edge.target), ranks),
    };
  });

  const nodes = graph.nodes.map((node) => {
    const outgoingEdges = edges.filter((edge) => edge.source === node.id && !edge.disabled);
    const incomingEdges = edges.filter((edge) => edge.target === node.id && !edge.disabled);

    return {
      ...node,
      tone: getNodeTone(node, outgoingEdges, incomingEdges),
    };
  });

  return { ...graph, nodes, edges };
};
