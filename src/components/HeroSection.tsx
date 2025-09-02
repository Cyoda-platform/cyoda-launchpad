import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroBackground from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  const prebakedExamples = [
    "Order Management System",
    "Customer Onboarding Portal", 
    "Real-Time Analytics Dashboard"
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with texture overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat texture-overlay"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-dark opacity-80" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-gradient-hero leading-tight">
              From Problem → Prototype → Production
            </h1>
            
            {/* Subtext */}
            <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed max-w-3xl mx-auto">
              Cyoda is a developer-first application platform with an AI builder. 
              It helps you turn problems into scalable, enterprise-grade systems in minutes. 
              Build complex, data-driven backends, iterate in your IDE, and deploy to production with confidence.
            </p>
          </div>

          {/* Input section */}
          <div className="max-w-2xl mx-auto space-y-6">
            <form action="https://ai.cyoda.net" method="GET" target="_blank" id="start-form" className="relative">
              <Textarea
                name="name"
                id="name"
                required
                minLength={1}
                maxLength={10000}
                aria-label="Describe what you want to build..."
                placeholder="Describe your application idea..."
                className="min-h-[120px] text-lg bg-background/10 backdrop-blur border-2 border-primary/30 focus:border-primary glow-primary placeholder:text-foreground/60 pr-32"
              />
              <Button 
                type="submit"
                id="start-btn"
                size="lg"
                className="absolute right-2 top-2 bg-gradient-primary text-white glow-primary"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Building
              </Button>
            </form>

            {/* Pre-baked examples */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Or try these examples:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {prebakedExamples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="bg-card/20 backdrop-blur border-primary/30 hover:bg-primary/10 hover:border-primary glow-hover text-sm"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="pt-8">
            <Button 
              size="lg"
              className="bg-gradient-primary text-white text-lg px-8 py-4 glow-primary"
              onClick={() => window.open('https://ai.cyoda.net', '_blank')}
            >
              Try it Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-primary opacity-20 blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-gradient-accent opacity-15 blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-20 w-16 h-16 rounded-full bg-cyoda-purple opacity-25 blur-lg animate-pulse delay-500" />
    </section>
  );
};

export default HeroSection;