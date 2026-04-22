import type { WorkflowDiagramSpec } from '@/lib/workflow-diagram';

export const agenticAiRegulatedActionWorkflow: WorkflowDiagramSpec = {
  id: 'agentic-ai-regulated-action-workflow',
  title: 'Agentic AI RegulatedActionCase workflow graph',
  subtitle: 'Workflow graph · operational view',
  entityName: 'RegulatedActionCase',
  description:
    'An agentic AI system may propose and reassess regulated actions, while all production-state mutation happens through governed deterministic workflow states, human review branches, and terminal exception handling.',
  lanes: [
    {
      id: 'aiProposal',
      title: 'AI PROPOSAL · PROBABILISTIC',
      description: 'Probabilistic proposal generation and persistent monitoring. AI does not mutate production state.',
      order: 1,
      tone: 'muted',
    },
    {
      id: 'deterministicGovernance',
      title: 'CYODA-GOVERNED DETERMINISTIC PATH',
      description: 'Governed state transition path for validation, authorization, execution, and outcome recording.',
      order: 2,
      tone: 'primary',
      layout: { containsMainBaseline: true },
    },
    {
      id: 'humanOversight',
      title: 'HUMAN OVERSIGHT · EXCEPTIONS · TERMINALS',
      description: 'Human-in-the-loop review, rejected outcomes, and rollback handling.',
      order: 3,
      tone: 'warning',
    },
  ],
  nodes: [
    { id: 'generateProposal', kind: 'process', laneId: 'aiProposal', title: 'Generate action proposal', subtitle: 'AI · Probabilistic', size: 'compact', tone: 'ai', layout: { alignXWith: 'actionProposed', order: 1 } },
    { id: 'monitoringReassessment', kind: 'state', laneId: 'aiProposal', title: 'Monitoring / Reassessment', subtitle: 'State · Persistent', size: 'persistent', tone: 'ai', layout: { alignXWith: 'outcomeRecorded', order: 2 } },

    { id: 'caseOpened', kind: 'state', laneId: 'deterministicGovernance', title: 'Case Opened', subtitle: 'State · Start', size: 'standard', layout: { baseline: true, row: 'main-baseline', order: 1 } },
    { id: 'actionProposed', kind: 'state', laneId: 'deterministicGovernance', title: 'Action Proposed', subtitle: 'State · Captured', size: 'standard', layout: { baseline: true, row: 'main-baseline', order: 2 } },
    { id: 'proposalCredible', kind: 'decision', laneId: 'deterministicGovernance', title: 'Proposal credible?', size: 'decision', layout: { baseline: true, row: 'main-baseline', order: 3 } },
    { id: 'policyValidation', kind: 'state', laneId: 'deterministicGovernance', title: 'Policy Validation', subtitle: 'State · Gate', processLabel: 'VALIDATE POLICY · AUTHORITY', size: 'standard', layout: { baseline: true, row: 'main-baseline', order: 4 } },
    { id: 'policyClear', kind: 'decision', laneId: 'deterministicGovernance', title: 'Policy clear?', size: 'decision', layout: { baseline: true, row: 'main-baseline', order: 5 } },
    { id: 'authorized', kind: 'state', laneId: 'deterministicGovernance', title: 'Authorized', subtitle: 'State · Cleared', size: 'standard', tone: 'success', layout: { row: 'execution', order: 6, alignXWith: 'policyValidation' } },
    { id: 'executing', kind: 'state', laneId: 'deterministicGovernance', title: 'Executing', subtitle: 'State · Deterministic', processLabel: 'EXECUTE APPROVED ACTION', size: 'standard', layout: { row: 'execution', order: 7, alignXWith: 'policyClear' } },
    { id: 'executionSucceeded', kind: 'decision', laneId: 'deterministicGovernance', title: 'Execution succeeded?', size: 'decision', layout: { row: 'execution', order: 8, alignXWith: 'executing' } },
    { id: 'outcomeRecorded', kind: 'state', laneId: 'deterministicGovernance', title: 'Outcome Recorded', subtitle: 'State · Committed', processLabel: 'RECORD IMMUTABLE OUTCOME', size: 'standard', layout: { row: 'execution', order: 9, alignXWith: 'executionSucceeded' } },

    { id: 'escalatedReview', kind: 'state', laneId: 'humanOversight', title: 'Escalated Review', subtitle: 'State · Human-in-the-loop', body: 'maker-checker workbench · policy & authority review', processLabel: 'REQUEST HUMAN AUTHORIZATION', size: 'wide', tone: 'human', layout: { row: 'review', alignXWith: 'policyClear', branchOf: 'proposalCredible', order: 1 } },
    { id: 'rolledBack', kind: 'terminal', laneId: 'humanOversight', title: 'Rolled Back', subtitle: 'Terminal', processLabel: 'ROLLBACK · COMPENSATE', size: 'terminal', tone: 'warning', layout: { row: 'terminals', alignXWith: 'executionSucceeded', order: 2 } },
    { id: 'blockedRejected', kind: 'terminal', laneId: 'humanOversight', title: 'Blocked / Rejected', subtitle: 'Terminal', size: 'terminal', tone: 'danger', layout: { row: 'terminals', alignXWith: 'outcomeRecorded', order: 3 } },
  ],
  edges: [
    { id: 'aiGeneratesProposal', from: 'generateProposal', to: 'actionProposed', kind: 'annotation', condition: 'proposal captured as immutable case payload', layout: { routing: 'vertical', fromPort: 'bottom', toPort: 'top' } },
    { id: 'caseOpenedToActionProposed', from: 'caseOpened', to: 'actionProposed', kind: 'main', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'actionProposedToProposalCredible', from: 'actionProposed', to: 'proposalCredible', kind: 'main', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'credibleProposalToPolicyValidation', from: 'proposalCredible', to: 'policyValidation', kind: 'main', condition: 'credible', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'policyValidationToPolicyClear', from: 'policyValidation', to: 'policyClear', kind: 'main', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'clearPolicyToAuthorized', from: 'policyClear', to: 'authorized', kind: 'main', condition: 'clear', layout: { routing: 'orthogonal', fromPort: 'bottom', toPort: 'top' } },
    { id: 'authorizedToExecuting', from: 'authorized', to: 'executing', kind: 'main', label: 'authorized', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left', labelPlacement: { side: 'above' } } },
    { id: 'executingToExecutionSucceeded', from: 'executing', to: 'executionSucceeded', kind: 'main', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'successfulExecutionToOutcomeRecorded', from: 'executionSucceeded', to: 'outcomeRecorded', kind: 'main', condition: 'succeeded', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'outcomeRecordedToMonitoring', from: 'outcomeRecorded', to: 'monitoringReassessment', kind: 'main', label: 'persist', layout: { routing: 'curve', fromPort: 'top', toPort: 'bottom', labelPlacement: { side: 'right' } } },
    { id: 'monitoringReassessmentToPolicyValidation', from: 'monitoringReassessment', to: 'policyValidation', kind: 'loop', label: 'monitoring alert · reassess', layout: { routing: 'loop-above', fromPort: 'left', toPort: 'top', labelPlacement: { side: 'above' } } },
    { id: 'lowConfidenceToEscalatedReview', from: 'proposalCredible', to: 'escalatedReview', kind: 'branch', label: 'low confidence', condition: 'not credible', layout: { routing: 'vertical', fromPort: 'bottom', toPort: 'top', labelPlacement: { side: 'right' } } },
    { id: 'manualApprovalToEscalatedReview', from: 'policyClear', to: 'escalatedReview', kind: 'branch', label: 'manual approval', condition: 'manual approval required', layout: { routing: 'vertical', fromPort: 'bottom', toPort: 'top' } },
    { id: 'policyRejectToBlockedRejected', from: 'policyClear', to: 'blockedRejected', kind: 'exception', label: 'policy reject', condition: 'policy rejected', layout: { routing: 'right-detour', fromPort: 'top', toPort: 'right' } },
    { id: 'reviewApprovedToAuthorized', from: 'escalatedReview', to: 'authorized', kind: 'branch', label: 'approved', condition: 'reviewer approves', layout: { routing: 'orthogonal', fromPort: 'right', toPort: 'bottom' } },
    { id: 'reviewBlockedToBlockedRejected', from: 'escalatedReview', to: 'blockedRejected', kind: 'exception', label: 'blocked', condition: 'reviewer blocks', layout: { routing: 'bottom-corridor', fromPort: 'bottom', toPort: 'left' } },
    { id: 'executionFailedToRolledBack', from: 'executionSucceeded', to: 'rolledBack', kind: 'exception', label: 'execution failed', condition: 'not succeeded', layout: { routing: 'vertical', fromPort: 'bottom', toPort: 'top' } },
  ],
  labels: [
    { id: 'aiMutationBoundary', text: 'AI does not mutate production state', laneId: 'aiProposal', tone: 'boundary', placement: 'top-right' },
    { id: 'proposalCaptureHint', text: 'Proposal is captured as an immutable case payload, never a direct mutation.', nearNodeId: 'actionProposed', tone: 'hint', placement: 'bottom-left' },
    { id: 'reassessmentLoopCallout', text: 'Outcomes remain observable. Signals reopen evaluation.', nearNodeId: 'monitoringReassessment', tone: 'callout', placement: 'top-right' },
  ],
  layout: {
    mainLaneId: 'deterministicGovernance',
    mainNodeIds: ['caseOpened', 'actionProposed', 'proposalCredible', 'policyValidation', 'policyClear'],
    nodeGap: 34,
    rowGap: 30,
    minWidth: 1180,
  },
};

export default agenticAiRegulatedActionWorkflow;
