// src/components/ThreeBenefitsSection.tsx
import { GaugeCircle, Layers3, ShieldCheck } from "lucide-react";

const ThreeBenefitsSection = () => {
    const benefits = [
        {
            icon: GaugeCircle,
            title: "1. Innovate Heavyweight Systems at AI Speed",
            description:
                "Go beyond simple apps. Our unified platform lets you build and flex stateful, event-driven systems with transactional consistency, security, and horizontal scalability for mission-critical workloads.",
            gradient: "bg-primary",
        },
        {
            icon: Layers3,
            title: "2. Smaller Teams, Fewer Skills, Faster Delivery",
            description:
                "Eliminate diverse platform engineering stacks. A single architecture streamlines the whole path from design to deployment, so small teams deliver complex systems with unprecedented speed.",
            gradient: "bg-secondary",
        },
        {
            icon: ShieldCheck,
            title: "3. Built-In Compliance and Audit",
            description:
                "Every action is an immutable event with full data lineage. Reporting and compliance come as standard, making audit readiness a feature instead of a costly afterthought.",
            gradient: "bg-secondary",
        },
    ];

    return (
        <section className="py-16 sm:py-20 md:py-24 relative">
            <div className="absolute inset-0 texture-overlay opacity-30" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="mobile-text-3xl font-bold text-foreground">
                        Why clients choose Cyoda
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {benefits.map((b, i) => (
                        <div
                            key={i}
                            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur p-6 sm:p-8 shadow-xl"
                        >
                            {/* Icon */}
                            <div
                                className={`w-12 h-12 sm:w-14 sm:h-14 ${b.gradient} flex items-center justify-center rounded-xl mb-6`}
                            >
                                <b.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="mobile-text-xl font-bold mb-3 sm:mb-4 text-foreground">
                                {b.title}
                            </h3>
                            <p className="mobile-text-sm text-muted-foreground leading-relaxed">
                                {b.description}
                            </p>

                            {/* Hover ring */}
                            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-primary/20 transition-colors duration-300" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ThreeBenefitsSection;