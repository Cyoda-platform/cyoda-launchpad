# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is the **cyoda.com** marketing/product site (Enterprise Cyoda). `AGENTS.md` and `README.md` carry the canonical project rules and route table — read those for copy constraints, brand DOs/DON'Ts, and the full route list. This file focuses on commands and the architectural shape that isn't obvious from a single file.

## Commands

```bash
npm run dev         # Vite dev server on port 8080
npm run dev:test    # Dev server with Vite mode "test" (uses .env.test)
npm run build       # Production build (runs prebuild → generate-blog-index.js)
npm run build:dev   # Build with development mode (sourcemaps, no minify)
npm run build:static # Build + prerender all routes to flat dist/<route>.html + sitemap (what CI deploys)
npm run prerender    # Prerender an existing dist/ (requires prior build with VITE_SITE_ORIGIN)
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run generate-index   # Manually rebuild src/data/blog-index.json from src/content/

npm run test        # Vitest watch
npm run test:run    # Vitest one-shot
npm run test:ui     # Vitest UI
npm run test:coverage
npm run test:e2e    # Playwright (requires dev server reachable at localhost:8080)
npm run test:e2e:ui
```

Run a single Vitest file: `npx vitest run path/to/file.test.ts`
Run a single Playwright test: `npx playwright test tests/e2e/<file>.spec.ts -g "<title>"`

After changes, run `npm run build && npm run typecheck` (and `npm run lint` before shipping). Tests live in `tests/{unit,integration,e2e}` with `tests/setup.ts` as the Vitest setup file (see `vitest.config.ts`).

## Architecture

**SPA shape.** Vite + React 18 + TypeScript. `@` is aliased to `src/` (see `vite.config.ts`). React/react-dom are deduped and pinned via explicit aliases — don't add a second copy via a sub-dependency.

**Routing & app shell — `src/App.tsx`.** All pages are `React.lazy()` imports, wrapped in a single `<Suspense>`. Routes are declared above a `*` catch-all (`NotFound`). The shell wires, in order: `HelmetProvider` → `QueryClientProvider` (TanStack Query) → `ThemeProvider` (`next-themes`, `attribute="class"`, `defaultTheme="light"`) → `CookieConsentProvider` → `AnalyticsManager` → `TooltipProvider` → `BrowserRouter` (with `basename` from `import.meta.env.BASE_URL`) → `AnalyticsTracker` (calls `useAnalyticsTracking` + `useUtmTracking`). The cookie-consent banner and the lazy-loaded preferences modal sit outside the routed area so they persist across navigation. Routes live in `src/routes.tsx` (`appRoutes` — the single source of truth consumed by the router, the prerender crawl, and sitemap generation). New pages must be added there above the `*` catch-all entry with `prerender: true`; the deploy pipeline prerenders every such route to a flat `dist/<route>.html` and regenerates `sitemap.xml` automatically.

**Note on aliased routes.** `App.tsx` intentionally maps several use-case URLs (`/use-cases/governed-agentic-workflows`, `/use-cases/governed-ai-actions`, `/use-cases/agentic-ai`) to the same `UseCaseGovernedAiActions` page. Don't "deduplicate" these — they exist to preserve external links.

**SEO — `src/components/SEO.tsx` + `src/data/schemas.ts`.** Each page renders its own `<SEO title="…" description="…" url="…" jsonLd={…} />`. The component does **not** auto-append a site suffix to titles — every page must own its full `<title>` string. JSON-LD is passed via the `jsonLd` prop using the helpers in `src/data/schemas.ts` (`organizationSchema`, breadcrumb builders).

**Blog pipeline.** Markdown lives in `src/content/` (parsed at runtime via `gray-matter` and `react-markdown` + `remark-gfm` + `rehype-raw`). `scripts/generate-blog-index.js` runs in `prebuild` and writes `src/data/blog-index.json`, which the blog pages consume — so a content change isn't visible after `npm run build` unless the index regenerates. Use `npm run generate-index` to force it. Code blocks in posts are rendered with `react-syntax-highlighter` (Prism).

**Workflow viewers.** Read-only Cyoda workflow rendering is provided by the `@cyoda/workflow-{core,graph,layout,viewer}` packages. Diagrams elsewhere use `reactflow` and `mermaid`. `gray-matter`/`buffer` need explicit Vite pre-bundling and a `globalThis` shim — both are configured in `vite.config.ts`; preserve them when touching that file.

**Analytics & consent.** GA4 is loaded via `react-ga4` inside `AnalyticsManager`, gated by the consent state from `CookieConsentProvider`. `useAnalyticsTracking` hooks page-view tracking into route changes; `useUtmTracking` captures UTMs once on app load. Don't fire analytics outside this gate.

**Design system.** Tailwind v3 + shadcn/ui (full library in `src/components/ui/`). Design tokens are CSS variables in `src/index.css` (light is the default theme; teal primary at `--primary: 175 65% 32%`). Tailwind config (`tailwind.config.ts`) extends colors from those CSS vars and registers `tailwindcss-animate` and `@tailwindcss/typography`. The font is Montserrat, loaded in `src/index.css`.

## Three-site context

The Cyoda web estate is split across three sites — this matters when writing copy and CTAs:

- **cyoda.com** (this repo) — Enterprise, commercially supported.
- **cyoda.dev** — Open-source, self-hosted.
- **ai.cyoda.net** — Cyoda Cloud, hosted SaaS.
- **docs.cyoda.net** — Docs.

Convention: CTA buttons that go to `cyoda.dev` / `ai.cyoda.net` open in the **same tab**; only header/footer nav links to those properties use `target="_blank"`.

## Project docs to consult

- `AGENTS.md` — full route table, brand/copy constraints, "DO NOT" rules.
- `docs/DESIGN.md` — visual specs, design tokens, entity model.
- `docs/REQUIREMENTS.md` — exact SEO values, copy, and structured data per page.
- `docs/TASKS.md` — task list with acceptance criteria.
