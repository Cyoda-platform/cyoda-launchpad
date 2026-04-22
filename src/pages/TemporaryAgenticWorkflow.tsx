import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import WorkflowDiagram from '@/lib/workflow-diagram';
import { agenticAiRegulatedActionWorkflow } from '@/workflows';

const TemporaryAgenticWorkflow = () => (
  <>
    <SEO
      title="Temporary Agentic AI Workflow Preview | Cyoda"
      description="Temporary preview page for the Agentic AI regulated action workflow graph."
      url="/temporary/agentic-ai-workflow"
    />
    <Header />
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted/30">
        <div className="container max-w-screen-2xl py-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Temporary preview</p>
          <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            {agenticAiRegulatedActionWorkflow.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
            {agenticAiRegulatedActionWorkflow.description}
          </p>
        </div>
      </section>

      <section className="container max-w-screen-2xl py-8">
        <WorkflowDiagram spec={agenticAiRegulatedActionWorkflow} minSvgWidth={1080} />
      </section>
    </main>
    <Footer />
  </>
);

export default TemporaryAgenticWorkflow;
