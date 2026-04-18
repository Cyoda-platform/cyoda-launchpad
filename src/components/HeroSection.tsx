import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import * as React from 'react';
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
 * Architectural field SVG — fills the hero as a quiet background surface.
 *
 * Composition: 7 circular nodes, 5 connecting lines, 2 sweeping arcs,
 * 1 dashed ring around the hub node. No labels, no arrowheads.
 * All elements live in a single <g opacity="0.22"> so they recede uniformly.
 * viewBox 0 0 1200 500 with preserveAspectRatio="xMidYMid slice" fills
 * the section at every viewport width without cropping geometry.
 */
const ArchitectureField = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 500"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 w-full h-full"
    fill="none"
    aria-hidden="true"
  >
    <g opacity="0.22" stroke="hsl(175,50%,42%)" fill="none">

      {/* ── Sweeping background arcs ── */}
      {/* Upper-right structural arc */}
      <path d="M 640 0 A 560 560 0 0 0 1200 390" strokeWidth="0.9" />
      {/* Lower-left structural arc */}
      <path d="M 0 190 A 480 480 0 0 1 530 500" strokeWidth="0.9" />

      {/* ── Connecting lines ── */}
      <line x1="115"  y1="82"  x2="385"  y2="255" strokeWidth="0.8" />
      <line x1="385"  y1="255" x2="790"  y2="148" strokeWidth="0.8" />
      <line x1="790"  y1="148" x2="1085" y2="308" strokeWidth="0.8" />
      <line x1="1085" y1="308" x2="1055" y2="98"  strokeWidth="0.7" />
      <line x1="255"  y1="398" x2="645"  y2="428" strokeWidth="0.7" />

      {/* ── Dashed ring around hub node (790, 148) ── */}
      <circle cx="790" cy="148" r="105" strokeWidth="0.8" strokeDasharray="7 9" />

      {/* ── Nodes — concentric rings + filled centre ── */}

      {/* Node 1  (115, 82) — upper left */}
      <circle cx="115" cy="82"  r="18" strokeWidth="0.7" />
      <circle cx="115" cy="82"  r="8"  strokeWidth="1"   />
      <circle cx="115" cy="82"  r="3.5" fill="hsl(175,55%,42%)" stroke="none" />

      {/* Node 2  (385, 255) — left-centre */}
      <circle cx="385" cy="255" r="22" strokeWidth="0.7" />
      <circle cx="385" cy="255" r="10" strokeWidth="1"   />
      <circle cx="385" cy="255" r="4"  fill="hsl(175,55%,42%)" stroke="none" />

      {/* Node 3  (790, 148) — hub, slightly larger */}
      <circle cx="790" cy="148" r="26" strokeWidth="0.9" />
      <circle cx="790" cy="148" r="12" strokeWidth="1"   />
      <circle cx="790" cy="148" r="5"  fill="hsl(175,55%,42%)" stroke="none" />

      {/* Node 4  (1085, 308) — right */}
      <circle cx="1085" cy="308" r="18" strokeWidth="0.7" />
      <circle cx="1085" cy="308" r="8"  strokeWidth="1"   />
      <circle cx="1085" cy="308" r="3.5" fill="hsl(175,55%,42%)" stroke="none" />

      {/* Node 5  (1055, 98) — upper right */}
      <circle cx="1055" cy="98"  r="16" strokeWidth="0.7" />
      <circle cx="1055" cy="98"  r="7"  strokeWidth="1"   />
      <circle cx="1055" cy="98"  r="3"  fill="hsl(175,55%,42%)" stroke="none" />

      {/* Node 6  (255, 398) — lower left */}
      <circle cx="255"  cy="398" r="13" strokeWidth="0.7" />
      <circle cx="255"  cy="398" r="5.5" strokeWidth="1"  />
      <circle cx="255"  cy="398" r="2.5" fill="hsl(175,55%,42%)" stroke="none" />

      {/* Node 7  (645, 428) — lower centre */}
      <circle cx="645"  cy="428" r="13" strokeWidth="0.7" />
      <circle cx="645"  cy="428" r="5.5" strokeWidth="1"  />
      <circle cx="645"  cy="428" r="2.5" fill="hsl(175,55%,42%)" stroke="none" />

    </g>
  </svg>
);

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

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden py-24 md:py-32"
      style={{
        background: 'linear-gradient(160deg, hsl(175,45%,98%) 0%, hsl(0,0%,100%) 55%)',
      }}
    >
      <ArchitectureField />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">

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
          ) : (
            React.createElement(
              defaultHeadingAs,
              { className: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground' },
              'Enterprise Cyoda'
            )
          )}

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
      </div>
    </section>
  );
};

export default HeroSection;
