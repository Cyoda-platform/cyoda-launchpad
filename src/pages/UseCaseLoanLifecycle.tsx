import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema, breadcrumbLoanLifecycle } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const loanStates = ['Application', 'Under Review', 'Approved', 'Active', 'Settled / Defaulted'];

const checkpoints = [
  'State machine from Submitted → Under Review → Approved → Active → Settled / Defaulted with immutable transitions',
  'Concurrent updates serialized per entity — no optimistic locking hacks or merge conflicts',
  'Full state history queryable at any point in time for compliance and audit',
  'No separate audit table — every transition is an immutable event by design',
  'Workflow engine, event log, and database unified in one consistency model',
  'Regulatory reconstruction of entity state at any historical timestamp',
];

const UseCaseLoanLifecycle = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Loan Origination & Lifecycle Management | Cyoda"
        description="Manage multi-stage loan approval, drawdown, repayment, and default states with immutable audit and serialized concurrent writes."
        url="https://cyoda.com/use-cases/loan-lifecycle"
        type="website"
        jsonLd={[organizationSchema, breadcrumbLoanLifecycle]}
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
                Loan Origination and Full Lifecycle Management
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
              Complex Lifecycle, Fragile Stack
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              Multi-stage approval workflows, drawdown, repayment, and default states require
              concurrent consistency and full state history. Most teams patch this with status
              flags, event logs, and fragile glue code between their database and workflow engine.
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
              One Entity, One Consistency Model
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              The loan is a Cyoda entity with its own state machine: Submitted → Under Review →
              Approved → Active → Settled / Defaulted. Every transition is an immutable event.
              Concurrent updates are serialized per entity. There is no separate audit table and
              no glue code.
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
                  {loanStates.map((state, i) => (
                    <div key={state} className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-full border bg-[hsl(var(--state-node-bg))] border-[hsl(var(--state-node-border))] text-primary text-sm font-medium whitespace-nowrap">
                        {state}
                      </div>
                      {i < loanStates.length - 1 && (
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
              Ready to Simplify Your Loan Lifecycle?
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

export default UseCaseLoanLifecycle;
