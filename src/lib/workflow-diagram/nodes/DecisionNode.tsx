import type { LaidOutNode } from '../types';

export const DecisionNode = ({ nodeLayout }: { nodeLayout: LaidOutNode }) => {
  const { node, box, center, titleLines } = nodeLayout;
  const points = [
    `${center.x},${box.y}`,
    `${box.x + box.width},${center.y}`,
    `${center.x},${box.y + box.height}`,
    `${box.x},${center.y}`,
  ].join(' ');

  return (
    <g>
      <polygon points={points} className="fill-amber-50 stroke-amber-300" strokeWidth="1.5" />
      {titleLines.map((line, index) => (
        <text
          key={`${node.id}-title-${line}`}
          x={center.x}
          y={center.y - (titleLines.length - 1) * 8 + index * 16}
          textAnchor="middle"
          className="fill-amber-900 text-[13px] font-semibold"
        >
          {line}
        </text>
      ))}
    </g>
  );
};
