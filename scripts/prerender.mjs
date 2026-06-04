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
// configFile: false — the project config aliases react to a directory, which
// breaks Vite's SSR externalization (`module is not defined` inside CJS react).
// routes.tsx only needs default resolution: its sole static import is react,
// and the lazy() dynamic imports are never invoked here.
async function loadAppRoutes() {
  const vite = await createServer({
    configFile: false,
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
    optimizeDeps: { noDiscovery: true, include: [] },
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
  // react-helmet-async flushes head tags on a deferred animation frame — wait
  // for the canonical link (every public page renders <SEO> with one) so the
  // snapshot cannot race the flush. A page missing <SEO> would time out here,
  // which is the correct failure mode (every public page must own its SEO tags).
  await page.waitForSelector('head link[rel="canonical"][data-rh]', {
    state: 'attached',
    timeout: PAGE_TIMEOUT_MS,
  });

  const snapshot = await page.evaluate((bannerSelector) => {
    const root = document.getElementById('root');
    // Expected: with no stored consent the banner renders (showBannerByDefault) —
    // strip it from the capture; browsers re-show it live after React boots.
    const clone = root ? root.cloneNode(true) : null;
    if (clone) {
      clone.querySelectorAll(bannerSelector).forEach((el) => el.remove());
    }
    const rootHtml = clone ? clone.innerHTML : '';
    const bannerStillPresent = clone ? clone.querySelector(bannerSelector) !== null : false;
    return {
      title: document.title,
      // helmet marks its meta/link/script tags with data-rh (NOT the <title>).
      headTags: Array.from(document.head.querySelectorAll('[data-rh]')).map((el) => el.outerHTML),
      rootHtml,
      bannerStillPresent,
    };
  }, BANNER_SELECTOR);

  if (snapshot.bannerStillPresent) throw new Error('cookie banner survived strip');
  if (!snapshot.rootHtml.trim()) throw new Error('empty #root');
  if (!snapshot.title.trim()) throw new Error('empty document.title');
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
    // appending, so output never ships stale + correct tag pairs. Helmet tags
    // with repeated keys (e.g. one article:tag per tag) are all kept.
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
  const rootEl = doc.getElementById('root');
  if (!rootEl) throw new Error('shell has no #root element');
  rootEl.innerHTML = snapshot.rootHtml;

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

const queue = [...targets];
const failures = [];
// IMPORTANT: hold merged HTML in memory and write only after the crawl ends.
// Writing dist/index.html mid-crawl would change what the preview's SPA
// fallback serves to routes still being crawled.
const outputs = new Map();

async function worker() {
  const context = await browser.newContext();
  // Each target gets a FRESH page so that SPA client-side navigation cannot
  // leave helmet tags from a previous route in the document head.
  for (let target = queue.shift(); target; target = queue.shift()) {
    const page = await context.newPage();
    try {
      const snapshot = await capture(page, target);
      outputs.set(target.path, mergeIntoShell(cleanShell, snapshot));
      console.log(`✅ ${target.path}`);
    } catch (error) {
      failures.push(`${target.path}: ${error.message}`);
      console.error(`❌ ${target.path}: ${error.message}`);
    } finally {
      await page.close();
    }
  }
  await context.close();
}

let browser;
try {
  browser = await chromium.launch();
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
} finally {
  await browser?.close().catch(() => {});
  await previewServer.close().catch(() => {});
}

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
