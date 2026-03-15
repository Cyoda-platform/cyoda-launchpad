# Cyoda Website — Improvement Spec for Claude Code

## This Is an Existing Project
Repository: `/Users/patrick/dev/cyoda-launchpad`
Do NOT create a new project. Work entirely within the existing codebase.

## Project Stack
- **Framework**: Vite + React 18 + TypeScript
- **Routing**: react-router-dom v6 (routes defined in `src/App.tsx`)
- **Styling**: Tailwind CSS v3 + shadcn/ui component library
- **Design tokens**: CSS variables in `src/index.css`
- **Font**: Montserrat (Google Fonts, loaded in `src/index.css`)
- **Theme**: dark/light toggle via `next-themes` + `ThemeProvider`
- **SEO**: `react-helmet-async` via `src/components/SEO.tsx`
- **Analytics**: GA4 via `src/components/AnalyticsManager.tsx`
- **Blog**: Markdown content in `src/content/`, indexed by `scripts/generate-blog-index.js`
- **shadcn/ui**: Full component library in `src/components/ui/`
- **Sitemap**: Static file at `public/sitemap.xml` (manually maintained)
- **llms.txt**: Static file at `public/llms.txt`

## Build Commands
```bash
npm run dev       # Development server on port 8080
npm run build     # Production build
npm run lint      # ESLint check
npm run typecheck # npx tsc --noEmit
```
Run `npm run build && npm run typecheck` after every task. Fix all errors before proceeding.

## Current State — What Was Already Completed
The following exist in the codebase from a previous session:
- `/about` → `src/pages/About.tsx` ✅
- `/use-cases` → `src/pages/UseCases.tsx` ✅
- `/use-cases/loan-lifecycle` → `src/pages/UseCaseLoanLifecycle.tsx` ✅
- `/use-cases/trade-settlement` → `src/pages/UseCaseTradeSettlement.tsx` ✅
- `/use-cases/kyc-onboarding` → `src/pages/UseCaseKycOnboarding.tsx` ✅
- `/use-cases/agentic-ai` → `src/pages/UseCaseAgenticAi.tsx` ✅
- `/contact` → `src/pages/Contact.tsx` ✅
- `src/components/ProofBar.tsx` ✅
- `src/components/ArchitectureDiagram.tsx` ✅
- `src/components/UseCaseCard.tsx` ✅
- Header: Use Cases + About links added ✅
- Footer: tagline updated ✅
- Pricing: H1 fixed, Coming Soon badges removed ✅
- HeroSection: chatbot widget removed ✅

## What the Audit Found — Remaining Problems
A professional site audit scored the site 22/40. The key remaining issues are:

### SEO — CRITICAL (scored 4/10)
1. All inner pages share the identical title tag from the old default — must each be unique
2. All pages share the same meta description — must each be unique
3. Canonical tags are missing on all pages except the homepage
4. `/about`, `/use-cases`, `/use-cases/*`, and `/contact` are absent from `public/sitemap.xml`
5. `/cto` page has TWO `<h1>` elements — a hard HTML and SEO error
6. Zero structured data (JSON-LD) on any page

### AI Readability (scored 6/10)
7. `public/llms.txt` description must be updated to match the homepage positioning
8. The entity model in `src/components/DeveloperReliabilitySection.tsx` shows a
   warehouse/inventory JSON (SKU, warehouseId, UN3481 hazard codes) — this must be
   replaced with a financial entity. See REQUIREMENTS.md for the exact replacement JSON.

### Copy / Marketing
9. "Available to all" still appears on the Products page — remove it
10. The About page mission quote is the strongest ICP copy on the site and is not on the homepage
11. SRT (Synthetic Risk Transfer) is a named ICP priority market with no page presence

### Visual
12. Hero background is a generic 3D node/tunnel animation — signals consumer SaaS, not fintech
13. EcosystemSection feature icons use orange/amber — replace with teal
14. Use-case sub-pages are entirely text — add state machine diagrams

## Critical SEO Note: SPA Title Tags
This project is a pure client-side React SPA. `react-helmet-async` sets title tags via
JavaScript after page load. Googlebot will only see them after full JS rendering.

The `SEO` component (`src/components/SEO.tsx`) auto-appends "| Cyoda" to every title:
`const fullTitle = \`${title} | ${siteName}\`` — this makes most titles too long (>60 chars)
and means every page that passes the same `title` prop gets an identical rendered title.

**Required fix**: Modify `SEO.tsx` to set `fullTitle = title` (remove the auto-append).
Then every page passes its own complete title string, including "| Cyoda" where appropriate.
Every page must also pass an explicit `url` prop for the canonical tag.

## Key Constraints — DO NOT
- Do NOT create a new project or change the build system
- Do NOT remove working features (blog, analytics, cookie consent, theme toggle)
- Do NOT use orange (`--cyoda-orange` / `bg-icon`) in new enterprise sections
- Do NOT add `.texture-overlay` class to new sections
- Do NOT put "Available to all" in any copy
- Do NOT use "Get Building for Free"
- Do NOT invent customer names or metrics — use only proof points from REQUIREMENTS.md
- Do NOT change the purpose or layout of `/cto` or `/dev` — only fix their SEO metadata
  and the duplicate H1 on `/cto`

## Routing — How to Add New Pages
1. Create the file in `src/pages/`
2. Import it in `src/App.tsx`
3. Add `<Route path="..." element={<Component />} />` above the `*` catch-all

## Read Next
1. `docs/DESIGN.md` — visual specs, entity model replacement, icon and hero guidance
2. `docs/REQUIREMENTS.md` — exact SEO values, copy, and structured data per page
3. `docs/TASKS.md` — ordered task list with acceptance criteria
