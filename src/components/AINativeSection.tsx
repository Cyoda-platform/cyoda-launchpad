const AINativeSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
          AI-NATIVE INFRASTRUCTURE
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          Agentic AI needs a platform that can keep up
        </h2>
        <div className="space-y-4 text-lg text-muted-foreground text-left max-w-2xl mx-auto">
          <p>
            AI agents can get to a working demo in hours. Getting from that demo to something a financial services client will trust is a different problem: audit trails, transactional consistency, point-in-time state reconstruction. None of that is in the model. It has to be in the platform.
          </p>
          <p>
            Cyoda was designed for the class of system where state transitions are the product. That makes it a natural foundation for agentic AI. Agent actions are entity transitions, they are transactional, they are immutably recorded, and they can be reconstructed at any moment. No custom state management code. No separate audit pipeline.
          </p>
        </div>
        <p className="mt-8 text-muted-foreground">
          <a
            href="https://ai.cyoda.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline underline-offset-2"
          >
            Start at ai.cyoda.net
          </a>{' '}
          and describe what you want to build.
        </p>
      </div>
    </section>
  );
};

export default AINativeSection;
