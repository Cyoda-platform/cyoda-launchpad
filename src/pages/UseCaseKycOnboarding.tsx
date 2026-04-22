import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema, breadcrumbKycOnboarding } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import WorkflowDiagram from '@/lib/workflow-diagram';
import { kycOnboardingWorkflow } from '@/workflows';

// ─── What changes section ─────────────────────────────────────────────────────

const changes = [
  {
    title: 'STP without sacrificing auditability',
    body: 'Low-risk cases complete automated ID&V, sanctions, and PEP checks without human intervention. The immutable event history captures every check result regardless — not only when something goes wrong.',
  },
  {
    title: 'Exception handling inside the same lifecycle',
    body: 'EDD and manual casework are not a separate system. They are named states with their own criteria and attached processes — branching off the same entity, feeding back into the same workflow.',
  },
  {
    title: 'Decision-time evidence captured by default',
    body: 'The data available at each transition is recorded as part of the entity history. Point-in-time reconstruction for a regulatory exam or internal review is a query, not a rebuild.',
  },
  {
    title: 'UBO and legal-entity complexity in the workflow',
    body: 'Beneficial ownership discovery and control-structure verification are modelled as conditional states with their own criteria. The path is explicit, not hidden in application code.',
  },
  {
    title: 'Post-approval monitoring, not a dead end',
    body: 'Approval transitions into ongoing monitoring. Trigger-based reassessment and periodic review re-enter the workflow as first-class transitions — not polling jobs or background cron tasks.',
  },
  {
    title: 'No separate audit layer',
    body: 'Immutable history is how Cyoda stores state. There is no warehouse to load, no audit table to keep in sync, and no reconstruction needed to answer "what did we know at T?"',
  },
];

// ─── Production relevance section ────────────────────────────────────────────

const productionItems = [
  {
    title: 'Cleaner audit and compliance review',
    body: 'Every decision, check result, and exception is part of the entity record. Audit trails are structural, not reconstructed.',
  },
  {
    title: 'Fewer seams across systems',
    body: 'Onboarding, screening, casework, and evidence live in one consistency model. There is no reconciliation between an onboarding system and a separate audit store.',
  },
  {
    title: 'Explicit decision paths for policy review',
    body: 'Criteria on transitions make every routing decision inspectable. How a case reached EDD, or why it was rejected, is queryable directly from the entity history.',
  },
  {
    title: 'Lower operational burden for exceptions',
    body: 'Casework states, human-in-the-loop branches, and reassessment triggers are part of the workflow definition — not custom orchestration code that must be maintained separately.',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const UseCaseKycOnboarding = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="KYC & Customer Onboarding | Cyoda"
        description="Model KYC and customer onboarding as a Cyoda entity workflow — STP, exception handling, EDD, ongoing monitoring, and immutable audit history in one consistency model."
        url="https://cyoda.com/use-cases/kyc-onboarding"
        type="website"
        jsonLd={[organizationSchema, breadcrumbKycOnboarding]}
      />
      <Header />
      <main>

        {/* Section 1 — Hero */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Use case · KYC &amp; customer onboarding
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5 max-w-3xl leading-tight">
              KYC and customer onboarding in one auditable lifecycle
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Modern onboarding is not a one-time pass/fail check. Low-risk customers should pass
              quickly through automated screening. Higher-risk cases branch into enhanced due
              diligence. Legal entities require beneficial ownership discovery. Approved customers
              enter ongoing monitoring that can trigger reassessment. Cyoda models all of it as a
              single entity with an explicit workflow — states, criteria-driven transitions, attached
              processes, and an immutable history of every decision.
            </p>
          </div>
        </section>

        {/* Section 2 — The problem */}
        <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                  The problem
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-5">
                  Onboarding doesn't fit one system
                </h2>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Document and data checks, external screening, casework, and audit are typically
                    split across multiple systems with separate consistency models. A sanctions match
                    in one system has to propagate to the onboarding record in another before a
                    decision can be made — and the evidence of that propagation is rarely stored.
                  </p>
                  <p>
                    Asynchronous external checks — ID&amp;V, sanctions, PEP, adverse media — fail
                    intermittently and must be retried safely without duplicate side effects. Without
                    a durable state model, retries are either unsafe or require custom idempotency
                    logic to manage.
                  </p>
                  <p>
                    Low-risk cases should complete in seconds via straight-through processing. But
                    the same path must branch into enhanced due diligence for higher-risk cases
                    without losing the STP evidence. Legal entities add a second dimension:
                    beneficial ownership discovery is a conditional sub-workflow, not a checkbox.
                  </p>
                  <p>
                    Onboarding does not end at approval. Ongoing monitoring and trigger-based
                    reassessment are operational requirements — not optional add-ons. In conventional
                    stacks they are background jobs, disconnected from the onboarding record, with
                    no shared history.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                  The conventional assembly
                </h3>
                <ul className="space-y-4">
                  {[
                    { system: 'Onboarding application / CRM', problem: 'Holds the record but cannot model complex branching, loop-back, or conditional sub-workflows.' },
                    { system: 'Screening API (sanctions, PEP, adverse media)', problem: 'Asynchronous results with retry logic written in application code; evidence not stored durably.' },
                    { system: 'Case management system for EDD', problem: 'Separate data model and consistency boundary; casework outcome must be reconciled back to the onboarding record.' },
                    { system: 'Audit log or compliance database', problem: 'Assembled separately — does not capture the data available at the exact moment of each decision.' },
                    { system: 'Monitoring jobs / cron tasks', problem: 'Disconnected from the onboarding lifecycle; trigger-based reassessment is custom code with no shared history.' },
                  ].map((item) => (
                    <li key={item.system} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-muted-foreground/50" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.system}</p>
                        <p className="text-xs text-muted-foreground leading-snug">{item.problem}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* Section 3 — How Cyoda models it */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-8">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                How Cyoda models it
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                One onboarding entity, one workflow
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                The customer case is a Cyoda entity. Its lifecycle is a workflow graph — states,
                criteria-driven transitions, attached processes, and an immutable event history all
                in one consistency model. The straight-through path stays fast; exceptions route into
                controlled case handling; approval transitions into ongoing monitoring rather than a
                dead end.
              </p>
            </div>

            {/* Workflow artifact */}
            <WorkflowDiagram spec={kycOnboardingWorkflow} minSvgWidth={940} />

            {/* Callouts */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: 'Criteria on every transition',
                  detail:
                    'Each transition — ID&V pass, sanctions clear, risk threshold met — fires only when its criteria evaluate to true. The criteria are part of the workflow definition, not scattered across service code.',
                },
                {
                  label: 'Processes attach to states',
                  detail:
                    "The screening processor runs on entry to Automated ID&V. The risk-scoring processor runs on entry to Dynamic Risk Assessment. Both run inside the entity's transactional boundary — not as fire-and-forget calls.",
                },
                {
                  label: 'Ongoing monitoring is a state',
                  detail:
                    'Approval does not close the entity. It transitions into Active / Ongoing Monitoring. A monitoring alert re-enters the workflow as a named transition — not a background job reading a separate table.',
                },
              ].map((c) => (
                <div key={c.label} className="rounded-lg border border-primary/20 bg-primary/[0.03] p-4">
                  <p className="text-sm font-semibold text-foreground mb-1.5">{c.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4 — What changes when onboarding is native */}
        <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              The outcome
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              What changes when onboarding is native
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {changes.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5 — Why this matters in production */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                Production relevance
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Why the model matters for compliance and operations
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
                The architecture differences become concrete when a regulator asks questions, an
                internal review runs, or an exception case needs to be reconstructed.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productionItems.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6 — CTA */}
        <section className="py-20 md:py-28 bg-background border-t border-border">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="mx-auto mb-6 w-10 h-0.5 bg-primary rounded" />
            <p className="text-xl font-medium text-foreground leading-relaxed mb-8">
              If you're building or evaluating onboarding infrastructure that has to satisfy
              compliance, audit, and ongoing monitoring requirements, we'd like to talk.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="px-8 font-semibold" asChild>
                <Link to="/contact">Talk to us</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 font-semibold" asChild>
                <Link to="/products">Read the architecture</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default UseCaseKycOnboarding;
