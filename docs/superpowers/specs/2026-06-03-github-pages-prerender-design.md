# Real-200 Prerendering for GitHub Pages

**Date:** 2026-06-03
**Status:** Approved (design) — pending implementation plan
**Repo:** cyoda-launchpad (cyoda.com marketing site)

## Problem

The site is a Vite + React 18 + react-router-dom v6 SPA using `BrowserRouter`,
deployed to GitHub Pages with a `CNAME` for `cyoda.com`. GitHub Pages is a static
file server with no server-side logic. Routes such as
`/use-cases/governed-agentic-workflows` exist only after React + react-router boot
client-side; there is no static file at that path, so a direct request returns a
real **network-level 404**.

The current mitigation (`cp dist/index.html dist/404.html` in the deploy workflow)
only lets a **JavaScript-executing browser** recover client-side. It does not help
non-JS clients: crawlers, social/link unfurlers, `curl`, and AI fetchers receive a
404 status with no rendered content. This breaks SEO, link previews, and machine
readability.

**Reproduce:** `curl -i https://cyoda.com/use-cases/loan-lifecycle` returns 404.

## Goal

Every public route must return a real network-level **200** with **fully-rendered
HTML** — visible content, route-specific `<title>`/meta tags, and JSON-LD — to all
clients, including non-JS fetchers. The fix must not depend on the `404.html`
redirect hack or on client-side JS execution.

## Constraints & decisions

- **Hosting stays on GitHub Pages.** Static-only; true per-request SSR is
  impossible. The solution is **build-time prerendering (SSG)**: emit a real
  `index.html` for every route. (Decided: stay on Pages.)
- **Prerender via headless-browser snapshot** (Playwright, already a dependency),
  not `vite-react-ssg`. Rationale: zero changes to page components — `reactflow`,
  `mermaid`, and the `@cyoda/workflow-*` viewers need no SSR-safety refactor. The
  snapshot captures `react-helmet-async` head tags exactly as the browser produces
  them. (Decided: Approach A.)
- **All real routes are enumerable at build time** (static routes + blog slugs),
  so prerendering covers 100% of public URLs — there are no unknown dynamic paths.
- **The existing `sitemap.xml` is NOT a trustworthy source** (audit below), so the
  route list must be derived from the app itself, and the sitemap is regenerated
  from the same canonical source.

### How the fix works (mechanism)

GitHub Pages does no content negotiation or user-agent sniffing. After
prerendering, a real file exists at `dist/<route>/index.html`, so Pages returns it
as a 200 to **every** client, byte-for-byte the same:

- **Non-JS clients** (crawler / curl / unfurler / AI) read the prerendered HTML
  and get full content + metadata. ✅
- **Real browsers** receive the same HTML, then run the `<script>` bundle it
  references → React boots and the SPA becomes interactive (workflow visualizer
  animates, nav works). The snapshot is first-paint only.

`main.tsx` uses `createRoot().render()` (client render, not `hydrateRoot`), so on
boot React replaces `#root` content. There are **no hydration-mismatch errors**;
at most a sub-second first-paint flash. Switching to `hydrateRoot` is a possible
future optimization, out of scope here.

## Sitemap audit (why we can't trust it)

Comparing `public/sitemap.xml` against `App.tsx` routes and `blog-index.json`:

- **4 dead blog URLs** — sitemap uses underscores; `generate-blog-index.js`
  (`createSlug`) produces hyphens. Dead URLs advertised to Google:
  - `/blog/a_technical_description_of_the_cyoda_platform` → `…/a-technical-description-of-the-cyoda-platform`
  - `/blog/entity_workflows_for_event-driven_architectures` → `…/entity-workflows-for-event-driven-architectures`
  - `/blog/whats_an_entity_database` → `…/whats-an-entity-database`
  - `/blog/cyoda_comparison_by_category` → `…/cyoda-comparison-by-category`
- **14 bogus `.md` paths** (`/docs/blogs/*.md`) listed as URLs; not routes.
- **Missing real routes:** the aliases `/use-cases/governed-ai-actions` and
  `/use-cases/agentic-ai`, and the published post `demo-to-poc-in-fintech`.
- **`/llm/` and `/llms.txt`** are real static files in `public/` (correct as-is;
  no prerendering needed).
- **Blog publish rule:** `blog-index.json` marks `test-post` as
  `published: false` and `demo-to-poc-in-fintech` as `published: true`. The
  canonical rule is **prerender posts where `published === true`**, which drops
  test content automatically.

## Architecture

### 1. Single source of truth — `src/routes.tsx`

Extract all route definitions out of inline `App.tsx` JSX into one exported array:

```tsx
export type AppRoute = {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  // true = prerender as static; false = exclude (test/dev); "blog" = expand from blog-index
  prerender: boolean | "blog";
  // optional content selector the prerender capture waits for (default: "main")
  waitFor?: string;
};

export const appRoutes: AppRoute[] = [
  { path: "/", component: lazy(() => import("./pages/Index")), prerender: true },
  // … all routes, including the three governed-AI aliases as ordinary entries …
  { path: "/blog/:slug", component: lazy(() => import("./pages/BlogPost")), prerender: "blog" },
  { path: "/blog-test", component: lazy(() => import("./pages/BlogTest")), prerender: false },
  { path: "*", component: lazy(() => import("./pages/NotFound")), prerender: false },
];
```

- `App.tsx` renders `<Routes>` by mapping over `appRoutes` (the `*` catch-all
  stays last). The provider/shell wiring in `App.tsx` is unchanged.
- Because the app can only serve routes present in `appRoutes`, the table is
  authoritative **by construction** — adding a page means adding one entry, which
  prerender and sitemap both consume. No separate manifest to forget; no regex
  parsing.
- The three intentional governed-AI aliases
  (`/use-cases/governed-agentic-workflows`, `/use-cases/governed-ai-actions`,
  `/use-cases/agentic-ai`) remain mapped to `UseCaseGovernedAiActions` and are
  each prerendered so external links resolve.

### 2. Prerender script — `scripts/prerender.mjs`

Runs **after** `vite build`, against the built `dist/`.

1. **Load routes without executing components.** Import `appRoutes` via Vite's
   `ssrLoadModule('/src/routes.tsx')`. `lazy(() => import(...))` is never invoked,
   so no page/`window` code runs in Node.
2. **Build the URL list:**
   - static paths where `prerender === true` (no `:param`), plus
   - for the `prerender: "blog"` entry, one URL per `blog-index.json` post with
     `published === true` (`/blog/<slug>`).
3. **Serve & crawl:** start `vite preview` on `dist/`; launch Playwright
   (Chromium). For each URL:
   - wait for `networkidle` (bundle + blog markdown fetched from
     `public/docs/blogs/*.md`),
   - wait for the loading spinner / skeleton selectors to be **absent**,
   - wait for the content selector to be present (`main` by default; per-route
     `waitFor` override — e.g. a rendered workflow-viewer node such as
     `.react-flow__node` — for viewer pages),
   - all under a hard max-timeout.
4. **Write** `document.documentElement.outerHTML` to `dist/<route>/index.html`
   (root route overwrites `dist/index.html`). The captured HTML includes the same
   `<script>`/`<link>` tags, so browsers still boot the SPA; `base: '/'` means
   absolute `/assets/...` URLs resolve from any nesting depth.
5. **Fail the build (non-zero exit)** if any route times out, errors, or yields an
   empty `#root`. A silently-blank page must not ship as a 200.

### 3. Sitemap regeneration — same `appRoutes`

Regenerate `sitemap.xml` from the canonical static routes + published blog slugs
(reuse the slug logic so URLs match exactly). This fixes the 4 dead URLs and drops
the 14 bogus `.md` paths. Preserve the legitimate `/llm/` and `/llms.txt` entries.
Generated as part of the build pipeline so the sitemap can never drift from the
routes again.

### 4. CI — `.github/workflows/pages.yml`

- Add a Playwright browser install step: `npx playwright install --with-deps chromium`.
- Run the prerender step after `npm run build` and before
  `actions/upload-pages-artifact`.
- Keep `cp dist/index.html dist/404.html` as a fallback for **genuinely unknown**
  URLs only (real routes now have their own files).

NPM scripts: keep `build` = `vite build` (fast; no browser, so dev/preview builds
stay quick). Add `prerender` (runs the script) and a convenience
`build:static` = `build && prerender` for local full-fidelity reproduction. CI runs
build then prerender as explicit, separate steps.

### 5. Verification

- **Primary gate:** the prerender script's own failure on timeout / error / empty
  `#root`.
- **Vitest guard:** assert every `prerender: true` route produced a non-empty
  output file (non-empty `<title>`, `#root` has children) and that every
  `published === true` blog slug is covered.
- **Manual smoke:** `curl -i` a nested route against `vite preview` of the
  post-prerender `dist/` returns 200 with rendered content and route-specific
  `<title>`.

## Out of scope / untouched

- All page components, `reactflow` / `mermaid` / `@cyoda/workflow-*` viewers — no
  SSR-safety changes.
- The dev server and `base: '/'`.
- Migrating hosts or adopting an SSR meta-framework.
- `hydrateRoot` migration (possible later optimization).
- Stripping the cookie-consent banner from snapshots (it renders in its correct
  pre-consent state; acceptable).

## Risks & mitigations

- **Async/animated workflow viewer not captured:** mitigated by the content
  selector wait + per-route `waitFor` override; escalation path is an in-app
  `window.__PRERENDER_READY__` signal the viewer flips on layout settle (only if a
  page proves flaky).
- **Build time / flakiness from headless crawl (~30 URLs):** bounded concurrency,
  per-route max-timeout, and a hard build-fail surface problems immediately rather
  than shipping blanks.
- **First-paint flash on browsers:** accepted; `hydrateRoot` is the future fix.
```
