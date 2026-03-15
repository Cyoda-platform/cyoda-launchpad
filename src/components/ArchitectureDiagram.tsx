const ArchitectureDiagram = () => {
  const leftSystems = [
    { name: 'Apache Cassandra', label: 'Distributed database' },
    { name: 'Apache ZooKeeper', label: 'Cluster coordination' },
    { name: 'Temporal / Conductor / Step Functions', label: 'Workflow orchestration' },
    { name: 'XState / Spring State Machine', label: 'Finite state machine enforcement' },
    { name: 'Custom SSI transaction manager', label: 'Cross-boundary consistency (most teams never fully solve this)' },
    { name: 'EventStoreDB / append-only tables', label: 'Immutable audit store' },
    { name: 'XTDB / custom event replay', label: 'Point-in-time query engine' },
    { name: 'Outbox pattern / dead-letter queues', label: 'Concurrency control and idempotency' },
    { name: 'gRPC / REST API layer', label: 'Client integration' },
  ];

  const rightCapabilities = [
    'Distributed database (Cassandra, built in)',
    'Cluster coordination (ZooKeeper, built in)',
    'Workflow orchestration engine',
    'Finite state machine enforcement',
    'SSI transaction manager across the DB-workflow boundary',
    'Immutable audit store (the storage mechanism itself, not a bolt-on)',
    'Point-in-time query engine, no retention window',
    'Event-context sharding and concurrency control',
    'gRPC API layer',
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left column — Without Cyoda */}
        <div className="bg-muted/50 rounded-xl p-6 border border-border">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Without Cyoda
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Nine components to assemble, wire, and keep consistent under failure
          </p>

          <div className="space-y-2">
            {leftSystems.map((system, index) => (
              <div key={system.name} className="bg-background border border-border rounded-lg p-3">
                <p className="text-sm font-semibold text-foreground">
                  <span className="text-muted-foreground/60 mr-2 font-mono text-xs">{index + 1}.</span>
                  {system.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 ml-5">{system.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm font-medium text-destructive">
            Glue code between every seam. The consistency guarantee only holds if you built it correctly across all nine.
          </p>
        </div>

        {/* Right column — With Cyoda */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            With Cyoda
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            One platform. One consistency model. All nine capabilities.
          </p>

          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-4">
            <p className="text-base font-bold text-foreground mb-1">Cyoda EDBMS</p>
            <p className="text-xs text-muted-foreground mb-3">Entity Database Management System</p>
            <ul className="space-y-1.5">
              {rightCapabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-primary mt-0.5 shrink-0">✓</span>
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            One consistency model. The audit trail is not added on top — it is how data is stored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
