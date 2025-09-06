## Cookie Consent: Legal Compliance Guide (EU/GDPR)

This guide explains how to keep the cookie consent system legally compliant when modifying tracking or consent behavior.

### Legal sources
- GDPR (esp. Articles 4(11), 6(1)(a), 7, 12–15, 20)
- ePrivacy Directive (as implemented in EEA member states)
- Current policy language: docs/cookies_policy-eu.txt

### Categories and legal bases
- Essential: always on, based on legitimate interests or strictly necessary exemptions.
- Analytics: requires explicit consent before any tracking fires.
- Marketing: requires explicit consent; includes ad pixels and cross-site identifiers.
- Personalization: requires explicit consent for profiling/preferences.

### Required behaviors
- Prior consent: non-essential tags must not run until consent is granted.
- Granularity: user can opt in/out per category.
- Withdrawal: as easy as giving consent (persistent Preferences control; Reject All; Delete consent record).
- Expiration: consent record stored for 12 months (365 days) by default; then re-prompt.
- Transparency: clear links to Cookie Policy and Privacy Policy from banner and modal.
- Auditability: local audit log of consent events is kept with retention (24 months) for internal reporting.

### Developer checklist when adding tracking
1. Map the tracker to a category (Analytics, Marketing, or Personalization).
2. Gate all code execution behind the relevant permission flags from `useTrackingPermissions()`.
3. Do not write identifiers or third-party cookies until consent is present.
4. On withdrawal or Reject All, ensure trackers are disabled and identifiers are cleared where possible.
5. Keep user-facing copy aligned with docs/cookies_policy-eu.txt.
6. If you change legal text or links, update `src/config/cookie-consent.ts`.

### Access/erasure/portability
- Access/Portability: call `getConsentRecord()` from `useCookieConsent()` to export current consent as a portable JSON.
- Erasure: call `deleteConsentRecord()` to remove consent data and show the banner again.

### Regionalization
- Default configuration targets EU/GDPR. A regional config scaffold is available in `src/config/cookie-consent.ts` for future needs.

### QA notes
- Verify banner appears when no consent or when expired.
- Verify that toggles control category-specific execution.
- Verify links open Cookie Policy and Privacy Policy.
- Verify Reject All and Delete consent record paths.
- Inspect Local Storage for `cyoda-cookie-consent` and audit key `cyoda-cookie-consent-audit`.

