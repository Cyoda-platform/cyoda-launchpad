import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import CloudWaitlistForm from '@/components/CloudWaitlistForm';
import { Card, CardContent } from '@/components/ui/card';
import { SiGithub } from 'react-icons/si';
import { Building2, History, ServerCog, GitBranch } from 'lucide-react';
import { organizationSchema } from '@/data/schemas';

const valueProps = [
  {
    icon: Building2,
    title: 'Production architecture from day one',
    body: 'Prototype on the same entity-database core a regulated institution would run. When real volume arrives, you change infrastructure — not your code or your data model.',
  },
  {
    icon: History,
    title: 'An audit trail by construction',
    body: 'Every entity state change is committed with its full history, queryable at any point in time. The artifact auditors and investors ask for, built in — not bolted on.',
  },
  {
    icon: ServerCog,
    title: 'Fully managed, zero ops',
    body: 'We run the platform, the storage, and the upgrades. You never patch a server or carry a pager.',
  },
  {
    icon: GitBranch,
    title: 'Your code stays yours',
    body: 'Business logic runs in compute nodes you own: your repository, your pipeline, your artifact. The platform never holds your source.',
  },
];

const waitlistPerks = [
  'Early access in invitation cohorts',
  'Founding-customer pricing',
  'A direct line to the engineers building it',
];

const CyodaCloud = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Cyoda Cloud — Coming Soon | Join the Waitlist"
      description="The new Cyoda Cloud: a fully managed platform for regulated workflows. Prototype to production without re-architecting. Join the waitlist for early access."
      url="https://cyoda.com/cloud"
      type="website"
      jsonLd={organizationSchema}
    />
    <Header />
    <main>
      {/* Hero with inline waitlist form */}
      <section className="pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary border border-primary/30 rounded-full px-3 py-1 mb-6">
              Coming soon
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
              The new Cyoda Cloud
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              A fully managed platform that runs your regulated workflows on Cyoda —
              start with a prototype, reach production without re-architecting.
            </p>
            <div className="max-w-md mx-auto rounded-2xl border border-border bg-card p-6 text-left">
              <h2 className="text-lg font-semibold text-foreground mb-4">Join the waitlist</h2>
              <CloudWaitlistForm />
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-16 bg-[hsl(var(--section-alt-bg))]">
        <div className="container mx-auto px-4">
          <h2 className="sr-only">Why Cyoda Cloud</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {valueProps.map((prop) => (
              <Card key={prop.title} className="border-border/60 bg-card/80">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <prop.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{prop.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{prop.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What waitlist members get */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <ul className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center list-none">
            {waitlistPerks.map((perk) => (
              <li key={perk} className="text-sm font-medium text-foreground">
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Anonymous alternative */}
      <section className="py-16 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Not ready to share your email?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Star{' '}
              <a
                href="https://github.com/Cyoda-platform/cyoda-cloud-cli"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline underline-offset-2"
              >
                cyoda-cloud-cli
              </a>{' '}
              on GitHub instead — every star is a vote to ship this sooner.
            </p>
            <a
              href="https://github.com/Cyoda-platform/cyoda-cloud-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-border bg-card font-semibold text-sm text-foreground hover:border-primary/40 transition-colors"
            >
              <SiGithub className="w-4 h-4" aria-hidden="true" />
              Star on GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default CyodaCloud;
