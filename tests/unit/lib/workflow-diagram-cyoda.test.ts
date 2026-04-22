import { describe, expect, it } from 'vitest';
import { agenticAmlTriageWorkflow } from '@/data/workflows/agenticAmlTriageWorkflow';
import {
  layoutCyodaWorkflowWithElk,
  parseCyodaWorkflowInput,
  summarizeProcessors,
} from '@/lib/workflow-diagram/cyoda';
import type { CyodaWorkflowConfig } from '@/lib/workflow-diagram/cyoda';

describe('Cyoda workflow diagram parser', () => {
  it('parses the AML triage workflow without changing raw labels', () => {
    const graph = parseCyodaWorkflowInput(agenticAmlTriageWorkflow);

    expect(graph.title).toBe('Agentic AI AML Triage Workflow');
    expect(graph.workflow.initialState).toBe('ALERT_INGESTED');
    expect(graph.stats.stateCount).toBe(10);
    expect(graph.stats.transitionCount).toBe(13);
    expect(graph.stats.visibleTransitionCount).toBe(13);
    expect(graph.nodes.find((node) => node.id === 'ALERT_INGESTED')?.label).toBe('ALERT_INGESTED');
    expect(graph.edges.find((edge) => edge.label === 'GENERATE_AI_PROPOSAL')?.label).toBe('GENERATE_AI_PROPOSAL');
  });

  it('detects initial, terminal, manual, processor, criterion, and loop semantics', () => {
    const graph = parseCyodaWorkflowInput(agenticAmlTriageWorkflow);

    expect(graph.nodes.find((node) => node.id === 'ALERT_INGESTED')?.isInitial).toBe(true);
    expect(graph.nodes.filter((node) => node.isTerminal).map((node) => node.id).sort()).toEqual(['BLOCKED', 'ROLLED_BACK']);
    expect(graph.edges.filter((edge) => edge.manual).map((edge) => edge.label).sort()).toEqual(['APPROVE_MANUAL', 'REJECT_MANUAL']);
    expect(graph.edges.find((edge) => edge.label === 'VALIDATE_PROPOSAL')?.criterionSummary?.label).toBe('AND · 2');
    expect(graph.edges.find((edge) => edge.label === 'EXECUTE_DISPOSITION')?.processorSummary?.label).toBe('SYNC');
    expect(graph.edges.find((edge) => edge.label === 'ROLLBACK_FAILURE')?.processorSummary?.label).toBe('2 processors');
    expect(graph.edges.find((edge) => edge.label === 'REASSESS_ALERT')?.kind).toBe('loop');
  });

  it('renders the first workflow when a workflow envelope contains multiple workflows', () => {
    const secondWorkflow = {
      ...agenticAmlTriageWorkflow,
      name: 'Second Workflow',
    } satisfies CyodaWorkflowConfig;

    const graph = parseCyodaWorkflowInput({
      entityName: 'Alert',
      modelVersion: 1,
      workflows: [agenticAmlTriageWorkflow, secondWorkflow],
    });

    expect(graph.title).toBe('Agentic AI AML Triage Workflow');
    expect(graph.entityName).toBe('Alert');
    expect(graph.modelVersion).toBe(1);
    expect(graph.warnings.some((warning) => warning.code === 'multiple-workflows')).toBe(true);
  });

  it('hides disabled transitions by default and can show them for debugging', () => {
    const workflow = {
      version: '1.0',
      name: 'Disabled Test',
      initialState: 'OPEN',
      states: {
        OPEN: {
          transitions: [
            { name: 'ACTIVE_PATH', next: 'DONE', manual: false, disabled: false },
            { name: 'DISABLED_PATH', next: 'DONE', manual: false, disabled: true },
          ],
        },
        DONE: { transitions: [] },
      },
    } satisfies CyodaWorkflowConfig;

    expect(parseCyodaWorkflowInput(workflow).edges.map((edge) => edge.label)).toEqual(['ACTIVE_PATH']);
    expect(parseCyodaWorkflowInput(workflow, { showDisabledTransitions: true }).edges.map((edge) => edge.label)).toEqual([
      'ACTIVE_PATH',
      'DISABLED_PATH',
    ]);
  });

  it('summarizes scheduled processors as badges only', () => {
    const summary = summarizeProcessors([
      {
        type: 'scheduled',
        name: 'schedule_timeout',
        config: {
          delayMs: 1000,
          transition: 'TIMEOUT',
        },
      },
    ]);

    expect(summary?.label).toBe('scheduled');
    expect(summary?.hasScheduled).toBe(true);
  });

  it('computes an ELK layout for the AML triage graph', async () => {
    const graph = parseCyodaWorkflowInput(agenticAmlTriageWorkflow);
    const layout = await layoutCyodaWorkflowWithElk(graph);

    expect(layout.nodes).toHaveLength(10);
    expect(layout.edges).toHaveLength(13);
    expect(layout.width).toBeGreaterThan(800);
    expect(layout.height).toBeGreaterThan(300);
    expect(layout.edges.every((edge) => edge.path.startsWith('M '))).toBe(true);
  });
});
