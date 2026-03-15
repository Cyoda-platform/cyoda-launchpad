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
        title="For Developers | Cyoda"
        description="A developer-first platform for building stateful, event-driven applications. Free tier at ai.cyoda.net — no credit card required."
        url="https://cyoda.com/dev"
        type="website"
        jsonLd={organizationSchema}
      />
      <Header />
      <main>
          <HeroSection renderHeadings={true} h1="Build scalable event-driven applications" h2="As easy as talking to an AI assistant" h3="Build the mission-critical systems that other platforms can’t.">
          </HeroSection>
          <ThreeStepSection />
          <EcosystemSection />
          <ThreeBenefitsSection renderHeadings={false} />
        <DeveloperReliabilitySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
