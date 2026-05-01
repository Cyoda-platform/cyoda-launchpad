import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema, breadcrumbLoanLifecycle } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import LoanLifecycleWorkflowViewer from '@/components/LoanLifecycleWorkflowViewer';
import UseCaseIllustrativeNote from '@/components/UseCaseIllustrativeNote';

const changes = [
  {
    title: 'Branching and re-entry are explicit',
    body: 'Document requests, exception review, and arrears re-entry are modelled as named transitions with criteria — not handled by application code.',
  },
  {
    title: 'No separate orchestration engine',
    body: 'Orchestration, audit, and persistence share one consistency contract. There is no seam to reconcile between a separate orchestration engine and a database.',
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
    body: 'State, entity lifecycle, events, and audit collapse into one model. Outbox patterns, duplicate-event guards, and reconciliation pipelines are not needed.',
  },
];

const UseCaseLoanLifecycle = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Corporate Loan Origination & Lifecycle | Cyoda"
      description="Model corporate loan origination and lifecycle management as a Cyoda entity workflow with credit assessment, approval conditions, drawdown, servicing, and immutable history."
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
            Use case · Corporate lending
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5 max-w-4xl leading-tight">
            Corporate Loan Origination &amp; Lifecycle
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Corporate lending is not a straight line. A borrower company moves through intake,
            document collection, KYC, credit assessment, approval committee review, conditions,
            completion, drawdown, servicing, and exception paths. Cyoda models all of it as a
            single LoanApplication entity with an explicit entity workflow: named states,
            criteria-driven transitions, attached processors, and an immutable history of every
            step on that entity.
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
                Corporate loan lifecycles don&apos;t fit a status column
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  A borrower company can return to document collection after KYC and then re-enter
                  credit assessment with a different pack of supporting documents. That is a
                  loop-back. Status flags in a database cannot model it without losing the history
                  of the original check.
                </p>
                <p>
                  Credit assessment is a decision gate with multiple exits: approve with
                  conditions, refer to committee, request amendments, or decline. Each exit is a
                  different transition with different criteria. Approval review is itself a state
                  with its own transitions and attached processor.
                </p>
                <p>
                  Once the facility completes, the lifecycle continues through drawdown, servicing,
                  covenant exceptions, arrears, restructuring, and eventual repayment or default.
                  These are not edge cases. They are normal lifecycle events that share the same
                  entity and the same audit requirement as origination.
                </p>
                <p>
                  Conventional stacks split this across a status column, an orchestration engine,
                  an event log, and a separate audit table. The seams between them are the source
                  of the bugs.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                  The conventional assembly
                </h3>
                <ul className="space-y-4">
                  {[
                  { system: 'Status column in PostgreSQL', problem: 'Cannot model loop-back, conditional approvals, or drawdown branching without losing transition history.' },
                  { system: 'Kafka or SQS for events', problem: 'Eventual consistency across services means facility state and event history can diverge.' },
                  { system: 'Separate orchestration engine', problem: 'Different consistency boundary from the database, so the borrower lifecycle must be reconciled back into the system of record.' },
                  { system: 'Audit table or event log', problem: 'Assembled after the fact instead of being an invariant of the write path.' },
                  { system: 'Glue code', problem: 'Outbox patterns, idempotency keys, and approval workflow plumbing are required to hold the assembly together.' },
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
        <div className="mx-auto max-w-[1840px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-6xl">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              How you can model it with Cyoda
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              LoanApplication entity workflow in a corporate lending system
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              The LoanApplication is a Cyoda entity. Its lifecycle can be modelled as an entity
              workflow graph with named states, criteria-driven transitions, attached processors,
              and immutable history on the entity, all in one consistency model. The graph below
              shows branching, loop-back, approval conditions, drawdown, servicing states, terminal
              outcomes, and supporting audit history as one model.
              </p>
            </div>

          <LoanLifecycleWorkflowViewer />

          {/* Callouts */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: 'Criteria on every transition',
                detail:
                  'KYC CHECK to CREDIT ASSESSMENT only fires when the criteria evaluate to true. The criteria are part of the entity workflow definition, not application code.',
                },
              {
                label: 'Processors attach to transitions',
                detail:
                  "KYC processors, credit assessment processors, and facility-servicing hooks attach to transitions. They run inside the entity's transactional boundary, not as background jobs.",
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

          <UseCaseIllustrativeNote />
        </div>
      </section>

      {/* What changes when the entity lifecycle is native */}
      <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            The outcome
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            What changes when the entity lifecycle is native
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
            If you&apos;re modelling a stateful, auditable entity lifecycle and the current stack
            is the problem, we&apos;d like to talk.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="px-8 font-semibold" asChild>
              <Link to="/contact">Talk to us</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 font-semibold" asChild>
              <Link to="/#how-it-works">Read the architecture</Link>
            </Button>
          </div>
        </div>
      </section>

    </main>
    <Footer />
  </div>
);

export default UseCaseLoanLifecycle;
