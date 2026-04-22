import { nodeTextClasses, nodeToneClasses } from '../tokens';
import type { LaidOutNode, NodeTone } from '../types';

export const ProcessNode = ({ nodeLayout }: { nodeLayout: LaidOutNode }) => {
  const { node, box, center, titleLines } = nodeLayout;
  const tone = (node.tone ?? 'muted') as NodeTone;
  const textTone = nodeTextClasses[tone];
  const titleStartY = box.y + (node.subtitle ? 44 : 28);

  return (
    <g>
      <rect
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        rx="8"
        className={nodeToneClasses[tone]}
        strokeWidth="1.2"
        strokeDasharray="6 4"
      />
      {node.subtitle && (
        <text x={center.x} y={box.y + 20} textAnchor="middle" className={`${textTone.meta} text-[9px] font-semibold uppercase tracking-[0.14em]`}>
          {node.subtitle}
        </text>
      )}
      {titleLines.map((line, index) => (
        <text key={`${node.id}-title-${line}`} x={center.x} y={titleStartY + index * 15} textAnchor="middle" className={`${textTone.title} text-[12px] font-semibold`}>
          {line}
        </text>
      ))}
      {node.processLabel && (
        <text x={center.x} y={box.y + box.height - 12} textAnchor="middle" className="fill-slate-500 text-[9px] font-semibold tracking-[0.12em]">
          {node.processLabel}
        </text>
      )}
    </g>
  );
};
