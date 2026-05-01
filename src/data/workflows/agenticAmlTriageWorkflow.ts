import type { CyodaWorkflowConfig } from '@/lib/workflow-diagram/cyoda/cyodaTypes';

export const agenticAmlTriageWorkflow = {
  version: '1.0',
  name: 'Agentic AI AML Triage Workflow',
  desc: 'Governed execution layer for AI-assisted AML alert triage, separating probabilistic reasoning from deterministic action.',
  initialState: 'ALERT_INGESTED',
  active: true,
  states: {
    ALERT_INGESTED: {
      transitions: [
        {
          name: 'GENERATE_AI_PROPOSAL',
          next: 'AI_TRIAGE_DRAFTED',
          manual: false,
          disabled: false,
          processors: [
            {
              type: 'externalized',
              name: 'Draft AI Narrative & Disposition',
              executionMode: 'ASYNC_NEW_TX',
              config: {
                attachEntity: true,
                calculationNodesTags: 'ai-agent-pool',
              },
            },
          ],
        },
      ],
    },
    AI_TRIAGE_DRAFTED: {
      transitions: [
        {
          name: 'VALIDATE_PROPOSAL',
          next: 'POLICY_GATING',
          manual: false,
          disabled: false,
          criterion: {
            type: 'group',
            operator: 'AND',
            conditions: [
              {
                type: 'simple',
                jsonPath: '$.aiConfidenceScore',
                operation: 'GREATER_THAN',
                value: 0.95,
              },
              {
                type: 'simple',
                jsonPath: '$.isEvidenceComplete',
                operation: 'EQUALS',
                value: true,
              },
            ],
          },
        },
        {
          name: 'ESCALATE_LOW_CONFIDENCE',
          next: 'L2_REVIEW',
          manual: false,
          disabled: false,
        },
      ],
    },
    POLICY_GATING: {
      transitions: [
        {
          name: 'BLOCK_POLICY_VIOLATION',
          next: 'BLOCKED',
          manual: false,
          disabled: false,
          criterion: {
            type: 'simple',
            jsonPath: '$.policyViolationDetected',
            operation: 'EQUALS',
            value: true,
          },
          processors: [
            {
              type: 'externalized',
              name: 'Persist Blocked Snapshot',
              executionMode: 'ASYNC_NEW_TX',
              config: {
                attachEntity: true,
              },
            },
          ],
        },
        {
          name: 'AUTHORIZE_STP',
          next: 'AUTHORIZED',
          manual: false,
          disabled: false,
          criterion: {
            type: 'group',
            operator: 'AND',
            conditions: [
              {
                type: 'simple',
                jsonPath: '$.aiDisposition',
                operation: 'EQUALS',
                value: 'FALSE_POSITIVE',
              },
              {
                type: 'simple',
                jsonPath: '$.transactionValue',
                operation: 'LESS_THAN',
                value: 50000,
              },
            ],
          },
        },
        {
          name: 'ESCALATE_L2',
          next: 'L2_REVIEW',
          manual: false,
          disabled: false,
        },
      ],
    },
    L2_REVIEW: {
      transitions: [
        {
          name: 'APPROVE_MANUAL',
          next: 'AUTHORIZED',
          manual: true,
          disabled: false,
        },
        {
          name: 'REJECT_MANUAL',
          next: 'BLOCKED',
          manual: true,
          disabled: false,
          processors: [
            {
              type: 'externalized',
              name: 'Persist Blocked Snapshot',
              executionMode: 'ASYNC_NEW_TX',
              config: {
                attachEntity: true,
              },
            },
          ],
        },
      ],
    },
    AUTHORIZED: {
      transitions: [
        {
          name: 'EXECUTE_DISPOSITION',
          next: 'EXECUTING_DISPOSITION',
          manual: false,
          disabled: false,
          processors: [
            {
              type: 'externalized',
              name: 'Execute Deterministic Action',
              executionMode: 'SYNC',
              config: {
                attachEntity: true,
                calculationNodesTags: 'core-banking-api',
              },
            },
          ],
        },
      ],
    },
    EXECUTING_DISPOSITION: {
      transitions: [
        {
          name: 'RECORD_SUCCESS',
          next: 'OUTCOME_RECORDED',
          manual: false,
          disabled: false,
          criterion: {
            type: 'simple',
            jsonPath: '$.executionStatus',
            operation: 'EQUALS',
            value: 'SUCCESS',
          },
          processors: [
            {
              type: 'externalized',
              name: 'Persist Point-in-Time Snapshot and Evidence',
              executionMode: 'ASYNC_NEW_TX',
              config: {
                attachEntity: true,
              },
            },
          ],
        },
        {
          name: 'ROLLBACK_FAILURE',
          next: 'ROLLED_BACK',
          manual: false,
          disabled: false,
          processors: [
            {
              type: 'externalized',
              name: 'Execute Rollback and Compensating Action',
              executionMode: 'SYNC',
              config: {
                attachEntity: true,
              },
            },
            {
              type: 'externalized',
              name: 'Persist Rolled Back Snapshot',
              executionMode: 'ASYNC_NEW_TX',
              config: {
                attachEntity: true,
              },
            },
          ],
        },
      ],
    },
    OUTCOME_RECORDED: {
      transitions: [
        {
          name: 'ENTER_MONITORING',
          next: 'ONGOING_MONITORING',
          manual: false,
          disabled: false,
        },
      ],
    },
    ONGOING_MONITORING: {
      transitions: [
        {
          name: 'REASSESS_ALERT',
          next: 'POLICY_GATING',
          manual: false,
          disabled: false,
          criterion: {
            type: 'simple',
            jsonPath: '$.hasNewMonitoringTrigger',
            operation: 'EQUALS',
            value: true,
          },
        },
      ],
    },
    BLOCKED: {
      transitions: [],
    },
    ROLLED_BACK: {
      transitions: [],
    },
  },
} satisfies CyodaWorkflowConfig;

export default agenticAmlTriageWorkflow;
