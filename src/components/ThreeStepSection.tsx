
import { Button } from "@/components/ui/button";
import { Bot, Code, Rocket } from "lucide-react";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";

const ThreeStepSection = () => {
  const steps = [
    {
      icon: Bot,
      title: "1. Let AI build your prototype",
      description: "Describe your application in natural language. Our AI understands complex business requirements and generates enterprise-grade data models, APIs, and workflows in minutes.",
      gradient: "bg-gradient-primary"
    },
    {
      icon: Code,
      title: "2. Iterate in your IDE",
      description: "Clone to your favorite development environment. Customize, extend, and refine using familiar tools and workflows. Full control over your codebase.",
      gradient: "bg-gradient-accent"
    },
    {
      icon: Rocket,
      title: "3. Deploy to production",
      description: (
        <>
          One-click deployment to scalable infrastructure
          <sup>
            <HashLink
              to="#footnote-production"
              className="text-primary hover:text-primary/80 no-underline ml-0.5 text-sm font-semibold"
              smooth
            >
              *
            </HashLink>
          </sup>
          . Built-in monitoring, security, and compliance features ensure your application is production-ready from day one.
        </>
      ),
      gradient: "bg-gradient-hero"
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-background via-card to-secondary/20 relative">
        <div className="absolute inset-0 texture-overlay opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="mobile-text-3xl font-bold text-gradient-primary mb-4 sm:mb-6">
            Focus on the solution, not infrastructure
          </h2>
          <p className="mobile-text-lg text-muted-foreground max-w-3xl mx-auto">
            Transform your ideas into scalable applications with our AI-powered development platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative p-6 sm:p-7 md:p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur hover:bg-card/50 transition-all duration-300 glow-hover"
            >


              {/* Icon */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl ${step.gradient} flex items-center justify-center mb-6 glow-primary`}>
                <step.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="mobile-text-xl font-bold mb-3 sm:mb-4 text-foreground">
                {step.title}
              </h3>
              <p className="mobile-text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Hover effect border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
        {/* Call to action */}
        <div className="pt-8 flex justify-center">
            <Button
                asChild
                size="mobile-lg"
                className="bg-gradient-primary text-white mobile-btn-text-lg px-6 py-3 sm:px-8 sm:py-4 glow-primary min-h-[44px]"
            >
                <a href="https://ai.cyoda.net" target="_blank" rel="noopener noreferrer">
                    Try Now
                </a>
            </Button>
        </div>

        {/* Footnote */}
        <div className="mt-8 pt-4 border-t border-border/30 max-w-6xl mx-auto">
          <p id="footnote-production" className="text-xs text-muted-foreground text-center">
            <span className="font-semibold text-primary">*</span>
              Production-grade support with an SLA is currently only available with an enterprise license.
              See our <Link to="/terms-of-service" className="text-primary hover:text-primary/80 underline underline-offset-2">terms of service</Link> for more details about our subscription plans.
          </p>
        </div>
    </section>
  );
};

export default ThreeStepSection;