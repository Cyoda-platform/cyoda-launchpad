import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema } from '@/data/schemas';
import UseCaseCard from '@/components/UseCaseCard';
import { Building2, BarChart3, UserCheck, Bot, FileText } from 'lucide-react';

const useCases = [
  {
    icon: Building2,
    title: 'Corporate Loan Origination & Lifecycle',
    description: 'Model borrower-company origination, credit assessment, approval conditions, drawdown, and servicing in one governed entity lifecycle.',
    href: '/use-cases/loan-lifecycle',
  },
  {
    icon: BarChart3,
    title: 'Trade Settlement & Regulatory Reporting',
    description: 'Point-in-time queryable trade states for regulatory reconstruction. No ETL pipeline required.',
    href: '/use-cases/trade-settlement',
  },
  {
    icon: UserCheck,
    title: 'KYC & Customer Onboarding',
    description: 'Durable retry for external checks, with full audit of every decision and the data behind it.',
    href: '/use-cases/kyc-onboarding',
  },
  {
    icon: Bot,
    title: 'Governed Agentic Workflows',
    description: 'AI agents need governance when they act on enterprise systems. Cyoda runs agent decisions through entity workflows, records each state change, and keeps the context needed to audit, review, or reverse the outcome.',
    href: '/use-cases/governed-agentic-workflows',
  },
  {
    icon: FileText,
    title: 'Governed Claims Adjudication',
    description: 'Run AI-assisted claims decisions through a governed Claim entity lifecycle, with traceable state changes, adjuster review, payment, appeal, and reversal paths.',
    href: '/use-cases/governed-claims-adjudication',
  },
];

const UseCases = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Use Cases | Cyoda"
        description="See how Cyoda powers loan lifecycle management, governed agentic workflows, governed claims adjudication, trade settlement, and KYC onboarding in financial services."
        url="https://cyoda.com/use-cases"
        type="website"
        jsonLd={organizationSchema}
      />
      <Header />
      <main>
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl mb-16">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                USE CASES
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Built for Systems Where Correctness Is Not Optional
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Cyoda is purpose-built for domains where entities have complex lifecycles,
                where history must be queryable for compliance, and where concurrent writes
                create consistency challenges.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {useCases.map((uc) => (
                <UseCaseCard
                  key={uc.href}
                  icon={uc.icon}
                  title={uc.title}
                  description={uc.description}
                  href={uc.href}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UseCases;
