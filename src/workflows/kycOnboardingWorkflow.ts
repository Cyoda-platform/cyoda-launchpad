import type { WorkflowDiagramSpec } from '@/lib/workflow-diagram';

export const kycOnboardingWorkflow: WorkflowDiagramSpec = {
  id: 'kyc-onboarding-workflow',
  title: 'KYC and Customer Onboarding workflow graph',
  subtitle: 'Workflow graph · operational view',
  entityName: 'CustomerOnboardingCase',
  description:
    'Customer onboarding lifecycle with automated IDV, legal-entity ownership discovery, dynamic risk scoring, EDD, rejection, abandonment, active monitoring, and perpetual KYC reassessment.',
  lanes: [
    { id: 'legalEntity', title: 'LEGAL-ENTITY BRANCH', description: 'Conditional UBO and control discovery for legal entities.', order: 1, tone: 'muted' },
    { id: 'straightThrough', title: 'STRAIGHT-THROUGH PATH', description: 'Automated intake, IDV, screening, dynamic risk, and active monitoring.', order: 2, tone: 'primary', layout: { containsMainBaseline: true } },
    { id: 'exceptions', title: 'EXCEPTIONS / TERMINALS', description: 'EDD, rejection, abandonment, and approval back into monitoring.', order: 3, tone: 'warning' },
  ],
  nodes: [
    { id: 'legalEntityQuestion', kind: 'decision', laneId: 'legalEntity', title: 'Legal entity?', size: 'decision', layout: { alignXWith: 'automationClear', order: 1 } },
    { id: 'uboDiscovery', kind: 'state', laneId: 'legalEntity', title: 'UBO & Control Discovery', subtitle: 'State · Conditional branch', processLabel: 'DISCOVER UBO & CONTROL', size: 'wide', layout: { alignXWith: 'automatedIdv', order: 2 } },

    { id: 'dataIntake', kind: 'state', laneId: 'straightThrough', title: 'Data Intake & Triage', subtitle: 'State · Start', processLabel: 'CLASSIFY', size: 'standard', layout: { baseline: true, row: 'main-baseline', order: 1 } },
    { id: 'automatedIdv', kind: 'state', laneId: 'straightThrough', title: 'Automated ID&V & Screening', subtitle: 'State · Automated', processLabel: 'ID&V · SANCTIONS · PEP', size: 'wide', tone: 'active', layout: { baseline: true, row: 'main-baseline', order: 2 } },
    { id: 'automationClear', kind: 'decision', laneId: 'straightThrough', title: 'Automation clear?', size: 'decision', layout: { baseline: true, row: 'main-baseline', order: 3 } },
    { id: 'dynamicRisk', kind: 'state', laneId: 'straightThrough', title: 'Dynamic Risk Assessment', subtitle: 'State · Decisioning', processLabel: 'SCORE RISK DYNAMICALLY', size: 'wide', layout: { baseline: true, row: 'main-baseline', order: 4 } },
    { id: 'lowRisk', kind: 'decision', laneId: 'straightThrough', title: 'Low risk?', size: 'decision', layout: { baseline: true, row: 'main-baseline', order: 5 } },
    { id: 'activeMonitoring', kind: 'state', laneId: 'straightThrough', title: 'Active / Ongoing Monitoring', subtitle: 'State · Persistent', body: 'perpetual KYC', size: 'persistent', tone: 'success', layout: { baseline: true, row: 'main-baseline', order: 6 } },

    { id: 'edd', kind: 'state', laneId: 'exceptions', title: 'Exception Handling & EDD', subtitle: 'State · Human-in-the-loop', body: 'missing info · SoF/SoW · escalations', processLabel: 'HANDLE EXCEPTION · EDD', size: 'wide', tone: 'human', layout: { alignXWith: 'automationClear', order: 1 } },
    { id: 'rejected', kind: 'terminal', laneId: 'exceptions', title: 'Rejected', subtitle: 'Terminal', size: 'terminal', tone: 'danger', layout: { alignXWith: 'lowRisk', order: 2 } },
    { id: 'abandoned', kind: 'terminal', laneId: 'exceptions', title: 'Abandoned', subtitle: 'Terminal', size: 'terminal', tone: 'warning', layout: { alignXWith: 'activeMonitoring', order: 3 } },
  ],
  edges: [
    { id: 'intakeToIdv', from: 'dataIntake', to: 'automatedIdv', kind: 'main', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'idvToAutomationClear', from: 'automatedIdv', to: 'automationClear', kind: 'main', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'automationClearToRisk', from: 'automationClear', to: 'dynamicRisk', kind: 'main', label: 'yes', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'riskToLowRisk', from: 'dynamicRisk', to: 'lowRisk', kind: 'main', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'lowRiskToMonitoring', from: 'lowRisk', to: 'activeMonitoring', kind: 'main', label: 'low risk', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },

    { id: 'idvToLegalEntityQuestion', from: 'automatedIdv', to: 'legalEntityQuestion', kind: 'branch', label: 'legal entity', layout: { routing: 'orthogonal', fromPort: 'top', toPort: 'right' } },
    { id: 'legalEntityToUbo', from: 'legalEntityQuestion', to: 'uboDiscovery', kind: 'branch', layout: { routing: 'horizontal', fromPort: 'left', toPort: 'right' } },
    { id: 'uboToRisk', from: 'uboDiscovery', to: 'dynamicRisk', kind: 'branch', layout: { routing: 'orthogonal', fromPort: 'bottom', toPort: 'top' } },

    { id: 'automationExceptionToEdd', from: 'automationClear', to: 'edd', kind: 'branch', label: 'exception', layout: { routing: 'vertical', fromPort: 'bottom', toPort: 'top' } },
    { id: 'riskHighToEdd', from: 'lowRisk', to: 'edd', kind: 'branch', label: 'high risk', layout: { routing: 'orthogonal', fromPort: 'bottom', toPort: 'right' } },
    { id: 'idvTimeoutToAbandoned', from: 'automatedIdv', to: 'abandoned', kind: 'exception', label: 'timeout', layout: { routing: 'right-detour', fromPort: 'bottom', toPort: 'right' } },
    { id: 'riskRejectToRejected', from: 'lowRisk', to: 'rejected', kind: 'exception', label: 'policy reject', layout: { routing: 'vertical', fromPort: 'bottom', toPort: 'top' } },
    { id: 'eddRejectToRejected', from: 'edd', to: 'rejected', kind: 'exception', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'eddApprovedToMonitoring', from: 'edd', to: 'activeMonitoring', kind: 'branch', label: 'EDD approved', layout: { routing: 'orthogonal', fromPort: 'right', toPort: 'bottom' } },
    { id: 'eddTimeoutToAbandoned', from: 'edd', to: 'abandoned', kind: 'exception', label: 'timeout', layout: { routing: 'bottom-corridor', fromPort: 'bottom', toPort: 'left' } },
    { id: 'monitoringReassess', from: 'activeMonitoring', to: 'dynamicRisk', kind: 'loop', label: 'monitoring alert', layout: { routing: 'loop-above', fromPort: 'top', toPort: 'top' } },
  ],
  labels: [
    {
      id: 'perpetualLoop',
      text: 'Perpetual KYC loop: approval is not an endpoint.',
      nearNodeId: 'activeMonitoring',
      tone: 'callout',
      placement: 'top-right',
    },
  ],
  layout: {
    mainLaneId: 'straightThrough',
    mainNodeIds: ['dataIntake', 'automatedIdv', 'automationClear', 'dynamicRisk', 'lowRisk', 'activeMonitoring'],
    nodeGap: 34,
    rowGap: 28,
    minWidth: 980,
  },
};

export default kycOnboardingWorkflow;
