import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProofBar from '@/components/ProofBar';
import CyodaPathsSection from '@/components/CyodaPathsSection';
import CyodaModelDiagram from '@/components/CyodaModelDiagram';
import UseCaseCard from '@/components/UseCaseCard';
import EcosystemSection from '@/components/EcosystemSection';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema } from '@/data/schemas';
import { Bot, ShieldCheck, Layers, TrendingUp, Building2, BarChart3, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const integratedArchCards = [
  {
    icon: Bot,
    title: 'Higher AI fidelity',
    description: 'Explicit structure means AI agents reason over your workflows accurately. No hidden integration seams to misread.',
  },
  {
    icon: Layers,
    title: 'Throw away the glue',
    description: 'One model replaces the stack of separate components that glue code usually connects.',
  },
  {
    icon: ShieldCheck,
    title: 'Built for compliance',
    description: 'Audit trails are not added on top — they are how data is stored. Temporal history is first-class.',
  },
  {
    icon: TrendingUp,
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
        <ProofBar />
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
                Build on an integrated architecture
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                State, workflow, transactions, events, history, and business logic unified in one model. No separate orchestration layer. No separate audit service. No consistency seams to manage.
              </p>
            </div>

            {/* Model diagram */}
            <div className="mb-12">
              <CyodaModelDiagram />
            </div>

            {/* Value card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto mb-10">
              {integratedArchCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="p-6 rounded-xl border border-border bg-card shadow-sm flex gap-4 items-start"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4.5 h-4.5 text-primary w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">{card.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Closing line */}
            <p className="text-center text-sm text-muted-foreground font-medium">
              One model. One API surface. One growth path from local to cluster.
            </p>
          </div>
        </section>

        <EcosystemSection />

        {/* Enterprise value section */}
        <section className="py-16 md:py-24 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                ENTERPRISE CYODA
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Built for production in regulated environments
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Teams running Cyoda in regulated production need more than software. Enterprise Cyoda provides commercial structure, deployment assistance, and engineering support to run it with confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  title: 'Support for audit-driven deployments',
                  description:
                    'SLAs on workflow integrity, audit-trail validation, and temporal-history review. Not generic ticketing support.',
                },
                {
                  title: 'Scalable operational modes',
                  description:
                    'Support for PostgreSQL and Cassandra operational modes, including migration between them without changing your entity model.',
                },
                {
                  title: 'Regulated procurement and rollout',
                  description:
                    'Procurement paperwork, security questionnaires, implementation, and rollout support for regulated industries.',
                },
                {
                  title: 'Long-term engineering engagement',
                  description:
                    'Roadmap access, co-engineering on high-consequence workflows, and direct contact with the Cyoda core team.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-xl border border-border bg-card shadow-sm"
                >
                  <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/contact"
                className="text-primary font-medium hover:underline focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                Talk to the enterprise team →
              </Link>
            </div>
          </div>
        </section>

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
