import { Bot, Code, Rocket } from 'lucide-react';

const ThreeStepSection = () => {
  const steps = [
    {
      icon: Bot,
      title: "1. Let AI build your prototype",
      description: "Describe your application in natural language. Our AI understands complex business requirements and generates enterprise-grade data models, APIs, and workflows in seconds.",
      gradient: "bg-gradient-primary"
    },
    {
      icon: Code,
      title: "2. Iterate in your IDE",
      description: "Export to your favorite development environment. Customize, extend, and refine using familiar tools and workflows. Full control over your codebase.",
      gradient: "bg-gradient-accent"
    },
    {
      icon: Rocket,
      title: "3. Deploy to production",
      description: "One-click deployment to scalable infrastructure. Built-in monitoring, security, and compliance features ensure your application is production-ready from day one.",
      gradient: "bg-gradient-hero"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-background via-card to-secondary/20 relative">
      <div className="absolute inset-0 texture-overlay opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-6">
            Focus on the solution, not infrastructure
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your ideas into scalable applications with our AI-powered development platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur hover:bg-card/50 transition-all duration-300 glow-hover"
            >


              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${step.gradient} flex items-center justify-center mb-6 glow-primary`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Hover effect border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeStepSection;