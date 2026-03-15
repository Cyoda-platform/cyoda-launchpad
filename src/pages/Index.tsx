import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProofBar from '@/components/ProofBar';
import ArchitectureDiagram from '@/components/ArchitectureDiagram';
import UseCaseCard from '@/components/UseCaseCard';
import ThreeStepSection from '@/components/ThreeStepSection';
import ThreeBenefitsSection from '@/components/ThreeBenefitsSection';
import EcosystemSection from '@/components/EcosystemSection';
import DeveloperReliabilitySection from '@/components/DeveloperReliabilitySection';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema } from '@/data/schemas';
import { AlertCircle, Building2, BarChart3, UserCheck, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const painPoints = [
  'Most of the engineering effort goes into keeping nine components consistent, not into the product',
  'Partial progress failure modes at every seam: the DB commits, the event fails to publish, the workflow advances on stale data',
  'When a regulator asks for entity state from three months ago, the answer comes from log archaeology across disparate systems',
  'Adding a new workflow state requires coordinated changes across the database schema, the event schema, and the workflow engine',
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
                  Every team building stateful financial backends eventually hits the same wall. Postgres for consistency, Kafka for events, Temporal for workflows (that's the shortlist). The full list is nine components, each individually correct, held together by glue code that only works until one of them fails mid-transaction. The hardest problem isn't picking the tools. It's making them consistent across the database-to-workflow boundary and most teams never fully solve it. It's hard for developers to build on and opaque to AI coding tools.
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
              The Cyoda EDBMS (Entity Database Management System) ships all nine capabilities in a single consistency model. Transactions, workflows, and point-in-time queries share one source of truth. The audit trail is not a log added on top — it is the storage mechanism itself.
            </p>
          </div>
        </section>

        <ThreeBenefitsSection renderHeadings={false} />
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
                Built for Problems That Other Platforms Can't Solve
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
                description="Platform-level consistency for AI agent actions — deterministic, auditable, and recoverable."
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
