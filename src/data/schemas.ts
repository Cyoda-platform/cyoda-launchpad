export const breadcrumbLoanLifecycle = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cyoda.com/" },
    { "@type": "ListItem", "position": 2, "name": "Use Cases", "item": "https://cyoda.com/use-cases" },
    { "@type": "ListItem", "position": 3, "name": "Corporate Loan Origination & Lifecycle", "item": "https://cyoda.com/use-cases/loan-lifecycle" }
  ]
};

export const breadcrumbTradeSettlement = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cyoda.com/" },
    { "@type": "ListItem", "position": 2, "name": "Use Cases", "item": "https://cyoda.com/use-cases" },
    { "@type": "ListItem", "position": 3, "name": "Trade Settlement & Regulatory Reporting", "item": "https://cyoda.com/use-cases/trade-settlement" }
  ]
};

export const breadcrumbKycOnboarding = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cyoda.com/" },
    { "@type": "ListItem", "position": 2, "name": "Use Cases", "item": "https://cyoda.com/use-cases" },
    { "@type": "ListItem", "position": 3, "name": "KYC & Customer Onboarding", "item": "https://cyoda.com/use-cases/kyc-onboarding" }
  ]
};

export const breadcrumbAgenticAi = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cyoda.com/" },
    { "@type": "ListItem", "position": 2, "name": "Use Cases", "item": "https://cyoda.com/use-cases" },
    { "@type": "ListItem", "position": 3, "name": "Governed Agentic Workflows", "item": "https://cyoda.com/use-cases/governed-agentic-workflows" }
  ]
};

export const breadcrumbGovernedAiActions = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cyoda.com/" },
    { "@type": "ListItem", "position": 2, "name": "Use Cases", "item": "https://cyoda.com/use-cases" },
    { "@type": "ListItem", "position": 3, "name": "Governed Agentic Workflows", "item": "https://cyoda.com/use-cases/governed-agentic-workflows" }
  ]
};

export const breadcrumbGovernedClaimsAdjudication = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cyoda.com/" },
    { "@type": "ListItem", "position": 2, "name": "Use Cases", "item": "https://cyoda.com/use-cases" },
    { "@type": "ListItem", "position": 3, "name": "Governed Claims Adjudication", "item": "https://cyoda.com/use-cases/governed-claims-adjudication" }
  ]
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Cyoda",
  "url": "https://cyoda.com",
  "description": "The unified platform that replaces Postgres + Kafka + Camunda for teams building stateful, auditable workflows in regulated financial services.",
  "foundingDate": "2012",
  "sameAs": [
    "https://www.linkedin.com/company/cyoda"
  ]
};

export const faqPageSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
});
