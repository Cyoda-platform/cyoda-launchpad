import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema, breadcrumbAgenticAi } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AgenticAiWorkflowViewer from '@/components/AgenticAiWorkflowViewer';

const workflowNativeChanges = [
  'Agent output becomes a proposal, not an uncontrolled side effect.',
  'Every proposed action is evaluated against policy before execution.',
  'Low-risk actions can flow through without sacrificing auditability.',
  'Human approval is built into the lifecycle where risk or policy requires it.',
  'Execution, rollback, exception handling, and escalation live in one case history.',
  'The action record is reconstructable at any point in time.',
];

const productionControls = [
  {
    title: 'Snapshot reconstruction for explainability',
    body:
      'Teams can reconstruct the exact case state, evidence, model proposal, policy result, and operator decision at the moment an action was proposed or executed.',
  },
  {
    title: 'Governed authorization',
    body:
      'An AI recommendation does not equal direct production mutation. Permissions, approvals, segregation of duties, and operator override remain part of the write path.',
  },
  {
    title: 'Rollback, exception, and retry discipline',
    body:
      'Failed or contested actions move through explicit states. Retries, rollbacks, escalations, and reassessment are workflow behavior, not scattered log analysis.',
  },
  {
    title: 'Less custom governance plumbing',
    body:
      'Firms do not need to build a bespoke event-sourced control layer around every promising agentic prototype just to make it safe for production.',
  },
];

const UseCaseAgenticAi = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Agentic AI for Regulated Industries | Cyoda"
        description="AI agent actions need platform-level consistency. Cyoda gives every agent action an immutable audit trail within the same entity consistency model."
        url="https://cyoda.com/use-cases/agentic-ai"
        type="website"
        jsonLd={[organizationSchema, breadcrumbAgenticAi]}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Use case · Agentic AI
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5 max-w-4xl leading-tight">
              Govern agentic actions before they touch regulated production
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              AI can classify, prioritize, explain, and propose. In regulated systems, the action
              still needs deterministic execution: policy gates, approval paths, controlled
              processes, immutable history, and point-in-time reconstruction. Cyoda provides that
              governed action layer.
            </p>
          </div>
        </section>

        {/* The production bottleneck */}
        <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                  The problem
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-5">
                  Prototypes can suggest actions. Production must govern them.
                </h2>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Agentic prototypes are easy to demo: a model reads an AML or
                    transaction-monitoring case, drafts a rationale, and recommends closure,
                    escalation, outreach, or remediation.
                  </p>
                  <p>
                    The hard part starts when that recommendation could affect production state.
                    The write path needs policy gating, maker-checker controls, permissions,
                    safe retries, rollback behavior, and human oversight where risk requires it.
                  </p>
                  <p>
                    Chat logs, prompt traces, and tool-call transcripts are not the same as
                    regulator-grade reconstruction. Teams need to know what the case looked like,
                    what evidence was available, who authorized the action, and what state changed.
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
                      'Model output sits outside the system-of-record lifecycle.',
                      'Approvals and segregation of duties are bolted on after the prototype.',
                      'Retries and rollbacks live in queues, logs, scripts, or manual runbooks.',
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

        {/* Workflow framing */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-8">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                How Cyoda models it
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                One RegulatedActionCase, one governed workflow
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
                In an agent-assisted AML or transaction-monitoring workflow, the model can propose
                a classification, rationale, or next action. Cyoda records that proposal inside a
                case entity, evaluates criteria, routes authorization, executes approved actions
                through attached processes, and appends immutable history for reconstruction.
              </p>
            </div>

            <AgenticAiWorkflowViewer />
          </div>
        </section>

        {/* Workflow-native outcomes */}
        <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              The outcome
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              What changes when action is workflow-native
            </h2>
            <div className="max-w-3xl space-y-4">
              {workflowNativeChanges.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Regulated production */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Regulated production
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Why this matters once agents leave the pilot
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

        {/* CTA */}
        <section className="py-20 md:py-28 bg-background border-t border-border">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="mx-auto mb-6 w-10 h-0.5 bg-primary rounded" />
            <p className="text-xl font-medium text-foreground leading-relaxed mb-8">
              If you are moving an agentic workflow from demo to regulated production, we can help
              map the action lifecycle, control points, and audit requirements.
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

export default UseCaseAgenticAi;
