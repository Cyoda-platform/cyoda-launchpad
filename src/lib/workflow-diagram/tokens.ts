import type { EdgeTone, LabelTone, NodeSizeVariant, NodeTone } from './types';

export const workflowDiagramTokens = {
  spacing: {
    outerX: 48,
    outerTop: 44,
    lanePaddingX: 22,
    laneHeaderHeight: 72,
    laneFooterPadding: 26,
    laneGap: 26,
    rowGap: 34,
    nodeGap: 42,
    labelOffset: 22,
    labelCollisionPadding: 8,
    loopClearance: 88,
    detourClearance: 64,
    laneTitleInsetX: 24,
    laneTitleInsetY: 32,
  },
  nodeSizes: {
    compact: { minWidth: 150, minHeight: 60, titleChars: 18, bodyChars: 26 },
    standard: { minWidth: 158, minHeight: 70, titleChars: 17, bodyChars: 28 },
    wide: { minWidth: 225, minHeight: 86, titleChars: 24, bodyChars: 34 },
    decision: { minWidth: 118, minHeight: 96, titleChars: 12, bodyChars: 20 },
    terminal: { minWidth: 155, minHeight: 72, titleChars: 17, bodyChars: 26 },
    persistent: { minWidth: 198, minHeight: 74, titleChars: 20, bodyChars: 28 },
  } satisfies Record<NodeSizeVariant, { minWidth: number; minHeight: number; titleChars: number; bodyChars: number }>,
  text: {
    widthFactor: 6.5,
    titleLineHeight: 16,
    bodyLineHeight: 14,
  },
};

export const nodeToneClasses: Record<NodeTone, string> = {
  default: 'fill-teal-50 stroke-teal-400',
  active: 'fill-emerald-100 stroke-emerald-600',
  success: 'fill-emerald-100 stroke-emerald-600',
  warning: 'fill-amber-50 stroke-amber-300',
  danger: 'fill-rose-50 stroke-rose-300',
  human: 'fill-violet-50 stroke-violet-300',
  ai: 'fill-sky-50 stroke-sky-300',
  muted: 'fill-slate-50 stroke-slate-300',
};

export const nodeTextClasses: Record<NodeTone, { title: string; meta: string }> = {
  default: { title: 'fill-slate-900', meta: 'fill-teal-700' },
  active: { title: 'fill-slate-900', meta: 'fill-emerald-700' },
  success: { title: 'fill-emerald-900', meta: 'fill-emerald-700' },
  warning: { title: 'fill-amber-900', meta: 'fill-amber-700' },
  danger: { title: 'fill-rose-900', meta: 'fill-rose-700' },
  human: { title: 'fill-violet-950', meta: 'fill-violet-700' },
  ai: { title: 'fill-sky-950', meta: 'fill-sky-700' },
  muted: { title: 'fill-slate-800', meta: 'fill-slate-500' },
};

export const edgeToneClasses: Record<EdgeTone, string> = {
  primary: 'stroke-slate-600',
  soft: 'stroke-slate-300',
  branch: 'stroke-violet-400',
  exception: 'stroke-rose-400',
  loop: 'stroke-teal-500',
  annotation: 'stroke-sky-400',
};

export const laneToneClasses = {
  default: 'fill-slate-50 stroke-slate-200',
  primary: 'fill-teal-50/60 stroke-teal-200',
  muted: 'fill-slate-50 stroke-slate-200',
  warning: 'fill-amber-50/50 stroke-amber-200',
};

export const labelToneClasses: Record<LabelTone, string> = {
  default: 'fill-slate-600 text-[10px] font-semibold',
  muted: 'fill-slate-500 text-[12px] font-semibold',
  boundary: 'fill-slate-600 text-[11px] font-bold uppercase tracking-[0.16em]',
  hint: 'fill-slate-500 text-[12px] font-semibold',
  callout: 'fill-teal-700 text-[12px] font-bold',
};

export const defaultLegend = [
  { id: 'state', label: 'State', kind: 'state' as const, tone: 'default' as const },
  { id: 'decision', label: 'Criterion', kind: 'decision' as const, tone: 'warning' as const },
  { id: 'process', label: 'Process', kind: 'process' as const, tone: 'muted' as const },
  { id: 'terminal', label: 'Terminal', kind: 'terminal' as const, tone: 'danger' as const },
];
