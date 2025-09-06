# Actionable Step: Create Legal Document Page Components

**Objective:** Create properly formatted React page components for Cookie Policy, Privacy Policy, and Terms of Service that convert plain text content into well-structured, styled HTML components.

**Prerequisites:** None.

**Action Items:**
1. Create `src/pages/CookiePolicy.tsx` component that imports and renders the cookie policy content
2. Create `src/pages/PrivacyPolicy.tsx` component that imports and renders the privacy policy content  
3. Create `src/pages/TermsOfService.tsx` component that imports and renders the terms of service content
4. Convert plain text content from `/docs/cookies_policy-eu.txt` into structured JSX with proper headings, paragraphs, and lists
5. Convert plain text content from `/docs/privicy_policy.txt` into structured JSX with proper headings, paragraphs, and lists
6. Convert plain text content from `/docs/terms_of_service.txt` into structured JSX with proper headings, paragraphs, and lists
7. Apply consistent page layout structure with Header and Footer components matching other pages
8. Implement proper semantic HTML structure with appropriate heading hierarchy (h1, h2, h3, etc.)
9. Add proper meta tags and page titles using react-helmet-async for SEO
10. Ensure all components follow the existing project's TypeScript patterns and component structure

**Acceptance Criteria:** 
- Three new page components exist in `src/pages/` directory
- Each component renders properly formatted legal document content with clear typography hierarchy
- Components include proper page layout with Header and Footer
- All components are properly typed with TypeScript
- Content is semantically structured with appropriate HTML elements
- Page titles and meta descriptions are properly set
