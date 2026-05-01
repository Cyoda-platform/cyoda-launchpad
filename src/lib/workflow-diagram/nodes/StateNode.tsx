import { nodeTextClasses, nodeToneClasses } from '../tokens';
import type { LaidOutNode, NodeTone } from '../types';

export const StateNode = ({ nodeLayout }: { nodeLayout: LaidOutNode }) => {
  const { node, box, center, titleLines, bodyLines } = nodeLayout;
  const tone = (node.tone ?? 'default') as NodeTone;
  const textTone = nodeTextClasses[tone];
  const titleStartY = box.y + (node.subtitle ? 48 : 34);
  const bodyStartY = titleStartY + titleLines.length * 16 + 10;

  return (
    <g>
      <rect
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        rx="10"
        className={nodeToneClasses[tone]}
        strokeWidth={tone === 'active' || tone === 'success' ? '1.8' : '1.5'}
      />
      {node.subtitle && (
        <text x={center.x} y={box.y + 22} textAnchor="middle" className={`${textTone.meta} text-[10px] font-semibold uppercase tracking-[0.14em]`}>
          {node.subtitle}
        </text>
      )}
      {titleLines.map((line, index) => (
        <text key={`${node.id}-title-${line}`} x={center.x} y={titleStartY + index * 16} textAnchor="middle" className={`${textTone.title} text-[13px] font-semibold`}>
          {line}
        </text>
      ))}
      {bodyLines.map((line, index) => (
        <text key={`${node.id}-body-${line}`} x={center.x} y={bodyStartY + index * 14} textAnchor="middle" className="fill-slate-600 text-[11px]">
          {line}
        </text>
      ))}
      {node.processLabel && (
        <text x={center.x} y={box.y + box.height - 14} textAnchor="middle" className="fill-slate-500 text-[9px] font-semibold tracking-[0.12em]">
          {node.processLabel}
        </text>
      )}
    </g>
  );
};
