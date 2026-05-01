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
export type CyodaDiagramDensity = 'compact' | 'comfortable';

const elk = new ELK();

export type CyodaDiagramDensityProfile = {
  padding: number;
  labelPaddingX: number;
  labelPaddingY: number;
  badgeHeight: number;
  badgeGap: number;
  nodeLabelWidthFactor: number;
  edgeLabelWidthFactor: number;
  edgeTitleLineHeight: number;
  nodeTitleLineHeight: number;
  nodeTitleTop: number;
  nodeTitleMaxChars: number;
  terminalTitleMaxChars: number;
  nodeWidthPadding: number;
  edgeLabelMinWidth: number;
  badgeMinWidth: number;
  nodeWidths: {
    state: number;
    processing: number;
    manual: number;
    terminal: number;
  };
  nodeHeights: {
    state: number;
    processing: number;
    manual: number;
    terminal: number;
  };
  elk: {
    nodeNode: number;
    edgeEdge: number;
    edgeNode: number;
    downLayer: number;
    rightLayer: number;
  };
  labelCandidateStep: number;
  labelObstaclePadding: number;
  placedLabelPadding: number;
};

const densityProfiles: Record<CyodaDiagramDensity, CyodaDiagramDensityProfile> = {
  compact: {
    padding: 34,
    labelPaddingX: 10,
    labelPaddingY: 6,
    badgeHeight: 13,
    badgeGap: 4,
    nodeLabelWidthFactor: 5.9,
    edgeLabelWidthFactor: 5.2,
    edgeTitleLineHeight: 11,
    nodeTitleLineHeight: 13,
    nodeTitleTop: 39,
    nodeTitleMaxChars: 18,
    terminalTitleMaxChars: 16,
    nodeWidthPadding: 32,
    edgeLabelMinWidth: 68,
    badgeMinWidth: 34,
    nodeWidths: {
      state: 164,
      processing: 180,
      manual: 178,
      terminal: 150,
    },
    nodeHeights: {
      state: 66,
      processing: 68,
      manual: 68,
      terminal: 62,
    },
    elk: {
      nodeNode: 38,
      edgeEdge: 16,
      edgeNode: 24,
      downLayer: 64,
      rightLayer: 82,
    },
    labelCandidateStep: 14,
    labelObstaclePadding: 9,
    placedLabelPadding: 4,
  },
  comfortable: {
    padding: 54,
    labelPaddingX: 14,
    labelPaddingY: 8,
    badgeHeight: 16,
    badgeGap: 6,
    nodeLabelWidthFactor: 6.4,
    edgeLabelWidthFactor: 5.8,
    edgeTitleLineHeight: 13,
    nodeTitleLineHeight: 15,
    nodeTitleTop: 47,
    nodeTitleMaxChars: 18,
    terminalTitleMaxChars: 16,
    nodeWidthPadding: 44,
    edgeLabelMinWidth: 84,
    badgeMinWidth: 42,
    nodeWidths: {
      state: 194,
      processing: 218,
      manual: 210,
      terminal: 176,
    },
    nodeHeights: {
      state: 82,
      processing: 82,
      manual: 82,
      terminal: 76,
    },
    elk: {
      nodeNode: 56,
      edgeEdge: 22,
      edgeNode: 34,
      downLayer: 92,
      rightLayer: 106,
    },
    labelCandidateStep: 18,
    labelObstaclePadding: 12,
    placedLabelPadding: 5,
  },
};

export const getCyodaDensityProfile = (density: CyodaDiagramDensity = 'compact') =>
  densityProfiles[density];

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

const getNodeSize = (node: CyodaDisplayNode, profile: CyodaDiagramDensityProfile) => {
  const titleLines = wrapRawIdentifier(node.label, node.isTerminal ? profile.terminalTitleMaxChars : profile.nodeTitleMaxChars);
  const baseWidth = node.isTerminal
    ? profile.nodeWidths.terminal
    : node.hasManualTransitions
      ? profile.nodeWidths.manual
      : node.hasProcessors
        ? profile.nodeWidths.processing
        : profile.nodeWidths.state;
  const baseHeight = node.isTerminal
    ? profile.nodeHeights.terminal
    : node.hasManualTransitions
      ? profile.nodeHeights.manual
      : node.hasProcessors
        ? profile.nodeHeights.processing
        : profile.nodeHeights.state;
  const width = Math.max(baseWidth, Math.max(...titleLines.map((line) => line.length * profile.nodeLabelWidthFactor)) + profile.nodeWidthPadding);
  const height = Math.max(baseHeight, profile.nodeTitleTop + titleLines.length * profile.nodeTitleLineHeight + 10);

  return {
    width: Math.ceil(width),
    height: Math.ceil(height),
    titleLines,
    subtitle: getNodeSubtitle(node),
  };
};

const getBadgeWidth = (badge: string, profile: CyodaDiagramDensityProfile) =>
  Math.max(profile.badgeMinWidth, Math.ceil(badge.length * 5.1 + 12));

const getEdgeLabelSize = (edge: CyodaDisplayEdge, profile: CyodaDiagramDensityProfile): CyodaEdgeLabelLayout => {
  const titleLines = wrapRawIdentifier(edge.label, 22);
  const titleWidth = Math.max(...titleLines.map((line) => line.length * profile.edgeLabelWidthFactor), 0);
  const badgeWidth = edge.badges.reduce((sum, badge, index) =>
    sum + getBadgeWidth(badge, profile) + (index > 0 ? profile.badgeGap : 0),
  0);
  const width = Math.max(profile.edgeLabelMinWidth, titleWidth + profile.labelPaddingX * 2, badgeWidth + profile.labelPaddingX * 2);
  const titleHeight = titleLines.length * profile.edgeTitleLineHeight;
  const badgeHeight = edge.badges.length ? profile.badgeHeight + 5 : 0;
  const height = titleHeight + badgeHeight + profile.labelPaddingY * 2;

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

const getLongestSegmentMidpoint = (points: Point[], profile: CyodaDiagramDensityProfile) => {
  if (points.length < 2) return points[0] ?? { x: profile.padding, y: profile.padding };

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

const getBounds = (boxes: Box[], points: Point[], profile: CyodaDiagramDensityProfile) => {
  const minX = Math.min(profile.padding, ...boxes.map((box) => box.x), ...points.map((point) => point.x));
  const minY = Math.min(profile.padding, ...boxes.map((box) => box.y), ...points.map((point) => point.y));
  const maxX = Math.max(profile.padding * 2, ...boxes.map(boxRight), ...points.map((point) => point.x));
  const maxY = Math.max(profile.padding * 2, ...boxes.map(boxBottom), ...points.map((point) => point.y));

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const placeLabelAwayFromObstacles = (
  label: CyodaEdgeLabelLayout,
  anchor: Point,
  obstacles: Box[],
  bounds: Box,
  profile: CyodaDiagramDensityProfile,
) => {
  const step = profile.labelCandidateStep;
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

const getElkOptions = (direction: CyodaElkDirection, profile: CyodaDiagramDensityProfile): Record<string, string> => ({
  'elk.algorithm': 'layered',
  'elk.direction': direction,
  'elk.edgeRouting': 'ORTHOGONAL',
  'elk.spacing.nodeNode': String(profile.elk.nodeNode),
  'elk.spacing.edgeEdge': String(profile.elk.edgeEdge),
  'elk.spacing.edgeNode': String(profile.elk.edgeNode),
  'elk.layered.spacing.nodeNodeBetweenLayers': String(direction === 'DOWN' ? profile.elk.downLayer : profile.elk.rightLayer),
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
  'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
  'elk.layered.cycleBreaking.strategy': 'GREEDY',
});

export const layoutCyodaWorkflowWithElk = async (
  graph: CyodaDisplayGraph,
  options: { direction?: CyodaElkDirection; density?: CyodaDiagramDensity } = {},
): Promise<CyodaWorkflowLayout> => {
  const profile = getCyodaDensityProfile(options.density);
  const nodeMetrics = new Map(graph.nodes.map((node) => [node.id, getNodeSize(node, profile)]));
  const edgeLabelMetrics = new Map(graph.edges.map((edge) => [edge.id, getEdgeLabelSize(edge, profile)]));
  const elkGraph: ElkNode = {
    id: `${graph.id}-layout`,
    layoutOptions: getElkOptions(options.direction ?? 'RIGHT', profile),
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
      x: (elkNode?.x ?? 0) + profile.padding,
      y: (elkNode?.y ?? 0) + profile.padding,
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
    const sourceBox = source ? { x: source.x - profile.padding, y: source.y - profile.padding, width: source.width, height: source.height } : { x: 0, y: 0, width: 1, height: 1 };
    const targetBox = target ? { x: target.x - profile.padding, y: target.y - profile.padding, width: target.width, height: target.height } : sourceBox;
    const elkEdge = elkEdgeById.get(edge.id);
    const points = getEdgePoints(elkEdge, sourceBox, targetBox).map((point) => ({
      x: point.x + profile.padding,
      y: point.y + profile.padding,
    }));

    return { edge, points };
  });
  const routeBounds = getBounds(
    nodes.map((node) => ({ x: node.x, y: node.y, width: node.width, height: node.height })),
    shiftedEdges.flatMap((edge) => edge.points),
    profile,
  );
  const labelBounds = expandBox(routeBounds, profile.padding);
  const obstacles = nodes.map((node) => expandBox({ x: node.x, y: node.y, width: node.width, height: node.height }, profile.labelObstaclePadding));
  const placedLabelObstacles: Box[] = [];

  const edges: CyodaLaidOutEdge[] = shiftedEdges.map(({ edge, points }) => {
    const metrics = edgeLabelMetrics.get(edge.id) ?? getEdgeLabelSize(edge, profile);
    const anchor = getLongestSegmentMidpoint(points, profile);
    const point = placeLabelAwayFromObstacles(
      metrics,
      anchor,
      [...obstacles, ...placedLabelObstacles],
      labelBounds,
      profile,
    );
    const labelLayout = { ...metrics, x: point.x, y: point.y };
    placedLabelObstacles.push(expandBox(getLabelBox(labelLayout), profile.placedLabelPadding));

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
    profile,
  );
  const shiftX = profile.padding - finalBounds.x;
  const shiftY = profile.padding - finalBounds.y;
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
    width: Math.ceil(finalBounds.width + profile.padding * 2),
    height: Math.ceil(finalBounds.height + profile.padding * 2),
    nodes: normalizedNodes,
    edges: normalizedEdges,
  };
};
