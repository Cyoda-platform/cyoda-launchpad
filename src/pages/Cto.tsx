import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema } from '@/data/schemas';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layers, ShieldCheck, Cpu } from 'lucide-react';
import { ArchitectureField, heroGradient } from '@/components/HeroBackground';
import { trackCtaConversion } from '@/utils/analytics';
import type { LucideIcon } from 'lucide-react';

type BenefitCard = { icon: LucideIcon; title: string; description: string };

const benefitCards: BenefitCard[] = [
  {
    icon: Layers,
    title: 'Smaller platform team burden',
    description:
      'One integrated stack replaces Kafka, Temporal or Camunda, an audit pipeline, and the glue code between them. Fewer systems to operate, fewer people to own them.',
  },
  {
    icon: Cpu,
    title: 'Less architecture sprawl',
    description:
      'One consistency contract instead of reconciling three. Outbox patterns, duplicate-event guards, and reconciliation pipelines are symptoms of a fragmented stack, not requirements.',
  },
  {
    icon: ShieldCheck,
    title: 'Audit and compliance by construction',
    description:
      'Immutable event history is how data is stored, not a layer added on top. Temporal queries and audit trails are first-class, not bolted on before an exam.',
  },
];

const offeringCards = [
  {
    title: 'Support for audit-driven deployments',
    description:
      'SLAs on workflow integrity, audit-trail validation, and temporal-history review. Not generic ticketing support.',
  },
  {
    title: 'Scalable operational modes',
    description:
      'PostgreSQL and Cassandra modes, including migration between them without changing your entity model.',
  },
  {
    title: 'Regulated procurement and rollout',
    description:
      'Procurement paperwork, security questionnaires, implementation, and rollout support for regulated industries.',
  },
  {
    title: 'Long-term engineering engagement',
    description:
      'Roadmap access, co-engineering on high-consequence workflows, and direct contact with the Cyoda core team.',
  },
];

const productionCards = [
  {
    title: 'Proven in production',
    description: 'In production since 2017 in regulated financial workflows.',
  },
  {
    title: 'One model, multiple operating modes',
    description:
      'Run the same Cyoda model in-memory, on SQLite, on PostgreSQL, or at enterprise scale with Cassandra.',
  },
  {
    title: 'No re-platforming wall',
    description:
      'Move from local iteration to durable and distributed deployment with a simple config change.',
  },
  {
    title: 'Built by practitioners',
    description:
      'Designed and built by engineers who spent decades building the core systems for global financial institutions.',
  },
];

const trackTalkToUs = () =>
  trackCtaConversion({ location: 'cto', page_variant: 'cto', cta: 'talk_to_us', url: '/contact' });

const Cto = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="For engineering leaders | Cyoda"
      description="The commercially supported EDBMS for stateful, auditable backend systems in regulated production. One consistency model for state, workflow, transactions, and history."
      url="https://cyoda.com/cto"
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
        <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center">
          <div className="mb-4">
            <span
              className="inline-flex items-center text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: 'hsl(175,45%,86%)', color: 'hsl(175,62%,24%)' }}
            >
              For engineering leaders
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5"
            style={{ color: 'hsl(215,28%,14%)' }}
          >
            The commercially supported platform for stateful, auditable systems in regulated production
          </h1>
          <p
            className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto"
            style={{ color: 'hsl(215,18%,38%)' }}
          >
            One consistency model for state, workflow, transactions, and history, with business
            logic in your code. Commercially supported for teams running production systems in regulated environments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="px-8 text-base font-semibold" asChild>
              <Link to="/contact" onClick={trackTalkToUs}>Talk to us</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-7 text-base font-semibold" asChild>
              <Link to="/#how-it-works">Read the architecture</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section 1 — Why engineering leaders choose Cyoda */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              WHY TEAMS CHOOSE CYODA
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Fewer moving parts, built-in auditability
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {benefitCards.map((card) => (
              <div key={card.title} className="rounded-xl border border-border bg-card p-6">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-muted/40 mb-4">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2 — What Cyoda replaces */}
      <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              ARCHITECTURE
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              What Cyoda replaces
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left: standard assembly */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                The standard assembly
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'PostgreSQL', note: 'storage' },
                  { name: 'Kafka', note: 'event streaming' },
                  { name: 'Temporal / Camunda', note: 'workflow orchestration' },
                  { name: 'Audit pipeline', note: 'separate service' },
                  { name: 'Glue code', note: 'outbox patterns, reconciliation, duplicate-event guards' },
                ].map((item) => (
                  <li key={item.name} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full shrink-0 bg-muted-foreground/40" />
                    <span className="text-sm text-foreground">
                      <span className="font-medium">{item.name}</span>{' '}
                      <span className="text-muted-foreground">: {item.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-muted-foreground border-t border-border pt-4">
                Three separate consistency contracts to reconcile, plus failure modes at each seam.
              </p>
            </div>

            {/* Right: Cyoda model */}
            <div className="rounded-xl border border-primary/30 bg-primary/[0.03] p-6">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                The Cyoda model
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'One entity model', note: 'state, workflow, transactions, and history' },
                  { name: 'One consistency contract', note: 'no reconciliation between systems' },
                  { name: 'One audit mechanism', note: 'immutable history, built in' },
                  { name: 'One storage model', note: 'PostgreSQL or Cassandra, same API' },
                  { name: 'Your business logic', note: 'via gRPC processor, no platform lock-in' },
                ].map((item) => (
                  <li key={item.name} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full shrink-0 bg-primary/60" />
                    <span className="text-sm text-foreground">
                      <span className="font-medium">{item.name}</span>{' '}
                      <span className="text-muted-foreground">: {item.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-muted-foreground border-t border-primary/20 pt-4">
                One consistency model for everything. Audit trails and temporal history are how data
                is stored, not added on top.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Section 3 — Enterprise offering */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              ENTERPRISE CYODA
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              What commercial engagement includes
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {offeringCards.map((card) => (
              <div key={card.title} className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-base font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Production proof */}
      <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))] border-y border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              TRACK RECORD
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Built for production
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Cyoda is designed for stateful, auditable systems that have to survive contact with
              real production constraints.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productionCards.map((card) => (
              <div key={card.title} className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-base font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 — CTA close */}
      <section className="py-20 md:py-28 bg-background border-t border-border">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="mx-auto mb-6 w-10 h-0.5 bg-primary rounded" />
          <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-8">
            If you're running stateful, auditable production workloads and you're evaluating whether
            to build or buy the platform layer, we'd like to talk.
          </p>
          <Button size="lg" className="px-10 text-base font-semibold" asChild>
            <Link to="/contact" onClick={trackTalkToUs}>Talk to us</Link>
          </Button>
        </div>
      </section>

    </main>
    <Footer />
  </div>
);

export default Cto;
