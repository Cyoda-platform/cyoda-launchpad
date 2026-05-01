import { boxBottom, boxRight, getPort } from './geometry';
import { workflowDiagramTokens } from './tokens';
import type { Box, EdgeSpec, Point, SemanticId } from './types';

const spacing = workflowDiagramTokens.spacing;

type LabelSide = 'above' | 'below' | 'left' | 'right' | 'inline';
type LabelPosition = 'start' | 'middle' | 'end' | undefined;

type Segment = {
  start: Point;
  end: Point;
};

const getPositionRatio = (position: LabelPosition) => (position === 'start' ? 0.28 : position === 'end' ? 0.72 : 0.5);

const getSegmentLength = (segment: Segment) =>
  Math.hypot(segment.end.x - segment.start.x, segment.end.y - segment.start.y);

const getPointOnSegment = (segment: Segment, ratio: number) => ({
  x: segment.start.x + (segment.end.x - segment.start.x) * ratio,
  y: segment.start.y + (segment.end.y - segment.start.y) * ratio,
});

const getDefaultLabelSide = (segment: Segment): LabelSide =>
  Math.abs(segment.end.x - segment.start.x) >= Math.abs(segment.end.y - segment.start.y) ? 'above' : 'right';

const chooseLabelSegment = (
  segments: Segment[],
  position: LabelPosition,
) => {
  const visibleSegments = segments.filter((segment) => getSegmentLength(segment) > 4);
  if (!visibleSegments.length) return segments[0];
  if (position === 'start') return visibleSegments[0];
  if (position === 'end') return visibleSegments[visibleSegments.length - 1];

  return visibleSegments.reduce((best, segment) =>
    getSegmentLength(segment) > getSegmentLength(best) ? segment : best,
  visibleSegments[0]);
};

const applyLabelSide = (point: Point, side: LabelSide) => {
  if (side === 'above') return { ...point, y: point.y - spacing.labelOffset };
  if (side === 'below') return { ...point, y: point.y + spacing.labelOffset };
  if (side === 'left') return { ...point, x: point.x - spacing.labelOffset };
  if (side === 'right') return { ...point, x: point.x + spacing.labelOffset };
  return point;
};

const getCubicPoint = (from: Point, controlA: Point, controlB: Point, to: Point, ratio: number) => {
  const inverse = 1 - ratio;
  return {
    x: inverse ** 3 * from.x + 3 * inverse ** 2 * ratio * controlA.x + 3 * inverse * ratio ** 2 * controlB.x + ratio ** 3 * to.x,
    y: inverse ** 3 * from.y + 3 * inverse ** 2 * ratio * controlA.y + 3 * inverse * ratio ** 2 * controlB.y + ratio ** 3 * to.y,
  };
};

export const routeWorkflowEdge = (
  edge: EdgeSpec,
  nodeBoxes: Record<SemanticId, Box>,
  laneBoxes: Record<SemanticId, Box>,
  mainLaneId?: SemanticId,
) => {
  const from = getPort(nodeBoxes[edge.from], edge.layout?.fromPort ?? 'right');
  const to = getPort(nodeBoxes[edge.to], edge.layout?.toPort ?? 'left');
  const routing = edge.layout?.routing ?? 'horizontal';
  const laneValues = Object.values(laneBoxes);
  const minLaneTop = Math.min(...laneValues.map((box) => box.y));
  const maxLaneBottom = Math.max(...laneValues.map(boxBottom));
  const maxLaneRight = Math.max(...laneValues.map(boxRight));
  const mainLane = mainLaneId ? laneBoxes[mainLaneId] : laneValues[Math.floor(laneValues.length / 2)];

  if (routing === 'vertical' || routing === 'horizontal') {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }

  if (routing === 'curve') {
    const curve = Math.max(Math.abs(to.y - from.y) * 0.7, 72);
    return `M ${from.x} ${from.y} C ${from.x} ${from.y - curve}, ${to.x} ${to.y + curve}, ${to.x} ${to.y}`;
  }

  if (routing === 'loop-above') {
    const corridorY = Math.max(minLaneTop + 30, Math.min(from.y, to.y) - spacing.loopClearance);
    return `M ${from.x} ${from.y} C ${from.x - spacing.detourClearance * 2} ${corridorY}, ${to.x + spacing.detourClearance * 2} ${corridorY}, ${to.x} ${to.y}`;
  }

  if (routing === 'loop-left') {
    const leftX = Math.min(from.x, to.x) - spacing.detourClearance * 2;
    return `M ${from.x} ${from.y} C ${leftX} ${from.y}, ${leftX} ${to.y}, ${to.x} ${to.y}`;
  }

  if (routing === 'right-detour') {
    const corridorY = mainLane ? mainLane.y + spacing.laneTitleInsetY : Math.min(from.y, to.y) - spacing.detourClearance;
    const detourX = Math.max(maxLaneRight + spacing.detourClearance / 2, from.x + spacing.detourClearance, to.x + spacing.detourClearance);
    return `M ${from.x} ${from.y} L ${from.x} ${corridorY} L ${detourX} ${corridorY} L ${detourX} ${to.y} L ${to.x} ${to.y}`;
  }

  if (routing === 'bottom-corridor') {
    const corridorY = maxLaneBottom - spacing.laneFooterPadding / 2;
    return `M ${from.x} ${from.y} L ${from.x} ${corridorY} L ${to.x - spacing.detourClearance} ${corridorY} L ${to.x} ${to.y}`;
  }

  const midY = from.y + (to.y - from.y) / 2;
  return `M ${from.x} ${from.y} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${to.y}`;
};

export const getEdgeLabelPoint = (
  edge: EdgeSpec,
  nodeBoxes: Record<SemanticId, Box>,
  laneBoxes: Record<SemanticId, Box>,
  mainLaneId?: SemanticId,
) => {
  const from = getPort(nodeBoxes[edge.from], edge.layout?.fromPort ?? 'right');
  const to = getPort(nodeBoxes[edge.to], edge.layout?.toPort ?? 'left');
  const routing = edge.layout?.routing ?? 'horizontal';
  const placement = edge.layout?.labelPlacement;
  const position = placement?.position ?? 'middle';
  const ratio = getPositionRatio(position);
  const laneValues = Object.values(laneBoxes);
  const minLaneTop = Math.min(...laneValues.map((box) => box.y));
  const maxLaneBottom = Math.max(...laneValues.map(boxBottom));
  const maxLaneRight = Math.max(...laneValues.map(boxRight));
  const mainLane = mainLaneId ? laneBoxes[mainLaneId] : laneValues[Math.floor(laneValues.length / 2)];
  const placePoint = (point: Point, fallbackSide: LabelSide) =>
    applyLabelSide(point, (placement?.side ?? fallbackSide) as LabelSide);

  if (routing === 'vertical' || routing === 'horizontal') {
    const segment = { start: from, end: to };
    return placePoint(getPointOnSegment(segment, ratio), getDefaultLabelSide(segment));
  }

  if (routing === 'curve') {
    const curve = Math.max(Math.abs(to.y - from.y) * 0.7, 72);
    const point = getCubicPoint(
      from,
      { x: from.x, y: from.y - curve },
      { x: to.x, y: to.y + curve },
      to,
      ratio,
    );
    return placePoint(point, getDefaultLabelSide({ start: from, end: to }));
  }

  if (routing === 'loop-above') {
    const corridorY = Math.max(minLaneTop + 30, Math.min(from.y, to.y) - spacing.loopClearance);
    return placePoint({ x: from.x + (to.x - from.x) * ratio, y: corridorY }, 'above');
  }

  if (routing === 'loop-left') {
    const leftX = Math.min(from.x, to.x) - spacing.detourClearance * 2;
    return placePoint({ x: leftX, y: from.y + (to.y - from.y) * ratio }, 'left');
  }

  if (routing === 'right-detour') {
    const corridorY = mainLane ? mainLane.y + spacing.laneTitleInsetY : Math.min(from.y, to.y) - spacing.detourClearance;
    const detourX = Math.max(maxLaneRight + spacing.detourClearance / 2, from.x + spacing.detourClearance, to.x + spacing.detourClearance);
    const segment = chooseLabelSegment([
      { start: from, end: { x: from.x, y: corridorY } },
      { start: { x: from.x, y: corridorY }, end: { x: detourX, y: corridorY } },
      { start: { x: detourX, y: corridorY }, end: { x: detourX, y: to.y } },
      { start: { x: detourX, y: to.y }, end: to },
    ], position);
    return placePoint(getPointOnSegment(segment, 0.5), getDefaultLabelSide(segment));
  }

  if (routing === 'bottom-corridor') {
    const corridorY = maxLaneBottom - spacing.laneFooterPadding / 2;
    const segment = chooseLabelSegment([
      { start: from, end: { x: from.x, y: corridorY } },
      { start: { x: from.x, y: corridorY }, end: { x: to.x - spacing.detourClearance, y: corridorY } },
      { start: { x: to.x - spacing.detourClearance, y: corridorY }, end: to },
    ], position);
    return placePoint(getPointOnSegment(segment, 0.5), getDefaultLabelSide(segment));
  }

  const midY = from.y + (to.y - from.y) / 2;
  const segment = chooseLabelSegment([
    { start: from, end: { x: from.x, y: midY } },
    { start: { x: from.x, y: midY }, end: { x: to.x, y: midY } },
    { start: { x: to.x, y: midY }, end: to },
  ], position);

  return placePoint(getPointOnSegment(segment, 0.5), getDefaultLabelSide(segment));
};
