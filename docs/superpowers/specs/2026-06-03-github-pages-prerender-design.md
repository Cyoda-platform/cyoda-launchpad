# Real-200 Prerendering for GitHub Pages

**Date:** 2026-06-03
**Status:** Approved (design) — pending implementation plan
**Repo:** cyoda-launchpad (cyoda.com marketing site)
**Revision:** v4 — incorporates three independent review iterations (see "Review incorporation" at the end).

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
  (not `…/loan-lifecycle/index.html`). GitHub Pages "pretty URLs" serve
  `/use-cases/loan-lifecycle` as a **direct 200 with no redirect** (verified
  behavior), matching the existing no-trailing-slash canonical tags. A file
  (`blog.html`) and a same-named directory (`blog/`) coexist. `/` is served from
  `index.html`. Trailing-slash variants (`/foo/`) fall through to `404.html` —
  browsers recover client-side via the SPA shell; non-JS clients get a 404. Our
  canonicals and sitemap are slash-free, so this is an accepted edge (see Risk L3).
  (Decided.)
- **Canonical/OG/JSON-LD origin comes from a build-time env var.**
  `VITE_SITE_ORIGIN` (= `https://cyoda.com`) must be preferred over
  `window.location` **everywhere a URL ends up in SEO-relevant markup**, not just in
  `SEO.tsx`/`toAbsoluteUrl`: `BlogPost.tsx` (passes `url={window.location.href}` to
  `<SEO>` and `SocialShare`) and `Guide.tsx` (same pattern) must derive URLs from
  the env origin + route path instead. Otherwise the crawl (which runs against
  `vite preview` on localhost) bakes localhost into canonical/`og:url`/`og:image`/
  `twitter:image`/JSON-LD on exactly the highest-value pages. (Decided — Risk H1.)
  Two precise rules complete this fix:
  - **No-`url` pages:** `CookiePolicy.tsx`, `PrivacyPolicy.tsx`, and
    `TermsOfService.tsx` pass no `url` prop, so `SEO.tsx`'s fallback must be
    `VITE_SITE_ORIGIN + window.location.pathname` (the pathname is correct at crawl
    time; only the origin is wrong), not raw `window.location.href`.
  - **Unset-var behavior:** when `VITE_SITE_ORIGIN` is not set (local dev, the
    Surge preview-deploy workflow), fall back to `window.location.origin` — the
    pre-change behavior. The env var is required only for the production
    prerendering build; dev and preview deploys keep working unchanged. (The
    preview workflow's existing `SITE_URL`/`SURGE_URL` env vars are dead code —
    never read by `src/`; Vite only exposes `VITE_*` vars.)
- **Fix the hardcoded off-brand OG fallback while we're here.** `SEO.tsx` hardcodes
  `https://lovable.dev/opengraph-image-p98pqg.png` as the default OG image and as
  the JSON-LD publisher logo. Prerendering would freeze that into static HTML on
  every page without an explicit image. Replace with a cyoda.com asset (e.g.
  `/opengraph-image-cyoda.png`, which exists in `public/`). (Decided — pre-existing
  bug surfaced by review.)
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

`main.tsx` uses `createRoot().render()` (client render, not `hydrateRoot`): on boot
React wipes `#root` and re-renders, so injected snapshot content is purely cosmetic
first paint — **no hydration-mismatch errors**, at most a sub-second flash.
`hydrateRoot` is a possible future optimization, out of scope here.

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
  Slugs in the index match runtime lookup (`blog-loader.ts` resolves by
  `post.slug`).

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
  // CookieConsentTest is a named export — preserve the .then(m => ({default: m.CookieConsentTest})) mapping:
  { path: "/cookie-consent-test", component: lazy(() => import("./components/CookieConsentTest").then(m => ({ default: m.CookieConsentTest }))), prerender: false },
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
  prerendered so external links resolve. The page's single canonical `url` prop
  (pointing at one of the three) prevents duplicate-content signals.
- **Constraint:** `routes.tsx` must contain **no eval-time side effects** beyond
  `import { lazy } from "react"` and the `lazy()` calls themselves (side-effect-free;
  the dynamic `import()` is never invoked when build scripts load the module). The
  prerender and sitemap scripts load the table via Vite `ssrLoadModule` and read
  **only** `path` / `prerender` / `waitFor` — they never touch `component`. (We
  deliberately keep one table rather than splitting paths into a React-free data
  module, to avoid reintroducing the two-lists drift this design exists to prevent.)

### 2. Prerender script — `scripts/prerender.mjs`

Runs **after** `vite build`, against the built `dist/`. The build that produces the
prerendered `dist/` sets `VITE_SITE_ORIGIN=https://cyoda.com` so SEO tags use the
production origin. (`prebuild` regenerates `blog-index.json` before `vite build`,
so the prerender step always reads the fresh index.)

0. **Save the clean shell first.** Before any prerender writes, copy the original
   built `dist/index.html` (hashed asset tags, empty `#root`) aside. It is both the
   template-merge base (step 4) and the source for `404.html` (§4). This ordering
   matters because step 5 overwrites `dist/index.html` with the prerendered
   homepage.
1. **Load routes without executing components.** Import `appRoutes` via Vite
   `ssrLoadModule('/src/routes.tsx')`; read only `path`/`prerender`/`waitFor`.
2. **Build the URL list:**
   - static paths where `prerender === true` (no `:param`), plus
   - for the `prerender: "blog"` entry, one URL per `blog-index.json` post with
     `published === true` (`/blog/<slug>`).
3. **Serve & crawl:** start `vite preview` on an explicit port and **wait for it to
   accept connections** before crawling; launch Playwright (Chromium) with bounded
   concurrency. For each URL:
   - **primary readiness signal:** wait for `window.__PRERENDER_READY__ === true`
     (contract in §2a). Do **not** rely on Playwright `networkidle` —
     `mermaid.render`, `elkjs` layout, and React-Query retries can keep the network
     busy or leave a spinner on screen.
   - also wait for the content selector to be present (`main` default; per-route
     `waitFor` override, e.g. a rendered viewer node such as `.react-flow__node`)
     and for loading spinner / skeleton selectors to be **absent**,
   - strip the cookie-consent banner from `#root` and assert the strip succeeded (see step 4),
   - all under a hard max-timeout.
4. **Build output HTML via template-merge** (not raw `documentElement.outerHTML`):
   - start from the saved clean shell (step 0) — preserves the `<script>`/`<link>`
     asset tags so browsers still boot the SPA,
   - **title rule:** react-helmet-async sets the title via `document.title` and
     adds **no `data-rh` marker** to the `<title>` element — so capture
     `document.title` separately and **overwrite the shell's static `<title>`
     unconditionally**. A `data-rh`-only selector would miss it and ship the
     generic homepage title on every page.
   - **meta/link/script rule:** merge the helmet-produced tags (these DO carry
     `data-rh`: meta, canonical link, JSON-LD script). The shell `index.html`
     ships its own static `description`/`og:*`/`twitter:*` meta tags **without**
     `data-rh`, so dedup must key on tag identity and **remove the shell's static
     counterpart** when a helmet tag with the same key exists: key = `name` for
     `<meta name=…>`, `property` for `<meta property=…>` (OG), `rel` for
     `<link rel=…>`. Appending without keyed removal would emit duplicate
     stale + correct tag pairs on every page.
   - inject the captured **`#root` innerHTML** as the shell's `#root` content,
   - **discard nodes outside `#root`** (Sonner/Toaster and Radix portals mount on
     `document.body`; they are empty at load but must not leak into output).
     Note: the cookie-consent banner renders **inside** `#root` and DOES appear
     during the crawl (no stored consent → `showBannerByDefault: true` — the original
     design assumption was inverted; discovered during implementation). The capture
     strips it by selector and asserts the strip succeeded (harmless, since
     `createRoot` wipes `#root` on boot and live browsers re-show the banner).
5. **Write** flat files: `dist/<route>.html` (root route overwrites
   `dist/index.html`). `base: '/'` means absolute `/assets/...` URLs resolve
   regardless of nesting.
6. **Fail the build (non-zero exit)** if any route times out, errors, yields an
   empty `#root`, or contains the preview origin (localhost) anywhere in its head.

### 2a. In-app readiness contract

A small `usePrerenderReady` mechanism (inert in normal browsing) defines
`window.__PRERENDER_READY__`:

- **Non-viewer pages:** ready = the lazy route chunk has mounted its `main` content
  (first commit of the page component). The `main`-present wait in §2 step 3 is the
  practical proxy; the flag flips in an effect after mount.
- **Viewer pages:** the five live workflow-viewer components
  (`GovernedAiActionsWorkflowViewer`, `ClaimsAdjudicationWorkflowViewer`,
  `KycOnboardingWorkflowViewer`, `LoanLifecycleWorkflowViewer`,
  `TradeSettlementWorkflowViewer`) **register** as pending on mount and **resolve**
  when their async layout result is set (all five share the identical
  `layoutGraph(...).then(setLayout)` pattern in an effect keyed on `graph`; all are
  statically imported and unconditionally rendered by their pages, so they always
  mount during a crawl visit). The page-level flag flips only when the page is
  mounted AND all registered viewers have resolved. Ordering is well-defined:
  React effects run children-first, so a viewer registers before the page-level
  flip effect runs.
  - **Error path:** a viewer must register only once `graph` is non-null, and must
    **resolve (not hang) on its error branch** — otherwise a future bad workflow
    JSON would surface as an opaque crawl timeout instead of a visible error card
    in captured output.
- `AgenticAiWorkflowViewer` is orphaned dead code (no page imports it) and does not
  participate.

### 3. Sitemap regeneration — same `appRoutes`

Regenerate the sitemap from the canonical static routes + published blog slugs
(reuse the slug logic so URLs match exactly; no trailing slash — matching the flat
output shape and existing canonicals). Fixes the 4 dead URLs and drops the 14 bogus
`.md` paths. Preserve the legitimate `/llm/` and `/llms.txt` entries.

- **Emit into `dist/sitemap.xml` during the post-build step, not into `public/`** —
  regenerating a checked-in `public/sitemap.xml` in CI would leave the working tree
  dirty and fight the committed copy. Remove the stale checked-in file (or replace
  it with the generated output once, then stop hand-editing it). Accepted
  consequence: `npm run dev` and a bare `vite build` (no prerender) have no
  `/sitemap.xml` — only the full production pipeline produces it. Update
  `docs/REQUIREMENTS.md` (REQ-SITEMAP), which still describes the sitemap as a
  manually maintained `public/` file. External references
  (`robots.txt`, `public/llm/index.html`) use the absolute
  `https://cyoda.com/sitemap.xml` URL, which still resolves — no change needed.
- **Metadata policy:** omit `changefreq`/`priority` (Google ignores them). Set
  `lastmod` for blog posts from the post `date` in `blog-index.json`; omit
  `lastmod` for static routes (no reliable source).
- `robots.txt` already references the sitemap URL; verify it points at
  `https://cyoda.com/sitemap.xml` (unchanged location).

### 4. CI — `.github/workflows/pages.yml`

- Add `npx playwright install --with-deps chromium`.
- Run the prerender step after `npm run build` (with `VITE_SITE_ORIGIN` set) and
  before `actions/upload-pages-artifact`.
- **Replace** `cp dist/index.html dist/404.html` with: write the **saved clean
  shell** (§2 step 0 — hashed assets, empty `#root`) as `404.html`. Genuine 404s
  then boot the SPA for client-side recovery without serving prerendered homepage
  content + homepage canonical/OG under a 404 status (avoids soft-404).

NPM scripts: keep `build` = `vite build` (fast; no browser). Add `prerender` (runs
the script) and a convenience `build:static` = `build && prerender` for local
full-fidelity reproduction. CI runs build then prerender as explicit, separate steps.

### 5. Verification

Every check has a defined owner and trigger — nothing is aspirational:

- **Primary gate (owner: `scripts/prerender.mjs`, runs in the deploy workflow):**
  fails the build on timeout / error / empty `#root` / localhost leakage in head
  tags, AND asserts post-write that every `prerender: true` route produced a
  non-empty output file (non-empty route-specific `<title>`, `#root` has children,
  canonical/OG/JSON-LD use `https://cyoda.com`), every `published === true` blog
  slug is covered, and the generated sitemap contains exactly the prerendered URL
  set + `/llm/` + `/llms.txt`. These `dist/`-dependent assertions live in the
  prerender script itself (not Vitest) because only the deploy pipeline has a
  built+prerendered `dist/` and a Chromium install.
- **Vitest guard (owner: unit tests, runs with the normal test suite):** route-table
  invariants that need no `dist/` — all four dev/test routes are `prerender: false`,
  no duplicate paths, the `*` catch-all is last and excluded, the three governed-AI
  aliases are present.
- **Local smoke:** `curl -i` a nested route against `vite preview` of the
  post-prerender `dist/` returns 200 with rendered content and route-specific
  `<title>`.
- **Local smoke note:** Vite 7's `preview` defaults to `appType: 'spa'` with an
  html-fallback middleware that resolves extensionless paths to `<path>.html` —
  the same pretty-URL behavior as Pages — AND falls back to `index.html` for
  unknown paths, which is also why the crawl itself works before flat files exist.
- **Post-deploy smoke (required; owner: a final CI step in `pages.yml` after the
  deploy job):** `curl -i` a live nested URL
  (e.g. `https://cyoda.com/use-cases/loan-lifecycle`) and assert HTTP 200 + rendered
  content + production-origin canonical. `vite preview` does NOT replicate Pages'
  serving semantics exactly, so preview verification is necessary but not
  sufficient.

## Scope of app-code changes

Deliberately small, and all serve the goal:

- `App.tsx` → render routes from `src/routes.tsx` (new file).
- `SEO.tsx` + `toAbsoluteUrl` → prefer `VITE_SITE_ORIGIN`; replace the hardcoded
  `lovable.dev` OG image / publisher logo with a cyoda.com asset.
- `BlogPost.tsx`, `Guide.tsx` (and its `SocialShare` usage) → build URLs from the
  env origin + route path instead of `window.location.href`.
- The five live viewer components + a small `usePrerenderReady` hook → readiness
  registration (§2a).

**Untouched:** viewer internals (`reactflow`/`mermaid`/`@cyoda/workflow-*`), the dev
server, `base: '/'`, and the Surge **preview-deploy workflow** — preview deploys
stay un-prerendered (deep links there still 404; acceptable for previews) and keep
working via the unset-`VITE_SITE_ORIGIN` fallback. **Out of scope:** host
migration, SSR meta-frameworks, `hydrateRoot` (future optimization).

## Risks & mitigations

- **[H1 — fixed in design] Localhost origin baked into SEO tags.** Origin now comes
  from `VITE_SITE_ORIGIN`, including the explicit-`url` call sites in
  `BlogPost.tsx`/`Guide.tsx` that would have bypassed an SEO.tsx-only fix. Enforced
  by the prerender localhost-leak check and the Vitest guard.
- **[H2 — fixed in design] Snapshot duplication / orphaned portal DOM.**
  Template-merge from the saved clean shell + `data-rh`-keyed head merge + discard
  of body-mounted portals (§2 step 4).
- **[H3 — fixed in design] `networkidle` never fires / captures spinner.**
  `__PRERENDER_READY__` contract (§2a) is the primary signal; networkidle unused.
- **[M1] `vite preview` ≠ Pages.** Required post-deploy live-URL smoke check (§5).
- **[M2] CI cost/flakiness from the headless crawl (~25 URLs: 19 static + 6
  published posts; don't hard-code the count in assertions).** Bounded
  concurrency, explicit preview port + listen-wait, per-route max-timeout, hard
  build-fail. Viewer pages (elkjs layout) are the slow ones; the readiness signal
  bounds them.
- **[L1] First-paint flash on browsers** (createRoot, not hydrate). Accepted;
  `hydrateRoot` is the future fix.
- **[L2] GA pollution during crawl** — not a risk: default consent is denied with no
  localStorage, so `AnalyticsManager` does not initialize GA during the crawl.
- **[L3] Trailing-slash inbound links** (`/foo/`) 404 under flat files: browsers
  recover via the `404.html` SPA shell; non-JS clients get a 404. Internal links,
  canonicals, and the sitemap are all slash-free, so only malformed external links
  are affected. Accepted.
- **[L4] Unpublished/unknown blog slugs** get no flat file → `404.html` shell →
  client-side BlogPost fallback redirects home. A real 404 status is served to
  non-JS clients, which is semantically correct. Accepted.

## Implementation footnotes (from confirmation review)

Non-material notes for the implementer — verified facts, no design impact:

1. **`blog-index.json` is an object keyed by source filename**, not an array —
   iterate `Object.values(...)` in the prerender URL expansion and the sitemap
   `lastmod` lookup.
2. **The prerender script itself writes `dist/404.html`** from its saved clean
   shell (it holds the shell in memory and has already overwritten
   `dist/index.html` by then); the CI change is simply deleting the old `cp` line.
3. **Do not copy captured `<html>` attributes** in the template-merge. Starting
   from the clean shell already (correctly) avoids baking in next-themes'
   runtime `class="light"`/`dark` while preserving `lang="en"`.
4. **The post-deploy smoke check must poll/retry** — `deploy-pages` completing
   does not guarantee the CDN edge serves the new bytes immediately.

## Review incorporation

Four independent fresh-context review iterations: v1→v2 and v2→v3 verdicts
"sound-with-fixes"; v3 verdict "settled-with-minor-fixes"; v4 confirmation pass
verdict **"settled"** — every v4 addition verified against code (helmet title
behavior, shell static-tag dedup necessity, SEO fallback flow, CI job feasibility,
viewer error-path, URL counts), end-to-end traces of `/comparison`,
`/use-cases/kyc-onboarding`, and `/blog/demo-to-poc-in-fintech` found no cracks,
and no further design review warranted.

**v2 (review 1):** `VITE_SITE_ORIGIN` origin fix; template-merge capture + portal
handling; `__PRERENDER_READY__` as primary readiness; flat `<route>.html` output;
all four dev/test routes excluded; minimal-shell `404.html`; post-deploy smoke
check. Declined: splitting `appRoutes` into a React-free data module (would
reintroduce two-lists drift); single table kept with a documented
no-eval-side-effects constraint.

**v3 (review 2):** extended the origin fix to `BlogPost.tsx`/`Guide.tsx` explicit
`url={window.location.href}` call sites (an SEO.tsx-only fix would have missed the
blog); replaced the hardcoded `lovable.dev` OG image / JSON-LD publisher logo with
a cyoda.com asset; corrected the cookie-banner handling (it renders inside `#root`
and self-suppresses — assert absence rather than "strip outside #root"); defined
the concrete §2a readiness contract (register/resolve, layout-keyed); fixed the
shell/404 ordering footgun (save clean shell before the homepage overwrite); pinned
sitemap mechanics (emit to `dist/`, lastmod from blog dates, drop
changefreq/priority); specified CI preview-port readiness; acknowledged
trailing-slash and unpublished-slug edges (L3/L4). Scripts read only
`path`/`prerender`/`waitFor` from the route table; `CookieConsentTest` named-export
mapping preserved.

**v4 (review 3):** verified the linchpin (Vite 7 preview SPA-fallback makes the
crawl work and resolves extensionless paths like Pages); fixed the title-merge rule
(helmet sets `document.title` with no `data-rh` — overwrite the shell title
unconditionally); specified keyed meta dedup (`name`/`property`/`rel`) so shell
static OG/description tags are replaced, not duplicated; SEO.tsx fallback for
no-`url` pages (legal pages) = `VITE_SITE_ORIGIN + pathname`, with
`window.location.origin` fallback when the var is unset (dev/Surge previews); moved
`dist/`-dependent assertions into the prerender script and scoped the Vitest guard
to route-table invariants (every check now has an owner/trigger, incl. the
post-deploy smoke as a CI step); viewer readiness must resolve on the error branch;
corrected URL count (~25); acknowledged dev-mode sitemap absence +
`docs/REQUIREMENTS.md` doc drift; noted the preview workflow's dead
`SITE_URL`/`SURGE_URL` env vars.
