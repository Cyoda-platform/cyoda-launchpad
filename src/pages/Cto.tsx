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
          <ThreeBenefitsSection
              renderHeadings={true}
              h1="Financial-Grade Systems For Enterprise Backends"
              h2="Event-Driven Developer-first application platform"
              h3="Build the mission-critical systems that other platforms can’t."/>
          <HeroSection />
        <ThreeStepSection />
        <EcosystemSection />
        <DeveloperReliabilitySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
