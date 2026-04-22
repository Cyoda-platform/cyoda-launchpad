import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema, breadcrumbLoanLifecycle } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import WorkflowDiagram from '@/lib/workflow-diagram';
import { loanLifecycleWorkflow } from '@/workflows';

const changes = [
  {
    title: 'Branching and re-entry are explicit',
    body: 'Document requests, exception review, and arrears re-entry are modelled as named transitions with criteria — not handled by application code.',
  },
  {
    title: 'No separate workflow engine',
    body: 'Orchestration, audit, and persistence share one consistency contract. There is no seam to reconcile between a workflow engine and a database.',
  },
  {
    title: 'History is queryable at any point in time',
    body: 'Every state transition is an appended record. Regulatory reconstruction at any timestamp is a query, not a rebuild.',
  },
  {
    title: 'Transitions are auditable by design',
    body: 'Criteria, processor results, and transition timestamps are stored as part of the entity record — not inferred from a log.',
  },
  {
    title: 'Processors run inside a consistent lifecycle',
    body: "External KYC calls, scoring processors, and servicer hooks attach to transitions. They run inside the entity's transactional boundary.",
  },
  {
    title: 'Less glue code across the stack',
    body: 'State, workflow, events, and audit collapse into one model. Outbox patterns, duplicate-event guards, and reconciliation pipelines are not needed.',
  },
];

const LoanWorkflowEmbed = () => (
  <WorkflowDiagram spec={loanLifecycleWorkflow} minSvgWidth={980} />
);

const UseCaseLoanLifecycle = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Loan Origination & Lifecycle Management | Cyoda"
      description="Model the full loan lifecycle as a Cyoda entity — branching, criteria-driven transitions, loop-back, and immutable event history in one consistency model."
      url="https://cyoda.com/use-cases/loan-lifecycle"
      type="website"
      jsonLd={[organizationSchema, breadcrumbLoanLifecycle]}
    />
    <Header />
    <main>

      {/* Hero */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            Use case · Loan origination
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5 max-w-3xl leading-tight">
            Model the full loan lifecycle in one entity
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Loan origination is not a straight line. It branches through identity checks, document
            requests, underwriting decisions, manual exceptions, and multiple end states — then
            continues into servicing, arrears, and settlement. Cyoda models all of it as a single
            entity with an explicit workflow: states, criteria-driven transitions, attached
            processors, and an immutable history of every step.
          </p>
        </div>
      </section>

      {/* Why this is hard */}
      <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                The problem
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-5">
                Loan workflows don't fit a status column
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  A loan can return to document collection after KYC — then re-enter the
                  underwriting queue with a different set of documents. That is a loop-back.
                  Status flags in a database cannot model it without losing the history of the
                  original check.
                </p>
                <p>
                  Underwriting is a decision gate with three exits: approved, manual review, or
                  hard decline. Each exit is a different transition with different criteria. Manual
                  review is itself a state with its own transitions and attached processor.
                </p>
                <p>
                  Once the loan is active, the lifecycle continues through servicing cycles,
                  arrears, restructuring, and eventual settlement or default. These are not edge
                  cases — they are normal lifecycle events that share the same entity and the same
                  audit requirement as origination.
                </p>
                <p>
                  Conventional stacks split this across a status column, a workflow engine, an
                  event log, and a separate audit table. The seams between them are the source of
                  the bugs.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                The conventional assembly
              </h3>
              <ul className="space-y-4">
                {[
                  { system: 'Status column in PostgreSQL', problem: 'Cannot model loop-back or branching without losing transition history.' },
                  { system: 'Kafka or SQS for events', problem: 'Eventual consistency across services — state and events can diverge.' },
                  { system: 'Temporal or Camunda for workflow', problem: 'Separate consistency boundary from the database; reconciliation required.' },
                  { system: 'Audit table or event log', problem: 'Assembled after the fact — not an invariant of the write path.' },
                  { system: 'Glue code', problem: 'Outbox pattern, idempotency keys, saga orchestration across all of the above.' },
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

      {/* The Cyoda workflow */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              How Cyoda models it
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              One LoanApplication entity, one workflow
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              The loan is a Cyoda entity. Its lifecycle is a workflow graph — states,
              criteria-driven transitions, attached processes, and an immutable event history all
              in one consistency model. The graph below shows branching, loop-back, terminal
              outcomes, and terminal outcomes, and supporting audit history as one model.
            </p>
          </div>

          <LoanWorkflowEmbed />

          {/* Callouts */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: 'Criteria on every transition',
                detail:
                  'KYC CHECK → UNDERWRITING only fires when the criteria — docs complete, identity verified — evaluate to true. The criteria are part of the workflow definition, not application code.',
              },
              {
                label: 'Processors attach to transitions',
                detail:
                  "kyc-svc runs when the entity enters KYC CHECK. The scoring processor runs on entry to UNDERWRITING. Both run inside the entity's transactional boundary — not as background jobs.",
              },
              {
                label: 'Loop-back is a first-class pattern',
                detail:
                  'DOC REQUESTED is a named state. The transition back to KYC CHECK is an explicit, criteria-guarded transition — not a flag reset or ad hoc state mutation.',
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

      {/* What changes when workflow is native */}
      <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            The outcome
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            What changes when workflow is native
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

      {/* CTA */}
      <section className="py-20 md:py-28 bg-background border-t border-border">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="mx-auto mb-6 w-10 h-0.5 bg-primary rounded" />
          <p className="text-xl font-medium text-foreground leading-relaxed mb-8">
            If you're modelling a stateful, auditable workflow and the current stack is the
            problem, we'd like to talk.
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

export default UseCaseLoanLifecycle;
