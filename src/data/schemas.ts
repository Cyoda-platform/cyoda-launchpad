export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is there a free tier?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The Trial plan is free with no time limit. Start at ai.cyoda.net."
      }
    },
    {
      "@type": "Question",
      "name": "Can I deploy on my own infrastructure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The Enterprise plan supports private cloud and on-premises Kubernetes deployment."
      }
    },
    {
      "@type": "Question",
      "name": "What is the SLA for the Enterprise plan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Full compliance and SLA guarantees are included with Enterprise. Contact sales for details."
      }
    },
    {
      "@type": "Question",
      "name": "How do I migrate from my existing Postgres and Kafka stack?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Contact the team for a migration assessment. Most teams prototype on Cyoda Cloud in under a week."
      }
    }
  ]
};

export const breadcrumbLoanLifecycle = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cyoda.com/" },
    { "@type": "ListItem", "position": 2, "name": "Use Cases", "item": "https://cyoda.com/use-cases" },
    { "@type": "ListItem", "position": 3, "name": "Loan Origination & Lifecycle Management", "item": "https://cyoda.com/use-cases/loan-lifecycle" }
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
    { "@type": "ListItem", "position": 3, "name": "Agentic AI for Regulated Industries", "item": "https://cyoda.com/use-cases/agentic-ai" }
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
