import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, X } from 'lucide-react';
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

const Pricing = () => {
  const plans = [
    {
      name: "Trial",
      price: "Free",
      description: "Perfect for trying out the the platform",
      features: [
          'Cyoda Cloud access',
          'AI Assistant included',
          'Basic usage limits',
          'Community support'
      ],
      limitations: [
        "Limited deployment options",
        "Basic monitoring"
      ],
      cta: "Get Started Free",
      available: true
    },
    {
      name: "Developer",
      price: "TBD",
      period: "/month",
      description: "Developers and small teams",
      features: [
          'Expanded Cyoda Cloud resources',
          'AI Assistant included',
          'Higher usage quotas',
          'Community support'
      ],
      limitations: [],
      cta: "Start Free Trial",
        available: false
    },
      {
          name: "Professional",
          price: "TBD",
          period: "/month",
          description: "Developers and small teams",
          features: [
              'Cloud deployment options (AWS/GCP/Azure)',
              'AI Assistant included',
              'Increased capacity and performance',
              'Priority support'
          ],
          limitations: [],
          cta: "Start Free Trial",
          available: false
      },
    {
      name: "Enterprise",
      price: "Contact us",
      description: "For organizations with advanced needs",
      features: [

          'Private cloud or on‑prem deployment',
          'Unlimited scale and usage',
          'Full compliance and SLA guarantees',
          'Dedicated support'
      ],
      limitations: [],
      cta: "Contact Sales",
        available: true
    }
  ];

  const faqs = [
    {
      question: "Can I change my plan anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, or at the end of your billing cycle for downgrades."
    },
      {
          question: "No plan fits my needs",
          answer: "Contact our sales team, we'll be happy to help."
      },
    {
      question: "Is there a free version available?",
      answer: "Yes! You can try Cyoda for free. No credit card required to start."
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "Your data remains accessible for 30 days after cancellation. You can export all your applications and data during this period."
    },
    {
      question: "Do you offer discounts for students or nonprofits?",
      answer: " Contact our support team for more information."
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
                Get Building for Free
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                All plans include our open source AI builder.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <div 
                  key={index}
                  className={`relative p-8 rounded-xl border transition-all duration-300  border-primary bg-card/50 glow-primary scale-105`}
                >
                  {!plan.available && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                        Coming Soon
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-2xl font-bold text-gradient-primary">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-muted-foreground ml-1">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-cyoda-green mr-3 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, idx) => (
                      <div key={idx} className="flex items-center">
                        <X className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </div>
                    ))}
                  </div>

                    {plan.name === "Enterprise" ? (
                        <Button
                            className={`w-full bg-gradient-primary text-white glow-primary"}`}
                            asChild
                        >
                            <HashLink smooth to="/support#contact">
                                {plan.cta}
                            </HashLink>

                        </Button>
                    ) : (
                        <Button
                            className={`w-full bg-gradient-primary text-white glow-primary`}
                            onClick={() => window.open("https://ai.cyoda.net", "_blank")}
                        >
                            {plan.cta}
                        </Button>
                    )}
                </div>
              ))}
            </div>
              <div className="text-center mt-12">
                  <p className="text-xl md:text-lg font-semibold text-gradient-accent mb-6">
                      Full details of entitlements and limits are available in our{' '}
                      <a href="https://docs.cyoda.net/platform/entitlements/" className="underline">documentation</a>.
                  </p>
              </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gradient-dark relative">
          <div className="absolute inset-0 texture-overlay opacity-20" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gradient-accent mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Got questions? We've got answers.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl border border-border/50 bg-card/20 backdrop-blur"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-hero mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Build the future with Cyoda. Start your free trial today.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-primary text-white text-lg px-8 py-4 glow-primary"
              onClick={() => window.open('https://ai.cyoda.net', '_blank')}
            >
              Start Free Trial
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;