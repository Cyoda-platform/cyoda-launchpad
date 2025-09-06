# Actionable Step: Set Up Routing for Legal Document Pages

**Objective:** Configure React Router to handle the new legal document pages with proper URL paths that match the existing cookie consent banner expectations.

**Prerequisites:** Actionable Step 1 (Create Legal Document Page Components) must be finished first.

**Action Items:**
1. Add lazy-loaded imports for the three new legal document components in `src/App.tsx`
2. Add route configuration for `/cookie-policy` path pointing to CookiePolicy component
3. Add route configuration for `/privacy-policy` path pointing to PrivacyPolicy component  
4. Add route configuration for `/terms-of-service` path pointing to TermsOfService component
5. Ensure routes are added above the catch-all "*" route in the Routes configuration
6. Verify that the route paths match the URLs referenced in the cookie consent banner configuration (`/cookie-policy` and `/privacy-policy`)
7. Test that all three routes are accessible and render the correct components
8. Ensure lazy loading works properly with the existing Suspense wrapper and LoadingSpinner
9. Verify that navigation to these routes doesn't break the existing application flow
10. Confirm that the routes work with the application's base URL configuration for production deployment

**Acceptance Criteria:**
- Three new routes are properly configured in the React Router setup
- Routes use lazy loading consistent with other pages in the application
- URLs `/cookie-policy`, `/privacy-policy`, and `/terms-of-service` are accessible
- Navigation to legal document pages works without errors
- Routes are positioned correctly in the routing hierarchy
- Lazy loading displays appropriate loading states
