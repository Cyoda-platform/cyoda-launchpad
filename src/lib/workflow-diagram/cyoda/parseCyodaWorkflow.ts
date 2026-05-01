import { classifyCyodaGraph } from './classifyCyodaGraph';
import { normalizeCyodaWorkflowInput } from './normalizeCyodaInput';
import { validateCyodaWorkflow } from './validateCyodaWorkflow';
import type {
  CyodaCriterion,
  CyodaCriterionSummary,
  CyodaDisplayEdge,
  CyodaDisplayGraph,
  CyodaDisplayNode,
  CyodaProcessor,
  CyodaProcessorSummary,
  CyodaTransitionDefinition,
  CyodaValidationWarning,
  CyodaWorkflowConfig,
  CyodaWorkflowInput,
  CyodaWorkflowParseOptions,
} from './cyodaTypes';

const sanitizeForId = (value: string) => value.replace(/[^A-Za-z0-9_-]+/g, '-');

const getTransitionLabel = (transition: CyodaTransitionDefinition, index: number) =>
  transition.name || `TRANSITION_${index + 1}`;

const createEdgeId = (source: string, transition: CyodaTransitionDefinition, index: number) =>
  `${sanitizeForId(source)}__${sanitizeForId(getTransitionLabel(transition, index))}__${sanitizeForId(transition.next)}__${index}`;

const countCriteria = (criterion: CyodaCriterion | undefined): number => {
  if (!criterion) return 0;
  if (criterion.type === 'group' && Array.isArray(criterion.conditions)) {
    return criterion.conditions.reduce((count, child) => count + countCriteria(child), 0);
  }
  if (criterion.type === 'function' && criterion.function?.criterion) {
    return 1 + countCriteria(criterion.function.criterion);
  }
  return 1;
};

export const summarizeCriterion = (criterion: CyodaCriterion | undefined): CyodaCriterionSummary | undefined => {
  if (!criterion) return undefined;

  const type = typeof criterion.type === 'string' ? criterion.type : 'criterion';
  const conditionCount = countCriteria(criterion);

  if (type === 'group') {
    const operator = typeof criterion.operator === 'string' ? criterion.operator : 'GROUP';
    const directCount = Array.isArray(criterion.conditions) ? criterion.conditions.length : conditionCount;
    return {
      type,
      label: `${operator} · ${directCount}`,
      detail: `${operator} group criterion with ${conditionCount} total check${conditionCount === 1 ? '' : 's'}.`,
      conditionCount,
    };
  }

  if (type === 'function') {
    const name = criterion.function?.name ? `: ${criterion.function.name}` : '';
    return {
      type,
      label: 'function',
      detail: `Function criterion${name}.`,
      conditionCount,
    };
  }

  if (type === 'lifecycle') {
    return {
      type,
      label: 'lifecycle',
      detail: 'Lifecycle criterion.',
      conditionCount,
    };
  }

  if (type === 'array') {
    return {
      type,
      label: 'array',
      detail: 'Array criterion.',
      conditionCount,
    };
  }

  return {
    type,
    label: 'criterion',
    detail: `${type} criterion.`,
    conditionCount,
  };
};

export const summarizeProcessors = (processors: CyodaProcessor[] | undefined): CyodaProcessorSummary | undefined => {
  if (!processors?.length) return undefined;

  const executionModes = [...new Set(processors.map((processor) => processor.executionMode).filter(Boolean) as string[])];
  const hasScheduled = processors.some((processor) => processor.type === 'scheduled');
  const hasSync = executionModes.includes('SYNC');
  const names = processors.map((processor) => processor.name).filter(Boolean);
  const label = hasScheduled
    ? 'scheduled'
    : processors.length > 1
      ? `${processors.length} processors`
      : hasSync
        ? 'SYNC'
        : 'processor';

  return {
    count: processors.length,
    label,
    detail: [
      `${processors.length} processor${processors.length === 1 ? '' : 's'}`,
      executionModes.length ? `modes: ${executionModes.join(', ')}` : undefined,
      names.length ? `names: ${names.join(', ')}` : undefined,
    ].filter(Boolean).join(' · '),
    hasScheduled,
    hasSync,
    executionModes,
  };
};

const getActiveTransitions = (
  workflow: CyodaWorkflowConfig,
  showDisabledTransitions: boolean,
) => Object.entries(workflow.states).flatMap(([sourceStateId, state]) =>
  (state.transitions ?? [])
    .map((transition, transitionIndex) => ({ sourceStateId, transition, transitionIndex }))
    .filter(({ transition }) => showDisabledTransitions || !transition.disabled),
);

const buildNode = (
  workflow: CyodaWorkflowConfig,
  stateId: string,
  activeTransitionsBySource: Map<string, CyodaTransitionDefinition[]>,
): CyodaDisplayNode => {
  const rawState = workflow.states[stateId];
  const outgoingTransitions = activeTransitionsBySource.get(stateId) ?? [];
  const isTerminal = outgoingTransitions.length === 0;
  const hasManualTransitions = outgoingTransitions.some((transition) => transition.manual);
  const hasProcessors = outgoingTransitions.some((transition) => transition.processors?.length);

  return {
    id: stateId,
    label: stateId,
    rawState,
    kind: isTerminal ? 'terminal' : 'state',
    tone: 'default',
    isInitial: stateId === workflow.initialState,
    isTerminal,
    hasManualTransitions,
    hasProcessors,
  };
};

const buildEdge = (
  sourceStateId: string,
  transition: CyodaTransitionDefinition,
  transitionIndex: number,
): CyodaDisplayEdge => {
  const criterionSummary = summarizeCriterion(transition.criterion);
  const processorSummary = summarizeProcessors(transition.processors);
  const badges = [
    transition.manual ? 'manual' : undefined,
    criterionSummary?.label,
    processorSummary?.label,
    transition.disabled ? 'disabled' : undefined,
  ].filter(Boolean) as string[];

  return {
    id: createEdgeId(sourceStateId, transition, transitionIndex),
    label: getTransitionLabel(transition, transitionIndex),
    source: sourceStateId,
    target: transition.next,
    rawTransition: transition,
    sourceStateId,
    transitionIndex,
    kind: 'automated',
    manual: transition.manual === true,
    disabled: transition.disabled === true,
    isSelfTransition: sourceStateId === transition.next,
    isBackEdge: false,
    criterionSummary,
    processorSummary,
    badges,
  };
};

export const parseCyodaWorkflowInput = (
  input: CyodaWorkflowInput,
  options: CyodaWorkflowParseOptions = {},
): CyodaDisplayGraph => {
  const normalized = normalizeCyodaWorkflowInput(input);
  const validationWarnings = validateCyodaWorkflow(normalized.workflow);
  const warnings: CyodaValidationWarning[] = [...normalized.warnings, ...validationWarnings];
  const workflow = normalized.workflow ?? {
    version: 'unknown',
    name: 'Invalid workflow',
    initialState: '',
    active: false,
    states: {},
  };
  const showDisabledTransitions = options.showDisabledTransitions ?? false;
  const visibleTransitions = getActiveTransitions(workflow, showDisabledTransitions);
  const activeTransitionsBySource = visibleTransitions.reduce<Map<string, CyodaTransitionDefinition[]>>((map, item) => {
    map.set(item.sourceStateId, [...(map.get(item.sourceStateId) ?? []), item.transition]);
    return map;
  }, new Map());
  const nodes = Object.keys(workflow.states).map((stateId) => buildNode(workflow, stateId, activeTransitionsBySource));
  const edges = visibleTransitions.map(({ sourceStateId, transition, transitionIndex }) =>
    buildEdge(sourceStateId, transition, transitionIndex),
  );
  const rawTransitionCount = Object.values(workflow.states).reduce((count, state) => count + (state.transitions?.length ?? 0), 0);
  const graph: CyodaDisplayGraph = {
    id: sanitizeForId(workflow.name || 'cyoda-workflow').toLowerCase(),
    title: workflow.name,
    description: workflow.desc,
    workflow,
    sourceKind: normalized.kind,
    entityName: normalized.entityName,
    modelVersion: normalized.modelVersion,
    nodes,
    edges,
    warnings,
    stats: {
      stateCount: nodes.length,
      transitionCount: rawTransitionCount,
      visibleTransitionCount: edges.length,
      terminalCount: nodes.filter((node) => node.isTerminal).length,
      manualTransitionCount: edges.filter((edge) => edge.manual).length,
    },
  };

  return classifyCyodaGraph(graph);
};
