import { edgeToneClasses } from '../tokens';
import type { EdgeTone, LaidOutEdge } from '../types';

export const WorkflowEdge = ({ edgeLayout, markerId }: { edgeLayout: LaidOutEdge; markerId: string }) => {
  const { edge, path } = edgeLayout;
  const tone = (edge.tone ?? (edge.kind === 'main' ? 'primary' : edge.kind === 'loop' ? 'loop' : edge.kind === 'annotation' ? 'annotation' : edge.kind === 'exception' ? 'exception' : 'branch')) as EdgeTone;
  const isDashed = edge.kind === 'loop' || edge.kind === 'annotation' || edge.kind === 'exception';

  return (
    <g>
      <path
        d={path}
        className={`${edgeToneClasses[tone]} fill-none`}
        strokeWidth={edge.kind === 'main' ? 2 : 1.6}
        strokeDasharray={isDashed ? '7 6' : undefined}
        markerEnd={`url(#${markerId})`}
      />
    </g>
  );
};
