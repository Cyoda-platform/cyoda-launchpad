// Centralized configuration for cookie consent legal text and links
// Do not include secrets here. This is shipped to the client.

export interface RegionalComplianceConfig {
  // Placeholder for future regional differences (e.g., US/CPRA, CA/PIPEDA)
  regionCode: 'EU' | 'US' | 'UK' | 'CA' | 'BR' | 'OTHER';
  consentExpirationDays: number; // GDPR typically 12 months
}

export interface CookieConsentLegalConfig {
  policyUrl: string;
  privacyUrl: string;
  // Banner/message text snippets
  banner: {
    title: string;
    disclaimer: string; // Keep aligned with docs/cookies_policy-eu.txt
  };
  modal: {
    intro: string;
    essentialNote: string; // Clarify legitimate interest for essential cookies
  };
  regional: RegionalComplianceConfig;
}

export const cookieConsentLegalConfig: CookieConsentLegalConfig = {
  policyUrl: '/cookie-policy',
  privacyUrl: '/privacy-policy',
  banner: {
    title: 'Cookie Consent Required',
    disclaimer:
      'Our website uses cookies and other related technologies (for convenience all technologies are referred to as "cookies"). Some cookies ensure that certain parts of the website work properly and that your user preferences remain known (Essential cookies). We also place cookies for analytics to measure usage and improve your experience, and marketing cookies to create user profiles and display personalized advertising. By clicking "Accept All", you consent to us using all categories of cookies as described in our Cookie Policy. You can disable the use of cookies via your browser, but please note that our website may no longer work properly.',
  },
  modal: {
    intro:
      'Control how we use cookies on this site. You can change your settings at any time.',
    essentialNote:
      'Essential cookies are required for basic site functionality and security. These are always on and rely on our legitimate interests and are exempt from consent requirements under applicable law.',
  },
  regional: {
    regionCode: 'EU',
    consentExpirationDays: 365,
  },
};

