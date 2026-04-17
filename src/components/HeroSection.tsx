import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HashLink } from 'react-router-hash-link';
import * as React from 'react';
import { trackCtaConversion } from '@/utils/analytics';
import heroBg from '@/assets/hero-bg.png';

type HeroProps = {
  renderHeadings?: boolean;
  h1?: string;
  h2?: string;
  h3?: string;
  className?: string;
  defaultHeadingAs?: 'h1' | 'h2';
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
      cta: 'contact_enterprise_sales',
      url: '/contact',
    });
    window.location.href = '/contact';
  };

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden py-20"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* SVG state machine background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <svg
          viewBox="0 0 800 160"
          className="w-full max-w-4xl opacity-15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Arrow connectors */}
          <line x1="128" y1="80" x2="172" y2="80" stroke="hsl(175,60%,50%)" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <line x1="288" y1="80" x2="332" y2="80" stroke="hsl(175,60%,50%)" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <line x1="448" y1="80" x2="492" y2="80" stroke="hsl(175,60%,50%)" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <line x1="608" y1="80" x2="652" y2="80" stroke="hsl(175,60%,50%)" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="hsl(175,60%,50%)" />
            </marker>
          </defs>
          {/* State nodes */}
          {[
            { x: 20,  label: 'Application' },
            { x: 180, label: 'UnderReview' },
            { x: 340, label: 'Approved' },
            { x: 500, label: 'Active' },
            { x: 660, label: 'Settled' },
          ].map(({ x, label }) => (
            <g key={label} transform={`translate(${x}, 56)`}>
              <rect width="108" height="48" rx="8" fill="hsl(175,40%,18%)" stroke="hsl(175,60%,40%)" strokeWidth="1.5" />
              <text x="54" y="28" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="11" fontFamily="sans-serif" fontWeight="500">
                {label}
              </text>
            </g>
          ))}
        </svg>
      </div>

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

          <p className="text-lg md:text-xl text-foreground/90 leading-relaxed max-w-2xl mx-auto">
            The EDBMS for stateful, auditable, workflow-driven backend systems. Commercially supported for regulated and mission-critical environments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground px-8 text-base font-semibold focus-visible:ring-2 focus-visible:ring-primary"
              onClick={handleContactSales}
            >
              Contact Enterprise Sales
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 text-base font-semibold border-primary/40 hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary"
              asChild
            >
              <HashLink smooth to="/#how-it-works">
                See the Architecture
              </HashLink>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
