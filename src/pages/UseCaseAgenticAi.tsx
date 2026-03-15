import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema, breadcrumbAgenticAi } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const agentStates = ['Action Proposed', 'Validated', 'Executing', 'Completed / Rolled Back'];

const checkpoints = [
  'Agent actions are deterministic entity state transitions — not fire-and-forget API calls',
  'Every action is an immutable event within the same consistency model as all entity state',
  'Full audit trail for every agent decision, action, and its outcome',
  'Failed agent steps can be retried safely — the platform handles idempotency',
  'Probabilistic model output separated from deterministic, auditable state management',
  'Compliance-ready infrastructure for regulated industry deployments out of the box',
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
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                USE CASE
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Reliable Infrastructure for Agentic AI in Regulated Industries
              </h1>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="py-16 md:py-24 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-6xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              THE PROBLEM
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Probabilistic Models, Deterministic Consequences
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              AI agents that take actions on behalf of businesses need platform-level consistency
              guarantees. A model inference is probabilistic. The actions it triggers must be
              deterministic, auditable, and recoverable.
            </p>
          </div>
        </section>

        {/* Solution */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              HOW CYODA SOLVES IT
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Actions as Auditable State Transitions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              Agent actions are modelled as entity state transitions. Every action is an
              immutable event within the same consistency model that governs all entity state.
              Actions can be audited and recovered without custom state management.
            </p>
          </div>
        </section>

        {/* State machine diagram */}
        <section className="py-16 md:py-24 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-6xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Entity State Machine</p>
            <Card className="border-border/50 bg-card/30">
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-2">
                  {agentStates.map((state, i) => (
                    <div key={state} className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-full border bg-[hsl(var(--state-node-bg))] border-[hsl(var(--state-node-border))] text-primary text-sm font-medium whitespace-nowrap">
                        {state}
                      </div>
                      {i < agentStates.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Feature checkpoints */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              What You Get
            </h2>
            <div className="max-w-2xl space-y-4">
              {checkpoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Build Reliable Agentic Systems?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Start with a free evaluation or talk to the team about your specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground px-8 font-semibold"
                onClick={() => window.open('https://ai.cyoda.net', '_blank')}
              >
                Start Your Evaluation
              </Button>
              <Button size="lg" variant="outline" className="px-8 font-semibold" asChild>
                <Link to="/contact">Talk to the Team</Link>
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
