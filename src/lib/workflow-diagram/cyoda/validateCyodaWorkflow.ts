import { z } from 'zod';
import type {
  CyodaCriterion,
  CyodaProcessor,
  CyodaTransitionDefinition,
  CyodaValidationWarning,
  CyodaWorkflowConfig,
} from './cyodaTypes';

const transitionSchema = z.object({
  name: z.string().optional(),
  next: z.string(),
  manual: z.boolean().optional(),
  disabled: z.boolean().optional(),
  criterion: z.record(z.unknown()).optional(),
  processors: z.array(z.record(z.unknown())).optional(),
}).passthrough();

const stateSchema = z.object({
  name: z.string().optional(),
  transitions: z.array(transitionSchema).optional(),
}).passthrough();

const workflowSchema = z.object({
  version: z.string(),
  name: z.string(),
  desc: z.string().optional(),
  initialState: z.string(),
  active: z.boolean().optional(),
  criterion: z.record(z.unknown()).optional(),
  states: z.record(stateSchema),
}).passthrough();

const stateNamePattern = /^[A-Za-z][A-Za-z0-9_-]*$/;

const warning = (code: string, message: string, path?: string): CyodaValidationWarning => ({
  code,
  message,
  path,
  severity: 'warning',
});

const error = (code: string, message: string, path?: string): CyodaValidationWarning => ({
  code,
  message,
  path,
  severity: 'error',
});

const validateCriterion = (
  criterion: CyodaCriterion | undefined,
  path: string,
  warnings: CyodaValidationWarning[],
) => {
  if (!criterion) return;

  if (!criterion.type || typeof criterion.type !== 'string') {
    warnings.push(warning('criterion-missing-type', 'Criterion is missing a string type.', path));
    return;
  }

  if (criterion.type === 'group') {
    if (!Array.isArray(criterion.conditions)) {
      warnings.push(warning('group-criterion-missing-conditions', 'Group criterion should define a conditions array.', path));
      return;
    }
    criterion.conditions.forEach((child, index) => validateCriterion(child, `${path}.conditions[${index}]`, warnings));
    return;
  }

  if (criterion.type === 'function') {
    const functionConfig = criterion.function;
    if (!functionConfig || typeof functionConfig !== 'object') {
      warnings.push(warning('function-criterion-missing-function', 'Function criterion should define a function object.', path));
      return;
    }
    if (functionConfig.criterion) {
      validateCriterion(functionConfig.criterion, `${path}.function.criterion`, warnings);
    }
    return;
  }

  if (criterion.type === 'simple' || criterion.type === 'array') {
    if (typeof criterion.jsonPath !== 'string') {
      warnings.push(warning('criterion-missing-json-path', `${criterion.type} criterion should define jsonPath.`, path));
    }
    if (typeof (criterion.operation ?? criterion.operatorType) !== 'string') {
      warnings.push(warning('criterion-missing-operation', `${criterion.type} criterion should define operation or operatorType.`, path));
    }
    return;
  }

  if (criterion.type === 'lifecycle') {
    if (typeof criterion.field !== 'string') {
      warnings.push(warning('lifecycle-criterion-missing-field', 'Lifecycle criterion should define field.', path));
    }
    if (typeof (criterion.operation ?? criterion.operatorType) !== 'string') {
      warnings.push(warning('lifecycle-criterion-missing-operation', 'Lifecycle criterion should define operation or operatorType.', path));
    }
  }
};

const validateProcessors = (
  processors: CyodaProcessor[] | undefined,
  path: string,
  warnings: CyodaValidationWarning[],
) => {
  if (!processors) return;

  if (!Array.isArray(processors)) {
    warnings.push(warning('processors-not-array', 'Transition processors should be an array.', path));
    return;
  }

  processors.forEach((processor, index) => {
    const processorPath = `${path}.processors[${index}]`;
    if (!processor.type) {
      warnings.push(warning('processor-missing-type', 'Processor is missing type.', processorPath));
    }
    if (!processor.name) {
      warnings.push(warning('processor-missing-name', 'Processor is missing name.', processorPath));
    }
    if (processor.type === 'scheduled' && !processor.config?.delayMs) {
      warnings.push(warning('scheduled-processor-missing-delay', 'Scheduled processor should define config.delayMs.', processorPath));
    }
    if (processor.type === 'scheduled' && !processor.config?.transition) {
      warnings.push(warning('scheduled-processor-missing-transition', 'Scheduled processor should define config.transition.', processorPath));
    }
  });
};

export const validateCyodaWorkflow = (workflow: CyodaWorkflowConfig | null): CyodaValidationWarning[] => {
  if (!workflow) {
    return [error('missing-workflow', 'No workflow was selected for rendering.')];
  }

  const warnings: CyodaValidationWarning[] = [];
  const result = workflowSchema.safeParse(workflow);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      warnings.push(error('schema-error', issue.message, issue.path.join('.')));
    });
    return warnings;
  }

  const states = workflow.states ?? {};
  const stateIds = Object.keys(states);

  if (!stateIds.length) {
    warnings.push(error('empty-states', 'Workflow does not define any states.', 'states'));
  }

  if (!states[workflow.initialState]) {
    warnings.push(error('initial-state-missing', `Initial state "${workflow.initialState}" is not present in states.`, 'initialState'));
  }

  stateIds.forEach((stateId) => {
    if (!stateNamePattern.test(stateId)) {
      warnings.push(warning('invalid-state-name', `State "${stateId}" does not match the documented Cyoda state-name pattern.`, `states.${stateId}`));
    }

    const transitions = states[stateId]?.transitions ?? [];
    if (!Array.isArray(transitions)) {
      warnings.push(error('state-transitions-invalid', `State "${stateId}" transitions must be an array.`, `states.${stateId}.transitions`));
      return;
    }

    transitions.forEach((transition: CyodaTransitionDefinition, index) => {
      const path = `states.${stateId}.transitions[${index}]`;

      if (!transition.name) {
        warnings.push(warning('transition-missing-name', `Transition from "${stateId}" is missing name.`, `${path}.name`));
      }
      if (!transition.next) {
        warnings.push(error('transition-missing-next', `Transition "${transition.name ?? index}" from "${stateId}" is missing next state.`, `${path}.next`));
      } else if (!states[transition.next]) {
        warnings.push(error(
          'transition-target-missing',
          `Transition "${transition.name ?? index}" from "${stateId}" points to missing state "${transition.next}".`,
          `${path}.next`,
        ));
      }
      if (transition.manual !== undefined && typeof transition.manual !== 'boolean') {
        warnings.push(warning('transition-manual-not-boolean', `Transition "${transition.name ?? index}" manual should be boolean.`, `${path}.manual`));
      }
      if (transition.disabled !== undefined && typeof transition.disabled !== 'boolean') {
        warnings.push(warning('transition-disabled-not-boolean', `Transition "${transition.name ?? index}" disabled should be boolean.`, `${path}.disabled`));
      }

      validateCriterion(transition.criterion, `${path}.criterion`, warnings);
      validateProcessors(transition.processors, path, warnings);
    });
  });

  validateCriterion(workflow.criterion, 'criterion', warnings);

  return warnings;
};
