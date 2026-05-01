import type {
  CyodaJsonRecord,
  CyodaWorkflowConfig,
  CyodaWorkflowInput,
  NormalizedCyodaWorkflowInput,
} from './cyodaTypes';

const isRecord = (value: unknown): value is CyodaJsonRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasWorkflowShape = (value: unknown): value is CyodaWorkflowConfig => {
  if (!isRecord(value)) return false;
  return typeof value.version === 'string' &&
    typeof value.name === 'string' &&
    typeof value.initialState === 'string' &&
    isRecord(value.states);
};

export const normalizeCyodaWorkflowInput = (input: CyodaWorkflowInput): NormalizedCyodaWorkflowInput => {
  const warnings: NormalizedCyodaWorkflowInput['warnings'] = [];
  let value = input;

  if (typeof input === 'string') {
    try {
      value = JSON.parse(input);
    } catch {
      return {
        kind: 'invalid',
        workflow: null,
        warnings: [{
          code: 'invalid-json',
          message: 'Workflow input is a string but could not be parsed as JSON.',
          severity: 'error',
        }],
      };
    }
  }

  if (!isRecord(value)) {
    return {
      kind: 'invalid',
      workflow: null,
      warnings: [{
        code: 'invalid-input',
        message: 'Workflow input must be a Cyoda workflow object, workflow envelope, or UI wrapper.',
        severity: 'error',
      }],
    };
  }

  if (hasWorkflowShape(value)) {
    return { kind: 'single-workflow', workflow: value, warnings };
  }

  if (isRecord(value.configuration) && hasWorkflowShape(value.configuration)) {
    const entityModel = isRecord(value.entityModel) ? value.entityModel : undefined;

    return {
      kind: 'ui-wrapper',
      workflow: value.configuration,
      warnings,
      entityName: typeof entityModel?.modelName === 'string' ? entityModel.modelName : undefined,
      modelVersion: typeof entityModel?.modelVersion === 'number' ? entityModel.modelVersion : undefined,
    };
  }

  if (Array.isArray(value.workflows)) {
    const firstWorkflow = value.workflows.find(hasWorkflowShape);

    if (!firstWorkflow) {
      return {
        kind: 'workflow-envelope',
        workflow: null,
        warnings: [{
          code: 'missing-workflow',
          message: 'Workflow envelope does not contain a valid workflow object.',
          severity: 'error',
        }],
      };
    }

    if (value.workflows.length > 1) {
      warnings.push({
        code: 'multiple-workflows',
        message: 'Workflow envelope contains multiple workflows. Rendering the first valid workflow.',
        severity: 'warning',
      });
    }

    return {
      kind: 'workflow-envelope',
      workflow: firstWorkflow,
      warnings,
      entityName: typeof value.entityName === 'string' ? value.entityName : undefined,
      modelVersion: typeof value.modelVersion === 'number' ? value.modelVersion : undefined,
    };
  }

  return {
    kind: 'invalid',
    workflow: null,
    warnings: [{
      code: 'unsupported-shape',
      message: 'Workflow input does not match a supported Cyoda workflow JSON shape.',
      severity: 'error',
    }],
  };
};
