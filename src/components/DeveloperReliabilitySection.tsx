import { ScrollArea } from '@/components/ui/scroll-area';

const DeveloperReliabilitySection = () => {
  const complexEntityJson = `{
  "loanId": "string",
  "borrowerId": "string",
  "borrowerName": "string",
  "principalAmount": 0,
  "interestRate": 0.0,

  "currentState": "Application",
  "stateHistory": [
    {
      "state": "Application",
      "transitionedAt": "ISO8601",
      "transitionedBy": "string",
      "reason": "string",
      "snapshotRef": "string"
    }
  ],

  "terms": {
    "drawdownDate": "ISO8601",
    "maturityDate": "ISO8601",
    "repaymentSchedule": "monthly|quarterly|bullet",
    "facility": "revolving|term"
  },

  "covenants": [
    {
      "type": "financial|informational",
      "description": "string",
      "breached": false,
      "nextTestDate": "ISO8601"
    }
  ],

  "counterparty": {
    "lenderId": "string",
    "agentBankId": "string|null",
    "jurisdiction": "GB|EU|US"
  }
}`;

  return (
    <section className="py-24 bg-gradient-to-br from-background via-card to-secondary/20 relative">
      <div className="absolute inset-0 texture-overlay opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-accent mb-6">
            How the platform models a business entity
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Handle complex entities, relationships, and business logic with confidence.
            Cyoda excels at modeling intricate data structures that real enterprises depend on.
          </p>
        </div>

        {/* Non-technical intro block */}
        <div className="max-w-3xl mx-auto mb-10 bg-card/30 border border-border/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Evaluating Cyoda without an engineer in the room?
          </h3>
          <p className="text-muted-foreground mb-3">
            The short version: Cyoda replaces several years of platform engineering work with configuration. Every business entity (a loan, a trade, a KYC record) is modeled with its own lifecycle, its own history, and its own transition rules. Your team defines the business logic. Cyoda handles consistency, audit, and scale.
          </p>
          <p className="text-muted-foreground">
            For the technical detail, the architecture is below. For a working prototype, go to{' '}
            <a href="https://ai.cyoda.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline underline-offset-2">ai.cyoda.net</a>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* LEFT: JSON example */}
          <div className="w-full">
            <div className="bg-card/10 backdrop-blur border border-border/50 rounded-2xl p-6 glow-primary h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Complex Entity Model (Example)</h3>
                <div className="text-xs text-muted-foreground">cyoda: entity-first • event-sourced • audited</div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-muted-foreground">/models/entity.json</span>
              </div>
              <ScrollArea className="h-96 w-full md:h-[28rem]">
                <pre className="code-block text-[10px] md:text-[11px] leading-tight">
                  <code
                    dangerouslySetInnerHTML={{
                      __html: complexEntityJson
                        .replace(/"([^"]+)":/g, '<span class="key">"$1":</span>')
                        .replace(/: "([^"]+)"/g, ': <span class="string">"$1"</span>')
                        .replace(/: (\d+)(?![^<]*>)/g, ': <span class="number">$1</span>')
                        .replace(/: (true|false)/g, ': <span class="boolean">$1</span>')
                    }}
                  />
                </pre>
              </ScrollArea>
            </div>
          </div>

            {/* RIGHT: Why Cyoda */}
            <div className="w-full">
                <div className="bg-card/10 backdrop-blur border border-border/50 rounded-2xl p-6 h-full">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                        Why Cyoda for Complex, Structured Data
                    </h3>
                    <ul className="space-y-3 text-lg text-muted-foreground text-left">
                        <li>
                            <span className="font-medium text-foreground">Entity-first modeling:</span>
                            &nbsp;Capture rich business objects with nested attributes and relationships, without rigid schemas or complex joins.
                        </li>
                        <li>
                            <span className="font-medium text-foreground">Immutable, write-only ledger:</span>
                            &nbsp;Every change is stored as an event, preserving full lineage and audit for compliance and trust.
                        </li>
                        <li>
                            <span className="font-medium text-foreground">Stateful workflows & rules:</span>
                            &nbsp;Bind rules and actions directly to entity state transitions for straight-through processing.
                        </li>
                        <li>
                            <span className="font-medium text-foreground">Snapshot isolation:</span>
                            &nbsp;Query consistent views of data without blocking writes, even under heavy concurrent workloads.
                        </li>
                        <li>
                            <span className="font-medium text-foreground">Historical reporting:</span>
                            &nbsp;Analyze system state as it was at any point in time, supporting compliance and business insight.
                        </li>
                        <li>
                            <span className="font-medium text-foreground">Scale & reliability:</span>
                            &nbsp;Distributed architecture built for high-volume, high-integrity enterprise data flows.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperReliabilitySection;