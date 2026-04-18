import { Server, Cloud, Building2 } from 'lucide-react';

const CyodaPathsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            DEPLOYMENT MODELS
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Three ways to run Cyoda
          </h2>
        </div>

        {/* Enterprise card — full width, primary */}
        <div className="rounded-xl border border-primary/30 bg-primary/[0.03] p-7 mb-5 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Enterprise Cyoda</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Commercially supported deployment for teams building regulated, auditable production
              systems. Includes procurement assistance, implementation support, SLAs, and ongoing
              engineering engagement with the Cyoda core team.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Talk to us
            </a>
          </div>
        </div>

        {/* Secondary row — OSS + Cloud */}
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
          Other ways to run Cyoda
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Run it yourself */}
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted/40">
                <Server className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Open Source
                </span>
                <h3 className="text-base font-semibold text-foreground leading-tight">Run it yourself</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              Open source Cyoda on your own infrastructure. Start with in-memory or SQLite,
              grow to PostgreSQL without changing your model.
            </p>
            <div className="mt-4">
              <a
                href="https://cyoda.org"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                cyoda.org →
              </a>
            </div>
          </div>

          {/* Cyoda Cloud */}
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted/40">
                <Cloud className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  SaaS
                </span>
                <h3 className="text-base font-semibold text-foreground leading-tight">Cyoda Cloud</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              Hosted Cyoda with a free evaluation tier. Managed control plane — your business
              logic runs in your code via gRPC.
            </p>
            <div className="mt-4">
              <a
                href="https://ai.cyoda.net/"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                ai.cyoda.net →
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CyodaPathsSection;
