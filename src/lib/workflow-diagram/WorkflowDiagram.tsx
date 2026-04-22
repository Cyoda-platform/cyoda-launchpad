import { useMemo } from 'react';
import { computeWorkflowDiagramLayout } from './layout';
import { defaultLegend, labelToneClasses, nodeToneClasses } from './tokens';
import { EdgeLabel } from './edges/EdgeLabel';
import { WorkflowEdge } from './edges/WorkflowEdge';
import { WorkflowLane } from './lanes/WorkflowLane';
import { WorkflowNode } from './nodes/WorkflowNode';
import type { LegendItemSpec, WorkflowDiagramSpec } from './types';

interface WorkflowDiagramProps {
  spec: WorkflowDiagramSpec;
  className?: string;
  minSvgWidth?: number;
}

const LegendSwatch = ({ item }: { item: LegendItemSpec }) => {
  if (item.kind === 'decision') {
    return <span className="h-2.5 w-2.5 rotate-45 rounded-[1px] border border-amber-300 bg-amber-50" />;
  }

  if (item.kind === 'process') {
    return <span className="h-2.5 w-2.5 rounded-[3px] border border-dashed border-slate-300 bg-slate-50" />;
  }

  if (item.kind === 'terminal') {
    return <span className={`h-2.5 w-2.5 rounded-[3px] border ${nodeToneClasses.danger}`} />;
  }

  if (item.kind === 'edge') {
    return <span className="h-px w-4 bg-teal-500" />;
  }

  return <span className={`h-2.5 w-2.5 rounded-[3px] border ${nodeToneClasses.default}`} />;
};

export const WorkflowDiagram = ({ spec, className, minSvgWidth = 960 }: WorkflowDiagramProps) => {
  const layout = useMemo(() => computeWorkflowDiagramLayout(spec), [spec]);
  const markerId = `${spec.id}-arrow`;
  const legend = spec.legend ?? defaultLegend;
  const svgMinWidth = Math.min(
    layout.viewBox.width,
    Math.max(minSvgWidth, Math.round(layout.viewBox.width * 0.55)),
  );

  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-white shadow-sm ${className ?? ''}`}>
      <div className="flex flex-col gap-3 border-b border-border/70 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-baseline gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {spec.subtitle ?? 'Entity workflow'}
          </span>
          {spec.entityName && <span className="text-sm font-semibold text-foreground">{spec.entityName}</span>}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
          {legend.map((item) => (
            <span key={item.id} className="inline-flex items-center gap-1.5">
              <LegendSwatch item={item} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`${layout.viewBox.x} ${layout.viewBox.y} ${layout.viewBox.width} ${layout.viewBox.height}`}
          role="img"
          aria-labelledby={`${spec.id}-title ${spec.id}-description`}
          preserveAspectRatio="xMidYMin meet"
          style={{ width: '100%', height: 'auto', minWidth: svgMinWidth }}
        >
          <title id={`${spec.id}-title`}>{spec.title}</title>
          {spec.description && <desc id={`${spec.id}-description`}>{spec.description}</desc>}
          <defs>
            <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500" />
            </marker>
          </defs>

          <rect x={layout.viewBox.x} y={layout.viewBox.y} width={layout.viewBox.width} height={layout.viewBox.height} className="fill-white" />

          {layout.lanes.map((laneLayout) => (
            <WorkflowLane key={laneLayout.lane.id} laneLayout={laneLayout} />
          ))}

          {layout.edges.map((edgeLayout) => (
            <WorkflowEdge key={edgeLayout.edge.id} edgeLayout={edgeLayout} markerId={markerId} />
          ))}

          {layout.nodes.map((nodeLayout) => (
            <WorkflowNode key={nodeLayout.node.id} nodeLayout={nodeLayout} />
          ))}

          {layout.edges.map((edgeLayout) => (
            <EdgeLabel key={`${edgeLayout.edge.id}-label`} edgeLayout={edgeLayout} />
          ))}

          {layout.labels.map((labelLayout) => (
            <text
              key={labelLayout.label.id}
              x={labelLayout.x}
              y={labelLayout.y}
              textAnchor={labelLayout.textAnchor}
              className={labelToneClasses[labelLayout.label.tone ?? 'hint']}
            >
              {labelLayout.lines.map((line, index) => (
                <tspan key={`${labelLayout.label.id}-${line}`} x={labelLayout.x} dy={index === 0 ? 0 : 15}>
                  {line}
                </tspan>
              ))}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default WorkflowDiagram;
