# GitHub Pages Real-200 Prerendering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every public route on cyoda.com returns a real network-level 200 with fully-rendered HTML (content, route-specific title/meta, JSON-LD) to all clients, including non-JS fetchers.

**Architecture:** Build-time prerendering. A canonical route table (`src/routes.tsx`) drives both the SPA router and a post-build crawl: `scripts/prerender.mjs` serves the built `dist/` via `vite preview`, snapshots each route with headless Chromium (Playwright), template-merges each snapshot into the clean SPA shell, and writes flat `dist/<route>.html` files plus `404.html` and a regenerated `sitemap.xml`. SEO URLs come from `VITE_SITE_ORIGIN` at build time so the localhost crawl never leaks into canonical/OG tags.

**Spec:** `docs/superpowers/specs/2026-06-03-github-pages-prerender-design.md` (settled, v4 + footnotes). Read it before starting — it is the authority on every decision below.

**Tech Stack:** Vite 7, React 18, react-router-dom v6, react-helmet-async, Playwright (`playwright` package, already a devDependency), jsdom (already a devDependency), Vitest, GitHub Actions.

**Branch:** create `feat/prerender` off `main` before Task 1; all commits go there.

```bash
git checkout -b feat/prerender
```

---

## Key facts the implementer must know (verified against the codebase)

- `src/data/blog-index.json` is an **object keyed by source filename**, not an array. Iterate `Object.values(...)`. 6 posts have `published: true` (slugs: `a-technical-description-of-the-cyoda-platform`, `entity-workflows-for-event-driven-architectures`, `whats-an-entity-database`, `cyoda-comparison-by-category`, `demo-to-poc-in-fintech`, `when-transactions-meet-workflows`). Counts change over time — never hard-code them in assertions.
- react-helmet-async marks the meta/link/script tags it creates with `data-rh="true"`, but sets `<title>` via `document.title` with **no marker** — capture `document.title` separately and overwrite the shell title unconditionally.
- The repo-root `index.html` shell ships static `description`/`og:*`/`twitter:*` meta tags **without** `data-rh` — the head merge must remove these keyed counterparts (key = `name` / `property` / `rel`) or every page ships stale + correct tag pairs.
- The cookie-consent banner renders **inside** `#root` but self-suppresses during a crawl (no stored consent). Its dialog element carries `aria-labelledby="cookie-banner-title"` — assert absence; strip by selector only as fallback.
- `main.tsx` uses `createRoot().render()` — React wipes `#root` on boot, so injected snapshot HTML never causes hydration mismatches.
- Vite 7 `vite preview` defaults to SPA html-fallback: extensionless paths resolve to `<path>.html` if present (like GitHub Pages pretty URLs) and fall back to `index.html` otherwise (which is why the crawl works before flat files exist).
- **Footgun:** hold all merged HTML in memory and write only after the crawl finishes. Writing `dist/index.html` mid-crawl would change what `vite preview`'s SPA fallback serves to routes still being crawled.
- Most static pages already pass hardcoded `url="https://cyoda.com/..."` to `<SEO>`. The localhost-leak paths are: `BlogPost.tsx`/`Guide.tsx` (`url={window.location.href}`, twice each — SEO and SocialShare), the three legal pages (no `url` prop → SEO fallback), and `toAbsoluteUrl` (used for og:image).
- All 19 prerendered static pages render a `<main>` element (verified). Blog post pages render `<article>` only after content load (the loading state is a skeleton without `<main>`), so the blog route uses `waitFor: "article"`.
- `vite-plugin-sitemap` is in `dependencies` but referenced nowhere — it gets removed in Task 6.
- All commits in this plan end with the trailer:

  ```
  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  ```

## File structure

| File | Responsibility |
|---|---|
| `src/routes.tsx` (create) | Single source of truth: every route's path, lazy component, prerender flag, optional `waitFor` selector |
| `src/App.tsx` (modify) | Render `<Routes>` from `appRoutes`; host `PrerenderReadySignal` |
| `src/lib/site-origin.ts` (create) | `siteOrigin()` / `siteUrl()` — `VITE_SITE_ORIGIN` with `window.location.origin` fallback |
| `src/lib/utils.ts` (modify) | `toAbsoluteUrl` uses `siteOrigin()` |
| `src/components/SEO.tsx` (modify) | URL fallback = origin + pathname; cyoda OG image replaces lovable.dev |
| `src/pages/BlogPost.tsx`, `src/pages/Guide.tsx` (modify) | Canonical URLs from `siteUrl()` instead of `window.location.href` |
| `src/lib/prerender-ready.ts` (create) | Readiness registry: pending-task counter + page-mounted flag → `window.__PRERENDER_READY__` |
| `src/hooks/use-prerender-task.ts` (create) | Hook viewers use to register/release pending layout work |
| 5 × `src/components/*WorkflowViewer.tsx` (modify) | Register layout as a prerender task; settle on success AND error |
| `scripts/sitemap.mjs` (create) | Pure `buildSitemapXml()` — unit-testable |
| `scripts/prerender.mjs` (create) | Crawl + template-merge + write + verify (spec §2 steps 0–6, §5 primary gate) |
| `tests/unit/routes.test.ts` (create) | Route-table invariants (spec §5 Vitest guard) |
| `tests/unit/lib/site-origin.test.ts` (create) | Origin helper behavior incl. env fallback |
| `tests/unit/lib/prerender-ready.test.ts` (create) | Registry semantics |
| `tests/unit/scripts/sitemap.test.js` (create) | Sitemap XML shape (plain `.js` — imports an untyped `.mjs`) |
| `.github/workflows/pages.yml` (modify) | Playwright install, `VITE_SITE_ORIGIN`, prerender step, drop 404 `cp`, post-deploy smoke job |
| `package.json` (modify) | `prerender` + `build:static` scripts; remove `vite-plugin-sitemap` |
| `public/sitemap.xml` (delete) | Replaced by generated `dist/sitemap.xml` |
| `docs/REQUIREMENTS.md`, `CLAUDE.md`, `AGENTS.md`, `README.md` (modify) | Sitemap/routing doc drift |

---

### Task 1: Canonical route table + App.tsx refactor + Vitest guard

**Files:**
- Create: `src/routes.tsx`
- Create: `tests/unit/routes.test.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the failing route-table tests**

Create `tests/unit/routes.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { appRoutes } from '@/routes';

describe('appRoutes (canonical route table)', () => {
  it('has no duplicate paths', () => {
    const paths = appRoutes.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('keeps the * catch-all last and excluded from prerender', () => {
    const last = appRoutes[appRoutes.length - 1];
    expect(last.path).toBe('*');
    expect(last.prerender).toBe(false);
    expect(appRoutes.filter((r) => r.path === '*')).toHaveLength(1);
  });

  it('excludes all dev/test routes from prerender', () => {
    for (const path of ['/blog-test', '/blog-system-test', '/guide-system-test', '/cookie-consent-test']) {
      const route = appRoutes.find((r) => r.path === path);
      expect(route, `route ${path} must exist`).toBeDefined();
      expect(route?.prerender, `route ${path} must not be prerendered`).toBe(false);
    }
  });

  it('prerenders the three governed-AI alias URLs', () => {
    for (const path of [
      '/use-cases/governed-agentic-workflows',
      '/use-cases/governed-ai-actions',
      '/use-cases/agentic-ai',
    ]) {
      const route = appRoutes.find((r) => r.path === path);
      expect(route, `alias ${path} must exist`).toBeDefined();
      expect(route?.prerender).toBe(true);
    }
  });

  it('marks exactly one route as the blog expansion point', () => {
    const blogRoutes = appRoutes.filter((r) => r.prerender === 'blog');
    expect(blogRoutes).toHaveLength(1);
    expect(blogRoutes[0].path).toBe('/blog/:slug');
  });

  it('never marks a dynamic or wildcard path prerender:true', () => {
    for (const route of appRoutes.filter((r) => r.prerender === true)) {
      expect(route.path, `${route.path} must be static`).not.toMatch(/[:*]/);
      expect(route.path.startsWith('/')).toBe(true);
    }
  });

  it('prerenders the homepage', () => {
    expect(appRoutes.find((r) => r.path === '/')?.prerender).toBe(true);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run tests/unit/routes.test.ts`
Expected: FAIL — cannot resolve `@/routes` (module does not exist yet).

- [ ] **Step 3: Create `src/routes.tsx`**

The table must contain every route currently in `src/App.tsx:79-106`, in the same order. The commented-out `/guides` routes stay excluded. Full file:

```tsx
import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

export type AppRoute = {
  path: string;
  component: LazyExoticComponent<ComponentType>;
  /** true = emit a static HTML file; false = exclude (test/dev/catch-all); "blog" = expand from blog-index.json */
  prerender: boolean | "blog";
  /** CSS selector the prerender crawl waits for before capturing (default: "main") */
  waitFor?: string;
};

// Single source of truth for routing, prerendering, and sitemap generation.
// scripts/prerender.mjs loads this module via Vite ssrLoadModule and reads ONLY
// path / prerender / waitFor — it never touches `component`. Keep this file free
// of eval-time side effects beyond the lazy() calls themselves (their dynamic
// import() is never invoked by the build scripts).
export const appRoutes: AppRoute[] = [
  { path: "/", component: lazy(() => import("./pages/Index")), prerender: true },
  { path: "/blog", component: lazy(() => import("./pages/Blog")), prerender: true },
  { path: "/blog/:slug", component: lazy(() => import("./pages/BlogPost")), prerender: "blog", waitFor: "article" },
  { path: "/blog-test", component: lazy(() => import("./pages/BlogTest")), prerender: false },
  { path: "/blog-system-test", component: lazy(() => import("./pages/BlogSystemTest")), prerender: false },
  // /guides and /guides/:slug stay disabled (they were commented out in App.tsx).
  { path: "/guide-system-test", component: lazy(() => import("./pages/GuideSystemTest")), prerender: false },
  // CookieConsentTest is a named export — preserve the .then() default mapping.
  { path: "/cookie-consent-test", component: lazy(() => import("./components/CookieConsentTest").then((m) => ({ default: m.CookieConsentTest }))), prerender: false },
  { path: "/support", component: lazy(() => import("./pages/Support")), prerender: true },
  { path: "/cookie-policy", component: lazy(() => import("./pages/CookiePolicy")), prerender: true },
  { path: "/privacy-policy", component: lazy(() => import("./pages/PrivacyPolicy")), prerender: true },
  { path: "/terms-of-service", component: lazy(() => import("./pages/TermsOfService")), prerender: true },
  { path: "/dev", component: lazy(() => import("./pages/Dev")), prerender: true },
  { path: "/cto", component: lazy(() => import("./pages/Cto")), prerender: true },
  { path: "/about", component: lazy(() => import("./pages/About")), prerender: true },
  { path: "/use-cases", component: lazy(() => import("./pages/UseCases")), prerender: true },
  { path: "/use-cases/loan-lifecycle", component: lazy(() => import("./pages/UseCaseLoanLifecycle")), prerender: true, waitFor: ".react-flow__node" },
  { path: "/use-cases/trade-settlement", component: lazy(() => import("./pages/UseCaseTradeSettlement")), prerender: true, waitFor: ".react-flow__node" },
  { path: "/use-cases/kyc-onboarding", component: lazy(() => import("./pages/UseCaseKycOnboarding")), prerender: true, waitFor: ".react-flow__node" },
  // Three intentional aliases for the same page — they preserve external links. Do NOT deduplicate.
  { path: "/use-cases/governed-agentic-workflows", component: lazy(() => import("./pages/UseCaseGovernedAiActions")), prerender: true, waitFor: ".react-flow__node" },
  { path: "/use-cases/governed-ai-actions", component: lazy(() => import("./pages/UseCaseGovernedAiActions")), prerender: true, waitFor: ".react-flow__node" },
  { path: "/use-cases/governed-claims-adjudication", component: lazy(() => import("./pages/UseCaseGovernedClaimsAdjudication")), prerender: true, waitFor: ".react-flow__node" },
  { path: "/use-cases/agentic-ai", component: lazy(() => import("./pages/UseCaseGovernedAiActions")), prerender: true, waitFor: ".react-flow__node" },
  { path: "/contact", component: lazy(() => import("./pages/Contact")), prerender: true },
  { path: "/comparison", component: lazy(() => import("./pages/Comparison")), prerender: true },
  // ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE
  { path: "*", component: lazy(() => import("./pages/NotFound")), prerender: false },
];
```

`waitFor: ".react-flow__node"` on the 7 viewer URLs makes the capture wait for actually-rendered workflow nodes (belt and braces on top of the Task 3 readiness contract). `waitFor: "article"` on the blog route because the blog loading skeleton has no `<main>` — `<article>` exists only once content has loaded.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run tests/unit/routes.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Refactor `src/App.tsx` to render from the table**

Replace lines 18–45 (the block of per-page `const X = lazy(...)` declarations including `CookieConsentTest`) with a single import added to the import block at the top:

```tsx
import { appRoutes } from "@/routes";
```

Keep `LazyCookiePreferencesModal` (line 49) — it is not a route. Then replace the entire `<Routes>...</Routes>` block (lines 78–107) with:

```tsx
              <Routes>
                {appRoutes.map(({ path, component: Component }) => (
                  <Route key={path} path={path} element={<Component />} />
                ))}
              </Routes>
```

Everything else in App.tsx (providers, banner, modal, `AnalyticsTracker`, `Suspense`) stays unchanged.

- [ ] **Step 6: Verify build, typecheck, full unit suite**

Run: `npm run build && npm run typecheck && npm run test:run`
Expected: build succeeds, no type errors, all tests pass (lazy-import chunking should be unchanged — same dynamic imports, now in routes.tsx).

- [ ] **Step 7: Manual spot-check**

Run `npm run dev`, open `http://localhost:8080/use-cases/loan-lifecycle` and `http://localhost:8080/blog` in a browser (or `curl -s localhost:8080/ | head -5` to confirm the dev server responds). Navigation must work exactly as before. Stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add src/routes.tsx src/App.tsx tests/unit/routes.test.ts
git commit -m "refactor: extract canonical route table to src/routes.tsx

Single source of truth for the router, the prerender crawl, and sitemap
generation. Vitest guards enforce the table invariants (dev routes
excluded, catch-all last, governed-AI aliases present).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Site-origin helper + SEO URL fixes + lovable.dev OG image fix

**Files:**
- Create: `src/lib/site-origin.ts`
- Create: `tests/unit/lib/site-origin.test.ts`
- Modify: `src/lib/utils.ts:19-28`
- Modify: `src/components/SEO.tsx:35,37,105`
- Modify: `src/pages/BlogPost.tsx:93,194`
- Modify: `src/pages/Guide.tsx:92,181`

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/lib/site-origin.test.ts`:

```ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { siteOrigin, siteUrl } from '@/lib/site-origin';
import { toAbsoluteUrl } from '@/lib/utils';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('siteOrigin / siteUrl', () => {
  it('prefers VITE_SITE_ORIGIN when set', () => {
    vi.stubEnv('VITE_SITE_ORIGIN', 'https://cyoda.com');
    expect(siteOrigin()).toBe('https://cyoda.com');
    expect(siteUrl('/about')).toBe('https://cyoda.com/about');
  });

  it('strips a trailing slash from the env origin', () => {
    vi.stubEnv('VITE_SITE_ORIGIN', 'https://cyoda.com/');
    expect(siteUrl('/about')).toBe('https://cyoda.com/about');
  });

  it('falls back to window.location.origin when the env var is unset (dev / Surge previews)', () => {
    expect(siteOrigin()).toBe(window.location.origin);
  });

  it('prefixes a missing leading slash', () => {
    vi.stubEnv('VITE_SITE_ORIGIN', 'https://cyoda.com');
    expect(siteUrl('contact')).toBe('https://cyoda.com/contact');
  });
});

describe('toAbsoluteUrl with VITE_SITE_ORIGIN', () => {
  it('absolutizes relative URLs against the env origin', () => {
    vi.stubEnv('VITE_SITE_ORIGIN', 'https://cyoda.com');
    expect(toAbsoluteUrl('/img/x.png')).toBe('https://cyoda.com/img/x.png');
  });

  it('leaves fully-qualified URLs untouched', () => {
    vi.stubEnv('VITE_SITE_ORIGIN', 'https://cyoda.com');
    expect(toAbsoluteUrl('https://example.com/a.png')).toBe('https://example.com/a.png');
  });

  it('falls back to window origin when the env var is unset', () => {
    expect(toAbsoluteUrl('/img/x.png')).toBe(`${window.location.origin}/img/x.png`);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/unit/lib/site-origin.test.ts`
Expected: FAIL — cannot resolve `@/lib/site-origin`.

- [ ] **Step 3: Create `src/lib/site-origin.ts`**

```ts
// Canonical site origin for all SEO-relevant URLs (canonical, og:url, og:image,
// JSON-LD). The production prerendering build sets VITE_SITE_ORIGIN=https://cyoda.com
// so the localhost crawl never leaks into static HTML; when unset (local dev,
// Surge preview deploys) we fall back to the browser origin — the pre-existing
// behavior, kept so dev and previews work unchanged.
export function siteOrigin(): string {
  const fromEnv = import.meta.env.VITE_SITE_ORIGIN as string | undefined;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  return typeof window !== 'undefined' ? window.location.origin : '';
}

export function siteUrl(pathname: string): string {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${siteOrigin()}${p}`;
}
```

- [ ] **Step 4: Update `toAbsoluteUrl` in `src/lib/utils.ts`**

Add the import at the top:

```ts
import { siteOrigin } from "./site-origin"
```

Replace the existing `toAbsoluteUrl` (lines 19–28) with:

```ts
// Convert a possibly-relative URL to an absolute URL using the canonical site
// origin (VITE_SITE_ORIGIN, falling back to window.location.origin).
export function toAbsoluteUrl(url?: string): string | undefined {
  if (!url) return url
  if (/^(?:https?:)?\/\//i.test(url)) return url
  const origin = siteOrigin()
  if (!origin) return url
  if (url.startsWith('/')) return `${origin}${url}`
  return `${origin}/${url}`
}
```

(The old `url.startsWith('//')` branch was unreachable — the regex already returns early for protocol-relative URLs — so it is dropped, not relocated.)

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run tests/unit/lib/site-origin.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 6: Fix `src/components/SEO.tsx`**

Add the import:

```tsx
import { siteUrl } from '@/lib/site-origin';
```

Three changes:

1. Line 35 — the no-`url`-prop fallback must keep the (correct) pathname but use the canonical origin:

```tsx
  const currentUrl = url || (typeof window !== 'undefined' ? siteUrl(window.location.pathname) : '');
```

2. Line 37 — replace the lovable.dev default OG image with the cyoda asset (exists at `public/opengraph-image-cyoda.png`):

```tsx
  const defaultImage = toAbsoluteUrl(resolvedImage) || siteUrl('/opengraph-image-cyoda.png');
```

3. Line 105 — the JSON-LD publisher logo:

```tsx
              "logo": {
                "@type": "ImageObject",
                "url": siteUrl('/opengraph-image-cyoda.png')
              }
```

- [ ] **Step 7: Fix `src/pages/BlogPost.tsx`**

Add the import:

```tsx
import { siteUrl } from '@/lib/site-origin';
```

Inside the component, after the `nextPost` declaration (line ~28), add:

```tsx
  // Canonical URL from the route path — never window.location.href, which
  // would bake the localhost preview origin into prerendered output.
  const canonicalUrl = siteUrl(`/blog/${slug ?? ''}`);
```

Replace **both** occurrences of `url={window.location.href}` (line 93, the `<SEO>` prop; line 194, the `<SocialShare>` prop) with:

```tsx
        url={canonicalUrl}
```

- [ ] **Step 8: Fix `src/pages/Guide.tsx`**

Same pattern. Add the import:

```tsx
import { siteUrl } from '@/lib/site-origin';
```

Inside the component (after the slug/data hooks at the top), add:

```tsx
  const canonicalUrl = siteUrl(`/guides/${slug ?? ''}`);
```

Replace both `url={window.location.href}` occurrences (lines 92 and 181) with `url={canonicalUrl}`.

- [ ] **Step 9: Verify the whole suite, typecheck, build**

Run: `npm run test:run && npm run typecheck && npm run build`
Expected: all pass. Then verify no SEO-relevant `window.location.href` remains:

Run: `grep -rn "window.location.href" src/pages src/components | grep -v "ErrorBoundary\|reload"`
Expected: no output (any remaining hits must be non-SEO usages — investigate before proceeding).

- [ ] **Step 10: Commit**

```bash
git add src/lib/site-origin.ts src/lib/utils.ts src/components/SEO.tsx src/pages/BlogPost.tsx src/pages/Guide.tsx tests/unit/lib/site-origin.test.ts
git commit -m "fix: canonical SEO origin from VITE_SITE_ORIGIN; replace lovable.dev OG image

All SEO-relevant URLs (canonical, og:url, og:image, JSON-LD) now derive
from VITE_SITE_ORIGIN with a window.location.origin fallback for dev and
Surge previews. BlogPost/Guide no longer pass window.location.href. The
hardcoded lovable.dev OG image / publisher logo is replaced with
/opengraph-image-cyoda.png.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Prerender readiness contract (`__PRERENDER_READY__`)

**Files:**
- Create: `src/lib/prerender-ready.ts`
- Create: `src/hooks/use-prerender-task.ts`
- Create: `tests/unit/lib/prerender-ready.test.ts`
- Modify: `src/App.tsx` (add `PrerenderReadySignal`)
- Modify: `src/components/LoanLifecycleWorkflowViewer.tsx`
- Modify: `src/components/TradeSettlementWorkflowViewer.tsx`
- Modify: `src/components/KycOnboardingWorkflowViewer.tsx`
- Modify: `src/components/GovernedAiActionsWorkflowViewer.tsx`
- Modify: `src/components/ClaimsAdjudicationWorkflowViewer.tsx`

(`AgenticAiWorkflowViewer.tsx` is orphaned dead code — leave it untouched.)

- [ ] **Step 1: Write the failing registry tests**

Create `tests/unit/lib/prerender-ready.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerPrerenderTask,
  markPageMounted,
  resetPrerenderReadyForTests,
} from '@/lib/prerender-ready';

beforeEach(() => {
  resetPrerenderReadyForTests();
});

describe('prerender readiness registry', () => {
  it('is not ready before the page mounts', () => {
    expect(window.__PRERENDER_READY__).toBe(false);
  });

  it('becomes ready once the page mounts with no pending tasks', () => {
    markPageMounted();
    expect(window.__PRERENDER_READY__).toBe(true);
  });

  it('stays not-ready while a task is pending and flips on release', () => {
    const release = registerPrerenderTask();
    markPageMounted();
    expect(window.__PRERENDER_READY__).toBe(false);
    release();
    expect(window.__PRERENDER_READY__).toBe(true);
  });

  it('waits for ALL pending tasks and ignores double release', () => {
    const releaseA = registerPrerenderTask();
    const releaseB = registerPrerenderTask();
    markPageMounted();
    releaseA();
    releaseA(); // double release must not decrement twice
    expect(window.__PRERENDER_READY__).toBe(false);
    releaseB();
    expect(window.__PRERENDER_READY__).toBe(true);
  });

  it('tasks registered before the page mounts still gate readiness', () => {
    const release = registerPrerenderTask();
    expect(window.__PRERENDER_READY__).toBe(false);
    markPageMounted();
    expect(window.__PRERENDER_READY__).toBe(false);
    release();
    expect(window.__PRERENDER_READY__).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/unit/lib/prerender-ready.test.ts`
Expected: FAIL — cannot resolve `@/lib/prerender-ready`.

- [ ] **Step 3: Create `src/lib/prerender-ready.ts`**

```ts
// Readiness contract for the build-time prerender crawl (scripts/prerender.mjs).
// The crawl's primary signal is window.__PRERENDER_READY__ === true, which means:
// the routed page has mounted AND every registered async task (workflow-viewer
// layout) has settled. Inert during normal browsing — it only maintains a window
// flag that nothing in the app reads.
declare global {
  interface Window {
    __PRERENDER_READY__?: boolean;
  }
}

let pendingTasks = 0;
let pageMounted = false;

function publish() {
  if (typeof window !== 'undefined') {
    window.__PRERENDER_READY__ = pageMounted && pendingTasks === 0;
  }
}

/**
 * Mark a unit of async work as pending. Call the returned release function
 * exactly once when the work settles (success OR error — a hung task would
 * surface as an opaque crawl timeout).
 */
export function registerPrerenderTask(): () => void {
  pendingTasks += 1;
  publish();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    pendingTasks -= 1;
    publish();
  };
}

/** Called once the routed page component has committed (see PrerenderReadySignal in App.tsx). */
export function markPageMounted() {
  pageMounted = true;
  publish();
}

/** Test-only. */
export function resetPrerenderReadyForTests() {
  pendingTasks = 0;
  pageMounted = false;
  publish();
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/unit/lib/prerender-ready.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Create `src/hooks/use-prerender-task.ts`**

```ts
import { useEffect } from 'react';
import { registerPrerenderTask } from '@/lib/prerender-ready';

/**
 * Holds the prerender crawl open while `active && !done`.
 * Workflow viewers: active = graph parsed successfully, done = async layout
 * settled (resolved OR rejected). A parse failure (graph null) never registers,
 * so the error card is captured without blocking the crawl.
 */
export function usePrerenderTask(active: boolean, done: boolean) {
  useEffect(() => {
    if (!active || done) return;
    return registerPrerenderTask();
  }, [active, done]);
}
```

- [ ] **Step 6: Add `PrerenderReadySignal` to `src/App.tsx`**

Update the React import (line 15) to include `useEffect`:

```tsx
import { Suspense, lazy, useState, useEffect } from "react";
```

Add the lib import:

```tsx
import { markPageMounted } from "@/lib/prerender-ready";
```

Below the `AnalyticsTracker` component definition, add:

```tsx
// Flips the page-mounted half of window.__PRERENDER_READY__. Rendered inside
// the same <Suspense> as <Routes>, so its effect runs only after the lazy route
// chunk has committed — and AFTER the route subtree's own effects (React runs
// effects children-first), so viewers register their pending tasks first.
const PrerenderReadySignal = () => {
  useEffect(() => {
    markPageMounted();
  }, []);
  return null;
};
```

In the JSX, render it directly after `</Routes>`, still inside the `<Suspense>`:

```tsx
              <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
                <Routes>
                  {appRoutes.map(({ path, component: Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                  ))}
                </Routes>
                <PrerenderReadySignal />
              </Suspense>
```

- [ ] **Step 7: Wire the five live workflow viewers**

The same three-part change in each file. All five share the `layoutGraph(...).then(setLayout)` effect keyed on `graph`; only preset options differ — **do not change the layout options**.

For each of:
- `src/components/LoanLifecycleWorkflowViewer.tsx`
- `src/components/TradeSettlementWorkflowViewer.tsx`
- `src/components/KycOnboardingWorkflowViewer.tsx`
- `src/components/GovernedAiActionsWorkflowViewer.tsx`
- `src/components/ClaimsAdjudicationWorkflowViewer.tsx`

(a) Add the hook import after the existing `@/components/...` imports:

```tsx
import { usePrerenderTask } from '@/hooks/use-prerender-task';
```

(b) Add a `layoutSettled` state directly below the existing `layout` state declaration:

```tsx
  const [layoutSettled, setLayoutSettled] = useState(false);
```

(c) Extend the layout effect so it settles on success AND error. Example for `LoanLifecycleWorkflowViewer.tsx` (lines 89–106) — old:

```tsx
    void layoutGraph(graph, {
      preset: 'opsAudit',
      nodeSize: { width: 184, height: 92 },
    }).then((nextLayout) => {
      if (!cancelled) {
        setLayout(nextLayout);
      }
    });
```

new:

```tsx
    void layoutGraph(graph, {
      preset: 'opsAudit',
      nodeSize: { width: 184, height: 92 },
    })
      .then((nextLayout) => {
        if (!cancelled) {
          setLayout(nextLayout);
        }
      })
      .catch(() => {
        // Swallow layout failures: the viewer falls back to its unpositioned
        // render and the prerender crawl must not hang (see usePrerenderTask).
      })
      .finally(() => {
        if (!cancelled) {
          setLayoutSettled(true);
        }
      });
```

Apply the identical `.then/.catch/.finally` restructure in the other four files, preserving each file's own `layoutGraph` options verbatim:
- `TradeSettlementWorkflowViewer.tsx` (~line 82): `{ preset: 'opsAudit', nodeSize: { width: 176, height: 88 } }`
- `KycOnboardingWorkflowViewer.tsx` (~line 94): `{ preset: 'opsAudit', nodeSize: { width: 184, height: 92 } }`
- `GovernedAiActionsWorkflowViewer.tsx` (~line 96): `{ preset: 'opsAudit', orientation: 'vertical', nodeSize: { width: 204, height: 102 } }` — keep the existing TODO comment above the call
- `ClaimsAdjudicationWorkflowViewer.tsx` (~line 93): `{ preset: 'opsAudit', orientation: 'vertical', nodeSize: { width: 204, height: 102 } }`

(d) Register the task. In each file, add this line **immediately before the `if (!graph) {` early return** (after all the existing hooks — never after a conditional return, that breaks the Rules of Hooks):

```tsx
  // Hold the prerender crawl open until the async elkjs layout settles.
  usePrerenderTask(graph !== null, layoutSettled);
```

- [ ] **Step 8: Verify suite, typecheck, build, and the flag in a live browser**

Run: `npm run test:run && npm run typecheck && npm run build`
Expected: all pass.

Then run `npm run dev`, open `http://localhost:8080/use-cases/loan-lifecycle`, and in the browser console check `window.__PRERENDER_READY__` — it must be `true` once the workflow diagram has rendered. Also check a non-viewer page (`/about`) flips to `true`. Stop the dev server.

- [ ] **Step 9: Commit**

```bash
git add src/lib/prerender-ready.ts src/hooks/use-prerender-task.ts src/App.tsx src/components/LoanLifecycleWorkflowViewer.tsx src/components/TradeSettlementWorkflowViewer.tsx src/components/KycOnboardingWorkflowViewer.tsx src/components/GovernedAiActionsWorkflowViewer.tsx src/components/ClaimsAdjudicationWorkflowViewer.tsx tests/unit/lib/prerender-ready.test.ts
git commit -m "feat: window.__PRERENDER_READY__ readiness contract for the prerender crawl

Pages flip the flag after the route chunk commits; the five live workflow
viewers register their async elkjs layout as pending tasks that settle on
success or error, so the crawl never captures an unlaid-out diagram and
never hangs on a layout failure. Inert during normal browsing.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Sitemap builder (pure, unit-tested)

**Files:**
- Create: `scripts/sitemap.mjs`
- Create: `tests/unit/scripts/sitemap.test.js`

The test file is plain `.js` (not `.ts`) because it imports an untyped `.mjs` module — Vitest's include pattern (`tests/**/*.{test,spec}.{js,...}`) already covers it, and this keeps `tsc --noEmit` out of the picture.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/scripts/sitemap.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { buildSitemapXml } from '../../../scripts/sitemap.mjs';

const ORIGIN = 'https://cyoda.com';

describe('buildSitemapXml', () => {
  const xml = buildSitemapXml({
    siteOrigin: ORIGIN,
    staticPaths: ['/', '/about', '/use-cases/loan-lifecycle'],
    blogPosts: [{ slug: 'demo-to-poc-in-fintech', date: '2026-03-05' }],
  });

  it('declares the sitemap namespace', () => {
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  });

  it('emits the root as origin + trailing slash and other routes slash-free', () => {
    expect(xml).toContain(`<loc>${ORIGIN}/</loc>`);
    expect(xml).toContain(`<loc>${ORIGIN}/about</loc>`);
    expect(xml).not.toContain(`<loc>${ORIGIN}/about/</loc>`);
  });

  it('emits blog posts with lastmod from the post date', () => {
    expect(xml).toContain(`<loc>${ORIGIN}/blog/demo-to-poc-in-fintech</loc>`);
    expect(xml).toContain('<lastmod>2026-03-05</lastmod>');
  });

  it('omits lastmod for static routes and never emits changefreq/priority', () => {
    const aboutEntry = xml.split('<url>').find((chunk) => chunk.includes('/about<'));
    expect(aboutEntry).not.toContain('<lastmod>');
    expect(xml).not.toContain('<changefreq>');
    expect(xml).not.toContain('<priority>');
  });

  it('preserves the static /llm/ and /llms.txt entries', () => {
    expect(xml).toContain(`<loc>${ORIGIN}/llm/</loc>`);
    expect(xml).toContain(`<loc>${ORIGIN}/llms.txt</loc>`);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/unit/scripts/sitemap.test.js`
Expected: FAIL — `scripts/sitemap.mjs` does not exist.

- [ ] **Step 3: Create `scripts/sitemap.mjs`**

```js
/**
 * Pure sitemap builder — consumed by scripts/prerender.mjs and unit-tested in
 * tests/unit/scripts/sitemap.test.js.
 *
 * Policy (docs/superpowers/specs/2026-06-03-github-pages-prerender-design.md §3):
 * - URLs are slash-free (matching the flat <route>.html output and canonicals);
 *   the root and the static /llm/ directory keep their trailing slash.
 * - No changefreq/priority (Google ignores them).
 * - lastmod only for blog posts, from the post date in blog-index.json.
 * - /llm/ and /llms.txt are real static files in public/ — preserved as-is.
 */
export function buildSitemapXml({ siteOrigin, staticPaths, blogPosts }) {
  const entries = [];

  for (const routePath of staticPaths) {
    entries.push({ loc: routePath === '/' ? `${siteOrigin}/` : `${siteOrigin}${routePath}` });
  }

  for (const post of blogPosts) {
    entries.push({ loc: `${siteOrigin}/blog/${post.slug}`, lastmod: post.date });
  }

  entries.push({ loc: `${siteOrigin}/llm/` });
  entries.push({ loc: `${siteOrigin}/llms.txt` });

  const body = entries
    .map((entry) => {
      const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
      return `  <url>\n    <loc>${entry.loc}</loc>${lastmod}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/unit/scripts/sitemap.test.js`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/sitemap.mjs tests/unit/scripts/sitemap.test.js
git commit -m "feat: pure sitemap.xml builder for the prerender pipeline

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: The prerender script

**Files:**
- Create: `scripts/prerender.mjs`
- Modify: `package.json` (scripts block)

This is an integration script — its "test" is running it against a real build (Steps 3–5). The spec's primary verification gate (§5) lives **inside** the script.

- [ ] **Step 1: Create `scripts/prerender.mjs`**

```js
#!/usr/bin/env node
/**
 * Build-time prerendering for GitHub Pages (spec: docs/superpowers/specs/
 * 2026-06-03-github-pages-prerender-design.md §2, §3, §5).
 *
 * Runs AFTER `vite build`, against the built dist/:
 *   0. saves the clean SPA shell (dist/index.html) — template-merge base + 404.html
 *   1. loads the canonical route table from src/routes.tsx (components never executed)
 *   2. expands the URL list: prerender:true routes + published blog slugs
 *   3. serves dist/ via `vite preview` and crawls each URL with headless Chromium
 *   4. template-merges each snapshot into the clean shell (helmet head + #root)
 *   5. writes flat dist/<route>.html files, dist/404.html, dist/sitemap.xml
 *   6. verifies all output and exits non-zero on any failure
 *
 * REQUIRES the build to have run with VITE_SITE_ORIGIN=https://cyoda.com —
 * otherwise SEO tags bake in the localhost preview origin and verification fails.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createServer, preview } from 'vite';
import { chromium } from 'playwright';
import { JSDOM } from 'jsdom';
import { buildSitemapXml } from './sitemap.mjs';

const DIST = path.resolve('dist');
const PORT = 4173;
const PREVIEW_ORIGIN = `http://localhost:${PORT}`;
const SITE_ORIGIN = 'https://cyoda.com';
const CONCURRENCY = 4;
const PAGE_TIMEOUT_MS = 90_000;
const BANNER_SELECTOR = '[aria-labelledby="cookie-banner-title"]';

function fail(message) {
  console.error(`\n❌ ${message}`);
  process.exit(1);
}

// ---- Step 0: save the clean shell BEFORE anything overwrites index.html ----
const shellPath = path.join(DIST, 'index.html');
if (!fs.existsSync(shellPath)) {
  fail('dist/index.html not found — run `npm run build` first.');
}
const cleanShell = fs.readFileSync(shellPath, 'utf8');

// ---- Step 1: load the route table without executing any page component ----
async function loadAppRoutes() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
  });
  try {
    // Reads ONLY path / prerender / waitFor; lazy() components are inert here.
    const mod = await vite.ssrLoadModule('/src/routes.tsx');
    return mod.appRoutes;
  } finally {
    await vite.close();
  }
}

// ---- Step 2: expand the URL list -------------------------------------------
function buildTargets(appRoutes, publishedPosts) {
  const targets = [];
  for (const route of appRoutes) {
    if (route.prerender === true) {
      if (route.path.includes(':') || route.path.includes('*')) {
        fail(`Route "${route.path}" is prerender:true but contains a dynamic segment.`);
      }
      targets.push({ path: route.path, waitFor: route.waitFor ?? 'main' });
    } else if (route.prerender === 'blog') {
      for (const post of publishedPosts) {
        targets.push({ path: `/blog/${post.slug}`, waitFor: route.waitFor ?? 'main' });
      }
    }
  }
  return targets;
}

// ---- Step 3: capture one route ----------------------------------------------
async function capture(page, target) {
  await page.goto(`${PREVIEW_ORIGIN}${target.path}`, {
    waitUntil: 'domcontentloaded',
    timeout: PAGE_TIMEOUT_MS,
  });

  // Primary readiness signal (NOT networkidle — mermaid/elkjs/react-query
  // retries can keep the network busy indefinitely).
  await page.waitForFunction(() => window.__PRERENDER_READY__ === true, null, {
    timeout: PAGE_TIMEOUT_MS,
  });
  // Route-specific content must exist...
  await page.waitForSelector(target.waitFor, { state: 'attached', timeout: PAGE_TIMEOUT_MS });
  // ...and no loading UI may remain (Suspense fallback, list spinners, mermaid placeholders).
  await page.waitForFunction(() => document.querySelector('.animate-spin') === null, null, {
    timeout: PAGE_TIMEOUT_MS,
  });

  const snapshot = await page.evaluate((bannerSelector) => {
    const root = document.getElementById('root');
    const banner = root ? root.querySelector(bannerSelector) : null;
    let rootHtml = root ? root.innerHTML : '';
    if (banner) {
      // Fallback only — the banner self-suppresses without stored consent.
      const clone = root.cloneNode(true);
      clone.querySelectorAll(bannerSelector).forEach((el) => el.remove());
      rootHtml = clone.innerHTML;
    }
    return {
      title: document.title,
      // helmet marks its meta/link/script tags with data-rh (NOT the <title>).
      headTags: Array.from(document.head.querySelectorAll('[data-rh]')).map((el) => el.outerHTML),
      rootHtml,
      bannerPresent: Boolean(banner),
    };
  }, BANNER_SELECTOR);

  if (!snapshot.rootHtml.trim()) throw new Error('empty #root');
  if (!snapshot.title.trim()) throw new Error('empty document.title');
  if (snapshot.bannerPresent) {
    console.warn(`⚠️  ${target.path}: cookie banner rendered during crawl (stripped) — investigate.`);
  }
  return snapshot;
}

// ---- Step 4: template-merge into the clean shell -----------------------------
function mergeIntoShell(shellHtml, snapshot) {
  // Start from the clean shell: preserves hashed <script>/<link> asset tags and
  // <html lang="en"> WITHOUT next-themes' runtime class (do not copy captured
  // <html> attributes).
  const dom = new JSDOM(shellHtml);
  const doc = dom.window.document;

  // Title rule: helmet sets document.title directly (no data-rh marker) —
  // overwrite the shell's static <title> unconditionally.
  doc.title = snapshot.title;

  for (const tagHtml of snapshot.headTags) {
    const template = doc.createElement('template');
    template.innerHTML = tagHtml;
    const el = template.content.firstElementChild;
    if (!el || el.tagName === 'TITLE') continue;

    // Keyed dedup: remove the shell's static counterpart (no data-rh) before
    // appending, so output never ships stale + correct tag pairs.
    let shellSelector = null;
    if (el.tagName === 'META' && el.hasAttribute('name')) {
      shellSelector = `meta[name="${el.getAttribute('name')}"]:not([data-rh])`;
    } else if (el.tagName === 'META' && el.hasAttribute('property')) {
      shellSelector = `meta[property="${el.getAttribute('property')}"]:not([data-rh])`;
    } else if (el.tagName === 'LINK' && el.hasAttribute('rel')) {
      shellSelector = `link[rel="${el.getAttribute('rel')}"]:not([data-rh])`;
    }
    if (shellSelector) {
      doc.head.querySelectorAll(shellSelector).forEach((node) => node.remove());
    }
    doc.head.appendChild(el);
  }

  // First-paint content for non-JS clients; createRoot() wipes it on boot in
  // real browsers, so there is no hydration mismatch. Nodes outside #root
  // (Sonner/Radix portals on document.body) are discarded by construction.
  doc.getElementById('root').innerHTML = snapshot.rootHtml;

  const headHtml = doc.head.innerHTML;
  if (headHtml.includes('localhost') || headHtml.includes('127.0.0.1')) {
    throw new Error(
      'preview origin leaked into head tags — was the build run with VITE_SITE_ORIGIN=https://cyoda.com?',
    );
  }

  return dom.serialize();
}

// Flat output shape: /use-cases/loan-lifecycle -> dist/use-cases/loan-lifecycle.html
function outputPathFor(routePath) {
  return routePath === '/'
    ? path.join(DIST, 'index.html')
    : path.join(DIST, `${routePath.replace(/^\//, '')}.html`);
}

// ---- main --------------------------------------------------------------------
const appRoutes = await loadAppRoutes();

// blog-index.json is an OBJECT keyed by source filename, not an array.
const blogIndex = JSON.parse(fs.readFileSync(path.resolve('src/data/blog-index.json'), 'utf8'));
const publishedPosts = Object.values(blogIndex).filter((post) => post.published === true);
if (publishedPosts.length === 0) {
  fail('No published blog posts found in blog-index.json — did prebuild run?');
}

const targets = buildTargets(appRoutes, publishedPosts);
console.log(`Prerendering ${targets.length} URLs (${publishedPosts.length} published blog posts).`);

const previewServer = await preview({
  preview: { port: PORT, strictPort: true },
  logLevel: 'error',
});
// Wait until the preview server actually accepts connections before crawling.
let up = false;
for (let i = 0; i < 100 && !up; i++) {
  try {
    const res = await fetch(`${PREVIEW_ORIGIN}/`);
    up = res.ok;
  } catch {
    /* not listening yet */
  }
  if (!up) await new Promise((resolve) => setTimeout(resolve, 100));
}
if (!up) fail(`vite preview did not start on port ${PORT}.`);

const browser = await chromium.launch();
const queue = [...targets];
const failures = [];
// IMPORTANT: hold merged HTML in memory and write only after the crawl ends.
// Writing dist/index.html mid-crawl would change what the preview's SPA
// fallback serves to routes still being crawled.
const outputs = new Map();

async function worker() {
  const context = await browser.newContext();
  const page = await context.newPage();
  for (let target = queue.shift(); target; target = queue.shift()) {
    try {
      const snapshot = await capture(page, target);
      outputs.set(target.path, mergeIntoShell(cleanShell, snapshot));
      console.log(`✅ ${target.path}`);
    } catch (error) {
      failures.push(`${target.path}: ${error.message}`);
      console.error(`❌ ${target.path}: ${error.message}`);
    }
  }
  await context.close();
}
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
await browser.close();
await previewServer.close();

if (failures.length > 0) {
  fail(`${failures.length} route(s) failed to prerender:\n  ${failures.join('\n  ')}`);
}

// ---- Step 5: write outputs -----------------------------------------------------
for (const [routePath, html] of outputs) {
  const outPath = outputPathFor(routePath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
}

// 404.html = the clean SPA shell (NOT prerendered homepage content): genuine
// 404s boot the SPA for client-side recovery without serving homepage
// canonical/OG tags under a 404 status (soft-404 avoidance).
fs.writeFileSync(path.join(DIST, '404.html'), cleanShell);

// sitemap.xml from the same canonical sources as the prerender itself.
const staticPaths = appRoutes.filter((r) => r.prerender === true).map((r) => r.path);
const sitemapXml = buildSitemapXml({
  siteOrigin: SITE_ORIGIN,
  staticPaths,
  blogPosts: publishedPosts,
});
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemapXml);

// ---- Step 6: verify everything written to disk ---------------------------------
const verifyErrors = [];
for (const target of targets) {
  const outPath = outputPathFor(target.path);
  let html = '';
  try {
    html = fs.readFileSync(outPath, 'utf8');
  } catch {
    verifyErrors.push(`${target.path}: missing output file ${outPath}`);
    continue;
  }
  const doc = new JSDOM(html).window.document;
  const title = doc.querySelector('title')?.textContent?.trim() ?? '';
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
  const ogUrl = doc.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? '';
  const rootChildren = doc.getElementById('root')?.children.length ?? 0;
  if (!title) verifyErrors.push(`${target.path}: empty <title>`);
  if (!canonical.startsWith(SITE_ORIGIN)) {
    verifyErrors.push(`${target.path}: canonical "${canonical}" does not use ${SITE_ORIGIN}`);
  }
  if (!ogUrl.startsWith(SITE_ORIGIN)) {
    verifyErrors.push(`${target.path}: og:url "${ogUrl}" does not use ${SITE_ORIGIN}`);
  }
  if (rootChildren === 0) verifyErrors.push(`${target.path}: #root has no children`);
}

// The sitemap must contain exactly the prerendered URL set + /llm/ + /llms.txt.
const sitemapLocs = new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
const expectedLocs = new Set([
  ...targets.map((t) => (t.path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${t.path}`)),
  `${SITE_ORIGIN}/llm/`,
  `${SITE_ORIGIN}/llms.txt`,
]);
for (const loc of expectedLocs) {
  if (!sitemapLocs.has(loc)) verifyErrors.push(`sitemap.xml: missing <loc>${loc}</loc>`);
}
for (const loc of sitemapLocs) {
  if (!expectedLocs.has(loc)) verifyErrors.push(`sitemap.xml: unexpected <loc>${loc}</loc>`);
}

if (verifyErrors.length > 0) {
  fail(`Output verification failed:\n  ${verifyErrors.join('\n  ')}`);
}

console.log(`\n🎉 Prerendered ${targets.length} routes; wrote 404.html and sitemap.xml.`);
```

- [ ] **Step 2: Add the npm scripts**

In `package.json` scripts block, after `"build:dev"`, add:

```json
    "prerender": "node scripts/prerender.mjs",
    "build:static": "VITE_SITE_ORIGIN=https://cyoda.com npm run build && npm run prerender",
```

`build` stays `vite build` (fast, no browser). `build:static` is the local full-fidelity reproduction of what CI deploys; CI sets `VITE_SITE_ORIGIN` itself and runs the two steps separately.

- [ ] **Step 3: Run the full pipeline locally**

Ensure Chromium is installed for Playwright (it should be, from the existing e2e setup): `npx playwright install chromium`

Run: `npm run build:static`
Expected: lines like `✅ /use-cases/loan-lifecycle` for all ~25 URLs, then `🎉 Prerendered 25 routes; wrote 404.html and sitemap.xml.` and exit code 0. If any route times out, debug with the route's URL in a headed browser (`npx vite preview` + open it) checking `window.__PRERENDER_READY__`.

- [ ] **Step 4: Inspect the output files**

```bash
ls dist/use-cases/                     # loan-lifecycle.html, trade-settlement.html, kyc-onboarding.html, governed-*.html, agentic-ai.html
ls dist/blog.html dist/blog/           # blog.html file AND blog/ directory of post .html files coexist
grep -o '<title>[^<]*</title>' dist/use-cases/loan-lifecycle.html
grep -c 'localhost' dist/use-cases/loan-lifecycle.html      # expect 0 (grep exits 1 — that is the pass)
grep -o 'rel="canonical" href="[^"]*"' dist/cookie-policy.html   # expect https://cyoda.com/cookie-policy (fallback path!)
grep -c 'lovable.dev' dist/index.html                       # expect 0 (grep exits 1)
grep -c '<h1' dist/404.html                                 # expect 0 — 404.html is the clean shell
cat dist/sitemap.xml                                        # ~27 locs: 19 static + 6 posts + /llm/ + /llms.txt
```

- [ ] **Step 5: Local curl smoke against the prerendered dist**

```bash
npx vite preview --port 4173 &
sleep 2
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/use-cases/loan-lifecycle   # 200
curl -s http://localhost:4173/use-cases/loan-lifecycle | grep -o '<title>[^<]*</title>'   # route-specific title
curl -s http://localhost:4173/blog/demo-to-poc-in-fintech | grep -c '<article'            # >= 1
kill %1
```

Note: `vite preview` serves unknown paths as `index.html` 200 (SPA fallback) — GitHub Pages will serve `404.html` with a real 404 instead. That difference is expected and why the post-deploy smoke check (Task 7) exists.

- [ ] **Step 6: Commit**

```bash
git add scripts/prerender.mjs package.json
git commit -m "feat: build-time prerendering of all public routes to flat dist/<route>.html

scripts/prerender.mjs crawls the built site via vite preview + headless
Chromium, gated on window.__PRERENDER_READY__, template-merges each
snapshot into the clean SPA shell (helmet head tags keyed-deduped against
the shell's static metas, #root first paint injected), and writes flat
route files, a clean-shell 404.html, and a generated sitemap.xml. The
script hard-fails on timeouts, empty roots, localhost leakage, or a
sitemap/output mismatch.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Retire the stale sitemap + documentation drift

**Files:**
- Delete: `public/sitemap.xml`
- Modify: `package.json` (remove unused `vite-plugin-sitemap`)
- Modify: `docs/REQUIREMENTS.md:44-88` (REQ-SITEMAP section)
- Modify: `CLAUDE.md:35` and the Commands block
- Modify: `AGENTS.md:20,65,95-99`
- Modify: `README.md:72-77`

- [ ] **Step 1: Remove the stale checked-in sitemap and the unused dependency**

```bash
git rm public/sitemap.xml
npm uninstall vite-plugin-sitemap
```

(`vite-plugin-sitemap` is referenced nowhere in `src/`, `scripts/`, or `vite.config.ts` — verified. Two sitemap mechanisms would invite confusion.)

Confirm `public/robots.txt` still says `Sitemap: https://cyoda.com/sitemap.xml` — unchanged URL, now served by the generated `dist/sitemap.xml`. No edit needed.

- [ ] **Step 2: Replace the REQ-SITEMAP section in `docs/REQUIREMENTS.md`**

Delete everything from the line `## REQ-SITEMAP: Add Missing URLs to \`public/sitemap.xml\`` (line 44) up to but **not** including the line `## REQ-LLMS: Update \`public/llms.txt\`` (line 89). Insert in its place:

```markdown
## REQ-SITEMAP: Sitemap is generated at build time

`sitemap.xml` is no longer a checked-in file. `scripts/prerender.mjs` (run by
the deploy workflow after `vite build`) generates `dist/sitemap.xml` from
`src/routes.tsx` (every `prerender: true` route) plus the published blog slugs
in `src/data/blog-index.json`, and preserves the static `/llm/` and `/llms.txt`
entries. URLs carry no `changefreq`/`priority`; blog URLs set `lastmod` from
the post date. Do not hand-edit a sitemap — add routes to `src/routes.tsx`
instead. Note: `npm run dev` and a bare `vite build` produce no `/sitemap.xml`;
only the full pipeline (`npm run build:static` or the deploy workflow) does.

```

- [ ] **Step 3: Update `CLAUDE.md`**

In the Commands block, after the `npm run build:dev` line, add:

```
npm run build:static # Build + prerender all routes to flat dist/<route>.html + sitemap (what CI deploys)
npm run prerender    # Prerender an existing dist/ (requires prior build with VITE_SITE_ORIGIN)
```

In the "Routing & app shell" paragraph (line 35), replace the final sentence:

old: `New pages must be added inside the \`<Routes>\` block, above the catch-all, and registered in \`public/sitemap.xml\`.`

new: `Routes live in \`src/routes.tsx\` (\`appRoutes\` — the single source of truth consumed by the router, the prerender crawl, and sitemap generation). New pages must be added there above the \`*\` catch-all entry with \`prerender: true\`; the deploy pipeline prerenders every such route to a flat \`dist/<route>.html\` and regenerates \`sitemap.xml\` automatically.`

- [ ] **Step 4: Update `AGENTS.md`**

Line 20, replace:

old: `- **Sitemap**: Static file at \`public/sitemap.xml\` (manually maintained)`
new: `- **Sitemap**: Generated at deploy time into \`dist/sitemap.xml\` by \`scripts/prerender.mjs\` from \`src/routes.tsx\` + published blog posts — do not hand-edit`

Line 65, replace:

old: `- \`public/sitemap.xml\` ✅ — includes all routes`
new: `- \`dist/sitemap.xml\` ✅ — generated at deploy time from \`src/routes.tsx\` (all prerendered routes + published posts)`

Lines 94–99 ("Routing — How to Add New Pages"), replace the 5-step list with:

```markdown
## Routing — How to Add New Pages
1. Create the file in `src/pages/`
2. Add an entry to `appRoutes` in `src/routes.tsx` above the `*` catch-all (set `prerender: true` for public pages)
3. Add `<SEO title="..." description="..." url="..." />` in the page
4. Done — the deploy pipeline prerenders the route and regenerates the sitemap automatically
```

- [ ] **Step 5: Update `README.md`**

Replace the "Adding a new page" 5-step list (lines 72–77) with the same 4-step list as AGENTS.md above (keep the `## Adding a new page` heading).

- [ ] **Step 6: Verify nothing references the deleted file**

Run: `grep -rn "public/sitemap.xml" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=docs/superpowers . ; npm run test:run`
Expected: no remaining references outside the spec/plan history docs; tests pass.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "docs: sitemap is now generated; retire checked-in public/sitemap.xml

Removes the stale hand-maintained sitemap (4 dead underscore blog URLs,
14 bogus .md paths, missing alias routes) and the unused
vite-plugin-sitemap dependency. REQUIREMENTS/CLAUDE/AGENTS/README now
describe the generated pipeline and the routes.tsx-based add-a-page flow.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: CI — prerender in the deploy workflow + post-deploy smoke

**Files:**
- Modify: `.github/workflows/pages.yml`

- [ ] **Step 1: Rewrite `.github/workflows/pages.yml`**

Full new content:

```yaml
name: Deploy Vite site to GitHub Pages
on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install
        run: npm ci

      - name: Install Playwright Chromium
        run: npx playwright install --with-deps chromium

      - name: Build
        run: npm run build
        env:
          VITE_GA_MEASUREMENT_ID: ${{ secrets.GA_MEASUREMENT_ID }}
          VITE_SITE_ORIGIN: https://cyoda.com

      # Prerender every public route to flat dist/<route>.html, write the
      # clean-shell 404.html, and regenerate sitemap.xml. Hard-fails the build
      # on any timeout, empty root, or localhost leakage.
      - name: Prerender routes + sitemap
        run: npm run prerender

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

  smoke:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      # vite preview does not replicate Pages' serving semantics exactly, so a
      # live check is required. Poll with retries: deploy-pages finishing does
      # not guarantee the CDN edge serves the new bytes immediately.
      - name: Verify live nested route returns prerendered 200
        run: |
          url="https://cyoda.com/use-cases/loan-lifecycle"
          for i in $(seq 1 10); do
            code=$(curl -sS -o page.html -w '%{http_code}' "$url" || echo "000")
            if [ "$code" = "200" ] \
               && grep -q 'href="https://cyoda.com/use-cases/loan-lifecycle"' page.html \
               && grep -q '<h1' page.html; then
              echo "Smoke check passed on attempt $i"
              exit 0
            fi
            echo "Attempt $i failed (HTTP $code); retrying in 30s..."
            sleep 30
          done
          echo "Post-deploy smoke check FAILED after 10 attempts"
          head -c 2000 page.html
          exit 1
```

Changes vs. the old file: Playwright install step added; `VITE_SITE_ORIGIN` added to the build env; the `SPA 404 fallback` `cp` step is **deleted** (the prerender script writes `404.html` from the clean shell it saved in memory); the `smoke` job is new. The `grep '<h1'` check works because the clean shell contains no `<h1>` — only prerendered content does.

- [ ] **Step 2: Validate the YAML**

Run: `npx yaml-lint .github/workflows/pages.yml 2>/dev/null || python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/pages.yml')); print('YAML OK')"`
Expected: `YAML OK` (or yaml-lint pass).

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/pages.yml
git commit -m "ci: prerender all routes before Pages deploy + post-deploy smoke check

Build runs with VITE_SITE_ORIGIN, prerenders via headless Chromium, and
uploads the flat-file dist. The old index.html->404.html copy is replaced
by the clean-shell 404.html the prerender script writes (avoids soft-404
homepage content under a 404 status). A post-deploy job curls a live
nested route with retries for CDN propagation.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Full local gate**

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build:static
```

Expected: all green; prerender reports ~25 routes prerendered.

- [ ] **Step 2: Curl matrix against the final dist**

```bash
npx vite preview --port 4173 &
sleep 2
for p in / /blog /about /comparison /contact /use-cases \
         /use-cases/loan-lifecycle /use-cases/governed-agentic-workflows \
         /use-cases/governed-ai-actions /use-cases/agentic-ai \
         /cookie-policy /privacy-policy /terms-of-service \
         /blog/demo-to-poc-in-fintech /blog/when-transactions-meet-workflows; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:4173$p")
  title=$(curl -s "http://localhost:4173$p" | grep -o '<title>[^<]*</title>' | head -1)
  echo "$code $p $title"
done
curl -s http://localhost:4173/sitemap.xml | grep -c '<loc>'   # expect ~27
kill %1
```

Expected: every route 200 with a route-specific title; the three governed-AI aliases all return content with the same canonical (`/use-cases/governed-agentic-workflows`).

- [ ] **Step 3: Confirm no localhost/lovable.dev anywhere in output**

```bash
grep -rl 'localhost' dist --include='*.html' | grep -v 404.html ; echo "localhost grep exit: $?"
grep -rl 'lovable.dev' dist --include='*.html' ; echo "lovable grep exit: $?"
```

Expected: both greps find nothing (exit 1).

- [ ] **Step 4: Run the e2e suite (optional but recommended)**

```bash
npm run dev &
sleep 5
npm run test:e2e
kill %1
```

Expected: pass (the route refactor must not have changed runtime behavior). If pre-existing failures exist on `main`, compare against a `main` baseline before attributing them to this branch.

- [ ] **Step 5: Commit any stragglers and push the branch**

```bash
git status   # should be clean except untracked hero SVGs that pre-date this work — leave those alone
git push -u origin feat/prerender
```

Then open a PR to `main`. **After merge**, the deploy workflow runs; verify the production result:

```bash
curl -i https://cyoda.com/use-cases/loan-lifecycle        # 200 + rendered HTML (the original bug report repro)
curl -i https://cyoda.com/blog/demo-to-poc-in-fintech      # 200 + article content
curl -s https://cyoda.com/sitemap.xml | head -20           # generated sitemap, hyphenated blog slugs
curl -o /dev/null -s -w '%{http_code}\n' https://cyoda.com/no-such-page   # 404 (clean shell)
```

The CI `smoke` job asserts the first of these automatically.

---

## Spec-coverage checklist (self-review)

| Spec requirement | Task |
|---|---|
| §1 route table, App renders from it, aliases preserved, no eval side effects | 1 |
| §1/§5 Vitest guard (dev routes excluded, no dupes, catch-all last, aliases) | 1 |
| H1 `VITE_SITE_ORIGIN` everywhere incl. BlogPost/Guide/SocialShare + legal-page fallback + unset-var fallback | 2 |
| lovable.dev OG image + JSON-LD publisher logo → cyoda asset | 2 |
| §2a readiness contract, viewer register/resolve incl. error path, children-first ordering | 3 |
| §3 sitemap policy (slash-free, lastmod blog only, no changefreq/priority, /llm/ + /llms.txt) into `dist/` | 4, 5 |
| §2 steps 0–6 (shell saved first, ssrLoadModule, blog expansion via Object.values, preview listen-wait, no networkidle, template-merge title/keyed-dedup rules, portals discarded, banner asserted, flat output, localhost hard-fail) | 5 |
| Footnote 2 (script writes 404.html), footnote 3 (no `<html>` attr copy), in-memory writes after crawl | 5 |
| §4 CI (playwright install, env var, prerender step, drop `cp`, separate build/prerender steps, `build:static` convenience) | 5, 7 |
| §5 primary gate in-script; post-deploy smoke with retry (footnote 4); local curl smoke | 5, 7, 8 |
| Sitemap audit cleanup: stale file removed, REQUIREMENTS/CLAUDE/AGENTS/README drift fixed, robots.txt verified | 6 |
| Untouched: viewer internals, dev server, `base: '/'`, Surge preview workflow | all (no task touches them) |
