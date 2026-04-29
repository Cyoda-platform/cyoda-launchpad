import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema, breadcrumbGovernedAiActions } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import GovernedAiActionsWorkflowViewer from '@/components/GovernedAiActionsWorkflowViewer';

const entityLifecycleChanges = [
  'The requested action is held on the AgentAction entity, not passed around as workflow-local state.',
  'Authority checks, captured context, review outcomes, and execution results stay on the same entity record.',
  'Low-risk actions can flow through criteria-driven transitions without sacrificing auditability.',
  'Human review is part of the lifecycle when the workflow criteria require it.',
  'Execution, reversal, failure handling, and exception state remain queryable on one entity history.',
  'The action record is reconstructable at any point in time.',
];

const productionControls = [
  {
    title: 'Snapshot reconstruction for explainability',
    body:
      'Teams can reconstruct the exact action state, captured context, review outcome, and execution result at the moment an action was proposed or executed.',
  },
  {
    title: 'Governed authorization',
    body:
      'An autonomous recommendation does not equal a direct production mutation. Authority checks, review decisions, and operator override remain part of the write path.',
  },
  {
    title: 'Reversal, exception, and retry discipline',
    body:
      'Failed or contested actions move through explicit states. Reversal, retry, escalation, and reassessment are entity-lifecycle behavior, not scattered log analysis.',
  },
  {
    title: 'Less custom control plumbing',
    body:
      'Teams do not need to stitch together a separate control layer around every promising autonomous workflow just to make it safe for production.',
  },
];

const UseCaseGovernedAiActions = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Governed AI Actions | Cyoda"
        description="AI agents acting in enterprise systems must be accountable, not just capable. Cyoda runs agent actions through governed workflows and records each state change as an immutable event."
        url="https://cyoda.com/use-cases/governed-ai-actions"
        type="website"
        jsonLd={[organizationSchema, breadcrumbGovernedAiActions]}
      />
      <Header />
      <main>
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Use case · Governed AI actions
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 max-w-4xl leading-tight">
              Governed AI Actions
            </h1>
            <p className="text-lg font-medium text-foreground/90 mb-5 max-w-3xl leading-relaxed">
              Governance lifecycle for autonomous enterprise actions
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              AI agents acting in enterprise systems must be accountable, not just capable. Cyoda
              runs agent actions through governed workflows and records each state change as an
              immutable event, so teams can audit decisions, trace outcomes, and prove control over
              autonomous behaviour.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                  The problem
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-5">
                  Autonomous actions need an entity lifecycle, not a sidecar approval trail.
                </h2>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    An autonomous system can recommend or trigger a production change in seconds.
                    The hard part is proving what context it saw, what checks were performed, who
                    approved it, what changed, and how failures or reversals were handled.
                  </p>
                  <p>
                    If that context lives in one place, the requested action in another, and the
                    approval evidence in a third, teams end up reconstructing the control story
                    after the fact instead of governing it at write time.
                  </p>
                  <p>
                    Cyoda models the autonomous action as an entity. The workflow transitions act on
                    that entity directly, so captured context, authority checks, review decisions,
                    execution results, and immutable history stay together.
                  </p>
                </div>
              </div>

              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                    Where teams get stuck
                  </h3>
                  <ul className="space-y-4">
                    {[
                      'The requested action is kept outside the system-of-record lifecycle.',
                      'Approvals and authority checks are bolted on after the prototype.',
                      'Execution, failure, and reversal are split across queues, logs, scripts, or manual runbooks.',
                      'Audit requires stitching together prompts, tool traces, database state, and operator notes.',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
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
                AgentAction entity workflow for governed autonomous actions
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
                Each requested action is a Cyoda AgentAction entity. Its lifecycle is modelled as
                an entity workflow: captured context, authority checks, proposal review, execution,
                failure handling, reversal paths, and immutable history on that entity itself. The
                graph below is rendered directly from the supplied workflow JSON file.
              </p>
            </div>

            <GovernedAiActionsWorkflowViewer />
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              The outcome
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              What changes when the entity lifecycle is native
            </h2>
            <div className="max-w-3xl space-y-4">
              {entityLifecycleChanges.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
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
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Why this matters once autonomous actions leave the pilot
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {productionControls.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-background border-t border-border">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="mx-auto mb-6 w-10 h-0.5 bg-primary rounded" />
            <p className="text-xl font-medium text-foreground leading-relaxed mb-8">
              If you are moving autonomous actions from prototype to governed production, we can
              help map the entity lifecycle, control points, and audit requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="px-8 font-semibold" asChild>
                <Link to="/contact">Talk to us</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 font-semibold" asChild>
                <a href="https://ai.cyoda.net">Start an evaluation</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UseCaseGovernedAiActions;
