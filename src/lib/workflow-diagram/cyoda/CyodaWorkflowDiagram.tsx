import { useEffect, useMemo, useState } from 'react';
import { parseCyodaWorkflowInput } from './parseCyodaWorkflow';
import { getCyodaDensityProfile, layoutCyodaWorkflowWithElk } from './layoutWithElk';
import type { CyodaDiagramDensity, CyodaElkDirection } from './layoutWithElk';
import type {
  CyodaDisplayEdgeKind,
  CyodaDisplayNodeTone,
  CyodaLaidOutEdge,
  CyodaLaidOutNode,
  CyodaWorkflowInput,
  CyodaWorkflowLayout,
} from './cyodaTypes';

interface CyodaWorkflowDiagramProps {
  input: CyodaWorkflowInput;
  className?: string;
  minSvgWidth?: number;
  showDisabledTransitions?: boolean;
  direction?: CyodaElkDirection;
  density?: CyodaDiagramDensity;
}

const visualDensityProfiles: Record<CyodaDiagramDensity, {
  nodeSubtitleClass: string;
  nodeTitleClass: string;
  edgeTitleClass: string;
  badgeTextClass: string;
  nodeSubtitleY: number;
  nodeTitleStartY: number;
  nodeTitleLineHeight: number;
  edgeTitleTop: number;
  edgeTitleLineHeight: number;
  badgeTitleGap: number;
  badgeTextOffsetY: number;
  nodeRadius: number;
  terminalRadius: number;
  terminalInset: number;
  terminalInnerRadius: number;
  nodeStrokeWidth: number;
  initialStrokeWidth: number;
  edgeStrokeWidth: number;
  softEdgeStrokeWidth: number;
}> = {
  compact: {
    nodeSubtitleClass: 'text-[8px] font-bold uppercase tracking-[0.12em]',
    nodeTitleClass: 'text-[11px] font-bold tracking-[0.01em]',
    edgeTitleClass: 'fill-slate-600 text-[8px] font-bold tracking-[0.01em]',
    badgeTextClass: 'fill-slate-600 text-[7px] font-bold',
    nodeSubtitleY: 18,
    nodeTitleStartY: 39,
    nodeTitleLineHeight: 13,
    edgeTitleTop: 12,
    edgeTitleLineHeight: 11,
    badgeTitleGap: 2,
    badgeTextOffsetY: 9.5,
    nodeRadius: 8,
    terminalRadius: 18,
    terminalInset: 3,
    terminalInnerRadius: 15,
    nodeStrokeWidth: 1.35,
    initialStrokeWidth: 1.65,
    edgeStrokeWidth: 1.8,
    softEdgeStrokeWidth: 1.5,
  },
  comfortable: {
    nodeSubtitleClass: 'text-[9px] font-bold uppercase tracking-[0.14em]',
    nodeTitleClass: 'text-[12px] font-bold tracking-[0.02em]',
    edgeTitleClass: 'fill-slate-600 text-[9px] font-bold tracking-[0.02em]',
    badgeTextClass: 'fill-slate-600 text-[7.5px] font-bold',
    nodeSubtitleY: 22,
    nodeTitleStartY: 47,
    nodeTitleLineHeight: 15,
    edgeTitleTop: 15,
    edgeTitleLineHeight: 13,
    badgeTitleGap: 3,
    badgeTextOffsetY: 10.5,
    nodeRadius: 10,
    terminalRadius: 22,
    terminalInset: 3,
    terminalInnerRadius: 18,
    nodeStrokeWidth: 1.55,
    initialStrokeWidth: 1.9,
    edgeStrokeWidth: 2,
    softEdgeStrokeWidth: 1.7,
  },
};

const nodeToneClasses: Record<CyodaDisplayNodeTone, { rect: string; text: string; meta: string }> = {
  default: {
    rect: 'fill-teal-50 stroke-teal-400',
    text: 'fill-slate-900',
    meta: 'fill-teal-700',
  },
  initial: {
    rect: 'fill-emerald-100 stroke-emerald-600',
    text: 'fill-emerald-950',
    meta: 'fill-emerald-700',
  },
  terminal: {
    rect: 'fill-rose-50 stroke-rose-300',
    text: 'fill-rose-950',
    meta: 'fill-rose-700',
  },
  manual: {
    rect: 'fill-violet-50 stroke-violet-300',
    text: 'fill-violet-950',
    meta: 'fill-violet-700',
  },
  processing: {
    rect: 'fill-sky-50 stroke-sky-300',
    text: 'fill-sky-950',
    meta: 'fill-sky-700',
  },
};

const edgeToneClasses: Record<CyodaDisplayEdgeKind, string> = {
  automated: 'stroke-slate-500',
  manual: 'stroke-violet-500',
  conditional: 'stroke-amber-500',
  processing: 'stroke-sky-500',
  terminal: 'stroke-rose-400',
  loop: 'stroke-teal-500',
  disabled: 'stroke-slate-300',
};

const isDashedEdge = (kind: CyodaDisplayEdgeKind) =>
  kind === 'manual' || kind === 'terminal' || kind === 'loop' || kind === 'disabled';

const LegendSwatch = ({ type }: { type: 'state' | 'initial' | 'manual' | 'terminal' | 'criterion' | 'processor' }) => {
  if (type === 'initial') return <span className="h-2.5 w-2.5 rounded-[3px] border border-emerald-600 bg-emerald-100" />;
  if (type === 'manual') return <span className="h-px w-4 border-t border-dashed border-violet-500" />;
  if (type === 'terminal') return <span className="h-2.5 w-2.5 rounded-full border border-rose-300 bg-rose-50" />;
  if (type === 'criterion') return <span className="h-2.5 w-3.5 rounded-full border border-amber-300 bg-amber-50" />;
  if (type === 'processor') return <span className="h-2.5 w-3.5 rounded-full border border-sky-300 bg-sky-50" />;
  return <span className="h-2.5 w-2.5 rounded-[3px] border border-teal-400 bg-teal-50" />;
};

const CyodaNode = ({ node, density }: { node: CyodaLaidOutNode; density: CyodaDiagramDensity }) => {
  const tone = nodeToneClasses[node.tone];
  const visual = visualDensityProfiles[density];
  const titleStartY = node.y + visual.nodeTitleStartY;

  return (
    <g>
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        rx={node.isTerminal ? visual.terminalRadius : visual.nodeRadius}
        className={tone.rect}
        strokeWidth={node.tone === 'initial' ? visual.initialStrokeWidth : visual.nodeStrokeWidth}
      />
      {node.isTerminal && (
        <rect
          x={node.x + visual.terminalInset}
          y={node.y + visual.terminalInset}
          width={node.width - visual.terminalInset * 2}
          height={node.height - visual.terminalInset * 2}
          rx={visual.terminalInnerRadius}
          className="fill-none stroke-white/75"
          strokeDasharray="2 2"
          strokeWidth="0.8"
        />
      )}
      <text x={node.x + node.width / 2} y={node.y + visual.nodeSubtitleY} textAnchor="middle" className={`${tone.meta} ${visual.nodeSubtitleClass}`}>
        {node.subtitle}
      </text>
      {node.titleLines.map((line, index) => (
        <text
          key={`${node.id}-${line}-${index}`}
          x={node.x + node.width / 2}
          y={titleStartY + index * visual.nodeTitleLineHeight}
          textAnchor="middle"
          className={`${tone.text} ${visual.nodeTitleClass}`}
        >
          {line}
        </text>
      ))}
    </g>
  );
};

const CyodaEdgeLabel = ({ edge, density }: { edge: CyodaLaidOutEdge; density: CyodaDiagramDensity }) => {
  const densityProfile = getCyodaDensityProfile(density);
  const visual = visualDensityProfiles[density];
  const { labelLayout } = edge;
  const titleStartY = labelLayout.y - labelLayout.height / 2 + visual.edgeTitleTop;
  const badgeStartY = titleStartY + labelLayout.titleLines.length * visual.edgeTitleLineHeight + visual.badgeTitleGap;
  const badgeWidths = labelLayout.badges.map((badge) =>
    Math.max(densityProfile.badgeMinWidth, Math.ceil(badge.length * 5.1 + 12)),
  );
  const totalBadgeWidth = badgeWidths.reduce((sum, width) => sum + width, 0) + Math.max(0, badgeWidths.length - 1) * densityProfile.badgeGap;
  let badgeCursor = labelLayout.x - totalBadgeWidth / 2;

  return (
    <g pointerEvents="none">
      <title>
        {[edge.label, edge.criterionSummary?.detail, edge.processorSummary?.detail].filter(Boolean).join(' · ')}
      </title>
      <rect
        x={labelLayout.x - labelLayout.width / 2}
        y={labelLayout.y - labelLayout.height / 2}
        width={labelLayout.width}
        height={labelLayout.height}
        rx={density === 'compact' ? 10 : 13}
        className="fill-white/95 stroke-slate-200"
      />
      {labelLayout.titleLines.map((line, index) => (
        <text
          key={`${edge.id}-label-${line}-${index}`}
          x={labelLayout.x}
          y={titleStartY + index * visual.edgeTitleLineHeight}
          textAnchor="middle"
          className={visual.edgeTitleClass}
        >
          {line}
        </text>
      ))}
      {labelLayout.badges.map((badge, index) => {
        const width = badgeWidths[index];
        const x = badgeCursor;
        badgeCursor += width + densityProfile.badgeGap;

        return (
          <g key={`${edge.id}-${badge}-${index}`}>
            <rect
              x={x}
              y={badgeStartY}
              width={width}
              height={densityProfile.badgeHeight}
              rx={densityProfile.badgeHeight / 2}
              className={badge === 'manual'
                ? 'fill-violet-50 stroke-violet-200'
                : badge === 'scheduled' || badge === 'processor' || badge === 'SYNC' || badge.includes('processors')
                  ? 'fill-sky-50 stroke-sky-200'
                  : badge === 'disabled'
                    ? 'fill-slate-50 stroke-slate-200'
                    : 'fill-amber-50 stroke-amber-200'}
            />
            <text
              x={x + width / 2}
              y={badgeStartY + visual.badgeTextOffsetY}
              textAnchor="middle"
              className={visual.badgeTextClass}
            >
              {badge}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const CyodaEdge = ({
  edge,
  markerId,
  density,
}: {
  edge: CyodaLaidOutEdge;
  markerId: string;
  density: CyodaDiagramDensity;
}) => {
  const visual = visualDensityProfiles[density];

  return (
    <path
      d={edge.path}
      className={`${edgeToneClasses[edge.kind]} fill-none`}
      strokeWidth={edge.kind === 'automated' || edge.kind === 'conditional' || edge.kind === 'processing' ? visual.edgeStrokeWidth : visual.softEdgeStrokeWidth}
      strokeDasharray={isDashedEdge(edge.kind) ? '7 6' : undefined}
      markerEnd={`url(#${markerId})`}
    />
  );
};

export const CyodaWorkflowDiagram = ({
  input,
  className,
  minSvgWidth = 1040,
  showDisabledTransitions = false,
  direction = 'RIGHT',
  density = 'compact',
}: CyodaWorkflowDiagramProps) => {
  const graph = useMemo(
    () => parseCyodaWorkflowInput(input, { showDisabledTransitions }),
    [input, showDisabledTransitions],
  );
  const [layout, setLayout] = useState<CyodaWorkflowLayout | null>(null);
  const [layoutError, setLayoutError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLayout(null);
    setLayoutError(null);

    layoutCyodaWorkflowWithElk(graph, { direction, density })
      .then((nextLayout) => {
        if (!cancelled) setLayout(nextLayout);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLayoutError(error instanceof Error ? error.message : 'Unable to compute workflow layout.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [graph, direction, density]);

  const markerId = `${graph.id}-cyoda-arrow`;
  const svgMinWidth = layout ? Math.min(layout.width, minSvgWidth) : minSvgWidth;
  const blockingErrors = graph.warnings.filter((warning) => warning.severity === 'error');

  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-white shadow-sm ${className ?? ''}`}>
      <div className="flex flex-col gap-3 border-b border-border/70 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            CYODA WORKFLOW JSON
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{graph.title}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
          <span>{graph.stats.stateCount} states</span>
          <span>{graph.stats.visibleTransitionCount} transitions</span>
          <span>{graph.stats.terminalCount} terminals</span>
          <span>{graph.stats.manualTransitionCount} manual</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-b border-border/50 px-5 py-3 text-[11px] text-muted-foreground">
        {[
          ['state', 'State'],
          ['initial', 'Initial'],
          ['manual', 'Manual'],
          ['terminal', 'Terminal'],
          ['criterion', 'Criterion'],
          ['processor', 'Processor'],
        ].map(([type, label]) => (
          <span key={type} className="inline-flex items-center gap-1.5">
            <LegendSwatch type={type as 'state' | 'initial' | 'manual' | 'terminal' | 'criterion' | 'processor'} />
            {label}
          </span>
        ))}
      </div>

      {graph.description && (
        <p className="border-b border-border/50 px-5 py-3 text-sm leading-relaxed text-muted-foreground">
          {graph.description}
        </p>
      )}

      {blockingErrors.length > 0 && (
        <div className="border-b border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-900">
          {blockingErrors[0].message}
        </div>
      )}

      <div className="overflow-x-auto">
        {!layout && !layoutError && (
          <div className="flex min-h-[420px] items-center justify-center text-sm text-muted-foreground">
            Computing workflow layout...
          </div>
        )}

        {layoutError && (
          <div className="flex min-h-[420px] items-center justify-center px-5 text-sm text-rose-700">
            {layoutError}
          </div>
        )}

        {layout && !layoutError && (
          <svg
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            role="img"
            aria-labelledby={`${graph.id}-title ${graph.id}-description`}
            preserveAspectRatio="xMidYMin meet"
            style={{ width: '100%', height: 'auto', minWidth: svgMinWidth, maxWidth: layout.width, margin: '0 auto', display: 'block' }}
          >
            <title id={`${graph.id}-title`}>{graph.title}</title>
            <desc id={`${graph.id}-description`}>
              {graph.description ?? 'Cyoda workflow graph rendered from workflow JSON.'}
            </desc>
            <defs>
              <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500" />
              </marker>
            </defs>
            <rect x={0} y={0} width={layout.width} height={layout.height} className="fill-white" />

            <g>
              {layout.edges.map((edge) => (
                <CyodaEdge key={edge.id} edge={edge} markerId={markerId} density={density} />
              ))}
            </g>

            <g>
              {layout.nodes.map((node) => (
                <CyodaNode key={node.id} node={node} density={density} />
              ))}
            </g>

            <g>
              {layout.edges.map((edge) => (
                <CyodaEdgeLabel key={`${edge.id}-label`} edge={edge} density={density} />
              ))}
            </g>
          </svg>
        )}
      </div>
    </div>
  );
};

export default CyodaWorkflowDiagram;
