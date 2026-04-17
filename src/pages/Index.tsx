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
    description: 'Less hidden integration logic, more explicit structure.',
  },
  {
    icon: Layers,
    title: 'Comprehensible systems',
    description: 'State, workflow, and history stay visible and coherent.',
  },
  {
    icon: ShieldCheck,
    title: 'Built for compliance',
    description: 'Auditability and temporal history are part of the model.',
  },
  {
    icon: TrendingUp,
    title: 'No re-engineering wall',
    description: "Start small and grow through Cyoda's operational modes.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Enterprise Cyoda | EDBMS for Regulated Backend Systems"
        description="Enterprise Cyoda provides commercially supported, scalable deployment of the EDBMS platform for stateful, auditable, workflow-driven systems in regulated and mission-critical environments."
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
                Cyoda combines entity state, workflows, transactions, events, and history in one model. That makes backend systems easier to understand, easier to evolve, more audit-friendly, and far easier for AI to work with effectively.
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
                    className="p-6 rounded-xl border border-border/50 bg-card/20 backdrop-blur flex gap-4 items-start"
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
              One model for state, workflow, and history — from early build to enterprise scale.
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
                What the enterprise offering adds
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Open-source Cyoda is the foundation. Enterprise Cyoda wraps it with the operational guarantees, commercial support, and deployment assistance that organisations running regulated workloads require.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  title: 'Commercial support',
                  description:
                    'Defined SLAs, direct engineering access, and escalation paths for production issues.',
                },
                {
                  title: 'Scalable deployment',
                  description:
                    'Guidance and assistance for high-throughput, multi-region, and high-availability Kubernetes deployments.',
                },
                {
                  title: 'Compliance assurance',
                  description:
                    'Architectural reviews, audit-trail validation, and documented controls for regulated environments.',
                },
                {
                  title: 'Enterprise engagement',
                  description:
                    'Commercial contracts, procurement-compatible terms, and dedicated implementation support.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-xl border border-border/50 bg-card/20 backdrop-blur"
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
                Where Cyoda fits
              </h2>
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
        <section className="py-16 md:py-24 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-3xl text-center">
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
