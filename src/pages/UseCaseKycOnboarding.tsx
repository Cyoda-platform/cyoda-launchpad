import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema, breadcrumbKycOnboarding } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const kycStates = ['Initiated', 'ID Verification', 'Sanctions Check', 'Approved / Rejected'];

const checkpoints = [
  'External API calls modelled as durable entity state transitions with automatic retry on failure',
  'Every decision captures the exact data available at decision time — point-in-time by default',
  'No custom audit code required — full history is built into the entity model',
  'Sanctions and identity checks retried safely without duplicate side effects',
  'Full onboarding history queryable for compliance review at any historical point',
  'Asynchronous external calls handled within the same consistency model as all entity state',
];

const UseCaseKycOnboarding = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="KYC & Customer Onboarding | Cyoda"
        description="Model KYC as entity state transitions with durable retry. Point-in-time storage answers what you knew at decision time — with no custom audit code."
        url="https://cyoda.com/use-cases/kyc-onboarding"
        type="website"
        jsonLd={[organizationSchema, breadcrumbKycOnboarding]}
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
                KYC and Customer Onboarding with Full Audit Trail
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
              Async Checks, Partial Failures, Incomplete Logs
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              External API calls for identity verification and sanctions screening are
              asynchronous, occasionally fail, and must be retried with full logging. Every
              decision must capture the exact data available at decision time.
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
              Durable Checks, Zero Custom Audit Code
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              External calls are modelled as entity state transitions with durable retry.
              Point-in-time storage answers "what did we know when we made this decision" —
              without a line of custom audit code.
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
                  {kycStates.map((state, i) => (
                    <div key={state} className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-full border bg-[hsl(var(--state-node-bg))] border-[hsl(var(--state-node-border))] text-primary text-sm font-medium whitespace-nowrap">
                        {state}
                      </div>
                      {i < kycStates.length - 1 && (
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
              Ready to Simplify KYC Compliance?
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

export default UseCaseKycOnboarding;
