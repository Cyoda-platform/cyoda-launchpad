# Cyoda Website — Instructions for Codex

## This Is an Existing Project
Repository: `/Users/patrick/dev/cyoda-launchpad`
Do NOT create a new project. Work entirely within the existing codebase.

## Project Stack
- **Framework**: Vite + React 18 + TypeScript
- **Routing**: react-router-dom v6 (routes defined in `src/App.tsx`)
- **Styling**: Tailwind CSS v3 + shadcn/ui component library
- **Design tokens**: CSS variables in `src/index.css`
- **Font**: Montserrat (Google Fonts, loaded in `src/index.css`)
- **Theme**: Light mode default; dark/light toggle via `next-themes` + `ThemeProvider`
  (`defaultTheme="light"` in `src/App.tsx`, `attribute="class"`)
- **SEO**: `react-helmet-async` via `src/components/SEO.tsx`
  — `fullTitle = title` (no auto-append; each page owns its own complete title string)
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

## Current State — Completed Work

### Pages (all routed in `src/App.tsx`)
- `/` → `src/pages/Index.tsx` ✅
- `/products` → `src/pages/Products.tsx` ✅
- `/pricing` → `src/pages/Pricing.tsx` ✅
- `/comparison` → `src/pages/Comparison.tsx` ✅
- `/use-cases` → `src/pages/UseCases.tsx` ✅
- `/use-cases/loan-lifecycle` → `src/pages/UseCaseLoanLifecycle.tsx` ✅
- `/use-cases/trade-settlement` → `src/pages/UseCaseTradeSettlement.tsx` ✅
- `/use-cases/kyc-onboarding` → `src/pages/UseCaseKycOnboarding.tsx` ✅
- `/use-cases/agentic-ai` → `src/pages/UseCaseAgenticAi.tsx` ✅
- `/dev` → `src/pages/Dev.tsx` ✅
- `/cto` → `src/pages/Cto.tsx` ✅ (duplicate H1 fixed)
- `/about` → `src/pages/About.tsx` ✅
- `/contact` → `src/pages/Contact.tsx` ✅
- `/blog` → `src/pages/Blog.tsx` ✅
- `/blog/:slug` → `src/pages/BlogPost.tsx` ✅
- `/support` → `src/pages/Support.tsx` ✅

### Components
- `src/components/HeroSection.tsx` ✅ — SVG architecture field background; CTAs: "Talk to us" + "Open source, run it yourself"
- `src/components/ProofBar.tsx` ✅ — Two production proof points, ShieldCheck icon
- `src/components/CyodaPathsSection.tsx` ✅ — Enterprise card full-width primary; OSS + Cloud as 2-column secondary row
- `src/components/CyodaModelDiagram.tsx` ✅ — Hexagon layout, 6 nodes including Business Logic
- `src/components/EcosystemSection.tsx` ✅ — 4 tiles, teal icons, 2×2 grid
- `src/components/ArchitectureDiagram.tsx` ✅
- `src/components/UseCaseCard.tsx` ✅
- `src/components/Header.tsx` ✅ — Platform, Solutions, Cyoda Cloud, Open Source, Docs nav; mobile drawer
- `src/components/Footer.tsx` ✅ — Platform, Company, Cyoda columns; social links; cookie preferences

### SEO / Structured Data
- `src/components/SEO.tsx` ✅ — auto-append removed; renders `jsonLd` prop
- `src/data/schemas.ts` ✅ — `organizationSchema`, `faqSchema`, breadcrumb schemas
- All pages: unique title, description, canonical URL ✅
- `public/sitemap.xml` ✅ — includes all routes
- `public/llms.txt` ✅ — describes three-site structure and Enterprise Cyoda

### Design System
- Light mode default with teal primary (`--primary: 175 65% 32%`)
- `src/index.css` ✅ — `:root` has `--primary`, `--primary-foreground`, `--border`, `--accent`, `--muted-foreground`
- `bg-gradient-primary` and `glow-hover` utilities defined

## Cyoda Web Estate (three-site structure)
- **cyoda.com** — Enterprise Cyoda (this site). Commercially supported for regulated production.
- **cyoda.org** — Open-source Cyoda. Self-hosted, run-it-yourself.
- **ai.cyoda.net** — Cyoda Cloud. Hosted SaaS, free evaluation tier.
- **docs.cyoda.net** — Documentation and API reference.

The homepage positions Enterprise Cyoda as the primary offering. The other two properties
are surfaced as secondary options in `CyodaPathsSection` and the header nav.

## Key Constraints — DO NOT
- Do NOT create a new project or change the build system
- Do NOT remove working features (blog, analytics, cookie consent, theme toggle)
- Do NOT use orange (`--cyoda-orange` / `bg-icon`) in new enterprise sections
- Do NOT add `.texture-overlay` class to new sections
- Do NOT put "Available to all" in any copy
- Do NOT use "Get Building for Free"
- Do NOT invent customer names or metrics — use only verified proof points
- Do NOT change the purpose or layout of `/cto` or `/dev` — only fix their SEO metadata
- External links to cyoda.org and ai.cyoda.net should open in the **same tab** from CTA buttons;
  use `target="_blank"` for nav links only

## Routing — How to Add New Pages
1. Create the file in `src/pages/`
2. Import it in `src/App.tsx`
3. Add `<Route path="..." element={<Component />} />` above the `*` catch-all
4. Add `<SEO title="..." description="..." url="..." />` in the page
5. Add the URL to `public/sitemap.xml`

## Read Next
1. `docs/DESIGN.md` — visual specs, design tokens, entity model
2. `docs/REQUIREMENTS.md` — exact SEO values, copy, and structured data per page
3. `docs/TASKS.md` — task list with acceptance criteria
