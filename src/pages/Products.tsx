import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    Database,
    Cloud,
    Zap,
    BarChart3,
    Bot,
    CheckCircle,
    Anvil,
    ShieldCheck, Boxes, Workflow
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Products = () => {
    const features = [
        {
            icon: Database,
            title: "Entity Database",
            description: "Model business entities as immutable facts with full history and point in time historical querying, giving developers and enterprises a reliable single source of truth."
        },
        {
            icon: Zap,
            title: "Event-Driven Processing",
            description: "React to every state change in real time with scalable, event-streamed workflows that keep services responsive and decoupled."
        },
        {
            icon: ShieldCheck,
            title: "Transactional Consistency",
            description: "Cluster-wide ACID transactions ensure correctness and reduce operational risk, even at enterprise scale."
        },
        {
            icon: Boxes,
            title: "Horizontal Scalability",
            description: "Scale across nodes to handle growing data volumes and workloads without costly re-architecture."
        },
        {
            icon: Workflow,
            title: "Automated Workflows",
            description: "Attach business rules and actions directly to entity state transitions, streamlining complex processes into simple, reliable flows."
        },
        {
            icon: BarChart3,
            title: "SQL & Snapshot Isolation",
            description: "Run SQL queries over current and historical dates with distributed scalable execution, enabling fast insight and compliance reporting."
        }
    ];

  const platforms = [
    {
      icon: Bot,
      name: "AI Assistant",
      description: "Create your prototype in minutes",
      features: ["Build deterministic or agentic services", "Supports multiple programming languages", "Open Source", "Deploy Services"]
    },
    {
      icon: Anvil,
      name: "Cyoda Application Platform",
      description: "Do more with less code",
      features: ["Entity Database", "Horizontally scalable", "Event Driven Architecture", "Transactional Consistency"]
    },
    {
      icon: Cloud,
      name: "Cyoda Cloud",
      description: "Test for free",
      features: ["Cloud Native", "Thin Client Computing","Auto failover", "High Availability"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-background via-card to-secondary/20 relative">
          <div className="absolute inset-0 texture-overlay opacity-30" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gradient-hero mb-6">
                  Focus on Solutions,<br/> not Infrastructure
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                  A stateful, event-driven platform with an entity database, processing via workflows, horizontally scalable, transactional consistency and real-time insight without complex infrastructure.
              </p>
              <Button
                size="lg"
                className="bg-gradient-primary text-white text-lg px-8 py-4 glow-primary"
                onClick={() => window.open('https://ai.cyoda.net', '_blank')}
              >
                Start Building Today
              </Button>
            </div>
          </div>
        </section>

        {/* Platform Overview */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-6">
                The Enterprise Application Platform
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Freeing developers to focus on building business value, not infrastructure.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {platforms.map((platform, index) => (
                <div
                  key={index}
                  className="p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur hover:bg-card/50 transition-all duration-300 glow-hover"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 glow-primary">
                    <platform.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {platform.name}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {platform.description}
                  </p>

                  <ul className="space-y-3">
                    {platform.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-cyoda-green mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-gradient-dark relative">
          <div className="absolute inset-0 texture-overlay opacity-20" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gradient-accent mb-6">
                Enterprise-Grade Features
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Build, deploy, and scale on a <b>single unified platform</b>. <br/> Cut complexity and achieve more with less.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-xl border border-border/50 bg-card/20 backdrop-blur hover:bg-card/40 transition-all duration-300 glow-hover"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center glow-primary">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-hero mb-6">
              Ready to Transform Your Development?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start building the future with Cyoda's AI-powered platform.
            </p>
            <Button
              size="lg"
              className="bg-gradient-primary text-white text-lg px-8 py-4 glow-primary mr-4"
              onClick={() => window.open('https://ai.cyoda.net', '_blank')}
            >
              Try Now
            </Button>
            <Button
              size="lg"
              className="bg-gradient-primary text-white text-lg px-8 py-4 glow-primary mr-4"
              onClick={() => window.open('https://docs.cyoda.net/', '_blank')}
            >
              View Docs
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;