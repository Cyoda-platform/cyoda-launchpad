import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { ComparisonTable } from '@/components/ComparisonTable';
import { organizationSchema } from '@/data/schemas';

const WIN_LOSS_SUMMARY = [
  {
    competitor: 'Temporal',
    cyodaWins: [
      'Audit trail built-in, not app logic',
      'Data + workflow in one consistency model',
      'No glue between DB and orchestrator',
      'Point-in-time queries without extra tooling',
      'ACID across distributed long-lived workflows',
    ],
    theyWin: [
      'Larger community & ecosystem',
      'More SDK language options',
      'Easier for general microservices',
      'Proven hyperscale deployments',
    ],
  },
  {
    competitor: 'Camunda',
    cyodaWins: [
      'No separate DB needed',
      'Regulatory audit trail is intrinsic',
      'ACID consistency out of the box',
      'Built for machine-to-machine workflows',
      'Designed for high-volume financial data',
    ],
    theyWin: [
      'Business analyst-friendly BPMN editor',
      'Human task management built-in',
      'Huge enterprise customer base',
      'DMN decision tables for business rules',
    ],
  },
  {
    competitor: 'Confluent/Kafka',
    cyodaWins: [
      'Transactional entity state (not just events)',
      'No app-level conflict resolution needed',
      'Workflow + data in one system',
      'Full audit history out of the box',
      'ACID, not just ordering guarantees',
    ],
    theyWin: [
      'Massive throughput at scale',
      'Industry-standard integration hub',
      'Ubiquitous ecosystem & connectors',
      'Ideal for pure stream analytics',
    ],
  },
  {
    competitor: 'AxonIQ',
    cyodaWins: [
      'All-in-one: no separate DB + broker needed',
      'JSON-configurable entity models',
      'Designed specifically for FS back-office',
      'ACID consistency with SSI guarantee',
      'Point-in-time queries native',
    ],
    theyWin: [
      'Pure DDD/CQRS pattern support',
      'Strong Java/Spring community',
      'Flexible for event-driven microservices',
      'More widely known in DDD circles',
    ],
  },
  {
    competitor: 'XTDB',
    cyodaWins: [
      'Built-in workflow engine',
      'ACID distributed transactions',
      'Financial services production track record',
      'Managed cloud available now',
      'Horizontal scale proven (Cassandra-backed)',
    ],
    theyWin: [
      'Standard SQL interface',
      'True bitemporal (valid time + system time)',
      'Open source / no license cost',
      'Simpler for pure data use cases',
    ],
  },
];

export default function Comparison() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Cyoda vs Temporal, Camunda, Kafka — Platform Comparison"
        description="See how Cyoda's EDBMS compares to Temporal, Camunda, Confluent/Kafka, AxonIQ, and XTDB across the capabilities that matter in regulated financial services."
        url="https://cyoda.com/comparison"
        jsonLd={organizationSchema}
      />
      <Header />
      <main>

        {/* Hero section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              PLATFORM COMPARISON
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Why Teams Choose Cyoda Over the Standard Stack
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Temporal for orchestration, Camunda for workflows, Kafka for events — each is excellent at what it does.
              The hard part is making them consistent with each other. Cyoda eliminates that problem.
            </p>
          </div>
        </section>

        {/* Comparison matrix */}
        <section className="py-12 md:py-20 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Head-to-Head Comparison
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Across the dimensions that matter in financial services and regulated back-office systems.
              </p>
            </div>
            <ComparisonTable />

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">✓ Native</span>
                Fully supported natively
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">~ Partial</span>
                Partial or via extension
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">✗ No</span>
                Not supported
              </div>
            </div>
          </div>
        </section>

        {/* Win/Loss summary cards */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                When to Choose Cyoda
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Cyoda is purpose-built for stateful, auditable, transactional entity workflows.
                Here's how the trade-offs break down by competitor.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
              {WIN_LOSS_SUMMARY.map(({ competitor, cyodaWins, theyWin }) => (
                <div key={competitor} className="bg-card border border-border rounded-xl p-5">
                  <h3 className="text-sm font-bold text-foreground mb-4">vs. {competitor}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Cyoda Wins</p>
                      <ul className="space-y-1">
                        {cyodaWins.map(w => (
                          <li key={w} className="text-xs text-muted-foreground border-b border-border pb-1 last:border-0">
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">{competitor} Wins</p>
                      <ul className="space-y-1">
                        {theyWin.map(w => (
                          <li key={w} className="text-xs text-muted-foreground border-b border-border pb-1 last:border-0">
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to evaluate Cyoda?
            </h2>
            <p className="text-muted-foreground mb-8">
              Free tier available at ai.cyoda.net. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://ai.cyoda.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Start Evaluating for Free
              </a>
              <a
                href="https://docs.cyoda.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-border text-foreground font-semibold text-sm hover:bg-muted/40 transition-colors"
              >
                Read the Docs
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
