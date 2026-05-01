type Status = 'win' | 'lose' | 'partial';

interface Capability {
  label: string;
  ratings: [Status, Status, Status, Status, Status, Status];
  cyodaLabel: string;
  notes: [string, string, string, string, string, string];
}

const COMPETITORS = ['Cyoda (EDBMS)', 'Temporal', 'Camunda', 'Confluent/Kafka', 'AxonIQ', 'XTDB'];

const CAPABILITIES: Capability[] = [
  {
    label: 'Unified data + workflow (no glue code)',
    ratings: ['win', 'lose', 'lose', 'lose', 'partial', 'lose'],
    cyodaLabel: 'Native',
    notes: ['Native', 'Requires DB', 'Requires DB', 'No state', 'Partial', 'No workflow'],
  },
  {
    label: 'Point-in-time / bitemporal queries',
    ratings: ['win', 'lose', 'lose', 'lose', 'partial', 'win'],
    cyodaLabel: 'Intrinsic',
    notes: ['Intrinsic', 'No', 'No', 'No', 'Limited', 'Native'],
  },
  {
    label: 'ACID + distributed long-lived workflows',
    ratings: ['win', 'partial', 'partial', 'lose', 'partial', 'lose'],
    cyodaLabel: 'SSI',
    notes: ['SSI', 'Durable exec', 'Via ext DB', 'Not transactional', 'Framework only', 'No workflow'],
  },
  {
    label: 'Intrinsic audit trail (not bolt-on)',
    ratings: ['win', 'lose', 'lose', 'lose', 'partial', 'win'],
    cyodaLabel: 'Write-only store',
    notes: ['Write-only store', 'App-level', 'App-level', 'Log only', 'Event store', 'Immutable'],
  },
  {
    label: 'Finite state machine per entity',
    ratings: ['win', 'lose', 'partial', 'lose', 'partial', 'lose'],
    cyodaLabel: 'First-class',
    notes: ['First-class', 'Code-only', 'BPMN', 'No', 'Aggregates', 'No'],
  },
  {
    label: 'No external DB or broker required',
    ratings: ['win', 'lose', 'lose', 'lose', 'lose', 'lose'],
    cyodaLabel: 'All-in-one',
    notes: ['All-in-one', 'Needs DB', 'Needs DB', 'Broker only', 'Needs infra', 'DB only'],
  },
  {
    label: 'Horizontal scale + ACID',
    ratings: ['win', 'win', 'partial', 'win', 'partial', 'partial'],
    cyodaLabel: 'Cassandra-backed',
    notes: ['Cassandra-backed', 'Yes', 'Depends on DB', 'High throughput', 'Axon Server', 'Maturing'],
  },
  {
    label: 'Financial services production pedigree',
    ratings: ['win', 'partial', 'win', 'win', 'partial', 'lose'],
    cyodaLabel: 'Since 2017',
    notes: ['Since 2017', 'General use', 'Banking/Insurance', 'Widespread', 'General use', 'Early stage'],
  },
  {
    label: 'Managed cloud / SaaS option',
    ratings: ['win', 'win', 'win', 'win', 'partial', 'partial'],
    cyodaLabel: 'Cyoda Cloud',
    notes: ['Cyoda Cloud', 'Temporal Cloud', 'SaaS + self-mgd', 'Confluent Cloud', 'AxonIQ Cloud', 'Open source'],
  },
  {
    label: 'Language-agnostic (gRPC / multi-SDK)',
    ratings: ['win', 'win', 'win', 'win', 'partial', 'partial'],
    cyodaLabel: 'gRPC / any lang',
    notes: ['gRPC / any lang', 'Multi-SDK', 'REST/API', 'Multi-lang', 'JVM primary', 'Clojure/Java'],
  },
  {
    label: 'Regulatory-grade SSI consistency',
    ratings: ['win', 'lose', 'lose', 'lose', 'lose', 'partial'],
    cyodaLabel: 'Explicit SSI',
    notes: ['Explicit SSI', 'No ACID', 'Delegated to DB', 'Eventual only', 'Framework only', 'HTAP, maturing'],
  },
];

const statusConfig = {
  win:     { icon: '✓', classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  lose:    { icon: '✗', classes: 'bg-red-500/10 text-red-400 border border-red-500/20' },
  partial: { icon: '~', classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
};

function StatusBadge({ status, label }: { status: Status; label: string }) {
  const { icon, classes } = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${classes}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-card border-b border-border">
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[220px]">
              Capability
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-primary uppercase tracking-wider bg-primary/5">
              Cyoda (EDBMS)
            </th>
            {COMPETITORS.slice(1).map(c => (
              <th key={c} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CAPABILITIES.map((cap, i) => (
            <tr
              key={cap.label}
              className={`border-b border-border hover:bg-muted/30 transition-colors ${i % 2 === 0 ? 'bg-background' : 'bg-card/50'}`}
            >
              <td className="px-4 py-3 text-muted-foreground font-medium text-sm leading-snug">
                {cap.label}
              </td>
              {cap.ratings.map((status, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 ${j === 0 ? 'bg-primary/5' : ''}`}
                >
                  <StatusBadge status={status} label={cap.notes[j]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
