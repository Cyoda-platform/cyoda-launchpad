import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema, breadcrumbTradeSettlement } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import TradeSettlementWorkflowViewer from '@/components/TradeSettlementWorkflowViewer';

const outcomeCards = [
  {
    title: 'Immutable transition log by default',
    body: 'Every state change — matched, repair-requested, affirmed, settled — appends a signed, timestamped record. No separate audit table to synchronise; immutability is an invariant of the write path.',
  },
  {
    title: 'Point-in-time reconstruction is a query',
    body: 'Because history is native to the entity, the state of any trade at any moment is reconstructable from the stored transitions. No warehouse rebuild, no log replay, no ETL dependency.',
  },
  {
    title: 'Exception paths stay inside the lifecycle',
    body: 'Repair, affirmation failure, and settlement fail are named states with criteria-guarded transitions and attached processes — not side-system logic that has to be correlated after the fact.',
  },
  {
    title: 'Operational reporting runs on transactional history',
    body: 'Trade-state distribution, exception rates, and settlement latency are queryable from the same model that governs the entity lifecycle. There is no copied data to drift.',
  },
  {
    title: 'Write conflicts handled at platform level',
    body: 'Concurrent transitions to the same entity are resolved at the Cyoda platform level. Settlement race conditions and duplicate instruction delivery do not require application-level guards.',
  },
  {
    title: 'No ETL seam between system of record and regulator',
    body: 'Regulatory reconstruction queries entity history directly. The record the regulator sees is the same record that governed the operational entity lifecycle — no transformation layer in between.',
  },
];

const productionCards = [
  {
    title: 'Regulator and audit readiness',
    body: 'MiFIR, EMIR, and CAT all require the ability to reconstruct trade state at specific timestamps. When history is a first-class property of the entity, that reconstruction is a platform capability — not a reporting pipeline you have to build and maintain.',
  },
  {
    title: 'Lower exception-handling overhead',
    body: 'SSI mismatches, matching failures, and affirmation delays each open an exception path. Keeping those paths inside the entity workflow — as named states with criteria and processors — means exception state is always visible, always auditable, and never lost in a side system.',
  },
  {
    title: 'Fewer reconciliation cycles',
    body: 'When an orchestration engine, transactional database, event log, and audit trail are separate systems, they diverge. A single consistency model eliminates the daily reconciliation run that checks whether they agree.',
  },
  {
    title: 'Cleaner architecture for T+1 and beyond',
    body: 'Compressed settlement cycles increase the operational and reporting pressure on every exception. An architecture where exception state, audit history, and the operational entity lifecycle are the same thing scales better under that pressure than one built from multiple coordinated systems.',
  },
];

const UseCaseTradeSettlement = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Trade Settlement & Regulatory Reporting | Cyoda"
        description="Every trade state is a regulatory event. Cyoda gives you point-in-time reconstruction — no ETL pipeline or separate data warehouse required."
        url="https://cyoda.com/use-cases/trade-settlement"
        type="website"
        jsonLd={[organizationSchema, breadcrumbTradeSettlement]}
      />
      <Header />
      <main>
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Use case · Post-trade operations
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5 max-w-3xl leading-tight">
              One trade entity, regulator-ready history
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-4">
              Trade settlement is not a straight line. Validation, matching, affirmation,
              instruction, repair, settlement, failure, and cancellation are all operationally and
              often regulatorily significant events — and in T+1 environments, each exception
              increases reporting pressure. Cyoda models the full post-trade lifecycle as a single
              TradeSettlement entity with an explicit entity workflow: named states,
              criteria-driven transitions, attached processors, and an immutable history of every
              step on that entity.
            </p>
            <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
              Point-in-time reconstruction of any trade at any historical timestamp is a query
              against entity history — not a warehouse rebuild, not an ETL pipeline, not a
              separately maintained audit copy.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                  The problem
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-5">
                  Settlement operations don&apos;t fit a status column
                </h2>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Matching and affirmation are not cosmetic steps. A trade can match on economics
                    but fail on settlement instructions — triggering an exception path with its own
                    operational state, its own process attachments, and a repair loop that must
                    re-enter the main lifecycle. That branching and loop-back cannot be modelled
                    without losing the history of the original failure.
                  </p>
                  <p>
                    Affirmation is a regulatory checkpoint in modern post-trade flows. Whether a
                    trade was affirmed before the affirmation deadline, and what state it was in
                    when it was instructed to the custodian, are questions regulators ask. The
                    answers must come from the system of record, not from a separately assembled
                    report.
                  </p>
                  <p>
                    Settlement failures and cancellations add further branching. Each is a terminal
                    or repair path with its own regulatory reporting requirement. In conventional
                    stacks, these paths live in different systems — the orchestration engine
                    handles progression, the database holds state, the event log holds history, and
                    a
                    separate warehouse or ETL process assembles the view regulators see.
                  </p>
                  <p>
                    The seams between those systems are where consistency breaks — and where
                    reconciliation cycles, reporting lags, and audit gaps originate.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                  The conventional assembly
                </h3>
                <ul className="space-y-4">
                  {[
                    {
                      system: 'Status column in the trade database',
                      problem: 'Cannot model repair loop-back or exception branching without losing the history of prior state.',
                    },
                    {
                      system: 'Separate orchestration engine',
                      problem: 'Different consistency boundary from the database — entity state and lifecycle progression can diverge; reconciliation required.',
                    },
                    {
                      system: 'Event log or message broker',
                      problem: 'Eventual consistency — operational state and event history are not guaranteed to agree at any given timestamp.',
                    },
                    {
                      system: 'Warehouse or ETL layer for reporting',
                      problem: 'Regulatory reconstruction depends on copied data. Any pipeline lag means the regulatory view can be stale or incomplete.',
                    },
                    {
                      system: 'Glue code across all of the above',
                      problem: 'Outbox patterns, idempotency guards, and reconciliation jobs are required to hold the assembly together.',
                    },
                  ].map((item) => (
                    <li key={item.system} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.system}</p>
                        <p className="text-xs leading-snug text-muted-foreground">{item.problem}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-8">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                How Cyoda models it
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                TradeSettlement entity workflow in a settlement system
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Each trade is a Cyoda TradeSettlement entity. Its lifecycle is modelled as an
                entity workflow graph — named states, criteria-guarded transitions, attached
                processors, exception branches, repair loop-backs, and immutable history on the
                entity itself. The graph below shows the full post-trade lifecycle with the
                append-only record created by those entity transitions.
              </p>
            </div>

            <TradeSettlementWorkflowViewer />

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  label: 'Criteria guard every transition',
                  detail:
                    'MATCHED to AFFIRMED only fires when the match criterion evaluates to true. INSTRUCTED to SETTLED requires the settlement confirmation criterion. Criteria are part of the entity workflow definition, not application code.',
                },
                {
                  label: 'Exception paths are named states',
                  detail:
                    'REPAIR_REQUESTED and MANUAL_REVIEW are explicit states with their own criteria and attached processes. The repair loop back to VALIDATING is a first-class transition, not a flag reset.',
                },
                {
                  label: 'Processes attach to transitions',
                  detail:
                    'Matching logic, custodian instruction dispatch, and regulatory publication attach to the transitions that trigger them. They run inside the entity transaction boundary, not as background jobs.',
                },
              ].map((card) => (
                <div key={card.label} className="rounded-lg border border-primary/20 bg-primary/[0.03] p-4">
                  <p className="mb-1.5 text-sm font-semibold text-foreground">{card.label}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{card.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              The outcome
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              What changes when history is native
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {outcomeCards.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              In production
            </p>
            <h2 className="mb-3 text-2xl md:text-3xl font-bold text-foreground">
              Why this matters for post-trade operations
            </h2>
            <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
              The architectural difference between native history and assembled history becomes
              operationally significant under regulatory scrutiny, during exception-heavy periods,
              and at the scale where reconciliation costs compound.
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {productionCards.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-background py-20 md:py-28">
          <div className="container mx-auto max-w-2xl px-4 text-center">
            <div className="mx-auto mb-6 h-0.5 w-10 rounded bg-primary" />
            <p className="mb-8 text-xl font-medium leading-relaxed text-foreground">
              If your settlement architecture depends on ETL to answer what a regulator or auditor
              will ask, we&apos;d like to talk.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
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
};

export default UseCaseTradeSettlement;
