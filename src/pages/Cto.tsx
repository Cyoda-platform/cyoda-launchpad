import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ThreeStepSection from '@/components/ThreeStepSection';
import ThreeBenefitsSection from '@/components/ThreeBenefitsSection';
import EcosystemSection from '@/components/EcosystemSection';
import DeveloperReliabilitySection from '@/components/DeveloperReliabilitySection';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema } from '@/data/schemas';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="For Engineering Leaders | Cyoda"
        description="Replace the Postgres + Kafka + Camunda patchwork with one consistency model. Built for teams where correctness and audit are non-negotiable."
        url="https://cyoda.com/cto"
        type="website"
        jsonLd={organizationSchema}
      />
      <Header />
      <main>
          <ThreeBenefitsSection
              renderHeadings={true}
              h1="Financial-Grade Systems For Enterprise Backends"
              h2="Event-Driven Developer-first application platform"
              h3="Build the mission-critical systems that other platforms can’t."/>
          <HeroSection defaultHeadingAs="h2" />
        <ThreeStepSection />
        <EcosystemSection />
        <DeveloperReliabilitySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
