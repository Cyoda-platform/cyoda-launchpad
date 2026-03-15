import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema, faqSchema } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackCtaConversion } from '@/utils/analytics';

const Pricing = () => {
  const handlePricingCardClick = (planName: string) => {
    trackCtaConversion({
      location: "pricing_card",
      page_variant: "pricing",
      cta: "start_free_trial",
      label: planName,
      url: "https://ai.cyoda.net"
    });
    window.open('https://ai.cyoda.net', '_blank');
  };

  const handleCtaSectionClick = () => {
    trackCtaConversion({
      location: "cta_section",
      page_variant: "pricing",
      cta: "start_free_trial",
      url: "https://ai.cyoda.net"
    });
    window.open('https://ai.cyoda.net', '_blank');
  };

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
      price: "Contact Us",
      description: "Developers and small teams",
      features: [
          'Expanded Cyoda Cloud resources',
          'AI Assistant included',
          'Higher usage quotas',
          'Community support'
      ],
      limitations: [],
      cta: "Join the Waitlist",
        available: false
    },
      {
          name: "Professional",
          price: "Contact Us",
          description: "Developers and small teams",
          features: [
              'Cloud deployment options (AWS/GCP/Azure)',
              'AI Assistant included',
              'Increased capacity and performance',
              'Priority support'
          ],
          limitations: [],
          cta: "Join the Waitlist",
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
      question: "Is there a free tier?",
      answer: "Yes. The Trial plan is free with no time limit. Start at ai.cyoda.net — no credit card required."
    },
    {
      question: "Can I deploy on my own infrastructure?",
      answer: "Yes. The Enterprise plan supports private cloud and on-premises Kubernetes deployment."
    },
    {
      question: "What is the SLA for the Enterprise plan?",
      answer: "Full compliance and SLA guarantees are included with Enterprise. Contact sales for details."
    },
    {
      question: "How do I migrate from my existing Postgres + Kafka stack?",
      answer: "Contact the team for a migration assessment. Most teams prototype on Cyoda Cloud in under a week."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Pricing | Cyoda"
        description="Start your evaluation for free. Scale to enterprise when you need it. No time limits on the free tier."
        url="https://cyoda.com/pricing"
        type="website"
        jsonLd={[organizationSchema, faqSchema]}
      />
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-background via-card to-secondary/20 relative">
          <div className="absolute inset-0 texture-overlay opacity-30" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                Start Your Evaluation for Free
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                All plans include our open source AI Assistant.
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
                  className={`relative p-8 rounded-xl border transition-all duration-300  border-primary bg-card/50 scale-105`}
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-2xl font-bold text-foreground">
                        {plan.price}
                      </span>
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

                    {plan.name === "Trial" ? (
                        <Button
                            className={`w-full bg-button text-primary-foreground`}
                            onClick={() => handlePricingCardClick(plan.name)}
                        >
                            {plan.cta}
                        </Button>
                    ) : (
                        <Button
                            className={`w-full bg-button text-primary-foreground`}
                            asChild
                        >
                            <Link to="/contact">{plan.cta}</Link>
                        </Button>
                    )}
                </div>
              ))}
            </div>
              <div className="text-center mt-12">
                  <p className="text-xl md:text-lg font-semibold text-foreground mb-6">
                      Full details of entitlements and limits are available in our{' '}
                      <a href="https://docs.cyoda.net/platform/entitlements/" className="underline">documentation</a>.
                  </p>
              </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gradient-to-br from-background via-card to-secondary/20 relative">
          <div className="absolute inset-0 texture-overlay opacity-20" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Got questions? We've got answers.
              </p>
            </div>

            <Accordion type="single" collapsible className="max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                  <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Build the future with Cyoda. Start your free trial today.
            </p>
            <Button
              size="lg"
              className="bg-button text-primary-foreground text-lg px-8 py-4"
              onClick={handleCtaSectionClick}
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