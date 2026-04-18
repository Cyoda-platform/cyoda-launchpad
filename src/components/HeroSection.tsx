import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { trackCtaConversion } from '@/utils/analytics';
import { ShieldCheck } from 'lucide-react';

type HeroProps = {
  renderHeadings?: boolean;
  h1?: string;
  h2?: string;
  h3?: string;
  className?: string;
  defaultHeadingAs?: 'h1' | 'h2';
};

/**
 * Layered architectural background — fine grid texture + sweeping arcs + deliberate nodes.
 * Grid gives precision/data character; arcs and nodes give structural depth.
 * All elements stay clearly subordinate to content.
 */
const ArchitectureField = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 580"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 w-full h-full pointer-events-none"
    fill="none"
    aria-hidden="true"
  >
    {/* Fine structural grid — very low opacity, gives data/precision texture */}
    <g stroke="hsl(175,60%,32%)" strokeWidth="0.35" opacity="0.07">
      {[72, 144, 216, 288, 360, 432, 504].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="1200" y2={y} />
      ))}
      {[96, 192, 288, 384, 480, 576, 672, 768, 864, 960, 1056, 1152].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="580" />
      ))}
    </g>

    {/* Sweeping structural arcs — architectural depth */}
    <path d="M -80 580 A 780 780 0 0 1 840 -80" stroke="hsl(175,55%,35%)" strokeWidth="1" opacity="0.16" />
    <path d="M 1280 -40 A 700 700 0 0 1 360 580" stroke="hsl(175,50%,38%)" strokeWidth="0.9" opacity="0.11" />

    {/* Hub node — upper-right quadrant, clear of left text area */}
    <g opacity="0.20" stroke="hsl(175,55%,36%)">
      <circle cx="870" cy="150" r="110" strokeWidth="0.7" strokeDasharray="8 10" />
      <circle cx="870" cy="150" r="30" strokeWidth="0.9" />
      <circle cx="870" cy="150" r="13" strokeWidth="1.2" />
      <circle cx="870" cy="150" r="5" fill="hsl(175,55%,40%)" stroke="none" />
    </g>

    {/* Secondary nodes */}
    <g opacity="0.15" stroke="hsl(175,52%,36%)">
      <circle cx="230" cy="470" r="17" strokeWidth="0.7" />
      <circle cx="230" cy="470" r="7.5" strokeWidth="1" />
      <circle cx="230" cy="470" r="2.8" fill="hsl(175,52%,40%)" stroke="none" />

      <circle cx="1090" cy="390" r="14" strokeWidth="0.7" />
      <circle cx="1090" cy="390" r="6" strokeWidth="1" />
      <circle cx="1090" cy="390" r="2.2" fill="hsl(175,52%,40%)" stroke="none" />

      <circle cx="130" cy="165" r="11" strokeWidth="0.7" />
      <circle cx="130" cy="165" r="4.5" strokeWidth="1" />
      <circle cx="130" cy="165" r="1.8" fill="hsl(175,52%,40%)" stroke="none" />
    </g>

    {/* Connecting lines between nodes */}
    <g stroke="hsl(175,50%,38%)" strokeWidth="0.75" opacity="0.11">
      <line x1="130" y1="165" x2="870" y2="150" />
      <line x1="870" y1="150" x2="1090" y2="390" />
      <line x1="230" y1="470" x2="870" y2="150" />
    </g>
  </svg>
);

/**
 * Workflow audit artefact — the right-hand product visual.
 * Shows a Loan Origination entity workflow: ordered state transitions,
 * timestamps, status badges, and entity metadata. Compact, monospace,
 * product-like. Communicates auditability and ordered progression.
 */
const WorkflowArtefact = () => {
  const states = [
    { name: 'APPLICATION',  ts: '09:14:02.041', status: 'committed',   committed: true,  active: false },
    { name: 'CREDIT_CHECK', ts: '09:14:03.882', status: 'committed',   committed: true,  active: false },
    { name: 'UNDERWRITING', ts: '09:14:45.220', status: 'committed',   committed: true,  active: false },
    { name: 'APPROVAL',     ts: '09:15:12.774', status: 'in progress', committed: false, active: true  },
    { name: 'SETTLEMENT',   ts: '—',            status: 'pending',     committed: false, active: false },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden select-none"
      style={{
        background: 'hsl(0,0%,100%)',
        border: '1px solid hsl(175,35%,82%)',
        boxShadow:
          '0 2px 8px -2px hsl(175,40%,55%,0.12), 0 8px 32px -8px hsl(175,40%,50%,0.16), 0 1px 2px 0 hsl(175,30%,60%,0.08)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{
          background: 'linear-gradient(135deg, hsl(175,35%,95%) 0%, hsl(175,25%,97%) 100%)',
          borderColor: 'hsl(175,30%,88%)',
        }}
      >
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-1"
            style={{ color: 'hsl(175,55%,30%)' }}
          >
            Entity Workflow
          </p>
          <p className="text-sm font-semibold" style={{ color: 'hsl(215,25%,18%)' }}>
            Loan Origination
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
          style={{ background: 'hsl(175,45%,90%)', color: 'hsl(175,60%,26%)' }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
            style={{ background: 'hsl(175,60%,38%)' }}
          />
          Live
        </span>
      </div>

      {/* State transitions */}
      <div className="px-5 py-4 space-y-3">
        {states.map((s) => (
          <div
            key={s.name}
            className="flex items-center gap-3"
            style={{
              opacity: s.committed ? 0.68 : s.active ? 1 : 0.32,
            }}
          >
            {/* Status dot */}
            <div
              className="shrink-0 w-2.5 h-2.5 rounded-full"
              style={{
                background: s.committed
                  ? 'hsl(175,55%,42%)'
                  : s.active
                  ? 'hsl(175,50%,52%)'
                  : 'hsl(215,15%,80%)',
                boxShadow: s.active
                  ? '0 0 0 3px hsl(175,50%,90%)'
                  : undefined,
              }}
            />

            {/* State name */}
            <span
              className="flex-1 text-[11px] font-mono font-semibold tracking-wide"
              style={{
                color: s.active
                  ? 'hsl(215,25%,18%)'
                  : s.committed
                  ? 'hsl(215,18%,42%)'
                  : 'hsl(215,12%,58%)',
              }}
            >
              {s.name}
            </span>

            {/* Timestamp */}
            <span
              className="text-[10px] tabular-nums font-mono"
              style={{ color: 'hsl(215,12%,60%)' }}
            >
              {s.ts}
            </span>

            {/* Status badge */}
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
              style={{
                background: s.committed
                  ? 'hsl(175,40%,91%)'
                  : s.active
                  ? 'hsl(38,85%,92%)'
                  : 'hsl(215,15%,93%)',
                color: s.committed
                  ? 'hsl(175,55%,27%)'
                  : s.active
                  ? 'hsl(32,75%,32%)'
                  : 'hsl(215,15%,55%)',
              }}
            >
              {s.status}
            </span>
          </div>
        ))}
      </div>

      {/* Footer metadata */}
      <div
        className="px-5 py-3.5 border-t grid grid-cols-3 gap-4"
        style={{
          borderColor: 'hsl(175,28%,90%)',
          background: 'hsl(175,25%,97%)',
        }}
      >
        {[
          { label: 'Entity ID',   value: 'LN-28471' },
          { label: 'Transitions', value: '4 of 5'   },
          { label: 'History',     value: 'immutable' },
        ].map((m) => (
          <div key={m.label}>
            <p
              className="text-[9px] uppercase tracking-widest font-bold mb-0.5"
              style={{ color: 'hsl(175,35%,52%)' }}
            >
              {m.label}
            </p>
            <p
              className="text-[11px] font-mono font-semibold"
              style={{ color: 'hsl(215,20%,28%)' }}
            >
              {m.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const HeroSection: React.FC<HeroProps> = ({
  renderHeadings = false,
  h1,
  h2,
  h3,
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

  const isHomepage = !renderHeadings;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, hsl(175,45%,92%) 0%, hsl(175,32%,95%) 35%, hsl(175,18%,97%) 65%, hsl(0,0%,99%) 100%)',
        paddingTop: 'clamp(3.5rem, 7vw, 6rem)',
        paddingBottom: 'clamp(3.5rem, 7vw, 6rem)',
      }}
    >
      <ArchitectureField />

      <div className="relative z-10 container mx-auto px-4">
        {isHomepage ? (
          /* Homepage: two-column layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center max-w-6xl mx-auto">

            {/* Left column: headline, copy, CTAs */}
            <div className="max-w-lg lg:max-w-none">
              {/* Eyebrow */}
              <div className="mb-5">
                <span
                  className="inline-flex items-center text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{
                    background: 'hsl(175,45%,86%)',
                    color: 'hsl(175,62%,24%)',
                  }}
                >
                  Enterprise · Regulated Production
                </span>
              </div>

              {/* H1 */}
              {React.createElement(
                defaultHeadingAs,
                {
                  className:
                    'text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5',
                  style: { color: 'hsl(215,28%,14%)' },
                },
                'Enterprise Cyoda'
              )}

              {/* Sub-copy */}
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: 'hsl(215,18%,38%)' }}
              >
                State, workflow, transactions, events, history, and business logic in one
                model. Commercially supported for regulated and mission-critical production.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button
                  size="lg"
                  className="px-8 text-base font-semibold"
                  onClick={handleContactSales}
                >
                  Talk to us
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-7 text-base font-semibold"
                  style={{
                    borderColor: 'hsl(175,38%,65%)',
                    color: 'hsl(175,62%,24%)',
                    background: 'hsl(175,40%,96%)',
                  }}
                  asChild
                >
                  <a href="https://cyoda.org" rel="noopener noreferrer">
                    Run it yourself
                  </a>
                </Button>
              </div>

              {/* Inline proof line */}
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: 'hsl(175,45%,34%)' }}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>In production since 2017 · VC Trade, European private debt</span>
              </div>
            </div>

            {/* Right column: workflow/audit artefact */}
            <div className="lg:pl-4 xl:pl-8">
              <WorkflowArtefact />
            </div>
          </div>
        ) : (
          /* Other pages (dev, cto, products, pricing): centred layout */
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {renderHeadings && h1 ? (
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
                  {h1}
                </h1>
                {(h2 || h3) && (
                  <div className="mt-4 mb-2 text-muted-foreground space-y-1">
                    {h2 && <p className="text-base md:text-lg">{h2}</p>}
                    {h3 && <p className="text-sm md:text-base">{h3}</p>}
                  </div>
                )}
              </div>
            ) : null}

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Build scalable, auditable backend systems on an integrated architecture.
              Commercially supported for regulated and mission-critical production.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button
                size="lg"
                className="px-8 text-base font-semibold"
                onClick={handleContactSales}
              >
                Talk to us
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-base font-semibold"
                asChild
              >
                <a href="https://cyoda.org" rel="noopener noreferrer">
                  Open source, run it yourself
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
