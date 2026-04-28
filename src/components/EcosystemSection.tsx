import { Shapes, GitBranch, RadioTowerIcon, Table } from 'lucide-react';

const EcosystemSection = () => {
    const features = [
        {
            icon: Shapes,
            title: "Entity-First Data Model",
            description: "Every entity has a schema, a lifecycle, and an immutable history. Configured in JSON, enforced by the platform."
        },
        {
            icon: GitBranch,
            title: "Workflows and State Machines",
            description: "Model business logic as explicit state machines with small, discrete steps. Easy for humans and AI to understand, develop, and manage."
        },
        {
            icon: RadioTowerIcon,
            title: "Event-Driven by Default",
            description: "State transitions are transactional. No manual deduplication, no compensating transactions."
        },
        {
            icon: Table,
            title: "Transactional Consistency and History",
            description: "Point-in-time queries on a distributed store with snapshot isolation. No ETL pipeline. No retention window."
        },
    ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            What's in the platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Four core capabilities. One consistency model.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
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
