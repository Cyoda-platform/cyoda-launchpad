import ELK from 'elkjs/lib/elk.bundled.js';
import type { ElkEdgeSection, ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk-api';
import type {
  CyodaDisplayEdge,
  CyodaDisplayGraph,
  CyodaDisplayNode,
  CyodaEdgeLabelLayout,
  CyodaLaidOutEdge,
  CyodaLaidOutNode,
  CyodaWorkflowLayout,
} from './cyodaTypes';

type Box = { x: number; y: number; width: number; height: number };
type Point = { x: number; y: number };
export type CyodaElkDirection = 'RIGHT' | 'DOWN';

const elk = new ELK();

const PADDING = 54;
const LABEL_PADDING_X = 14;
const LABEL_PADDING_Y = 8;
const BADGE_HEIGHT = 16;
const BADGE_GAP = 6;
const NODE_LABEL_WIDTH_FACTOR = 6.4;
const EDGE_LABEL_WIDTH_FACTOR = 5.8;

export const wrapRawIdentifier = (value: string, maxChars: number) => {
  if (value.length <= maxChars) return [value];

  const tokens = value.match(/[^_-]+[_-]?|[_-]+/g) ?? [value];
  const lines: string[] = [];
  let line = '';

  tokens.forEach((token) => {
    const next = `${line}${token}`;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = token;
      return;
    }

    if (token.length > maxChars) {
      if (line) {
        lines.push(line);
        line = '';
      }
      for (let index = 0; index < token.length; index += maxChars) {
        lines.push(token.slice(index, index + maxChars));
      }
      return;
    }

    line = next;
  });

  if (line) lines.push(line);
  return lines;
};

const getNodeSubtitle = (node: CyodaDisplayNode) => {
  if (node.isInitial) return 'INITIAL STATE';
  if (node.isTerminal) return 'TERMINAL STATE';
  if (node.hasManualTransitions) return 'MANUAL REVIEW';
  if (node.hasProcessors) return 'PROCESSING STATE';
  return 'STATE';
};

const getNodeSize = (node: CyodaDisplayNode) => {
  const titleLines = wrapRawIdentifier(node.label, node.isTerminal ? 16 : 18);
  const baseWidth = node.isTerminal ? 176 : node.hasManualTransitions ? 210 : node.hasProcessors ? 218 : 194;
  const width = Math.max(baseWidth, Math.max(...titleLines.map((line) => line.length * NODE_LABEL_WIDTH_FACTOR)) + 44);
  const height = node.isTerminal ? 76 : Math.max(82, 48 + titleLines.length * 15);

  return {
    width: Math.ceil(width),
    height: Math.ceil(height),
    titleLines,
    subtitle: getNodeSubtitle(node),
  };
};

const getBadgeWidth = (badge: string) => Math.max(42, Math.ceil(badge.length * 5.7 + 14));

const getEdgeLabelSize = (edge: CyodaDisplayEdge): CyodaEdgeLabelLayout => {
  const titleLines = wrapRawIdentifier(edge.label, 22);
  const titleWidth = Math.max(...titleLines.map((line) => line.length * EDGE_LABEL_WIDTH_FACTOR), 0);
  const badgeWidth = edge.badges.reduce((sum, badge, index) =>
    sum + getBadgeWidth(badge) + (index > 0 ? BADGE_GAP : 0),
  0);
  const width = Math.max(84, titleWidth + LABEL_PADDING_X * 2, badgeWidth + LABEL_PADDING_X * 2);
  const titleHeight = titleLines.length * 13;
  const badgeHeight = edge.badges.length ? BADGE_HEIGHT + 6 : 0;
  const height = titleHeight + badgeHeight + LABEL_PADDING_Y * 2;

  return {
    x: 0,
    y: 0,
    width: Math.ceil(width),
    height: Math.ceil(height),
    titleLines,
    badges: edge.badges,
  };
};

const boxRight = (box: Box) => box.x + box.width;
const boxBottom = (box: Box) => box.y + box.height;

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

const getLabelBox = (label: CyodaEdgeLabelLayout, point: Point = label): Box => ({
  x: point.x - label.width / 2,
  y: point.y - label.height / 2,
  width: label.width,
  height: label.height,
});

const getSegmentLength = (start: Point, end: Point) => Math.hypot(end.x - start.x, end.y - start.y);

const getSectionPoints = (section: ElkEdgeSection | undefined): Point[] => {
  if (!section) return [];
  return [
    section.startPoint,
    ...(section.bendPoints ?? []),
    section.endPoint,
  ];
};

const getEdgePoints = (edge: ElkExtendedEdge | undefined, sourceBox: Box, targetBox: Box): Point[] => {
  const section = edge?.sections?.[0];
  const points = getSectionPoints(section);
  if (points.length >= 2) return points;

  return [
    { x: boxRight(sourceBox), y: sourceBox.y + sourceBox.height / 2 },
    { x: targetBox.x, y: targetBox.y + targetBox.height / 2 },
  ];
};

const getPathFromPoints = (points: Point[]) => {
  if (!points.length) return '';
  const [first, ...rest] = points;
  return `M ${first.x} ${first.y} ${rest.map((point) => `L ${point.x} ${point.y}`).join(' ')}`;
};

const getLongestSegmentMidpoint = (points: Point[]) => {
  if (points.length < 2) return points[0] ?? { x: PADDING, y: PADDING };

  let best = { start: points[0], end: points[1], length: getSegmentLength(points[0], points[1]) };
  for (let index = 1; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const length = getSegmentLength(start, end);
    if (length > best.length) best = { start, end, length };
  }

  return {
    x: best.start.x + (best.end.x - best.start.x) / 2,
    y: best.start.y + (best.end.y - best.start.y) / 2,
  };
};

const getBounds = (boxes: Box[], points: Point[]) => {
  const minX = Math.min(PADDING, ...boxes.map((box) => box.x), ...points.map((point) => point.x));
  const minY = Math.min(PADDING, ...boxes.map((box) => box.y), ...points.map((point) => point.y));
  const maxX = Math.max(PADDING * 2, ...boxes.map(boxRight), ...points.map((point) => point.x));
  const maxY = Math.max(PADDING * 2, ...boxes.map(boxBottom), ...points.map((point) => point.y));

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const placeLabelAwayFromObstacles = (
  label: CyodaEdgeLabelLayout,
  anchor: Point,
  obstacles: Box[],
  bounds: Box,
) => {
  const step = 18;
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
  const candidates = [{ ...anchor }];

  [1, 2, 3, 4, 5, 6, 7].forEach((distance) => {
    directions.forEach((direction) => {
      candidates.push({
        x: anchor.x + direction.x * step * distance,
        y: anchor.y + direction.y * step * distance,
      });
    });
  });

  const score = (point: Point) => {
    const clampedPoint = {
      x: clamp(point.x, bounds.x + label.width / 2, boxRight(bounds) - label.width / 2),
      y: clamp(point.y, bounds.y + label.height / 2, boxBottom(bounds) - label.height / 2),
    };
    const labelBox = getLabelBox(label, clampedPoint);
    const overlapScore = obstacles.reduce((sum, obstacle) => sum + getOverlapArea(labelBox, obstacle), 0);
    const distanceScore = Math.hypot(clampedPoint.x - anchor.x, clampedPoint.y - anchor.y);
    return { point: clampedPoint, value: overlapScore * 10000 + distanceScore };
  };

  return candidates.map(score).reduce((best, candidate) =>
    candidate.value < best.value ? candidate : best,
  ).point;
};

const getElkOptions = (direction: CyodaElkDirection): Record<string, string> => ({
  'elk.algorithm': 'layered',
  'elk.direction': direction,
  'elk.edgeRouting': 'ORTHOGONAL',
  'elk.spacing.nodeNode': '56',
  'elk.spacing.edgeEdge': '22',
  'elk.spacing.edgeNode': '34',
  'elk.layered.spacing.nodeNodeBetweenLayers': direction === 'DOWN' ? '92' : '106',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
  'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
  'elk.layered.cycleBreaking.strategy': 'GREEDY',
});

export const layoutCyodaWorkflowWithElk = async (
  graph: CyodaDisplayGraph,
  options: { direction?: CyodaElkDirection } = {},
): Promise<CyodaWorkflowLayout> => {
  const nodeMetrics = new Map(graph.nodes.map((node) => [node.id, getNodeSize(node)]));
  const edgeLabelMetrics = new Map(graph.edges.map((edge) => [edge.id, getEdgeLabelSize(edge)]));
  const elkGraph: ElkNode = {
    id: `${graph.id}-layout`,
    layoutOptions: getElkOptions(options.direction ?? 'RIGHT'),
    children: graph.nodes.map((node) => {
      const metrics = nodeMetrics.get(node.id);
      return {
        id: node.id,
        width: metrics?.width ?? 194,
        height: metrics?.height ?? 82,
      };
    }),
    edges: graph.edges.map((edge) => {
      const label = edgeLabelMetrics.get(edge.id);
      return {
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
        labels: label ? [{ text: edge.label, width: label.width, height: label.height }] : undefined,
      };
    }),
  };

  const elkLayout = await elk.layout(elkGraph);
  const elkNodeById = new Map((elkLayout.children ?? []).map((node) => [node.id, node]));
  const elkEdgeById = new Map((elkLayout.edges ?? []).map((edge) => [edge.id, edge]));

  const nodes: CyodaLaidOutNode[] = graph.nodes.map((node) => {
    const metrics = nodeMetrics.get(node.id);
    const elkNode = elkNodeById.get(node.id);

    return {
      ...node,
      x: (elkNode?.x ?? 0) + PADDING,
      y: (elkNode?.y ?? 0) + PADDING,
      width: metrics?.width ?? elkNode?.width ?? 194,
      height: metrics?.height ?? elkNode?.height ?? 82,
      titleLines: metrics?.titleLines ?? [node.label],
      subtitle: metrics?.subtitle ?? getNodeSubtitle(node),
    };
  });
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  const shiftedEdges = graph.edges.map((edge) => {
    const source = nodeById.get(edge.source);
    const target = nodeById.get(edge.target);
    const sourceBox = source ? { x: source.x - PADDING, y: source.y - PADDING, width: source.width, height: source.height } : { x: 0, y: 0, width: 1, height: 1 };
    const targetBox = target ? { x: target.x - PADDING, y: target.y - PADDING, width: target.width, height: target.height } : sourceBox;
    const elkEdge = elkEdgeById.get(edge.id);
    const points = getEdgePoints(elkEdge, sourceBox, targetBox).map((point) => ({
      x: point.x + PADDING,
      y: point.y + PADDING,
    }));

    return { edge, points };
  });
  const routeBounds = getBounds(
    nodes.map((node) => ({ x: node.x, y: node.y, width: node.width, height: node.height })),
    shiftedEdges.flatMap((edge) => edge.points),
  );
  const labelBounds = expandBox(routeBounds, PADDING);
  const obstacles = nodes.map((node) => expandBox({ x: node.x, y: node.y, width: node.width, height: node.height }, 12));
  const placedLabelObstacles: Box[] = [];

  const edges: CyodaLaidOutEdge[] = shiftedEdges.map(({ edge, points }) => {
    const metrics = edgeLabelMetrics.get(edge.id) ?? getEdgeLabelSize(edge);
    const anchor = getLongestSegmentMidpoint(points);
    const point = placeLabelAwayFromObstacles(
      metrics,
      anchor,
      [...obstacles, ...placedLabelObstacles],
      labelBounds,
    );
    const labelLayout = { ...metrics, x: point.x, y: point.y };
    placedLabelObstacles.push(expandBox(getLabelBox(labelLayout), 5));

    return {
      ...edge,
      points,
      path: getPathFromPoints(points),
      labelLayout,
    };
  });

  const finalBounds = getBounds(
    [
      ...nodes.map((node) => ({ x: node.x, y: node.y, width: node.width, height: node.height })),
      ...edges.map((edge) => getLabelBox(edge.labelLayout)),
    ],
    edges.flatMap((edge) => edge.points),
  );
  const shiftX = PADDING - finalBounds.x;
  const shiftY = PADDING - finalBounds.y;
  const normalizedNodes = nodes.map((node) => ({
    ...node,
    x: node.x + shiftX,
    y: node.y + shiftY,
  }));
  const normalizedEdges = edges.map((edge) => {
    const points = edge.points.map((point) => ({
      x: point.x + shiftX,
      y: point.y + shiftY,
    }));

    return {
      ...edge,
      points,
      path: getPathFromPoints(points),
      labelLayout: {
        ...edge.labelLayout,
        x: edge.labelLayout.x + shiftX,
        y: edge.labelLayout.y + shiftY,
      },
    };
  });

  return {
    width: Math.ceil(finalBounds.width + PADDING * 2),
    height: Math.ceil(finalBounds.height + PADDING * 2),
    nodes: normalizedNodes,
    edges: normalizedEdges,
  };
};
