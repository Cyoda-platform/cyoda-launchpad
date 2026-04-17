import { Server, Cloud, Building2 } from 'lucide-react';

const paths = [
  {
    icon: Server,
    badge: 'Open Source',
    title: 'Run it yourself',
    description:
      'Open-source Cyoda. Developer-first, local-first, self-hosted. Start on your own terms with full control over your deployment.',
    cta: 'cyoda.org',
    href: 'https://cyoda.org',
    external: true,
    highlight: false,
  },
  {
    icon: Cloud,
    badge: 'SaaS',
    title: 'Cyoda Cloud',
    description:
      'Hosted Cyoda. No infrastructure to manage, no cluster to operate. Start building immediately at ai.cyoda.net.',
    cta: 'ai.cyoda.net',
    href: 'https://ai.cyoda.net/',
    external: true,
    highlight: false,
  },
  {
    icon: Building2,
    badge: 'You are here',
    title: 'Enterprise Cyoda',
    description:
      'Commercially supported, scalable Cyoda for organisations that need production resilience, compliance assurance, and enterprise engagement.',
    cta: 'Talk to us',
    href: '/contact',
    external: false,
    highlight: true,
  },
];

const CyodaPathsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            THREE WAYS TO USE CYODA
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Choose your path
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paths.map((path) => {
            const Icon = path.icon;
            return (
              <div
                key={path.title}
                className={`relative p-6 rounded-xl border transition-all duration-300 flex flex-col ${
                  path.highlight
                    ? 'border-primary bg-primary/5 shadow-[0_0_20px_hsl(var(--primary)/0.15)]'
                    : 'border-border/50 bg-card/20 hover:bg-card/40'
                }`}
              >
                {/* Badge */}
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded ${
                      path.highlight
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    {path.badge}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      path.highlight ? 'bg-primary/20' : 'bg-muted/30'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${path.highlight ? 'text-primary' : 'text-muted-foreground'}`}
                    />
                  </div>
                </div>

                {/* Title + description */}
                <h3 className="text-lg font-semibold text-foreground mb-2">{path.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {path.description}
                </p>

                {/* CTA */}
                <div className="mt-5">
                  {path.external ? (
                    <a
                      href={path.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center text-sm font-medium transition-colors ${
                        path.highlight
                          ? 'text-primary hover:text-primary/80'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {path.cta} →
                    </a>
                  ) : (
                    <a
                      href={path.href}
                      className={`inline-flex items-center text-sm font-medium transition-colors ${
                        path.highlight
                          ? 'text-primary hover:text-primary/80'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {path.cta} →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CyodaPathsSection;
