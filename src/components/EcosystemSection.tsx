import {
    Table,
    Zap,
    GitBranch,
    RadioTowerIcon,
    Bot, Shapes
} from 'lucide-react';

const EcosystemSection = () => {
    const features = [
        {
            icon: Shapes,
            title: "Entity-First Data Models",
            description: "AI-assisted creation of rich structured models with validation, relationships, and business rules."
        },
        {
            icon: RadioTowerIcon,
            title: "Event-Driven Architecture",
            description: "EDA minus the complexity. Get scalability and decoupling " +
                "in a unified design that simplifies development and operations."
        },
        {
            icon: Zap,
            title: "Open APIs & gRPC",
            description: "Unified APIs for models, config, and data. Strongly‑typed interactions over gRPC for reliability and realtime integration."
        },
        {
            icon: GitBranch,
            title: "Workflow & State Machines",
            description: "Encode approvals, transitions, and complex lifecycle rules directly into your applications."
        },
        {
            icon: Table,
            title: "Distributed SQL Reporting",
            description: "Familiar SQL queries on a scalable, distributed store with snapshot isolation for consistent results."
        },
        {
            icon: Bot,
            title: "AI Co‑Builder",
            description: "Go from problem statement to runnable services with explainable suggestions, " +
                "enabling faster iteration without “black box” changes"
        }
    ];

  return (
    <section className="py-24 relative">
      {/* Abstract background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-card opacity-5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-card opacity-10 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-card opacity-5 blur-2xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Discover the Cyoda Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A  platform designed for modern application development
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-border/50 bg-card/20 backdrop-blur hover:bg-card/40 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-icon flex items-center justify-center">
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
  );
};

export default EcosystemSection;