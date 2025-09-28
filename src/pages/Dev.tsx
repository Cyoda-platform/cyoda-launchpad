import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ThreeStepSection from '@/components/ThreeStepSection';
import ThreeBenefitsSection from '@/components/ThreeBenefitsSection';
import EcosystemSection from '@/components/EcosystemSection';
import DeveloperReliabilitySection from '@/components/DeveloperReliabilitySection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
