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

### UTM Parameter Tracking and Storage

**Storage Mechanism**: UTM parameters are stored in **sessionStorage** (not cookies) under the key `cyoda_utm_params`.

**Consent Requirements**:
- UTM tracking requires Analytics consent to be granted
- Without consent, UTM parameters are not captured or stored
- SessionStorage is not accessed without consent

**Data Stored**:
```json
{
  "parameters": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "spring_sale"
  },
  "capturedAt": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

**Key Points**:
- SessionStorage data persists only for the current browser tab/window
- Data is automatically cleared when the tab is closed
- No cookies are used for UTM parameter storage
- All UTM tracking respects analytics consent settings
- UTM parameters are automatically included in all analytics events when available

**Consent Behavior**:
- ✅ **Consent Granted**: UTM parameters captured and stored in sessionStorage
- ❌ **Consent Denied**: No UTM capture, no sessionStorage access
- 🔄 **Consent Changed**: If consent granted after page load, UTM parameters captured immediately

For more details, see [UTM Tracking Guide](./utm_tracking_guide.md).

### Developer checklist when adding tracking
1. Map the tracker to a category (Analytics, Marketing, or Personalization).
2. Gate all code execution behind the relevant permission flags from `useTrackingPermissions()`.
3. Do not write identifiers or third-party cookies until consent is present.
4. For UTM tracking, ensure you use the provided utilities (`captureUtmParameters()`, `getUtmParameters()`) which automatically respect consent.
5. On withdrawal or Reject All, ensure trackers are disabled and identifiers are cleared where possible.
6. Keep user-facing copy aligned with docs/cookies_policy-eu.txt.
7. If you change legal text or links, update `src/config/cookie-consent.ts`.

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

