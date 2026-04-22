import { boxBottom, boxRight, estimateTextWidth, getCenter, wrapText } from './geometry';
import { getEdgeLabelPoint, routeWorkflowEdge } from './routing';
import { workflowDiagramTokens } from './tokens';
import type {
  Box,
  LabelSpec,
  LaidOutEdge,
  LaidOutNode,
  NodeSpec,
  SemanticId,
  WorkflowDiagramLayout,
  WorkflowDiagramSpec,
} from './types';

const { spacing, nodeSizes, text } = workflowDiagramTokens;

type MeasuredNode = Omit<LaidOutNode, 'box' | 'center'> & {
  width: number;
  height: number;
};

type LaneRow = {
  id: string;
  y: number;
  nodeTop: number;
  rowHeight: number;
  height: number;
  nodeIds: SemanticId[];
};

type LaneLayoutRows = {
  y: number;
  height: number;
  rows: Record<string, LaneRow>;
  rowOrder: string[];
};

const getNodeTone = (node: NodeSpec) => {
  if (node.tone) return node.tone;
  if (node.kind === 'process') return 'muted';
  if (node.kind === 'terminal') return 'danger';
  return 'default';
};

const measureNode = (node: NodeSpec): MeasuredNode => {
  const size = node.size ?? (node.kind === 'decision' ? 'decision' : node.kind === 'terminal' ? 'terminal' : 'standard');
  const defaults = nodeSizes[size];
  const titleLines = wrapText(node.title, defaults.titleChars);
  const bodyLines = node.body ? wrapText(node.body, defaults.bodyChars) : [];
  const textCandidates = [
    ...titleLines,
    ...bodyLines,
    node.subtitle,
    node.processLabel,
  ].filter(Boolean) as string[];

  const textWidth = Math.max(...textCandidates.map((value) => estimateTextWidth(value, text.widthFactor)), 0);
  const subtitleHeight = node.subtitle ? 22 : 0;
  const bodyHeight = bodyLines.length ? bodyLines.length * text.bodyLineHeight + 8 : 0;
  const processHeight = node.processLabel ? 18 : 0;
  const textHeight = 22 + subtitleHeight + titleLines.length * text.titleLineHeight + bodyHeight + processHeight;

  return {
    node: { ...node, tone: getNodeTone(node), size },
    width: Math.ceil(Math.max(defaults.minWidth, textWidth + 38)),
    height: Math.ceil(Math.max(defaults.minHeight, textHeight)),
    titleLines,
    bodyLines,
  };
};

const sortedLanes = (spec: WorkflowDiagramSpec) => {
  const explicitOrder = spec.layout?.laneOrder;
  if (explicitOrder?.length) {
    return [...spec.lanes].sort((a, b) => explicitOrder.indexOf(a.id) - explicitOrder.indexOf(b.id));
  }
  return [...spec.lanes].sort((a, b) => a.order - b.order);
};

const getMainLaneId = (spec: WorkflowDiagramSpec) =>
  spec.layout?.mainLaneId ??
  spec.lanes.find((lane) => lane.layout?.containsMainBaseline)?.id ??
  sortedLanes(spec)[Math.floor(spec.lanes.length / 2)]?.id;

const getMainNodeIds = (spec: WorkflowDiagramSpec) => {
  if (spec.layout?.mainNodeIds?.length) return spec.layout.mainNodeIds;
  const mainLaneId = getMainLaneId(spec);
  return spec.nodes
    .filter((node) => node.laneId === mainLaneId && (node.layout?.baseline || node.layout?.row === 'main-baseline'))
    .sort((a, b) => (a.layout?.order ?? 0) - (b.layout?.order ?? 0))
    .map((node) => node.id);
};

const getNodeRowId = (node: NodeSpec) => node.layout?.row ?? 'default';

const computeLaneRows = (spec: WorkflowDiagramSpec, measuredNodes: Map<SemanticId, MeasuredNode>) => {
  let y = spacing.outerTop;

  return sortedLanes(spec).reduce<Record<SemanticId, LaneLayoutRows>>((rows, lane) => {
    const laneNodes = spec.nodes.filter((node) => node.laneId === lane.id);
    const rowGroups = laneNodes.reduce<Record<string, NodeSpec[]>>((groups, node) => {
      const rowId = getNodeRowId(node);
      groups[rowId] = [...(groups[rowId] ?? []), node];
      return groups;
    }, {});
    const rowGap = spec.layout?.rowGap ?? spacing.rowGap;
    const rowEntries = Object.entries(rowGroups)
      .map(([rowId, nodes]) => ({
        id: rowId,
        nodes,
        order: Math.min(...nodes.map((node) => node.layout?.order ?? 999)),
        height: Math.max(...nodes.map((node) => measuredNodes.get(node.id)?.height ?? 0), 0),
      }))
      .sort((a, b) => a.order - b.order);
    let rowY = y + spacing.laneHeaderHeight;
    const laneRows = rowEntries.reduce<Record<string, LaneRow>>((laneRowMap, row) => {
      laneRowMap[row.id] = {
        id: row.id,
        y: rowY,
        nodeTop: rowY,
        rowHeight: row.height,
        height: row.height,
        nodeIds: row.nodes.map((node) => node.id),
      };
      rowY += row.height + rowGap;
      return laneRowMap;
    }, {});
    const totalRowsHeight = rowEntries.reduce((sum, row) => sum + row.height, 0);
    const totalRowGaps = Math.max(0, rowEntries.length - 1) * rowGap;
    const height = spacing.laneHeaderHeight + totalRowsHeight + totalRowGaps + spacing.laneFooterPadding;

    rows[lane.id] = {
      y,
      height,
      rows: laneRows,
      rowOrder: rowEntries.map((row) => row.id),
    };
    y += height + (spec.layout?.laneGap ?? spacing.laneGap);
    return rows;
  }, {});
};

const placeMainNodes = (
  spec: WorkflowDiagramSpec,
  measuredNodes: Map<SemanticId, MeasuredNode>,
  laneRows: Record<SemanticId, LaneLayoutRows>,
) => {
  const nodeBoxes: Partial<Record<SemanticId, Box>> = {};
  const mainLaneId = getMainLaneId(spec);
  const mainLane = laneRows[mainLaneId];
  let x = spacing.outerX;

  getMainNodeIds(spec).forEach((nodeId) => {
    const measured = measuredNodes.get(nodeId);
    const node = measured?.node;
    const mainRow = node ? mainLane.rows[getNodeRowId(node)] ?? mainLane.rows['main-baseline'] ?? mainLane.rows.default : undefined;
    if (!measured || !mainRow) return;

    nodeBoxes[nodeId] = {
      x,
      y: mainRow.nodeTop + (mainRow.rowHeight - measured.height) / 2,
      width: measured.width,
      height: measured.height,
    };
    x += measured.width + (spec.layout?.nodeGap ?? spacing.nodeGap);
  });

  return nodeBoxes;
};

const resolveAlignedCenter = (
  alignXWith: SemanticId | undefined,
  nodeBoxes: Partial<Record<SemanticId, Box>>,
) => {
  if (!alignXWith) return undefined;
  const box = nodeBoxes[alignXWith];
  return box ? getCenter(box).x : undefined;
};

const placeLaneSequentially = (
  nodes: NodeSpec[],
  measuredNodes: Map<SemanticId, MeasuredNode>,
  laneRow: LaneRow,
  nodeBoxes: Partial<Record<SemanticId, Box>>,
  nodeGap: number,
) => {
  let x = spacing.outerX;
  nodes.forEach((node) => {
    const measured = measuredNodes.get(node.id);
    if (!measured || nodeBoxes[node.id]) return;

    nodeBoxes[node.id] = {
      x,
      y: laneRow.nodeTop + (laneRow.rowHeight - measured.height) / 2,
      width: measured.width,
      height: measured.height,
    };
    x += measured.width + nodeGap;
  });
};

const placeAlignedAndBranchNodes = (
  spec: WorkflowDiagramSpec,
  measuredNodes: Map<SemanticId, MeasuredNode>,
  laneRows: Record<SemanticId, LaneLayoutRows>,
  nodeBoxes: Partial<Record<SemanticId, Box>>,
) => {
  const nodeGap = spec.layout?.nodeGap ?? spacing.nodeGap;
  const candidates = spec.nodes
    .filter((node) => !nodeBoxes[node.id])
    .sort((a, b) => (a.layout?.order ?? 0) - (b.layout?.order ?? 0));
  let didPlaceNode = true;

  while (didPlaceNode) {
    didPlaceNode = false;

    candidates
      .filter((node) => !nodeBoxes[node.id])
      .forEach((node) => {
        const measured = measuredNodes.get(node.id);
        const laneRow = laneRows[node.laneId].rows[getNodeRowId(node)] ?? laneRows[node.laneId].rows.default;
        if (!measured || !laneRow) return;

        const alignedCenter = resolveAlignedCenter(node.layout?.alignXWith, nodeBoxes);
        const branchCenter = node.layout?.branchOf && nodeBoxes[node.layout.branchOf]
          ? getCenter(nodeBoxes[node.layout.branchOf] as Box).x
          : undefined;
        const centerX = alignedCenter ?? branchCenter;

        if (centerX === undefined) return;

        nodeBoxes[node.id] = {
          x: centerX - measured.width / 2 + (node.layout?.offset?.x ?? 0),
          y: laneRow.nodeTop + (laneRow.rowHeight - measured.height) / 2 + (node.layout?.offset?.y ?? 0),
          width: measured.width,
          height: measured.height,
        };
        didPlaceNode = true;
      });
  }

  sortedLanes(spec).forEach((lane) => {
    const laneNodes = spec.nodes
      .filter((node) => node.laneId === lane.id && !nodeBoxes[node.id])
      .sort((a, b) => (a.layout?.order ?? 0) - (b.layout?.order ?? 0));
    const unplacedByRow = laneNodes
      .filter((node) => !nodeBoxes[node.id])
      .reduce<Record<string, NodeSpec[]>>((groups, node) => {
        const rowId = getNodeRowId(node);
        groups[rowId] = [...(groups[rowId] ?? []), node];
        return groups;
      }, {});

    Object.entries(unplacedByRow).forEach(([rowId, rowNodes]) => {
      const laneRow = laneRows[lane.id].rows[rowId] ?? laneRows[lane.id].rows.default;
      if (!laneRow) return;
      placeLaneSequentially(rowNodes, measuredNodes, laneRow, nodeBoxes, nodeGap);
    });
  });

  resolveRowCollisions(spec, nodeBoxes as Record<SemanticId, Box>, nodeGap);

  return nodeBoxes as Record<SemanticId, Box>;
};

const resolveRowCollisions = (
  spec: WorkflowDiagramSpec,
  nodeBoxes: Record<SemanticId, Box>,
  nodeGap: number,
) => {
  const collisionGap = Math.max(18, Math.round(nodeGap * 0.55));

  spec.lanes.forEach((lane) => {
    const rows = spec.nodes
      .filter((node) => node.laneId === lane.id)
      .reduce<Record<string, NodeSpec[]>>((groups, node) => {
        const rowId = getNodeRowId(node);
        groups[rowId] = [...(groups[rowId] ?? []), node];
        return groups;
      }, {});

    Object.values(rows).forEach((rowNodes) => {
      const sorted = rowNodes
        .filter((node) => nodeBoxes[node.id])
        .sort((a, b) => nodeBoxes[a.id].x - nodeBoxes[b.id].x);
      let cursor = Number.NEGATIVE_INFINITY;

      sorted.forEach((node) => {
        const box = nodeBoxes[node.id];
        if (box.x < cursor) {
          box.x = cursor;
        }
        cursor = box.x + box.width + collisionGap;
      });
    });
  });
};

const computeLaneBounds = (spec: WorkflowDiagramSpec, nodeBoxes: Record<SemanticId, Box>, laneRows: Record<SemanticId, LaneLayoutRows>) =>
  spec.lanes.reduce<Record<SemanticId, Box>>((bounds, lane) => {
    const boxes = spec.nodes
      .filter((node) => node.laneId === lane.id)
      .map((node) => nodeBoxes[node.id])
      .filter(Boolean);
    const minX = Math.min(...boxes.map((box) => box.x), spacing.outerX);
    const maxX = Math.max(...boxes.map(boxRight), minX);
    const row = laneRows[lane.id];
    const maxBottom = Math.max(...boxes.map(boxBottom), row.y + row.height);

    bounds[lane.id] = {
      x: minX - spacing.lanePaddingX,
      y: row.y,
      width: maxX - minX + spacing.lanePaddingX * 2,
      height: Math.max(row.height, maxBottom - row.y + spacing.laneFooterPadding),
    };
    return bounds;
  }, {});

type EdgeLabelLayout = NonNullable<LaidOutEdge['label']>;

const getEdgeLabelBox = (label: EdgeLabelLayout): Box => ({
  x: label.x - label.width / 2,
  y: label.y - label.height / 2,
  width: label.width,
  height: label.height,
});

const expandBox = (box: Box, padding: number): Box => ({
  x: box.x - padding,
  y: box.y - padding,
  width: box.width + padding * 2,
  height: box.height + padding * 2,
});

const getOverlapArea = (a: Box, b: Box) => {
  const width = Math.max(0, Math.min(boxRight(a), boxRight(b)) - Math.max(a.x, b.x));
  const height = Math.max(0, Math.min(boxBottom(a), boxBottom(b)) - Math.max(a.y, b.y));
  return width * height;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getEdgeLabelBounds = (laneBoxes: Record<SemanticId, Box>): Box => {
  const lanes = Object.values(laneBoxes);
  const minX = Math.min(...lanes.map((lane) => lane.x), spacing.outerX / 2);
  const minY = Math.min(...lanes.map((lane) => lane.y), spacing.outerTop / 2);
  const maxX = Math.max(...lanes.map(boxRight));
  const maxY = Math.max(...lanes.map(boxBottom));

  return {
    x: minX,
    y: minY,
    width: maxX - minX + spacing.outerX,
    height: maxY - minY + spacing.outerTop,
  };
};

const getCandidateLabelPoints = (label: EdgeLabelLayout, bounds: Box) => {
  const step = spacing.labelOffset;
  const directions = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
  ];
  const candidatePoints = [{ x: label.x, y: label.y }];

  [1, 2, 3, 4, 5, 6].forEach((distance) => {
    directions.forEach((direction) => {
      candidatePoints.push({
        x: label.x + direction.x * step * distance,
        y: label.y + direction.y * step * distance,
      });
    });
  });

  return candidatePoints.map((point) => ({
    x: clamp(point.x, bounds.x + label.width / 2, boxRight(bounds) - label.width / 2),
    y: clamp(point.y, bounds.y + label.height / 2, boxBottom(bounds) - label.height / 2),
  }));
};

const scoreLabelCandidate = (
  label: EdgeLabelLayout,
  point: { x: number; y: number },
  obstacles: Box[],
) => {
  const candidateBox = getEdgeLabelBox({ ...label, x: point.x, y: point.y });
  const overlapScore = obstacles.reduce((score, obstacle) => score + getOverlapArea(candidateBox, obstacle), 0);
  const distanceScore = Math.hypot(point.x - label.x, point.y - label.y);

  return overlapScore * 10000 + distanceScore;
};

const placeEdgeLabelAwayFromNodes = (
  label: EdgeLabelLayout,
  obstacles: Box[],
  bounds: Box,
): EdgeLabelLayout => {
  const bestPoint = getCandidateLabelPoints(label, bounds).reduce((best, point) =>
    scoreLabelCandidate(label, point, obstacles) < scoreLabelCandidate(label, best, obstacles) ? point : best,
  { x: label.x, y: label.y });

  return { ...label, x: bestPoint.x, y: bestPoint.y };
};

const resolveEdgeLabelCollisions = (
  edges: LaidOutEdge[],
  nodeBoxes: Record<SemanticId, Box>,
  laneBoxes: Record<SemanticId, Box>,
) => {
  const bounds = getEdgeLabelBounds(laneBoxes);
  const nodeObstacles = Object.values(nodeBoxes).map((box) => expandBox(box, spacing.labelCollisionPadding));
  const placedLabelObstacles: Box[] = [];

  return edges.map((edgeLayout) => {
    if (!edgeLayout.label) return edgeLayout;

    const label = placeEdgeLabelAwayFromNodes(
      edgeLayout.label,
      [...nodeObstacles, ...placedLabelObstacles],
      bounds,
    );
    placedLabelObstacles.push(expandBox(getEdgeLabelBox(label), spacing.labelCollisionPadding / 2));

    return { ...edgeLayout, label };
  });
};

const computeEdges = (
  spec: WorkflowDiagramSpec,
  nodeBoxes: Record<SemanticId, Box>,
  laneBoxes: Record<SemanticId, Box>,
): LaidOutEdge[] => {
  const edges = spec.edges.map((edge) => {
    const labelText = edge.label ?? edge.condition;
    const labelPoint = labelText ? getEdgeLabelPoint(edge, nodeBoxes, laneBoxes, getMainLaneId(spec)) : undefined;
    const labelWidth = labelText ? Math.max(72, estimateTextWidth(labelText, 6.2) + 28) : 0;

    return {
      edge,
      path: routeWorkflowEdge(edge, nodeBoxes, laneBoxes, getMainLaneId(spec)),
      label: labelText && labelPoint
        ? {
            text: labelText,
            x: labelPoint.x,
            y: labelPoint.y,
            width: labelWidth,
            height: 22,
            textAnchor: 'middle',
          }
        : undefined,
    };
  });

  return resolveEdgeLabelCollisions(edges, nodeBoxes, laneBoxes);
};

const placeLabel = (label: LabelSpec, nodeBoxes: Record<SemanticId, Box>, laneBoxes: Record<SemanticId, Box>) => {
  const laneBox = label.laneId ? laneBoxes[label.laneId] : undefined;
  const nearBox = label.nearNodeId ? nodeBoxes[label.nearNodeId] : undefined;
  const anchorBox = nearBox ?? laneBox;
  const placement = label.placement ?? 'inline';
  const lines = wrapText(label.text, label.maxChars ?? (label.tone === 'hint' ? 44 : 34));

  if (!anchorBox) {
    return { label, x: spacing.outerX, y: spacing.outerTop, lines, textAnchor: 'start' as const };
  }

  if (placement === 'top-right') {
    return {
      label,
      x: anchorBox.x + anchorBox.width - spacing.laneTitleInsetX,
      y: anchorBox.y + spacing.laneTitleInsetY,
      lines,
      textAnchor: 'end' as const,
    };
  }

  if (placement === 'bottom-left') {
    return {
      label,
      x: anchorBox.x + spacing.laneTitleInsetX,
      y: anchorBox.y + anchorBox.height - 26,
      lines,
      textAnchor: 'start' as const,
    };
  }

  if (placement === 'bottom-right') {
    return {
      label,
      x: anchorBox.x + anchorBox.width - spacing.laneTitleInsetX,
      y: anchorBox.y + anchorBox.height - 26,
      lines,
      textAnchor: 'end' as const,
    };
  }

  return {
    label,
    x: anchorBox.x + spacing.laneTitleInsetX,
    y: anchorBox.y + spacing.laneTitleInsetY,
    lines,
    textAnchor: 'start' as const,
  };
};

export const computeWorkflowDiagramLayout = (spec: WorkflowDiagramSpec): WorkflowDiagramLayout => {
  const measuredNodes = new Map(spec.nodes.map((node) => [node.id, measureNode(node)]));
  const laneRows = computeLaneRows(spec, measuredNodes);
  const partialNodeBoxes = placeMainNodes(spec, measuredNodes, laneRows);
  const nodeBoxes = placeAlignedAndBranchNodes(spec, measuredNodes, laneRows, partialNodeBoxes);
  const laneBoxes = computeLaneBounds(spec, nodeBoxes, laneRows);
  const maxRight = Math.max(
    ...Object.values(laneBoxes).map(boxRight),
    ...Object.values(nodeBoxes).map(boxRight),
    spec.layout?.minWidth ?? 0,
  );
  const maxBottom = Math.max(...Object.values(laneBoxes).map(boxBottom));

  return {
    viewBox: {
      x: 0,
      y: 0,
      width: Math.ceil(maxRight + spacing.outerX),
      height: Math.ceil(maxBottom + spacing.outerTop),
    },
    lanes: sortedLanes(spec).map((lane) => ({
      lane,
      box: laneBoxes[lane.id],
      titleY: laneBoxes[lane.id].y + spacing.laneTitleInsetY,
      descriptionY: laneBoxes[lane.id].y + spacing.laneTitleInsetY + 22,
    })),
    nodes: spec.nodes.map((node) => {
      const measured = measuredNodes.get(node.id);
      const box = nodeBoxes[node.id];
      return {
        node: measured?.node ?? node,
        box,
        center: getCenter(box),
        titleLines: measured?.titleLines ?? [node.title],
        bodyLines: measured?.bodyLines ?? [],
      };
    }),
    edges: computeEdges(spec, nodeBoxes, laneBoxes),
    labels: (spec.labels ?? []).map((label) => placeLabel(label, nodeBoxes, laneBoxes)),
    nodeBoxes,
    laneBoxes,
  };
};
