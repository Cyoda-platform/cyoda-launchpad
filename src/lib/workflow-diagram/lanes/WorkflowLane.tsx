import { laneToneClasses } from '../tokens';
import type { LaidOutLane } from '../types';

export const WorkflowLane = ({ laneLayout }: { laneLayout: LaidOutLane }) => {
  const { lane, box, titleY, descriptionY } = laneLayout;
  const tone = lane.tone ?? (lane.layout?.containsMainBaseline ? 'primary' : 'default');

  return (
    <g>
      <rect x={box.x} y={box.y} width={box.width} height={box.height} rx="18" className={laneToneClasses[tone]} />
      <text x={box.x + 24} y={titleY} className="fill-slate-700 text-[13px] font-bold tracking-[0.16em]">
        {lane.title}
      </text>
      {lane.description && (
        <text x={box.x + 24} y={descriptionY} className="fill-slate-500 text-[12px]">
          {lane.description}
        </text>
      )}
    </g>
  );
};
