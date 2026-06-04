import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema } from '@/data/schemas';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  MessageCircle,
  FileText,
  BookOpen,
  Zap,
  Video,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const supportChannels = [
  {
    icon: MessageCircle,
    title: 'Discord Community',
    description:
      'Real-time help and discussion with the Cyoda team and other developers.',
    action: 'Join Discord',
    href: 'https://discord.gg/95rdAyBZr2',
    external: true,
  },
  {
    icon: FileText,
    title: 'Documentation',
    description: 'Guides, API reference, and tutorials at docs.cyoda.net.',
    action: 'Browse docs',
    href: 'https://docs.cyoda.net/',
    external: true,
  },
  {
    icon: MessageCircle,
    title: 'Talk to the team',
    description:
      'Direct line for architecture, procurement, and deployment questions.',
    action: 'Contact us',
    href: '/contact',
    external: false,
  },
];

const resources = [
  {
    icon: BookOpen,
    title: 'Application Documentation',
    description: 'Complete API documentation and integration guides.',
    href: 'https://docs.cyoda.net/',
    external: true,
  },
  {
    icon: Zap,
    title: 'How-To Guides',
    description: 'Step-by-step tutorials for common use cases.',
    href: 'https://docs.cyoda.net/guides/cyoda-design-principles/',
    external: true,
  },
  {
    icon: Video,
    title: 'Video Explanations',
    description: 'Visual tutorials and product demonstrations.',
    href: null,
    badge: 'Coming soon',
  },
];

const faqs = [
  {
    question: 'How do I get started with Cyoda?',
    answer:
      'Start with the open-source platform at cyoda.dev — the documentation and how-to guides at docs.cyoda.net cover the underlying entity model. The fully managed Cyoda Cloud is coming soon; join the waitlist at cyoda.com/cloud.',
  },
  {
    question: 'What programming languages does Cyoda support?',
    answer:
      'Generated applications are produced in Java or Python. The exported code can be integrated with any language via the Cyoda HTTP and event APIs. If you need another target language, get in touch.',
  },
  {
    question: 'Can I export my code from Cyoda?',
    answer:
      'Yes. You have full access to the generated code and can export it to your own GitHub branch and IDE.',
  },
  {
    question: 'What kind of applications can I build?',
    answer:
      'Cyoda is designed for stateful, data-driven systems where state transitions, auditability, and consistency under failure matter — corporate lending, KYC, trade settlement, claims adjudication, and similar regulated workloads.',
  },
  {
    question: 'Can I run the AI Assistant locally?',
    answer:
      'Yes. The AI Assistant is open source and runs on Cyoda Cloud, but you can self-host it, configure your own LLMs, and run it locally.',
  },
  {
    question: 'How secure are applications built with Cyoda?',
    answer:
      'Authentication, authorization, encryption, and audit are first-class concerns. Cyoda Cloud is operated to SOC 2 and GDPR standards.',
  },
];

const Support = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Support | Cyoda"
        description="Get help with Cyoda — documentation, Discord community, and direct support for engineering teams building stateful systems."
        url="https://cyoda.com/support"
        type="website"
        jsonLd={organizationSchema}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                SUPPORT
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                How can we help?
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Documentation, community, and a direct line to the engineers who
                built the platform. Pick whichever fits the question.
              </p>
            </div>
          </div>
        </section>

        {/* Support channels */}
        <section className="py-16 md:py-24 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-6xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              CHANNELS
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">
              Get help
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {supportChannels.map((channel) => {
                const Icon = channel.icon;
                const ButtonInner = (
                  <>
                    {channel.action}
                    {channel.external ? (
                      <ExternalLink className="w-4 h-4 ml-2" />
                    ) : (
                      <ArrowRight className="w-4 h-4 ml-2" />
                    )}
                  </>
                );

                return (
                  <Card key={channel.title}>
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-foreground text-lg mb-2">
                        {channel.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                        {channel.description}
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-center"
                      >
                        {channel.external ? (
                          <a
                            href={channel.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {ButtonInner}
                          </a>
                        ) : (
                          <Link to={channel.href}>{ButtonInner}</Link>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              LEARNING
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">
              Resources
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {resources.map((resource) => {
                const Icon = resource.icon;
                const isAvailable = !!resource.href;

                return (
                  <Card key={resource.title}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">
                              {resource.title}
                            </h3>
                            {resource.badge && (
                              <span className="text-[10px] font-semibold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded">
                                {resource.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                            {resource.description}
                          </p>
                          {isAvailable ? (
                            <a
                              href={resource.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-primary font-medium hover:underline focus-visible:ring-2 focus-visible:ring-primary rounded"
                            >
                              Learn more
                              <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </a>
                          ) : (
                            <span className="inline-flex items-center text-sm text-muted-foreground">
                              Not yet available
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-3xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">
              Frequently asked questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.question} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline">
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

        {/* Direct contact CTA */}
        <section className="py-16 md:py-24 bg-background border-t border-border">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              STILL STUCK?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Talk to the team
            </h2>
            <p className="text-base text-muted-foreground mb-8">
              For architecture reviews, procurement, or anything that needs a
              human, send us a message.
            </p>
            <Button asChild size="lg" className="px-8 font-semibold">
              <Link to="/contact">
                Contact us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
