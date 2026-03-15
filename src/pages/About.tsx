import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema } from '@/data/schemas';
import { Card, CardContent } from '@/components/ui/card';

const founders = [
  {
    initials: 'PS',
    name: 'Patrick Stanton',
    title: 'CEO & Co-Founder',
    bio: '30+ years building core systems for global investment banks. LCH Automated Brokerage Service. Dresdner Kleinwort fixed income settlement (Frankfurt). Westpac FX (Sydney). Macquarie treasury and equity derivatives — live during the GFC. Intesa Sanpaolo (Milan). Co-founded Cyoda in 2012. Mechanical Engineering, University of Leeds.',
  },
  {
    initials: 'PSch',
    name: 'Paul Schleger PhD',
    title: 'CTO & Co-Founder',
    bio: 'Experimental physicist background. 25 years in financial software. Co-architect of the Entity Database Management System concept. Based in Vancouver.',
  },
];

const timeline = [
  { year: '2012', event: 'Cyoda founded' },
  { year: '2015', event: 'Full-time operations, London' },
  { year: '2017', event: 'First production deployment (VC Trade, European private-debt market)' },
  { year: '2025', event: 'Cyoda Cloud live beta launched (free tier at ai.cyoda.net)' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="About | Cyoda"
        description="Built by engineers who spent careers building the core regulated systems that run global investment banks. Cyoda reflects what financial systems actually need."
        url="https://cyoda.com/about"
        type="website"
        jsonLd={organizationSchema}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Built by People Who Lived the Problem
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Cyoda was not designed from first principles. It was designed by engineers who
                spent careers building the back-office systems that needed it at LCH, Dresdner
                Kleinwort, Westpac, Macquarie, and Intesa Sanpaolo. The platform reflects what
                those systems actually needed.
              </p>
            </div>
          </div>
        </section>

        {/* Founder bios */}
        <section className="py-16 md:py-24 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-6xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              THE TEAM
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">
              The Founders
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {founders.map((founder) => (
                <Card key={founder.name}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Initials avatar */}
                      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                        {founder.initials}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {founder.name}
                        </h3>
                        <p className="text-sm text-primary mb-3">{founder.title}</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {founder.bio}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              HISTORY
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">
              Company Timeline
            </h2>
            <div className="relative max-w-xl">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
              <ol className="space-y-8">
                {timeline.map((item) => (
                  <li key={item.year} className="flex items-start gap-6 relative">
                    {/* Dot */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shrink-0 z-10">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div className="pt-1.5">
                      <span className="text-sm font-bold text-primary">{item.year}</span>
                      <p className="text-muted-foreground mt-0.5">{item.event}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 md:py-24 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-6xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              MISSION
            </p>
            <blockquote className="max-w-3xl text-xl md:text-2xl text-foreground font-medium leading-relaxed border-l-4 border-primary pl-6">
              "We built Cyoda because we were tired of rebuilding the same infrastructure at
              every bank we worked at. The problem was always the same — state management, audit,
              consistency under failure — and the solution was always duct tape. Cyoda is the
              solution we would have paid for."
            </blockquote>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
