import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import {
  organizationSchema,
  breadcrumbGovernedAiActions,
} from "@/data/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import GovernedAiActionsWorkflowViewer from "@/components/GovernedAiActionsWorkflowViewer";
import UseCaseIllustrativeNote from "@/components/UseCaseIllustrativeNote";

const entityLifecycleChanges = [
  "Agent proposals become part of an entity lifecycle, not disconnected tool output.",
  "Business state changes only through valid workflow transitions.",
  "Human review can be required for high-risk or low-confidence actions.",
  "Failures, retries, reversals, and exceptions remain visible in the same entity history.",
  "Teams can reconstruct what the agent knew, what checks ran, who approved the action, and why the entity moved state.",
];

const productionControls = [
  {
    title: "Controlled execution",
    body: "AI-driven actions move through explicit workflow transitions rather than hidden prompt logic.",
  },
  {
    title: "Decision reconstruction",
    body: "Teams can review the context, criteria, proposal, approval, and outcome associated with each state change.",
  },
  {
    title: "Human review where it matters",
    body: "Manual transitions can be required for high-risk actions without blocking lower-risk automation.",
  },
  {
    title: "Audit trail by design",
    body: "Each action becomes part of the entity’s ordered history instead of a log trail added later.",
  },
];

const UseCaseGovernedAiActions = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Governed Agentic Workflows | Cyoda"
        description="Use Cyoda to govern AI-driven business actions through entity workflows, traceable state transitions, audit history, and decision reconstruction."
        url="https://cyoda.com/use-cases/governed-agentic-workflows"
        type="website"
        jsonLd={[organizationSchema, breadcrumbGovernedAiActions]}
      />
      <Header />
      <main>
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              USE CASE
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 max-w-4xl leading-tight">
              Governed Agentic Workflows
            </h1>
            <p className="text-lg font-medium text-foreground/90 mb-5 max-w-3xl leading-relaxed">
              Control, audit, and reconstruct AI-driven business actions
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              AI agents can draft, recommend, and trigger business actions, but
              regulated enterprises require more control. Constrained agency is
              established by embedding policy-as-code directly into governed
              Cyoda entity workflows. This transforms autonomous triggers into
              verifiable state changes, ensuring accountability through a
              traceable record of every action, its reasoning, and its complete
              context.
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
                  AI actions need a governed lifecycle
                </h2>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Agent frameworks can call tools, memory systems can recall
                    context, and orchestration tools can run steps. The hard
                    part in an enterprise system is proving that an AI-driven
                    business action was allowed, reviewed where necessary,
                    executed correctly, and recoverable when something goes
                    wrong.
                  </p>
                  <p>
                    Cyoda treats the action as part of an entity workflow. The
                    agent can propose or trigger a transition, but the platform
                    controls whether that transition is valid, what criteria
                    must pass, whether human review is required, and how the
                    outcome is recorded.
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
                      "Agent decisions sit outside the system-of-record lifecycle.",
                      "Prompt logs and tool traces do not explain why business state changed.",
                      "Human approval is bolted on after the AI pilot instead of modelled in the workflow.",
                      "Recovery, reversal, and audit paths are reconstructed after the event.",
                      "Governance rules live in application code or prompts rather than explicit workflow transitions.",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item}
                        </p>
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
                How you can model it with Cyoda
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Entity workflow for governed agentic actions
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
                Each AI-driven action can be represented as an entity lifecycle.
                Context is captured, authority and risk checks run, the agent
                proposal is recorded, human review is required where criteria
                demand it, approved actions execute through controlled
                transitions, and failures or reversals remain part of the same
                entity history.
              </p>
            </div>

            <GovernedAiActionsWorkflowViewer />

            <UseCaseIllustrativeNote />
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              The outcome
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              What changes when AI actions are governed
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
              Why this matters once AI-driven workflows leave the pilot
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {productionControls.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-background border-t border-border">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="mx-auto mb-6 w-10 h-0.5 bg-primary rounded" />
            <p className="text-xl font-medium text-foreground leading-relaxed mb-8">
              If you are moving AI-driven workflows from prototype to governed
              production, we can help map the entity lifecycle, control points,
              and audit requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="px-8 font-semibold" asChild>
                <Link to="/contact">Talk to us</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 font-semibold"
                asChild
              >
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
