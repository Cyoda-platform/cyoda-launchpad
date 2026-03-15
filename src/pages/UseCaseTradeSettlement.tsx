import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema, breadcrumbTradeSettlement } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const tradeStates = ['Pending', 'Matched', 'Affirmed', 'Settled / Failed / Cancelled'];

const checkpoints = [
  'Every trade state — matched, affirmed, settled, failed — is an immutable, timestamped event',
  'Point-in-time reconstruction of any trade at any historical moment without a data warehouse',
  'Distributed reporting runs directly against transactional data — no ETL pipeline required',
  'Concurrent write conflicts resolved at the platform level, not in application code',
  'Full regulator-ready audit trail generated automatically from entity state transitions',
  'Serializable Snapshot Isolation across asynchronous distributed workflows',
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
        {/* Hero */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                USE CASE
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Trade Settlement and Regulatory Reporting
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
              Every State Is a Regulatory Event
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              Every trade state — matched, affirmed, settled, failed — is a regulatory event.
              Regulators expect point-in-time reconstruction. Most teams cannot provide it without
              a separate data warehouse and ETL pipeline.
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
              Queryable History Without the Pipeline
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              Each trade is a Cyoda entity. Every state transition is an immutable, timestamped
              event queryable at any consistency time. Distributed reporting runs directly against
              transactional data — no ETL pipeline, no warehouse copy required.
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
                  {tradeStates.map((state, i) => (
                    <div key={state} className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-full border bg-[hsl(var(--state-node-bg))] border-[hsl(var(--state-node-border))] text-primary text-sm font-medium whitespace-nowrap">
                        {state}
                      </div>
                      {i < tradeStates.length - 1 && (
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
              Ready to Eliminate the ETL Pipeline?
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

export default UseCaseTradeSettlement;
