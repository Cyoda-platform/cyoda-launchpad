# Actionable Step: Update Cookie Consent Banner Links

**Objective:** Ensure the cookie consent banner's existing links to Cookie Policy and Privacy Policy work correctly with the new legal document pages and verify proper navigation behavior.

**Prerequisites:** Actionable Step 2 (Set Up Routing for Legal Document Pages) must be finished first.

**Action Items:**
1. Review the current CookieConsentBanner component implementation in `src/components/CookieConsentBanner.tsx`
2. Verify that the banner's policyUrl and privacyUrl props are correctly set to `/cookie-policy` and `/privacy-policy`
3. Check that the cookie consent configuration in `src/config/cookie-consent.ts` has the correct URLs
4. Test that clicking "Cookie Policy" link in the banner opens the new Cookie Policy page
5. Test that clicking "Privacy Policy" link in the banner opens the new Privacy Policy page  
6. Verify that the links open in new tabs (`target="_blank"`) as currently configured
7. Ensure the links maintain proper accessibility attributes (aria-label, rel="noopener noreferrer")
8. Test the banner links across different screen sizes to ensure they remain clickable and properly styled
9. Verify that the CookiePreferencesModal component also has working links to the legal documents
10. Confirm that all cookie consent related components can successfully navigate to the new legal pages

**Acceptance Criteria:**
- Cookie consent banner links to Cookie Policy and Privacy Policy work correctly
- Links open the appropriate legal document pages in new tabs
- All accessibility attributes are properly maintained
- Links work consistently across different screen sizes and devices
- Cookie preferences modal also has functional links to legal documents
- No JavaScript errors occur when clicking legal document links from cookie consent components
