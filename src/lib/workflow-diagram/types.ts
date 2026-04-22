export type SemanticId = string;

export type NodeKind = 'state' | 'decision' | 'process' | 'terminal' | 'annotation';

export type EdgeKind = 'main' | 'branch' | 'exception' | 'loop' | 'annotation';

export type NodeSizeVariant =
  | 'compact'
  | 'standard'
  | 'wide'
  | 'decision'
  | 'terminal'
  | 'persistent';

export type NodeTone =
  | 'default'
  | 'active'
  | 'success'
  | 'warning'
  | 'danger'
  | 'human'
  | 'ai'
  | 'muted';

export type EdgeTone = 'primary' | 'soft' | 'branch' | 'exception' | 'loop' | 'annotation';

export type LabelTone = 'default' | 'muted' | 'boundary' | 'hint' | 'callout';

export type EdgePort = 'top' | 'right' | 'bottom' | 'left' | 'center';

export type RoutingStrategy =
  | 'horizontal'
  | 'vertical'
  | 'orthogonal'
  | 'curve'
  | 'loop-above'
  | 'loop-left'
  | 'right-detour'
  | 'bottom-corridor';

export interface Point {
  x: number;
  y: number;
}

export interface Box extends Point {
  width: number;
  height: number;
}

export interface LaneSpec {
  id: SemanticId;
  title: string;
  description?: string;
  order: number;
  tone?: 'default' | 'primary' | 'muted' | 'warning';
  layout?: {
    weight?: number;
    containsMainBaseline?: boolean;
  };
}

export interface NodeSpec {
  id: SemanticId;
  kind: NodeKind;
  laneId: SemanticId;
  title: string;
  subtitle?: string;
  body?: string;
  processLabel?: string;
  size?: NodeSizeVariant;
  tone?: NodeTone;
  layout?: {
    baseline?: boolean;
    order?: number;
    row?: string;
    branchOf?: SemanticId;
    alignXWith?: SemanticId;
    alignYWith?: SemanticId;
    preferredPorts?: EdgePort[];
    /**
     * Rare escape hatch for diagrams that need a documented one-off nudge.
     * Prefer semantic alignment hints before using this.
     */
    offset?: Partial<Point>;
  };
}

export interface EdgeSpec {
  id: SemanticId;
  from: SemanticId;
  to: SemanticId;
  kind: EdgeKind;
  label?: string;
  condition?: string;
  tone?: EdgeTone;
  layout?: {
    routing?: RoutingStrategy;
    fromPort?: EdgePort;
    toPort?: EdgePort;
    corridor?: 'above-main' | 'below-main' | 'right-side' | 'left-side' | 'lane';
    labelPlacement?: {
      position?: 'start' | 'middle' | 'end';
      side?: 'above' | 'below' | 'left' | 'right' | 'inline';
    };
  };
}

export interface LabelSpec {
  id: SemanticId;
  text: string;
  laneId?: SemanticId;
  nearNodeId?: SemanticId;
  edgeId?: SemanticId;
  tone?: LabelTone;
  placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline';
  maxChars?: number;
}

export interface LegendItemSpec {
  id: SemanticId;
  label: string;
  kind: 'state' | 'decision' | 'process' | 'terminal' | 'edge';
  tone?: NodeTone | EdgeTone;
}

export interface WorkflowLayoutHints {
  orientation?: 'left-to-right';
  laneOrder?: SemanticId[];
  mainLaneId?: SemanticId;
  mainNodeIds?: SemanticId[];
  nodeGap?: number;
  laneGap?: number;
  rowGap?: number;
  minWidth?: number;
}

export interface WorkflowDiagramSpec {
  id: SemanticId;
  title: string;
  subtitle?: string;
  entityName?: string;
  description?: string;
  lanes: LaneSpec[];
  nodes: NodeSpec[];
  edges: EdgeSpec[];
  labels?: LabelSpec[];
  legend?: LegendItemSpec[];
  layout?: WorkflowLayoutHints;
}

export interface LaidOutNode {
  node: NodeSpec;
  box: Box;
  center: Point;
  titleLines: string[];
  bodyLines: string[];
}

export interface LaidOutLane {
  lane: LaneSpec;
  box: Box;
  titleY: number;
  descriptionY: number;
}

export interface LaidOutEdge {
  edge: EdgeSpec;
  path: string;
  label?: {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    textAnchor: 'start' | 'middle' | 'end';
  };
}

export interface LaidOutLabel {
  label: LabelSpec;
  x: number;
  y: number;
  lines: string[];
  textAnchor: 'start' | 'middle' | 'end';
}

export interface WorkflowDiagramLayout {
  viewBox: Box;
  lanes: LaidOutLane[];
  nodes: LaidOutNode[];
  edges: LaidOutEdge[];
  labels: LaidOutLabel[];
  nodeBoxes: Record<SemanticId, Box>;
  laneBoxes: Record<SemanticId, Box>;
}
