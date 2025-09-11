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
        <HeroSection />
          <ThreeBenefitsSection />
        <ThreeStepSection />
        <EcosystemSection />
        <DeveloperReliabilitySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
