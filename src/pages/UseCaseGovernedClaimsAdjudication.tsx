import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema, breadcrumbGovernedClaimsAdjudication } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ClaimsAdjudicationWorkflowViewer from '@/components/ClaimsAdjudicationWorkflowViewer';

const entityLifecycleChanges = [
  'Proposed adjudication is held on the Claim entity, not passed around as workflow-local state.',
  'Captured evidence, authority checks, adjuster decisions, payment results, and exception paths stay on the same entity record.',
  'Low-value, high-confidence claims can move through criteria-driven automatic transitions without losing auditability.',
  'Adjuster review is part of the lifecycle when workflow criteria require it.',
  'Payment, denial, appeal, reversal, and exception states remain queryable in one entity history.',
  'The full claim record can be reconstructed as of a past point in time.',
];

const productionCards = [
  {
    title: 'Snapshot reconstruction',
    body:
      'When a denied claim becomes a complaint later, teams can reconstruct the claim state, captured evidence, agent rationale, adjuster confirmation, and payment outcome at the time the decision was proposed or issued.',
  },
  {
    title: 'Governed adjudication authority',
    body:
      'An agent-drafted assessment does not equal a paid claim. Authority limits, SIU referrals, fraud-screening criteria, and adjuster confirmation stay in the write path.',
  },
  {
    title: 'Appeal and reversal discipline',
    body:
      'Failed payments, contested denials, and post-payment disputes move through explicit states. Retry, escalation, appeal, and reversal are lifecycle behaviour, not log archaeology.',
  },
  {
    title: 'Less custom control plumbing',
    body:
      'Carriers do not need to stitch a separate control layer around every promising claims-AI workflow. The control layer is the platform.',
  },
];

const UseCaseGovernedClaimsAdjudication = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Governed Claims Adjudication | Cyoda"
        description="Use Cyoda to govern AI-assisted claims adjudication through entity workflows, traceable state transitions, audit history, adjuster review, payment, appeal, and reversal paths."
        url="https://cyoda.com/use-cases/governed-claims-adjudication"
        type="website"
        jsonLd={[organizationSchema, breadcrumbGovernedClaimsAdjudication]}
      />
      <Header />
      <main>
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Use case · Governed claims adjudication
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 max-w-4xl leading-tight">
              Governed Claims Adjudication
            </h1>
            <p className="text-lg font-medium text-foreground/90 mb-5 max-w-3xl leading-relaxed">
              Governance lifecycle for AI-assisted property and casualty claims
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              AI is already drafting assessments, summarising records, and proposing adjudication
              decisions inside carriers. The hard part is moving any of it into production. Cyoda
              runs each claim through a governed entity workflow and records every state change as
              an immutable event, so teams can audit decisions, reconstruct what the system knew,
              and prove control over AI-assisted claims handling.
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
                  A claim decision needs an entity lifecycle, not a stitched-together approval trail
                </h2>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    An assessment agent can draft a coverage opinion quickly. The hard part is
                    proving what evidence it saw, which authority limits applied, who confirmed the
                    proposal, what payment issued, and how a later dispute or reversal was handled.
                  </p>
                  <p>
                    If the FNOL extract lives in one place, the proposed decision in another, the
                    adjuster confirmation in a third, and the payment record in a fourth, carriers
                    end up reconstructing the control story after the event rather than governing it
                    at write time.
                  </p>
                  <p>
                    Cyoda models the claim itself as the governed entity. The workflow transitions
                    act on that entity directly, so captured evidence, authority checks, agent
                    proposals, adjuster decisions, payment results, and immutable history stay
                    together.
                  </p>
                </div>
              </div>

              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                    Where carriers get stuck
                  </h3>
                  <ul className="space-y-4">
                    {[
                      'Proposed adjudication sits outside the claim system-of-record lifecycle.',
                      'Adjuster authority limits and SIU referrals are bolted on after the AI pilot.',
                      'Payment, denial, and reversal flows are split across queues, logs, and manual runbooks.',
                      'Audit on a contested claim requires stitching together prompts, tool traces, document snapshots, and adjuster notes from months or years earlier.',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
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
                Claim entity workflow for governed adjudication
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                Each claim is a Cyoda Claim entity. Its lifecycle is modelled as an entity
                workflow: captured FNOL context, coverage and authority checks, agent-drafted
                assessment, adjuster review, adjudication, payment, failure handling, appeal, and
                reversal paths, all as transitions on the claim itself.
              </p>
              <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
                Agents act through automatic transitions guarded by criteria. Adjusters act through
                manual transitions where human judgement or authority is required. Every proposal,
                confirmation, rejection, payment result, and reversal path becomes part of the
                claim&apos;s ordered history.
              </p>
            </div>

            <ClaimsAdjudicationWorkflowViewer />
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              The outcome
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              What changes when the claim lifecycle is native
            </h2>
            <div className="max-w-3xl space-y-4">
              {entityLifecycleChanges.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <p className="text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Regulated production
            </p>
            <h2 className="mb-8 text-2xl md:text-3xl font-bold text-foreground">
              Why this matters once AI-assisted claims handling leaves the pilot
            </h2>
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
              If you are moving AI-assisted claims handling from prototype to governed production,
              we can help map the entity lifecycle, control points, and audit requirements.
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

export default UseCaseGovernedClaimsAdjudication;
