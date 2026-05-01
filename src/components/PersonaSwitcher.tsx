import { useState } from 'react';
import { Layers3, ShieldCheck, GaugeCircle, Code2, Boxes, Rocket } from 'lucide-react';

type Persona = 'leader' | 'developer';

const leaderCards = [
  {
    icon: Layers3,
    title: 'Avoid building a platform team',
    description:
      'The Kafka specialist, the Temporal specialist, the audit pipeline engineer: those are hires you do not need to make. Cyoda replaces what would otherwise require three separate engineering specialisms.',
  },
  {
    icon: ShieldCheck,
    title: 'Audit-ready from day one',
    description:
      'Every entity transition is an immutable event with full data lineage. When an enterprise client or regulator asks for historical state reconstruction, the answer is seconds, not a sprint.',
  },
  {
    icon: GaugeCircle,
    title: 'Add workflow states without a rewrite',
    description:
      'New lifecycle states are configuration changes, not coordinated schema migrations across three systems.',
  },
];

const developerCards = [
  {
    icon: Code2,
    title: 'Your business logic, the platform\u2019s consistency',
    description:
      'Processors run in your code, in your language, via gRPC. Transactions, sharding, workflow orchestration, and audit history are platform-level. Not things you generate and maintain in application code.',
  },
  {
    icon: Boxes,
    title: 'One consistency model, nine capabilities',
    description:
      'Distributed transactional store, finite state machine enforcement, SSI transaction manager, immutable audit store, point-in-time queries \u2014 shipped as a single consistency contract with no glue code between them.',
  },
  {
    icon: Rocket,
    title: 'Start at ai.cyoda.net, clone into your IDE',
    description:
      'Describe your application. The AI generates entity models, state machine config, and gRPC scaffolding. Deploy to Cyoda Cloud or your own Kubernetes cluster.',
  },
];

const PersonaSwitcher = () => {
  const [persona, setPersona] = useState<Persona>('leader');
  const cards = persona === 'leader' ? leaderCards : developerCards;

  return (
    <section className="py-16 sm:py-20 md:py-24 relative">
      <div className="absolute inset-0 texture-overlay opacity-30" />
      <div className="container mx-auto px-4 relative z-10">

        {/* Toggle */}
        <div className="flex flex-col items-center mb-10">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
            ROLE
          </p>
          <div className="inline-flex rounded-full border border-border/60 bg-card/60 p-1 gap-1">
            <button
              onClick={() => setPersona('leader')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                persona === 'leader'
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Business
            </button>
            <button
              onClick={() => setPersona('developer')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                persona === 'developer'
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Builder
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur p-6 sm:p-8 shadow-xl"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/15 flex items-center justify-center rounded-xl mb-6">
                <card.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="mobile-text-xl font-bold mb-3 sm:mb-4 text-foreground">
                {card.title}
              </h3>
              <p className="mobile-text-sm text-muted-foreground leading-relaxed">
                {card.description}
              </p>
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-primary/20 transition-colors duration-300" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PersonaSwitcher;
