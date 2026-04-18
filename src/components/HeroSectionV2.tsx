import { useLocation } from 'react-router-dom';
import * as React from 'react';
import { ArrowRight, GitBranch, ShieldCheck, Activity } from 'lucide-react';
import { trackCtaConversion } from '@/utils/analytics';

type HeroProps = {
  renderHeadings?: boolean;
  h1?: string;
  h2?: string;
  h3?: string;
  className?: string;
  defaultHeadingAs?: 'h1' | 'h2';
};

/**
 * Architectural mesh — a dark-surface background pattern.
 * Visible nodes, a glowing hub, and sweeping arcs that read as
 * "distributed system diagram" without being literal.
 *
 * Unlike the light-mode ArchitectureField, this is designed to
 * be *seen*: stroke widths 1.2–1.6, opacities 0.35–0.7, and a
 * radial glow behind the hub node for depth.
 */
const ArchitectureMesh = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 600"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 w-full h-full"
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="hsl(175, 80%, 60%)" stopOpacity="0.45" />
        <stop offset="55%" stopColor="hsl(175, 80%, 60%)" stopOpacity="0.06" />
        <stop offset="100%" stopColor="hsl(175, 80%, 60%)" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="meshLine" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(175, 60%, 55%)" stopOpacity="0.08" />
        <stop offset="50%" stopColor="hsl(175, 70%, 60%)" stopOpacity="0.7" />
        <stop offset="100%" stopColor="hsl(175, 60%, 55%)" stopOpacity="0.08" />
      </linearGradient>
    </defs>

    {/* Hub glow — sits behind everything */}
    <circle cx="240" cy="290" r="260" fill="url(#hubGlow)" />

    {/* Faint background grid */}
    <g stroke="hsl(220, 20%, 30%)" strokeWidth="0.5" opacity="0.35">
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="600" />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 100} x2="1200" y2={i * 100} />
      ))}
    </g>

    {/* Sweeping structural arcs */}
    <path
      d="M 0 400 A 720 720 0 0 1 820 90"
      stroke="hsl(175, 60%, 50%)"
      strokeWidth="1.4"
      strokeOpacity="0.5"
    />
    <path
      d="M 380 600 A 620 620 0 0 1 1200 230"
      stroke="hsl(175, 50%, 45%)"
      strokeWidth="1.2"
      strokeOpacity="0.35"
    />

    {/* Inter-node connections */}
    <g stroke="url(#meshLine)" strokeWidth="1.6">
      <line x1="240" y1="290" x2="560" y2="180" />
      <line x1="240" y1="290" x2="560" y2="400" />
      <line x1="560" y1="180" x2="870" y2="120" />
      <line x1="560" y1="400" x2="870" y2="460" />
      <line x1="870" y1="120" x2="1110" y2="290" />
      <line x1="870" y1="460" x2="1110" y2="290" />
    </g>
    <line
      x1="560" y1="180" x2="560" y2="400"
      stroke="hsl(175, 55%, 50%)" strokeWidth="1.1" strokeOpacity="0.35"
    />

    {/* Dashed orbit around hub */}
    <circle
      cx="240" cy="290" r="130"
      stroke="hsl(175, 60%, 55%)"
      strokeWidth="1.2"
      strokeOpacity="0.5"
      strokeDasharray="6 9"
    />

    {/* Nodes — concentric rings + filled centre + glow halo on hub */}
    {[
      { cx: 240,  cy: 290, r: 18, hub: true },
      { cx: 560,  cy: 180, r: 12 },
      { cx: 560,  cy: 400, r: 12 },
      { cx: 870,  cy: 120, r: 10 },
      { cx: 870,  cy: 460, r: 10 },
      { cx: 1110, cy: 290, r: 14 },
    ].map((n, i) => (
      <g key={i}>
        {n.hub && (
          <circle
            cx={n.cx} cy={n.cy} r={n.r + 22}
            stroke="hsl(175, 80%, 60%)" strokeWidth="1" strokeOpacity="0.3"
          />
        )}
        <circle
          cx={n.cx} cy={n.cy} r={n.r + 8}
          stroke="hsl(175, 65%, 55%)" strokeWidth="1" strokeOpacity="0.4"
        />
        <circle
          cx={n.cx} cy={n.cy} r={n.r}
          stroke="hsl(175, 75%, 65%)" strokeWidth="1.5"
        />
        <circle
          cx={n.cx} cy={n.cy} r={n.r * 0.4}
          fill="hsl(175, 85%, 65%)"
        />
      </g>
    ))}
  </svg>
);

/**
 * Right-column product artefact — a stylized entity state machine card.
 * Shows what Cyoda actually models: an entity (a loan application) moving
 * through states with timestamps, a "current" state, and an audit footer.
 * Purely presentational — no live data, but reads as a screenshot from
 * an operator console.
 */
const StateMachineArtefact = () => {
  const states = [
    { label: 'Submitted',    ts: '09:14:02', status: 'done'    as const },
    { label: 'KYC Verified', ts: '09:14:08', status: 'done'    as const },
    { label: 'Underwriting', ts: '09:17:31', status: 'current' as const },
    { label: 'Approval',     ts: '—',        status: 'pending' as const },
    { label: 'Settlement',   ts: '—',        status: 'pending' as const },
  ];

  return (
    <div className="relative w-full max-w-[460px] mx-auto">
      {/* Ambient halo */}
      <div className="absolute -inset-6 rounded-3xl bg-[hsl(175,70%,55%)] opacity-20 blur-3xl pointer-events-none" />

      <div className="relative rounded-2xl border border-[hsl(175,30%,40%)]/60 bg-[hsl(220,30%,11%)]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Top status bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/25">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[hsl(175,75%,55%)] animate-pulse" />
            <span className="text-[11px] font-mono text-white/60 tracking-wider">
              entity:loan_application
            </span>
          </div>
          <span className="text-[11px] font-mono text-white/40">id 0x4f2a…918c</span>
        </div>

        {/* States */}
        <div className="px-5 py-5 space-y-2.5">
          {states.map((s, i) => {
            const isCurrent = s.status === 'current';
            const isDone    = s.status === 'done';
            return (
              <div
                key={s.label}
                className={
                  isCurrent
                    ? 'flex items-center gap-3 rounded-lg px-3 py-2 bg-[hsl(175,55%,45%)]/15 border border-[hsl(175,65%,55%)]/40'
                    : isDone
                    ? 'flex items-center gap-3 rounded-lg px-3 py-2 bg-white/[0.03] border border-white/5'
                    : 'flex items-center gap-3 rounded-lg px-3 py-2 opacity-50 border border-transparent'
                }
              >
                <div
                  className={
                    isCurrent
                      ? 'shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-[hsl(175,75%,55%)] text-[hsl(220,40%,10%)]'
                      : isDone
                      ? 'shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-[hsl(175,40%,30%)] text-[hsl(175,75%,75%)]'
                      : 'shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-white/10 text-white/40'
                  }
                >
                  {isDone ? '✓' : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={
                      isCurrent
                        ? 'text-sm font-medium text-white'
                        : isDone
                        ? 'text-sm font-medium text-white/85'
                        : 'text-sm font-medium text-white/40'
                    }
                  >
                    {s.label}
                  </div>
                </div>
                <div className="text-[11px] font-mono text-white/40 tabular-nums">{s.ts}</div>
              </div>
            );
          })}
        </div>

        {/* Audit footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-black/35 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-white/55">
            <ShieldCheck className="w-3.5 h-3.5 text-[hsl(175,60%,55%)]" />
            <span>Immutable audit trail</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-white/45">
            <Activity className="w-3 h-3" />
            <span>14 events</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroSectionV2: React.FC<HeroProps> = ({
  renderHeadings = false,
  h1,
  defaultHeadingAs = 'h1',
}) => {
  const location = useLocation();

  const getPageVariant = (): 'home' | 'dev' | 'cto' | 'products' | 'pricing' => {
    const path = location.pathname;
    if (path === '/dev') return 'dev';
    if (path === '/cto') return 'cto';
    if (path === '/products') return 'products';
    if (path === '/pricing') return 'pricing';
    return 'home';
  };

  const handleContactSales = () => {
    trackCtaConversion({
      location: 'hero',
      page_variant: getPageVariant(),
      cta: 'talk_to_us',
      url: '/contact',
    });
    window.location.href = '/contact';
  };

  const HeadingTag = defaultHeadingAs;
  const headingClasses =
    'text-4xl md:text-5xl lg:text-[3.75rem] font-extrabold tracking-tight text-white leading-[1.05]';

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 70% 55% at 22% 48%, hsl(175, 50%, 18%) 0%, transparent 60%),
          linear-gradient(180deg, hsl(220, 35%, 9%) 0%, hsl(220, 38%, 11%) 100%)
        `,
      }}
    >
      <ArchitectureMesh />

      <div className="relative z-10 container mx-auto px-4 py-20 md:py-24 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">

          {/* Left column — copy + CTAs */}
          <div className="lg:col-span-7 max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(175,40%,40%)]/40 bg-[hsl(175,55%,45%)]/10 px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(175,75%,55%)]" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(175,70%,78%)]">
                Enterprise EDBMS
              </span>
            </div>

            {/* H1 */}
            {renderHeadings && h1 ? (
              <HeadingTag className={headingClasses}>{h1}</HeadingTag>
            ) : (
              <HeadingTag className={headingClasses}>
                Backend systems
                <br />
                <span className="bg-gradient-to-r from-[hsl(175,75%,65%)] to-[hsl(175,55%,50%)] bg-clip-text text-transparent">
                  built to be audited.
                </span>
              </HeadingTag>
            )}

            {/* Subtitle */}
            <p className="mt-6 text-lg md:text-xl text-white/70 leading-relaxed max-w-xl">
              Cyoda unifies state, workflow, transactions, events, and history in
              one entity model — so regulated and mission-critical systems don't
              need duct tape to stay consistent.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleContactSales}
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(175,70%,50%)] hover:bg-[hsl(175,72%,56%)] px-7 py-3.5 text-sm font-semibold text-[hsl(220,40%,10%)] shadow-lg shadow-[hsl(175,70%,40%)]/30 transition-all hover:shadow-xl hover:shadow-[hsl(175,70%,40%)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(175,70%,60%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(220,35%,9%)]"
              >
                Talk to us
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <a
                href="https://cyoda.org"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 hover:border-white/40 bg-white/[0.04] hover:bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(220,35%,9%)]"
              >
                <GitBranch className="w-4 h-4" />
                Open source, run it yourself
              </a>
            </div>

            {/* Inline trust strip */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] text-white/55">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[hsl(175,60%,58%)]" />
                <span>In regulated production since 2017</span>
              </div>
              <div className="hidden sm:block w-px h-3 bg-white/15" />
              <div className="font-mono text-[11px] tracking-wide text-white/50">
                PostgreSQL · Cassandra · gRPC
              </div>
              <div className="hidden sm:block w-px h-3 bg-white/15" />
              <div>Apache 2.0 open core</div>
            </div>
          </div>

          {/* Right column — state machine artefact */}
          <div className="lg:col-span-5">
            <StateMachineArtefact />
          </div>
        </div>
      </div>

      {/* Bottom fade to blend into next (light) section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
};

export default HeroSectionV2;
