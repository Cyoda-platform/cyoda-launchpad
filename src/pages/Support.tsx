import Header from '@/components/Header';
import Footer from '@/components/Footer';
// at top
import {useEffect} from 'react';


import {Button} from '@/components/ui/button';
import {
    MessageCircle,
    FileText,
    Video,
    ArrowRight,
    ExternalLink,
    HelpCircle,
    BookOpen,
    Zap
} from 'lucide-react';
// inside Support component, near the top

const Support = () => {

    useEffect(() => {
        const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
        if (!siteKey) {
            console.error("VITE_RECAPTCHA_SITE_KEY is not set. reCAPTCHA cannot initialize.");
            return;
        }

        // Avoid injecting multiple times and avoid removing script on unmount (clients can break)
        if (window.grecaptcha) return;
        const existing = document.querySelector('script[data-recaptcha="v3"]') as HTMLScriptElement | null;
        if (existing) return;

        const s = document.createElement("script");
        s.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        s.async = true;
        s.defer = true;
        s.setAttribute("data-recaptcha", "v3");
        document.body.appendChild(s);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formEl = e.currentTarget;
        const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

        if (!siteKey) {
            alert("reCAPTCHA site key is not configured.");
            return;
        }

        if (!window.grecaptcha) {
            alert("reCAPTCHA is still loading. Please try again in a moment.");
            return;
        }

        try {
            await new Promise<void>((resolve) => window.grecaptcha!.ready(() => resolve()));
            const token = await window.grecaptcha!.execute(siteKey, {action: "submit"});

            const formData = new FormData(formEl);
            formData.append("g-recaptcha-response", token);

            const res = await fetch("https://formspree.io/f/mzzaollp", {
                method: "POST",
                body: formData,
                headers: {Accept: "application/json"},
            });

            if (res.ok) {
                alert("Thanks for your message!");
                formEl.reset();
            } else {
                alert("There was a problem submitting the form.");
            }
        } catch (err) {
            console.error("reCAPTCHA/submit error", err);
            alert("There was a problem verifying reCAPTCHA. Please reload the page and try again.");
        }
    };


    const supportChannels = [
        {
            icon: MessageCircle,
            title: "Discord Community",
            description: "Join our active Discord community for real-time help, discussions, and networking with other developers.",
            action: "Join Discord",
            link: "https://discord.gg/95rdAyBZr2",
            primary: true
        },
        {
            icon: BookOpen,
            title: "How to and worked examples",
            description: "Follow worked examples and learn how to build with Cyoda.",
            action: "How to's",
            link: "/guides",
            primary: false
        },
        {
            icon: FileText,
            title: "Documentation",
            description: "Guides, API references, and tutorials to help you build with Cyoda.",
            action: "Browse Docs",
            link: "https://docs.cyoda.net/",
            primary: false
        }
    ];

    const resources = [
        {
            icon: BookOpen,
            title: "Application Documentation",
            description: "Complete API documentation and integration guides",
            link: "https://docs.cyoda.net/",
            openInNewTab: true
        },
        {
            icon: Zap,
            title: "How-To Guides",
            description: "Step-by-step tutorials for common use cases",
            link: "/guides",
            openInNewTab: false
        },
        {
            icon: Video,
            title: "Video Explanations",
            description: "Visual tutorials and product demonstrations",
            status: "Coming Soon",
            link: "#",
            openInNewTab: false
        }
    ];

    const faqs = [
        {
            question: "How do I get started with Cyoda?",
            answer: "The easiest way to get started is to sign up for a free account and try our AI builder. You can also check out our documentation and how-to guides for more information."
        },
        {
            question: "What programming languages does Cyoda support?",
            answer: "Cyoda generates applications in Java or Python, but you can export and work with the code in any language.If you want another language, please let us know."
        },
        {
            question: "Can I export my code from Cyoda?",
            answer: "Yes! You have full access to your generated code and can export it to work in your preferred IDE via the GitHub branch supplied during the AI interactions."
        },
        {
            question: "What kind of applications can I build?",
            answer: "Cyoda excels at building data-driven applications like order management systems, customer portals, and enterprise workflows. It was orginally designed for financial services, but can be used for any complex, data-driven system."
        },
        {
            question: "can I run the AI builder locally?",
            answer: "Yes, it's an open source project, built on Cyoda Cloud, you're welcome to download it, configure your own LLMs, and run it locally."
        },
        {
            question: "How secure are applications built with Cyoda?",
            answer: "Security is built into every application with features like authentication, authorization, encryption, and compliance with standards like SOC2 and GDPR."
        }
    ];


    return (
        <div className="min-h-screen bg-background">
            <Header/>
            <main>
                {/* Hero Section */}
                <section className="pt-24 pb-16 bg-gradient-dark relative">
                    <div className="absolute inset-0 texture-overlay opacity-30"/>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center max-w-4xl mx-auto">
                            <h1 className="text-5xl md:text-6xl font-bold text-gradient-hero mb-6">
                                How Can We Help?
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                Get the support you need to build amazing applications with Cyoda. Our community and
                                resources are here to help you succeed.
                            </p>

                        </div>
                    </div>
                </section>

                {/* Support Channels */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-6">
                                Get Support
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                Choose the support channel that works best for you
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {supportChannels.map((channel, index) => (
                                <div
                                    key={index}
                                    className={`p-8 rounded-2xl border transition-all duration-300 ${
                                        channel.primary
                                            ? 'border-primary bg-card/50 glow-primary scale-105'
                                            : 'border-border/50 bg-card/30 hover:bg-card/50 glow-hover'
                                    }`}
                                >
                                    <div
                                        className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 glow-primary">
                                        <channel.icon className="w-8 h-8 text-white"/>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                                        {channel.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        {channel.description}
                                    </p>

                                    <Button
                                        className={`w-full ${
                                            channel.primary
                                                ? 'bg-gradient-primary text-white glow-primary'
                                                : 'bg-card/20 text-white backdrop-blur border border-primary/30 hover:bg-primary/10 hover:border-primary glow-hover'
                                        }`}
                                        onClick={() => window.open(channel.link, '_blank')}
                                    >
                                        {channel.action} <ExternalLink className="w-4 h-4 ml-2"/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Resources */}
                <section className="py-24 bg-gradient-dark relative">
                    <div className="absolute inset-0 texture-overlay opacity-20"/>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gradient-accent mb-6">
                                Learning Resources
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                Everything you need to master Cyoda development
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {resources.map((resource, index) => (
                                <div
                                    key={index}
                                    className="group p-6 rounded-xl border border-border/50 bg-card/20 backdrop-blur hover:bg-card/40 transition-all duration-300 glow-hover"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div
                                                className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center glow-primary">
                                                <resource.icon className="w-6 h-6 text-white"/>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                                    {resource.title}
                                                </h3>
                                                {resource.status && (
                                                    <span
                                                        className="text-xs bg-cyoda-orange/20 text-cyoda-orange px-2 py-1 rounded">
                            {resource.status}
                          </span>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                                                {resource.description}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-primary hover:text-primary hover:bg-primary/10 p-0"
                                                disabled={resource.status === "Coming Soon"}
                                                onClick={() => {
                                                    if (resource.status !== "Coming Soon") {
                                                        if (resource.openInNewTab) {
                                                            window.open(resource.link, '_blank');
                                                        } else {
                                                            window.location.href = resource.link;
                                                        }
                                                    }
                                                }}
                                            >
                                                Learn More <ArrowRight className="w-3 h-3 ml-1"/>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gradient-hero mb-6">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                Quick answers to common questions
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto space-y-6">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="p-6 rounded-xl border border-border/50 bg-card/20 backdrop-blur hover:bg-card/30 transition-all duration-300"
                                >
                                    <div className="flex items-start space-x-4">
                                        <HelpCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0"/>
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground mb-3">
                                                {faq.question}
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* Contact form */}
                <section id={"contact"} className="py-24 relative">
                    <div className="mt-10 max-w-2xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your name"
                                    required
                                    className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@company.com"
                                    required
                                    className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <textarea
                                name="message"
                                placeholder="Your message"
                                required
                                rows={5}
                                className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary resize-y"
                            />

                            {/* Honeypot */}
                            <input
                                type="text"
                                name="_gotcha"
                                tabIndex={-1}
                                autoComplete="off"
                                className="hidden"
                                aria-hidden="true"
                            />

                            <Button
                                type="submit"
                                className="bg-gradient-primary text-white glow-primary px-8 py-4 btn-text-lg min-h-[44px] w-full sm:w-auto"
                            >
                                Send
                            </Button>
                        </form>
                    </div>
                </section>
            </main>
            <Footer/>
        </div>
    );
};

export default Support;