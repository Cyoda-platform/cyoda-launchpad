export type CyodaJsonRecord = Record<string, unknown>;

export type CyodaCriterionType = 'simple' | 'group' | 'function' | 'lifecycle' | 'array' | string;

export interface CyodaCriterion extends CyodaJsonRecord {
  type?: CyodaCriterionType;
  conditions?: CyodaCriterion[];
  function?: {
    name?: string;
    config?: CyodaJsonRecord;
    criterion?: CyodaCriterion;
    [key: string]: unknown;
  };
}

export interface CyodaProcessorConfig extends CyodaJsonRecord {
  attachEntity?: boolean;
  calculationNodesTags?: string;
  responseTimeoutMs?: number;
  retryPolicy?: string;
  context?: string;
  asyncResult?: boolean;
  crossoverToAsyncMs?: number;
  delayMs?: number;
  transition?: string;
  timeoutMs?: number;
}

export type CyodaProcessorExecutionMode = 'SYNC' | 'ASYNC_SAME_TX' | 'ASYNC_NEW_TX' | string;

export interface CyodaProcessor extends CyodaJsonRecord {
  type?: 'externalized' | 'scheduled' | string;
  name?: string;
  executionMode?: CyodaProcessorExecutionMode;
  config?: CyodaProcessorConfig;
}

export interface CyodaTransitionDefinition extends CyodaJsonRecord {
  name?: string;
  next: string;
  manual?: boolean;
  disabled?: boolean;
  criterion?: CyodaCriterion;
  processors?: CyodaProcessor[];
}

export interface CyodaStateDefinition extends CyodaJsonRecord {
  name?: string;
  transitions?: CyodaTransitionDefinition[];
}

export interface CyodaWorkflowConfig extends CyodaJsonRecord {
  version: string;
  name: string;
  desc?: string;
  initialState: string;
  active?: boolean;
  criterion?: CyodaCriterion;
  states: Record<string, CyodaStateDefinition>;
}

export interface CyodaWorkflowImportEnvelope extends CyodaJsonRecord {
  importMode?: 'MERGE' | 'REPLACE' | 'ACTIVATE' | string;
  workflows: CyodaWorkflowConfig[];
}

export interface CyodaWorkflowExportEnvelope extends CyodaJsonRecord {
  entityName?: string;
  modelVersion?: number;
  workflows: CyodaWorkflowConfig[];
}

export interface CyodaWorkflowUiWrapper extends CyodaJsonRecord {
  configuration: CyodaWorkflowConfig;
  entityModel?: {
    modelName?: string;
    modelVersion?: number;
    [key: string]: unknown;
  };
}

export type CyodaWorkflowInput =
  | CyodaWorkflowConfig
  | CyodaWorkflowImportEnvelope
  | CyodaWorkflowExportEnvelope
  | CyodaWorkflowUiWrapper
  | string
  | unknown;

export type CyodaInputKind = 'single-workflow' | 'workflow-envelope' | 'ui-wrapper' | 'invalid';

export interface CyodaValidationWarning {
  code: string;
  message: string;
  path?: string;
  severity: 'warning' | 'error';
}

export interface NormalizedCyodaWorkflowInput {
  kind: CyodaInputKind;
  workflow: CyodaWorkflowConfig | null;
  warnings: CyodaValidationWarning[];
  entityName?: string;
  modelVersion?: number;
}

export interface CyodaWorkflowParseOptions {
  showDisabledTransitions?: boolean;
}

export type CyodaDisplayNodeKind = 'state' | 'terminal';

export type CyodaDisplayNodeTone = 'default' | 'initial' | 'terminal' | 'manual' | 'processing';

export type CyodaDisplayEdgeKind =
  | 'automated'
  | 'manual'
  | 'conditional'
  | 'processing'
  | 'terminal'
  | 'loop'
  | 'disabled';

export interface CyodaCriterionSummary {
  type: string;
  label: string;
  detail: string;
  conditionCount: number;
}

export interface CyodaProcessorSummary {
  count: number;
  label: string;
  detail: string;
  hasScheduled: boolean;
  hasSync: boolean;
  executionModes: string[];
}

export interface CyodaDisplayNode {
  id: string;
  label: string;
  rawState: CyodaStateDefinition;
  kind: CyodaDisplayNodeKind;
  tone: CyodaDisplayNodeTone;
  isInitial: boolean;
  isTerminal: boolean;
  hasManualTransitions: boolean;
  hasProcessors: boolean;
}

export interface CyodaDisplayEdge {
  id: string;
  label: string;
  source: string;
  target: string;
  rawTransition: CyodaTransitionDefinition;
  sourceStateId: string;
  transitionIndex: number;
  kind: CyodaDisplayEdgeKind;
  manual: boolean;
  disabled: boolean;
  isSelfTransition: boolean;
  isBackEdge: boolean;
  criterionSummary?: CyodaCriterionSummary;
  processorSummary?: CyodaProcessorSummary;
  badges: string[];
}

export interface CyodaDisplayGraphStats {
  stateCount: number;
  transitionCount: number;
  visibleTransitionCount: number;
  terminalCount: number;
  manualTransitionCount: number;
}

export interface CyodaDisplayGraph {
  id: string;
  title: string;
  description?: string;
  workflow: CyodaWorkflowConfig;
  sourceKind: CyodaInputKind;
  entityName?: string;
  modelVersion?: number;
  nodes: CyodaDisplayNode[];
  edges: CyodaDisplayEdge[];
  warnings: CyodaValidationWarning[];
  stats: CyodaDisplayGraphStats;
}

export interface CyodaLaidOutNode extends CyodaDisplayNode {
  x: number;
  y: number;
  width: number;
  height: number;
  titleLines: string[];
  subtitle: string;
}

export interface CyodaEdgeLabelLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  titleLines: string[];
  badges: string[];
}

export interface CyodaLaidOutEdge extends CyodaDisplayEdge {
  path: string;
  points: Array<{ x: number; y: number }>;
  labelLayout: CyodaEdgeLabelLayout;
}

export interface CyodaWorkflowLayout {
  width: number;
  height: number;
  nodes: CyodaLaidOutNode[];
  edges: CyodaLaidOutEdge[];
}
