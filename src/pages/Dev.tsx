import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema } from '@/data/schemas';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Server, Cloud, Building2 } from 'lucide-react';
import { ArchitectureField, heroGradient } from '@/components/HeroBackground';
import type { LucideIcon } from 'lucide-react';

type RoutingCard = {
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  link: { label: string; href: string; internal?: boolean };
};

const routingCards: RoutingCard[] = [
  {
    icon: Server,
    badge: 'Open source',
    title: 'Run it yourself',
    description:
      'Start locally with in-memory or SQLite, grow to PostgreSQL without changing your model. No vendor dependency.',
    link: { label: 'Go to cyoda.org', href: 'https://cyoda.org' },
  },
  {
    icon: Cloud,
    badge: 'SaaS',
    title: 'Cyoda Cloud',
    description:
      'Free evaluation tier. Managed control plane. Your business logic runs in your code via gRPC.',
    link: { label: 'Go to ai.cyoda.net', href: 'https://ai.cyoda.net/' },
  },
  {
    icon: Building2,
    badge: 'Enterprise',
    title: 'Commercial deployment',
    description:
      'SLAs, procurement support, and regulated rollout. For teams taking Cyoda into production.',
    link: { label: 'Talk to us', href: '/contact', internal: true },
  },
];

const grpcSnippet = `# loan_processor.py
from cyoda.sdk import ProcessorContext, entity_processor

@entity_processor(entity_type="LoanApplication")
def on_credit_check(
    ctx: ProcessorContext,
    entity: dict,
) -> dict:
    """Runs when a LoanApplication enters CREDIT_CHECK state."""
    score = credit_bureau.fetch(entity["applicant_id"])

    entity["credit_score"] = score
    entity["eligible"]     = score >= 650

    ctx.emit_event("credit_check_complete", {
        "entity_id": entity["id"],
        "score":     score,
    })
    return entity`;

const Dev = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="For developers | Cyoda"
      description="Building with Cyoda? Start on the open-source project at cyoda.org or try Cyoda Cloud free at ai.cyoda.net. Come to cyoda.com when you need commercial support."
      url="https://cyoda.com/dev"
      type="website"
      jsonLd={organizationSchema}
    />
    <Header />
    <main>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: heroGradient,
          paddingTop: 'clamp(3.5rem, 7vw, 6rem)',
          paddingBottom: 'clamp(3.5rem, 7vw, 6rem)',
        }}
      >
        <ArchitectureField />
        <div className="relative z-10 container mx-auto px-4 max-w-3xl text-center">
          <div className="mb-4">
            <span
              className="inline-flex items-center text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: 'hsl(175,45%,86%)', color: 'hsl(175,62%,24%)' }}
            >
              For developers
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5"
            style={{ color: 'hsl(215,28%,14%)' }}
          >
            Looking to build with Cyoda?
          </h1>
          <p
            className="text-lg leading-relaxed mb-8 max-w-xl mx-auto"
            style={{ color: 'hsl(215,18%,38%)' }}
          >
            Start on the open-source project or on Cyoda Cloud. Come back to cyoda.com when you
            need commercial support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="px-8 text-base font-semibold" asChild>
              <a href="https://cyoda.org" rel="noopener noreferrer">Go to cyoda.org</a>
            </Button>
            <Button size="lg" variant="outline" className="px-7 text-base font-semibold" asChild>
              <a href="https://ai.cyoda.net/" rel="noopener noreferrer">Try Cyoda Cloud</a>
            </Button>
          </div>
          <p className="mt-5 text-sm" style={{ color: 'hsl(215,18%,48%)' }}>
            Need enterprise support?{' '}
            <Link to="/contact" className="underline underline-offset-2 hover:text-primary transition-colors">
              Talk to us
            </Link>
          </p>
        </div>
      </section>

      {/* Section 1 — Where to start */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              WHERE TO START
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Three paths, one model
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
              Cyoda keeps the same entity model across open source, cloud, and enterprise. No
              re-platforming wall as your requirements change.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {routingCards.map((card) => (
              <div key={card.title} className="rounded-xl border border-border bg-card p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-muted/40">
                    <card.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
                      {card.badge}
                    </span>
                    <h3 className="text-base font-semibold text-foreground leading-tight">{card.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {card.description}
                </p>
                <div className="mt-4">
                  {card.link.internal ? (
                    <Link
                      to={card.link.href}
                      className="text-sm font-medium text-primary hover:underline transition-colors"
                    >
                      {card.link.label}
                    </Link>
                  ) : (
                    <a
                      href={card.link.href}
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline transition-colors"
                    >
                      {card.link.label}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2 — gRPC processor snippet */}
      <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-6">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              HOW IT WORKS
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Your code lives in a gRPC processor
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Cyoda calls your processor when an entity transitions state. You handle the logic;
              Cyoda handles consistency, history, and delivery.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-border shadow-sm">
            {/* IDE chrome */}
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{ background: 'hsl(220,14%,18%)' }}
            >
              <span className="w-3 h-3 rounded-full" style={{ background: 'hsl(0,72%,60%)' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: 'hsl(40,85%,58%)' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: 'hsl(134,45%,48%)' }} />
              <span
                className="ml-3 text-[11px] font-mono"
                style={{ color: 'hsl(220,10%,65%)' }}
              >
                loan_processor.py
              </span>
            </div>
            {/* Code */}
            <pre
              className="overflow-x-auto text-sm leading-relaxed p-5"
              style={{
                background: 'hsl(220,14%,12%)',
                color: 'hsl(220,15%,88%)',
                fontFamily:
                  '"JetBrains Mono","Fira Code","Cascadia Code",ui-monospace,monospace',
              }}
            >
              <code>{grpcSnippet}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Section 3 — Quick next steps */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <ol className="flex flex-col sm:flex-row gap-6 sm:gap-0 sm:divide-x divide-border">
            {[
              {
                step: '1',
                content: (
                  <>
                    Start on{' '}
                    <a
                      href="https://cyoda.org"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline"
                    >
                      cyoda.org
                    </a>
                  </>
                ),
              },
              {
                step: '2',
                content: (
                  <>
                    Build or test on{' '}
                    <a
                      href="https://ai.cyoda.net/"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline"
                    >
                      ai.cyoda.net
                    </a>
                  </>
                ),
              },
              {
                step: '3',
                content: 'Move to enterprise if you need SLAs, procurement, or regulated support.',
              },
            ].map((item) => (
              <li
                key={item.step}
                className="flex-1 px-0 sm:px-6 first:pl-0 last:pr-0 flex gap-4 items-start"
              >
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'hsl(175,45%,86%)', color: 'hsl(175,60%,26%)' }}
                >
                  {item.step}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">
                  {item.content}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Section 4 — CTA close */}
      <section className="py-14 md:py-20 bg-[hsl(var(--section-alt-bg))] border-t border-border">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <h2 className="text-xl font-semibold text-foreground mb-6">Ready to start building?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="px-8 text-base font-semibold" asChild>
              <a href="https://cyoda.org" rel="noopener noreferrer">Go to cyoda.org</a>
            </Button>
            <Button size="lg" variant="outline" className="px-7 text-base font-semibold" asChild>
              <a href="https://ai.cyoda.net/" rel="noopener noreferrer">Try Cyoda Cloud</a>
            </Button>
          </div>
        </div>
      </section>

    </main>
    <Footer />
  </div>
);

export default Dev;
