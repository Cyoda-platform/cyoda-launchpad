# cyoda.com — Enterprise Cyoda website

Marketing and product site for Enterprise Cyoda (cyoda.com), the commercially supported
deployment of the Cyoda EDBMS for regulated and mission-critical production environments.

## Cyoda web estate

| Site | Purpose |
|------|---------|
| cyoda.com | Enterprise Cyoda — this repo |
| cyoda.org | Open-source Cyoda — self-hosted, run-it-yourself |
| ai.cyoda.net | Cyoda Cloud — hosted SaaS, free evaluation tier |
| docs.cyoda.net | Documentation and API reference |

## Stack

- **Framework**: Vite + React 18 + TypeScript
- **Routing**: react-router-dom v6 (`src/App.tsx`)
- **Styling**: Tailwind CSS v3 + shadcn/ui
- **Theme**: light mode default; dark mode toggle via `next-themes`
- **Design tokens**: CSS custom properties in `src/index.css`
- **Font**: Montserrat (Google Fonts)
- **SEO**: `react-helmet-async` via `src/components/SEO.tsx`
- **Analytics**: GA4 via `src/components/AnalyticsManager.tsx`
- **Blog**: Markdown files in `src/content/`, indexed by `scripts/generate-blog-index.js`
- **Components**: shadcn/ui in `src/components/ui/`

## Build commands

```bash
npm install       # Install dependencies
npm run dev       # Dev server on port 8080
npm run build     # Production build
npm run lint      # ESLint
npm run typecheck # npx tsc --noEmit
```

Run `npm run build && npm run typecheck` after every change.

## Routes

| Path | Page |
|------|------|
| `/` | Homepage (Enterprise Cyoda) |
| `/comparison` | Compare vs. alternatives |
| `/use-cases` | Use cases hub |
| `/use-cases/loan-lifecycle` | Loan origination |
| `/use-cases/trade-settlement` | Trade settlement |
| `/use-cases/kyc-onboarding` | KYC onboarding |
| `/use-cases/agentic-ai` | Agentic AI |
| `/dev` | For developers |
| `/cto` | For engineering leaders |
| `/about` | About |
| `/contact` | Contact |
| `/blog` | Blog |
| `/blog/:slug` | Blog post |
| `/support` | Support |

## Key constraints

- Do NOT use orange (`--cyoda-orange`) in enterprise sections
- Do NOT put "Available to all" in any copy
- Do NOT invent customer names or metrics — use only verified proof points
- Do NOT remove the dark mode toggle, analytics, or cookie consent
- External links to cyoda.org and ai.cyoda.net open in the same tab from CTAs;
  `target="_blank"` is for nav links only

## Adding a new page

1. Create the file in `src/pages/`
2. Import it in `src/App.tsx`
3. Add `<Route path="..." element={<Component />} />` above the `*` catch-all
4. Add `<SEO title="..." description="..." url="..." />` at the top of the page
5. Add the URL to `public/sitemap.xml`

## Project docs

- `docs/DESIGN.md` — visual specs, design tokens
- `docs/REQUIREMENTS.md` — SEO values, copy, and structured data per page
- `docs/TASKS.md` — task list with acceptance criteria
- `CLAUDE.md` — instructions for Claude Code sessions
