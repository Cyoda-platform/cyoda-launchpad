import type { WorkflowDiagramSpec } from '@/lib/workflow-diagram';

export const tradeSettlementWorkflow: WorkflowDiagramSpec = {
  id: 'trade-settlement-workflow',
  title: 'TradeSettlement workflow graph',
  subtitle: 'Entity workflow',
  entityName: 'TradeSettlement',
  description:
    'Post-trade lifecycle covering validation, matching, affirmation, instruction, settlement, repair, failure, cancellation, and immutable reporting.',
  lanes: [
    { id: 'intake', title: 'INTAKE', description: 'Validation, matching, and reporting processors.', order: 1, tone: 'muted' },
    { id: 'mainLifecycle', title: 'MAIN LIFECYCLE', description: 'Trade capture through affirmation.', order: 2, tone: 'primary', layout: { containsMainBaseline: true } },
    { id: 'settlement', title: 'INSTRUCTION & SETTLEMENT', description: 'Settlement instruction and success/failure decisioning.', order: 3 },
    { id: 'repair', title: 'EXCEPTIONS & REPAIR', description: 'Repair, manual review, loop-back, and terminal outcomes.', order: 4, tone: 'warning' },
  ],
  nodes: [
    { id: 'validateTrade', kind: 'process', laneId: 'intake', title: 'Validate trade', subtitle: 'Schema · refs · rules', size: 'compact', layout: { alignXWith: 'validating', order: 1 } },
    { id: 'runMatching', kind: 'process', laneId: 'intake', title: 'Run matching', subtitle: 'Counterparty · venue', size: 'compact', layout: { alignXWith: 'matched', order: 2 } },
    { id: 'publishReport', kind: 'process', laneId: 'intake', title: 'Publish report', subtitle: 'MiFIR · EMIR · CAT', size: 'compact', layout: { alignXWith: 'settled', order: 3 } },
    { id: 'sendInstruction', kind: 'process', laneId: 'intake', title: 'Send instruction', subtitle: 'Custodian · CSD', size: 'compact', layout: { alignXWith: 'instructed', order: 4 } },
    { id: 'applyRepair', kind: 'process', laneId: 'intake', title: 'Apply repair', subtitle: 'Amend · resubmit', size: 'compact', layout: { alignXWith: 'repaired', order: 5 } },

    { id: 'tradeReceived', kind: 'state', laneId: 'mainLifecycle', title: 'Trade received', subtitle: 'Entity created', size: 'standard', layout: { baseline: true, row: 'main-baseline', order: 1 } },
    { id: 'validating', kind: 'state', laneId: 'mainLifecycle', title: 'Validating', subtitle: 'Active', size: 'standard', tone: 'active', layout: { baseline: true, row: 'main-baseline', order: 2 } },
    { id: 'valid', kind: 'decision', laneId: 'mainLifecycle', title: 'Valid?', size: 'decision', layout: { baseline: true, row: 'main-baseline', order: 3 } },
    { id: 'matched', kind: 'state', laneId: 'mainLifecycle', title: 'Matched', subtitle: 'Economics aligned', size: 'standard', layout: { baseline: true, row: 'main-baseline', order: 4 } },
    { id: 'matchOk', kind: 'decision', laneId: 'mainLifecycle', title: 'Match ok?', size: 'decision', layout: { baseline: true, row: 'main-baseline', order: 5 } },
    { id: 'affirmed', kind: 'state', laneId: 'mainLifecycle', title: 'Affirmed', subtitle: 'Counterparty confirmed', size: 'standard', layout: { baseline: true, row: 'main-baseline', order: 6 } },

    { id: 'affirmedQuestion', kind: 'decision', laneId: 'settlement', title: 'Affirmed?', size: 'decision', layout: { row: 'affirmation', alignXWith: 'matchOk', order: 1 } },
    { id: 'instructed', kind: 'state', laneId: 'settlement', title: 'Instructed', subtitle: 'Custodian notified', size: 'standard', layout: { row: 'settlement-main', alignXWith: 'matched', order: 2 } },
    { id: 'settleOk', kind: 'decision', laneId: 'settlement', title: 'Settle ok?', size: 'decision', layout: { row: 'settlement-main', alignXWith: 'matchOk', order: 3 } },
    { id: 'settled', kind: 'terminal', laneId: 'settlement', title: 'Settled', subtitle: 'Terminal · success', size: 'terminal', tone: 'success', layout: { row: 'settlement-main', alignXWith: 'affirmed', order: 4 } },
    { id: 'failed', kind: 'terminal', laneId: 'settlement', title: 'Failed', subtitle: 'Terminal · reported', size: 'terminal', tone: 'danger', layout: { row: 'failure', alignXWith: 'settled', order: 5 } },

    { id: 'repairRequested', kind: 'state', laneId: 'repair', title: 'Repair requested', subtitle: 'Exception open', size: 'wide', tone: 'warning', layout: { alignXWith: 'matched', order: 1 } },
    { id: 'manualReview', kind: 'state', laneId: 'repair', title: 'Manual review', subtitle: 'Ops queue', size: 'standard', tone: 'human', layout: { alignXWith: 'validating', order: 2 } },
    { id: 'repaired', kind: 'state', laneId: 'repair', title: 'Repaired', subtitle: 'Ready to resubmit', size: 'standard', layout: { alignXWith: 'tradeReceived', order: 3 } },
    { id: 'cancelled', kind: 'terminal', laneId: 'repair', title: 'Cancelled', subtitle: 'Terminal · by ops', size: 'terminal', tone: 'danger', layout: { alignXWith: 'settled', order: 4 } },
  ],
  edges: [
    { id: 'receivedToValidating', from: 'tradeReceived', to: 'validating', kind: 'main', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'validatingToValid', from: 'validating', to: 'valid', kind: 'main', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'validToMatched', from: 'valid', to: 'matched', kind: 'main', label: 'valid', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'matchedToMatchOk', from: 'matched', to: 'matchOk', kind: 'main', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'matchOkToAffirmed', from: 'matchOk', to: 'affirmed', kind: 'main', label: 'matched', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'affirmedToQuestion', from: 'affirmed', to: 'affirmedQuestion', kind: 'main', layout: { routing: 'orthogonal', fromPort: 'bottom', toPort: 'top' } },
    { id: 'questionToInstructed', from: 'affirmedQuestion', to: 'instructed', kind: 'main', label: 'affirmed', layout: { routing: 'orthogonal', fromPort: 'left', toPort: 'right' } },
    { id: 'instructedToSettleOk', from: 'instructed', to: 'settleOk', kind: 'main', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },
    { id: 'settleOkToSettled', from: 'settleOk', to: 'settled', kind: 'main', label: 'settled', layout: { routing: 'horizontal', fromPort: 'right', toPort: 'left' } },

    { id: 'validToRepair', from: 'valid', to: 'repairRequested', kind: 'exception', label: 'invalid', layout: { routing: 'vertical', fromPort: 'bottom', toPort: 'top' } },
    { id: 'matchToRepair', from: 'matchOk', to: 'repairRequested', kind: 'exception', label: 'mismatch', layout: { routing: 'vertical', fromPort: 'bottom', toPort: 'top' } },
    { id: 'affirmedToRepair', from: 'affirmedQuestion', to: 'repairRequested', kind: 'exception', label: 'not affirmed', layout: { routing: 'orthogonal', fromPort: 'bottom', toPort: 'top' } },
    { id: 'settleToFailed', from: 'settleOk', to: 'failed', kind: 'exception', label: 'settlement fail', layout: { routing: 'orthogonal', fromPort: 'bottom', toPort: 'left' } },
    { id: 'repairToReview', from: 'repairRequested', to: 'manualReview', kind: 'branch', layout: { routing: 'horizontal', fromPort: 'left', toPort: 'right' } },
    { id: 'reviewToRepaired', from: 'manualReview', to: 'repaired', kind: 'branch', label: 'repair applied', layout: { routing: 'horizontal', fromPort: 'left', toPort: 'right' } },
    { id: 'repairedToValidating', from: 'repaired', to: 'validating', kind: 'loop', label: 're-enter validation', layout: { routing: 'loop-left', fromPort: 'top', toPort: 'bottom' } },
    { id: 'reviewToCancelled', from: 'manualReview', to: 'cancelled', kind: 'exception', label: 'cancel', layout: { routing: 'bottom-corridor', fromPort: 'bottom', toPort: 'left' } },

    { id: 'validateToValidating', from: 'validateTrade', to: 'validating', kind: 'annotation', layout: { routing: 'vertical', fromPort: 'bottom', toPort: 'top' } },
    { id: 'matchingToMatched', from: 'runMatching', to: 'matched', kind: 'annotation', layout: { routing: 'vertical', fromPort: 'bottom', toPort: 'top' } },
    { id: 'reportToSettled', from: 'publishReport', to: 'settled', kind: 'annotation', layout: { routing: 'curve', fromPort: 'bottom', toPort: 'top' } },
    { id: 'instructionToInstructed', from: 'sendInstruction', to: 'instructed', kind: 'annotation', layout: { routing: 'vertical', fromPort: 'bottom', toPort: 'top' } },
    { id: 'applyRepairToRepaired', from: 'applyRepair', to: 'repaired', kind: 'annotation', layout: { routing: 'curve', fromPort: 'bottom', toPort: 'top' } },
  ],
  layout: {
    mainLaneId: 'mainLifecycle',
    mainNodeIds: ['tradeReceived', 'validating', 'valid', 'matched', 'matchOk', 'affirmed'],
    nodeGap: 36,
    rowGap: 28,
    minWidth: 1040,
  },
};

export default tradeSettlementWorkflow;
