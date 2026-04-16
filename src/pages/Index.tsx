import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProofBar from '@/components/ProofBar';
import ArchitectureDiagram from '@/components/ArchitectureDiagram';
import UseCaseCard from '@/components/UseCaseCard';
import ThreeStepSection from '@/components/ThreeStepSection';
import PersonaSwitcher from '@/components/PersonaSwitcher';
import AINativeSection from '@/components/AINativeSection';
import EcosystemSection from '@/components/EcosystemSection';
import DeveloperReliabilitySection from '@/components/DeveloperReliabilitySection';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema } from '@/data/schemas';
import { AlertCircle, Building2, BarChart3, UserCheck, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const painPoints = [
  'Most of the engineering effort goes into keeping components consistent, not into the product',
  'Partial progress failure modes at every seam: one system commits, another fails mid-transaction, and now you are reconciling across logs',
  'When a regulator asks for entity state from three months ago, reconstructing it from disparate audit logs takes days, not seconds',
  'Adding a new workflow state requires coordinated changes across multiple systems, and something always breaks',
  'AI coding agents cannot reason coherently across a heterogeneous stack. Inconsistencies at component boundaries compound',
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Cyoda | Unified Platform for Stateful Workflows in Financial Services"
        description="Transactions, workflows, state machines, and immutable audit in one consistency model. For fintech teams done wiring nine components together."
        url="https://cyoda.com/"
        type="website"
        jsonLd={organizationSchema}
      />
      <Header />
      <main>
        <HeroSection />
        <ProofBar />
        <PersonaSwitcher />

        {/* Problem / Architecture section */}
        <section
          id="how-it-works"
          className="py-16 md:py-24 bg-[hsl(var(--section-alt-bg))]"
        >
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Section header */}
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                THE PROBLEM
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                You're Not Assembling Three Systems. You're Assembling Nine.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every team building stateful financial backends hits the same wall. A transactional database, a message broker, a workflow engine, a reporting layer, an audit mechanism — each individually correct, assembled by hand, held together by glue code that does not survive a partial failure. The full list of components is closer to nine than three. The hardest problem is not picking the tools. It is keeping them consistent across every seam, and that problem grows every time you add a state.
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
                The other thing nobody mentions: that architecture is opaque to AI coding agents. The more heterogeneous the stack, the harder it is for AI to reason across it without introducing inconsistencies at the boundaries.
              </p>
            </div>

            {/* Pain points */}
            <div className="max-w-2xl mx-auto space-y-4 mb-12">
              {painPoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <p className="text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>

            {/* Architecture diagram */}
            <ArchitectureDiagram />

            {/* EDBMS definition */}
            <p className="text-center text-muted-foreground mt-10 max-w-3xl mx-auto">
              The Cyoda EDBMS ships all nine capabilities in a single consistency model. Transactions, workflows, and point-in-time queries share one source of truth. The audit trail is the storage mechanism: write-only, immutable, available for regulatory reconstruction at any point in time.
            </p>
          </div>
        </section>

        <AINativeSection />
        <ThreeStepSection />
        <EcosystemSection />

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

        <DeveloperReliabilitySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
