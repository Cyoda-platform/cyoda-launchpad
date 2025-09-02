import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, X } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Developer",
      price: "Free",
      description: "Perfect for personal projects and learning",
      features: [
        "Up to 3 applications",
        "Basic AI assistance",
        "Community support",
        "Standard templates",
        "5GB storage"
      ],
      limitations: [
        "Limited deployment options",
        "Basic monitoring"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "For serious developers and small teams",
      features: [
        "Unlimited applications",
        "Advanced AI builder",
        "Priority support",
        "Custom templates",
        "100GB storage",
        "Advanced analytics",
        "API integrations",
        "Custom domains"
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations with advanced needs",
      features: [
        "Everything in Professional",
        "Dedicated AI model training",
        "24/7 dedicated support",
        "Custom integrations",
        "Unlimited storage",
        "Advanced security features",
        "Compliance certifications",
        "On-premise deployment",
        "SLA guarantees"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I change my plan anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, or at the end of your billing cycle for downgrades."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and wire transfers for Enterprise customers. All payments are processed securely through Stripe."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! Professional plans include a 14-day free trial with full access to all features. No credit card required to start."
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "Your data remains accessible for 30 days after cancellation. You can export all your applications and data during this period."
    },
    {
      question: "Do you offer discounts for students or nonprofits?",
      answer: "Yes, we offer 50% discounts for students and qualified nonprofit organizations. Contact our support team for more information."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-dark relative">
          <div className="absolute inset-0 texture-overlay opacity-30" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gradient-hero mb-6">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Choose the plan that fits your needs. All plans include our core AI builder and deployment features.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <div 
                  key={index}
                  className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                    plan.popular 
                      ? 'border-primary bg-card/50 glow-primary scale-105' 
                      : 'border-border/50 bg-card/30 hover:bg-card/50 glow-hover'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-4xl font-bold text-gradient-primary">
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

                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-primary text-white glow-primary' 
                        : 'bg-card/20 backdrop-blur border border-primary/30 hover:bg-primary/10 hover:border-primary glow-hover'
                    }`}
                    onClick={() => {
                      if (plan.name === 'Enterprise') {
                        // Contact sales logic
                        window.open('mailto:sales@cyoda.net', '_blank');
                      } else {
                        window.open('https://ai.cyoda.net', '_blank');
                      }
                    }}
                  >
                    {plan.cta}
                  </Button>
                </div>
              ))}
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
              Join thousands of developers building the future with Cyoda. Start your free trial today.
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