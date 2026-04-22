import { DecisionNode } from './DecisionNode';
import { ProcessNode } from './ProcessNode';
import { StateNode } from './StateNode';
import { TerminalNode } from './TerminalNode';
import type { LaidOutNode } from '../types';

export const WorkflowNode = ({ nodeLayout }: { nodeLayout: LaidOutNode }) => {
  if (nodeLayout.node.kind === 'decision') return <DecisionNode nodeLayout={nodeLayout} />;
  if (nodeLayout.node.kind === 'terminal') return <TerminalNode nodeLayout={nodeLayout} />;
  if (nodeLayout.node.kind === 'process') return <ProcessNode nodeLayout={nodeLayout} />;
  return <StateNode nodeLayout={nodeLayout} />;
};
