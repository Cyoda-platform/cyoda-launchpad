import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { trackCtaConversion } from '@/utils/analytics';
import { ShieldCheck } from 'lucide-react';
import { ArchitectureField, heroGradient } from '@/components/HeroBackground';

type HeroProps = {
  renderHeadings?: boolean;
  h1?: string;
  h2?: string;
  h3?: string;
  className?: string;
  defaultHeadingAs?: 'h1' | 'h2';
};

/**
 * Workflow audit artefact, the right-hand product visual.
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

  const getPageVariant = (): 'home' | 'dev' | 'cto' => {
    const path = location.pathname;
    if (path === '/dev') return 'dev';
    if (path === '/cto') return 'cto';
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
        background: heroGradient,
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
                  className="inline-flex items-center text-[11px] font-bold tracking-[0.12em] px-3 py-1 rounded-full"
                  style={{
                    background: 'hsl(175,45%,86%)',
                    color: 'hsl(175,62%,24%)',
                  }}
                >
                  Enterprise Cyoda · Regulated production
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
                'Build auditable backend systems on one consistent architecture'
              )}

              {/* Sub-copy */}
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: 'hsl(215,18%,38%)' }}
              >
                Cyoda unifies state, workflow, transactions, events, and history in one model,
                with one path from local build to regulated production. Commercially supported by
                the people who built it.
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
                  <a href="#how-it-works">See the architecture</a>
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
              <p
                className="mt-3 text-center text-xs font-semibold"
                style={{ color: 'hsl(175,45%,34%)' }}
              >
                State, workflow, and history in one system
              </p>
            </div>
          </div>
        ) : (
          /* Other pages (dev, cto): centred layout */
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
