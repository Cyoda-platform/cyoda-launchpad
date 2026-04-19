import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CyodaPathsSection from '@/components/CyodaPathsSection';
import CyodaModelDiagram from '@/components/CyodaModelDiagram';
import UseCaseCard from '@/components/UseCaseCard';
import EcosystemSection from '@/components/EcosystemSection';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema } from '@/data/schemas';
import { Building2, BarChart3, UserCheck, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const integratedArchCards = [
  {
    title: 'Higher AI fidelity',
    description: 'Explicit structure means AI agents reason over your workflows accurately. No hidden integration seams to misread.',
  },
  {
    title: 'Throw away the glue',
    description: 'One model replaces the stack of separate components that glue code usually connects.',
  },
  {
    title: 'Built for compliance',
    description: 'Audit trails are not added on top — they are how data is stored. Temporal history is first-class.',
  },
  {
    title: 'No re-engineering wall',
    description: 'Start on PostgreSQL, scale to Cassandra without changing your entity model.',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Enterprise Cyoda: EDBMS for auditable, workflow-driven backend systems"
        description="Build scalable, auditable backend systems on an integrated architecture. Enterprise Cyoda provides commercial support, procurement, and deployment for regulated production."
        url="https://cyoda.com/"
        type="website"
        jsonLd={organizationSchema}
      />
      <Header />
      <main>
        <HeroSection />

        {/* Hero separator bar — no text, visual accent */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: '29px', background: 'hsl(175,40%,87%)' }}
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <pattern id="bar-dots" x="0" y="0" width="24" height="14" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="7" r="1.5" fill="hsl(175,55%,32%)" opacity="0.22" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bar-dots)" />
          </svg>
        </div>

        <CyodaPathsSection />

        {/* Integrated architecture section */}
        <section
          id="how-it-works"
          className="py-16 md:py-24 bg-[hsl(var(--section-alt-bg))]"
        >
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Section header */}
            <div className="text-center mb-10">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                ARCHITECTURE
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">
                One consistency model, not three stitched together
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                No separate orchestration layer, audit service, or consistency seam — because there is no separate layer.
              </p>
            </div>

            {/* Model diagram */}
            <div className="mb-12">
              <CyodaModelDiagram />
            </div>

            {/* Benefit strip — borderless, no card containers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border mt-2">
              {integratedArchCards.map((card) => (
                <div key={card.title} className="px-6 py-5 first:pl-0 last:pr-0">
                  <p className="text-sm font-semibold text-foreground mb-1">{card.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <EcosystemSection />

        {/* Use Cases preview section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                USE CASES
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Where enterprise teams use Cyoda
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto mt-2">
                Cyoda fits systems where state transitions, auditability, and consistency under failure are the product, not plumbing around it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <UseCaseCard
                icon={Building2}
                title="Loan Origination & Lifecycle"
                description="Full state machine from application to settlement, with immutable event history and concurrent consistency."
                href="/use-cases/loan-lifecycle"
              />
              <UseCaseCard
                icon={BarChart3}
                title="Trade Settlement & Regulatory Reporting"
                description="Point-in-time queryable trade states for regulatory reconstruction — no ETL pipeline required."
                href="/use-cases/trade-settlement"
              />
              <UseCaseCard
                icon={UserCheck}
                title="KYC & Customer Onboarding"
                description="Durable retry for external checks, with full audit of every decision and the data behind it."
                href="/use-cases/kyc-onboarding"
              />
              <UseCaseCard
                icon={Bot}
                title="Agentic AI for Regulated Industries"
                description="AI agents that take actions on behalf of businesses need more than model inference. Cyoda provides the transactional consistency, ordered state transitions, and audit history that make agent actions recoverable when something goes wrong."
                href="/use-cases/agentic-ai"
              />
            </div>

            <div className="text-center mt-10">
              <Link
                to="/use-cases"
                className="text-primary font-medium hover:underline focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                See all use cases →
              </Link>
            </div>
          </div>
        </section>

        {/* Mission quote */}
        <section className="py-20 md:py-28 bg-background border-t border-border">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="mx-auto mb-6 w-10 h-0.5 bg-primary rounded" />
            <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-6">
              "We built Cyoda because we were tired of rebuilding the same infrastructure at every bank
              we worked at. The problem was always the same: state management, audit, consistency under
              failure and the solution was duct tape. Cyoda is the solution we would have paid for."
            </blockquote>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
              Patrick Stanton &amp; Paul Schleger PhD, Co-Founders
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
