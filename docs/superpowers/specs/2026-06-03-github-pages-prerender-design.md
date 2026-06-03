# Real-200 Prerendering for GitHub Pages

**Date:** 2026-06-03
**Status:** Approved (design) — pending implementation plan
**Repo:** cyoda-launchpad (cyoda.com marketing site)
**Revision:** v2 — incorporates findings from an independent design review (see "Review incorporation" at the end).

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
  impossible. The solution is **build-time prerendering (SSG)**: emit a real static
  HTML file for every route. (Decided.)
- **Prerender via headless-browser snapshot** (Playwright, already a dependency),
  not `vite-react-ssg`. Rationale: no SSR-safety refactor of page components —
  `reactflow`, `mermaid`, and the `@cyoda/workflow-*` viewers keep working as-is.
  The snapshot captures `react-helmet-async` head tags, which exist only after
  React runs. (Decided: Approach A.)
- **All real routes are enumerable at build time** (static routes + published blog
  slugs), so prerendering covers 100% of public URLs. No unknown dynamic paths.
- **Output URL shape: flat `<route>.html`.** Write `dist/use-cases/loan-lifecycle.html`
  (not `…/loan-lifecycle/index.html`). GitHub Pages "pretty URLs" then serve
  `/use-cases/loan-lifecycle` as a **direct 200 with no redirect**, matching the
  existing no-trailing-slash canonical tags. No canonical/sitemap URL-shape changes
  needed. `/` is served from `index.html`. (Decided.)
- **Canonical/OG/JSON-LD origin comes from a build-time env var.** `SEO.tsx` and
  `toAbsoluteUrl` must prefer `VITE_SITE_ORIGIN` (= `https://cyoda.com`) over
  `window.location`, so the crawl (which runs against `vite preview` on localhost)
  does not bake localhost URLs into canonical/`og:url`/`og:image`/`twitter:image`/
  JSON-LD. This also fixes runtime correctness. (Decided — see Risk H1.)
- **The existing `sitemap.xml` is NOT a trustworthy source** (audit below); the
  route list is derived from the app itself, and the sitemap is regenerated from the
  same canonical source.

### How the fix works (mechanism)

GitHub Pages does no content negotiation or user-agent sniffing. After
prerendering, a real file exists for each route, so Pages returns it as a 200 to
**every** client, byte-for-byte the same:

- **Non-JS clients** (crawler / curl / unfurler / AI) read the prerendered HTML and
  get full content + metadata. ✅
- **Real browsers** receive the same HTML, then run the `<script>` bundle it
  references → React boots and the SPA becomes interactive (workflow visualizer
  animates, nav works). The snapshot is first-paint only.

`main.tsx` uses `createRoot().render()` (client render, not `hydrateRoot`), so on
boot React renders into `#root`. There are **no hydration-mismatch errors**; at most
a sub-second first-paint flash. `hydrateRoot` is a possible future optimization, out
of scope here.

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
- **`/llm/` and `/llms.txt`** are real static files in `public/` (correct as-is; no
  prerendering needed — preserve in the regenerated sitemap).
- **Blog publish rule:** `blog-index.json` marks `test-post` as `published: false`
  and `demo-to-poc-in-fintech` as `published: true`. The canonical rule is
  **prerender posts where `published === true`** (matches the runtime filter in
  `blog-loader.ts`), which drops test content automatically. All published slugs
  exist in `public/docs/blogs/`, so `vite preview` can serve every targeted URL.

## Architecture

### 1. Single source of truth — `src/routes.tsx`

Extract all route definitions out of inline `App.tsx` JSX into one exported array:

```tsx
export type AppRoute = {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  // true = prerender as static; false = exclude (test/dev); "blog" = expand from blog-index
  prerender: boolean | "blog";
  // optional content selector the capture waits for (default: "main")
  waitFor?: string;
};

export const appRoutes: AppRoute[] = [
  { path: "/", component: lazy(() => import("./pages/Index")), prerender: true },
  // … all routes, including the three governed-AI aliases as ordinary entries …
  { path: "/blog/:slug", component: lazy(() => import("./pages/BlogPost")), prerender: "blog" },
  // ALL dev/test routes excluded:
  { path: "/blog-test", component: lazy(() => import("./pages/BlogTest")), prerender: false },
  { path: "/blog-system-test", component: lazy(() => import("./pages/BlogSystemTest")), prerender: false },
  { path: "/guide-system-test", component: lazy(() => import("./pages/GuideSystemTest")), prerender: false },
  { path: "/cookie-consent-test", component: lazy(() => import("./components/CookieConsentTest")), prerender: false },
  { path: "*", component: lazy(() => import("./pages/NotFound")), prerender: false },
];
```

- `App.tsx` renders `<Routes>` by mapping over `appRoutes` (the `*` catch-all stays
  last). The provider/shell wiring in `App.tsx` is unchanged. The commented-out
  `/guides` routes stay excluded (not added).
- The table is authoritative **by construction** — adding a page means adding one
  entry, which prerender and sitemap both consume. No separate manifest; no regex
  parsing.
- The three intentional governed-AI aliases
  (`/use-cases/governed-agentic-workflows`, `/use-cases/governed-ai-actions`,
  `/use-cases/agentic-ai`) remain mapped to `UseCaseGovernedAiActions` and are each
  prerendered so external links resolve.
- **Constraint:** `routes.tsx` must contain **no eval-time side effects** beyond the
  `import { lazy } from "react"` and the `lazy()` calls themselves (which are
  side-effect-free; the dynamic `import()` is never invoked when the prerender/sitemap
  scripts load the module). This keeps the single-source table importable in Node via
  Vite `ssrLoadModule` without running page code. (We deliberately keep one table
  rather than splitting paths into a React-free data module, to avoid reintroducing
  the two-lists drift this design exists to prevent.)

### 2. Prerender script — `scripts/prerender.mjs`

Runs **after** `vite build`, against the built `dist/`. The build that produces the
prerendered `dist/` sets `VITE_SITE_ORIGIN=https://cyoda.com` so SEO tags use the
production origin.

1. **Load routes without executing components.** Import `appRoutes` via Vite
   `ssrLoadModule('/src/routes.tsx')`. `lazy()` is invoked but its dynamic `import()`
   is not, so no page/`window` code runs in Node.
2. **Build the URL list:**
   - static paths where `prerender === true` (no `:param`), plus
   - for the `prerender: "blog"` entry, one URL per `blog-index.json` post with
     `published === true` (`/blog/<slug>`).
3. **Serve & crawl:** start `vite preview` on `dist/`; launch Playwright (Chromium)
   with bounded concurrency. For each URL:
   - wait for the loading spinner / skeleton selectors to be **absent**, AND
   - **primary readiness signal:** wait for `window.__PRERENDER_READY__ === true`.
     The app sets this once first-meaningful content has rendered; the five async
     workflow-viewer pages flip it only after their diagram has laid out (see §2a).
     Do **not** rely on Playwright `networkidle` — `mermaid.render`, `elkjs` layout,
     and React-Query retries can keep the network busy or leave a spinner on screen.
   - also wait for the content selector to be present (`main` default; per-route
     `waitFor` override, e.g. a rendered viewer node such as `.react-flow__node`),
   - all under a hard max-timeout.
4. **Build output HTML via template-merge** (not raw `documentElement.outerHTML`):
   - take the original built `dist/index.html` as the shell (preserves the
     `<script>`/`<link>` asset tags so browsers still boot the SPA),
   - merge in the helmet-produced `<head>` tags (title, meta, canonical, OG/Twitter,
     JSON-LD), de-duplicating against the shell's existing head,
   - inject the captured **`#root` innerHTML** as the shell's `#root` content,
   - **strip nodes rendered outside `#root`** — Sonner toasts, Radix tooltips/portals,
     and the cookie-consent banner — so crawlers index clean content and browsers
     don't inherit orphaned portal DOM that React won't reconcile.
5. **Write** flat files: `dist/<route>.html` (root route stays `dist/index.html`).
   `base: '/'` means absolute `/assets/...` URLs resolve regardless of nesting.
6. **Fail the build (non-zero exit)** if any route times out, errors, or yields an
   empty `#root`. A silently-blank page must not ship as a 200.

### 2a. In-app readiness signal

A small, app-level mechanism sets `window.__PRERENDER_READY__ = true` when the page
is ready to capture. For most pages this is "after the first render commit." For the
five workflow-viewer pages, the viewer components
(`GovernedAiActionsWorkflowViewer`, `LoanLifecycleWorkflowViewer`,
`ClaimsAdjudicationWorkflowViewer`, and the KYC/Trade-Settlement viewers) participate
so the flag flips only after their async layout settles. The flag is inert in normal
browser use; it exists purely for the crawl.

### 3. Sitemap regeneration — same `appRoutes`

Regenerate `sitemap.xml` from the canonical static routes + published blog slugs
(reuse the slug logic so URLs match exactly, no trailing slash — matching the flat
output shape and existing canonicals). Fixes the 4 dead URLs and drops the 14 bogus
`.md` paths. Preserve the legitimate `/llm/` and `/llms.txt` entries. Generated as
part of the build pipeline so the sitemap can never drift from the routes again.

### 4. CI — `.github/workflows/pages.yml`

- Add `npx playwright install --with-deps chromium`.
- Run the prerender step after `npm run build` (with `VITE_SITE_ORIGIN` set) and
  before `actions/upload-pages-artifact`.
- **Replace** `cp dist/index.html dist/404.html` with a **minimal SPA shell**
  `404.html` (boots the SPA, contains no homepage content) so genuine 404s do not
  serve full prerendered homepage markup + homepage canonical/OG under a 404 status
  (avoids soft-404).

NPM scripts: keep `build` = `vite build` (fast; no browser). Add `prerender` (runs
the script) and a convenience `build:static` = `build && prerender` for local
full-fidelity reproduction. CI runs build then prerender as explicit, separate steps.

### 5. Verification

- **Primary gate:** the prerender script fails on timeout / error / empty `#root`.
- **Vitest guard:** assert every `prerender: true` route produced a non-empty output
  file (non-empty `<title>`, `#root` has children, canonical/OG use `https://cyoda.com`
  not localhost) and that every `published === true` blog slug is covered.
- **Local smoke:** `curl -i` a nested route against `vite preview` of the
  post-prerender `dist/` returns 200 with rendered content and route-specific
  `<title>`.
- **Post-deploy smoke (required):** after deploy, `curl -i` a live nested URL
  (e.g. `https://cyoda.com/use-cases/loan-lifecycle`) and assert HTTP 200 + rendered
  content + production-origin canonical. `vite preview` does NOT replicate Pages'
  serving/redirect semantics, so preview verification is necessary but not sufficient.

## Out of scope / untouched

- All page components except: the `SEO`/`toAbsoluteUrl` origin change, the small
  readiness-signal hooks in the five viewer components, and the `App.tsx`→`routes.tsx`
  routing refactor.
- `reactflow` / `mermaid` / `@cyoda/workflow-*` viewer internals — no SSR-safety work.
- The dev server and `base: '/'`.
- Migrating hosts or adopting an SSR meta-framework.
- `hydrateRoot` migration (possible later optimization).

## Risks & mitigations

- **[H1 — fixed in design] Localhost origin baked into SEO tags.** `SEO.tsx` and
  `toAbsoluteUrl` build canonical/OG/JSON-LD URLs from `window.location`; under the
  preview crawl that is localhost. Mitigation: `VITE_SITE_ORIGIN` env var, preferred
  over `window.location`. Verified by the Vitest guard.
- **[H2 — fixed in design] Snapshot duplication / orphaned portal DOM.** Raw
  `documentElement.outerHTML` would duplicate head tags on re-boot and capture
  toasts/tooltips/banner rendered outside `#root`. Mitigation: template-merge + strip
  non-`#root` nodes (§2 step 4).
- **[H3 — fixed in design] `networkidle` never fires / captures spinner.** Async
  mermaid/elkjs + React-Query retries. Mitigation: `__PRERENDER_READY__` is the
  primary signal (§2a); networkidle is not used.
- **[M1] `vite preview` ≠ Pages.** Mitigation: required post-deploy live-URL smoke
  check (§5).
- **[M2] CI cost/flakiness from the headless crawl (~28 URLs).** Mitigation: bounded
  concurrency, per-route max-timeout, hard build-fail surfaces problems immediately.
  Viewer pages (elkjs layout) are the slow ones; the readiness signal bounds them.
- **[L1] First-paint flash on browsers** (createRoot, not hydrate). Accepted;
  `hydrateRoot` is the future fix.
- **[L2] GA pollution during crawl** — not a risk: default consent is denied with no
  localStorage, so `AnalyticsManager` does not initialize GA during the crawl
  (confirmed in review).

## Review incorporation (v2)

An independent reviewer (fresh context) verified the spec against the code and
returned "sound-with-fixes." Incorporated: the H1 origin blocker (env var), H2
template-merge + portal stripping, H3 `__PRERENDER_READY__` as primary readiness,
flat `<route>.html` output, all four dev/test routes excluded, minimal-shell
`404.html`, and the post-deploy smoke check. Declined: splitting `appRoutes` into a
React-free data module (would reintroduce two-lists drift); instead the single table
is kept with a documented no-eval-side-effects constraint so `ssrLoadModule` can load
it safely.
