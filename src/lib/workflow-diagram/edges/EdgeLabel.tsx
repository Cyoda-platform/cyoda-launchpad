import type { LaidOutEdge } from '../types';

export const EdgeLabel = ({ edgeLayout }: { edgeLayout: LaidOutEdge }) => {
  if (!edgeLayout.label) return null;

  const { label } = edgeLayout;

  return (
    <g pointerEvents="none">
      <rect
        x={label.x - label.width / 2}
        y={label.y - label.height / 2}
        width={label.width}
        height={label.height}
        rx={label.height / 2}
        className="fill-white/95 stroke-slate-200"
      />
      <text x={label.x} y={label.y + 3} textAnchor={label.textAnchor} className="fill-slate-600 text-[10px] font-semibold">
        {label.text}
      </text>
    </g>
  );
};
