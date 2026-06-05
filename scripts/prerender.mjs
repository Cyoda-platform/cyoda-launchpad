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
import TurndownService from 'turndown';
import { buildSitemapXml } from './sitemap.mjs';
import { buildLlmsTxt, buildLlmsFullTxt, mdUrlFor } from './llms.mjs';

const DIST = path.resolve('dist');
const PORT = Number(process.env.PRERENDER_PORT ?? 4173);
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

// The shell must be the untouched vite-build output. A prior prerender bakes
// data-rh tags into dist/index.html; merging on top of that duplicates every
// SEO tag. Not idempotent by design — always rebuild before re-prerendering.
if (cleanShell.includes('data-rh')) {
  fail('dist/index.html already contains prerendered (data-rh) tags — run `npm run build` first (or use `npm run build:static`).');
}

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
function mergeIntoShell(shellHtml, snapshot, routePath) {
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

  // Append rel=alternate link pointing at the .md sibling for this page.
  // This coexists with the shell's existing /llms.txt alternate link (different type/href).
  const altLink = doc.createElement('link');
  altLink.setAttribute('rel', 'alternate');
  altLink.setAttribute('type', 'text/markdown');
  altLink.setAttribute('href', routePath === '/' ? '/index.md' : `${routePath}.md`);
  altLink.setAttribute('title', 'Markdown version of this page');
  doc.head.appendChild(altLink);

  return dom.serialize();
}

// Flat output shape: /use-cases/loan-lifecycle -> dist/use-cases/loan-lifecycle.html
function outputPathFor(routePath) {
  return routePath === '/'
    ? path.join(DIST, 'index.html')
    : path.join(DIST, `${routePath.replace(/^\//, '')}.html`);
}

// Markdown sibling: /use-cases/loan-lifecycle -> dist/use-cases/loan-lifecycle.md
function mdPathFor(routePath) {
  return routePath === '/'
    ? path.join(DIST, 'index.md')
    : path.join(DIST, `${routePath.replace(/^\//, '')}.md`);
}

// Extract description + canonical from captured helmet head tags.
// Shared by generateMarkdown (frontmatter) and the llms.txt page index.
function extractHeadMeta(headTags) {
  let description = '';
  for (const tagHtml of headTags) {
    const m = tagHtml.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"[^>]*>/i)
      || tagHtml.match(/<meta[^>]+content="([^"]*)"[^>]+name="description"[^>]*>/i);
    if (m) { description = m[1]; break; }
  }
  let canonical = '';
  for (const tagHtml of headTags) {
    const m = tagHtml.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"[^>]*>/i)
      || tagHtml.match(/<link[^>]+href="([^"]*)"[^>]+rel="canonical"[^>]*>/i);
    if (m) { canonical = m[1]; break; }
  }
  return { description, canonical };
}

// Generate markdown content for a route.
// Blog routes: copy the original source file verbatim.
// Built pages: convert <main> innerHTML via Turndown with YAML frontmatter.
function generateMarkdown(target, snapshot, blogSourceBySlug) {
  // Blog routes — copy the source markdown verbatim.
  if (target.path.startsWith('/blog/')) {
    const slug = target.path.slice('/blog/'.length);
    const sourcePath = blogSourceBySlug.get(slug);
    if (sourcePath) {
      return fs.readFileSync(sourcePath, 'utf8');
    }
  }

  // Built pages — extract <main>, strip noise, convert via Turndown.
  const dom = new JSDOM(snapshot.rootHtml);
  const doc = dom.window.document;
  const mainEl = doc.querySelector('main');
  if (!mainEl) throw new Error(`generateMarkdown: no <main> in captured rootHtml for ${target.path}`);

  // Strip elements that have no markdown equivalent or produce junk output
  // (coordinate streams, base64 data, hundreds of repeated SVG paths).
  // Do this in the jsdom tree BEFORE serializing, as belt-and-braces alongside
  // turndown.remove (which only acts on what Turndown's own parser sees).
  mainEl.querySelectorAll('svg, button, form, script, style, iframe, noscript').forEach((el) => el.remove());

  const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
  // Interactive/visual elements have no markdown equivalent — drop them.
  turndown.remove(['script', 'style', 'svg', 'button', 'form', 'iframe', 'noscript']);

  const markdown = turndown.turndown(mainEl.innerHTML);

  const { description, canonical } = extractHeadMeta(snapshot.headTags);

  // Escape double quotes in frontmatter strings.
  const escFm = (s) => s.replace(/"/g, '\\"');

  const frontmatter = [
    '---',
    `title: "${escFm(snapshot.title)}"`,
    description ? `description: "${escFm(description)}"` : null,
    canonical ? `canonical: ${canonical}` : null,
    '---',
  ].filter(Boolean).join('\n');

  return `${frontmatter}\n\n${markdown}\n`;
}

// ---- main --------------------------------------------------------------------
const appRoutes = await loadAppRoutes();

// blog-index.json is an OBJECT keyed by source filename, not an array.
const blogIndex = JSON.parse(fs.readFileSync(path.resolve('src/data/blog-index.json'), 'utf8'));
const publishedPosts = Object.values(blogIndex).filter((post) => post.published === true);
if (publishedPosts.length === 0) {
  fail('No published blog posts found in blog-index.json — did prebuild run?');
}

// Map slug → absolute source path for blog markdown siblings.
const blogSourceBySlug = new Map(
  Object.entries(blogIndex).map(([filename, post]) => [
    post.slug,
    path.resolve('public/docs/blogs', filename),
  ]),
);

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
// Markdown siblings — also held in memory until Step 5.
const mdOutputs = new Map();
// Per-page head meta (title/description/canonical) for the llms.txt index.
const pageMeta = new Map();

async function worker() {
  const context = await browser.newContext();
  // Each target gets a FRESH page so that SPA client-side navigation cannot
  // leave helmet tags from a previous route in the document head.
  for (let target = queue.shift(); target; target = queue.shift()) {
    const page = await context.newPage();
    try {
      const snapshot = await capture(page, target);
      outputs.set(target.path, mergeIntoShell(cleanShell, snapshot, target.path));
      mdOutputs.set(target.path, generateMarkdown(target, snapshot, blogSourceBySlug));
      pageMeta.set(target.path, { title: snapshot.title, ...extractHeadMeta(snapshot.headTags) });
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

// Write markdown siblings.
for (const [routePath, md] of mdOutputs) {
  const mdPath = mdPathFor(routePath);
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, md);
}

// llms.txt = hand-written preamble + generated page index; llms-full.txt =
// concatenated .md siblings of the core pages. Legal pages are linked but not
// inlined; blog posts are linked under ## Optional. Alias routes (three
// use-case URLs render one page) share a canonical and are listed once.
const LEGAL_PATHS = new Set(['/privacy-policy', '/terms-of-service', '/cookie-policy']);
const seenCanonicals = new Set();
const corePages = [];
const optionalPages = [];
for (const target of targets) {
  if (target.path.startsWith('/blog/')) continue;
  const meta = pageMeta.get(target.path);
  if (meta.canonical) {
    if (seenCanonicals.has(meta.canonical)) continue;
    seenCanonicals.add(meta.canonical);
  }
  // List the canonical path, not the crawled one — alias routes must never
  // surface an alias URL in llms.txt, regardless of route order in routes.tsx.
  const listedPath = meta.canonical ? new URL(meta.canonical).pathname : target.path;
  const page = { path: listedPath, title: meta.title, description: meta.description, canonical: meta.canonical };
  (LEGAL_PATHS.has(listedPath) ? optionalPages : corePages).push(page);
}
const llmsPreamble = fs.readFileSync(path.resolve('scripts/llms-preamble.md'), 'utf8');
const llmsTxt = buildLlmsTxt({
  siteOrigin: SITE_ORIGIN,
  preamble: llmsPreamble,
  pages: corePages,
  optionalPages,
  blogPosts: publishedPosts,
});
fs.writeFileSync(path.join(DIST, 'llms.txt'), llmsTxt);
const llmsFullTxt = buildLlmsFullTxt({
  siteOrigin: SITE_ORIGIN,
  sections: corePages.map((p) => ({ markdown: mdOutputs.get(p.path) })),
});
fs.writeFileSync(path.join(DIST, 'llms-full.txt'), llmsFullTxt);

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
  const canonicalCount = doc.querySelectorAll('link[rel="canonical"]').length;
  const ogUrlCount = doc.querySelectorAll('meta[property="og:url"]').length;
  if (canonicalCount !== 1) {
    verifyErrors.push(`${target.path}: expected exactly 1 canonical link, found ${canonicalCount}`);
  }
  if (ogUrlCount !== 1) {
    verifyErrors.push(`${target.path}: expected exactly 1 og:url meta, found ${ogUrlCount}`);
  }
}

// Every route must have a non-empty .md sibling containing a title: line
// (blog sources already have YAML frontmatter with title:; built-page markdown
// has a title: frontmatter line written by generateMarkdown).
for (const target of targets) {
  const mdPath = mdPathFor(target.path);
  let mdContent = '';
  try {
    mdContent = fs.readFileSync(mdPath, 'utf8');
  } catch {
    verifyErrors.push(`${target.path}: missing markdown sibling ${mdPath}`);
    continue;
  }
  if (!mdContent.trim()) {
    verifyErrors.push(`${target.path}: markdown sibling is empty`);
    continue;
  }
  const isBlogRoute = target.path.startsWith('/blog/');
  const hasTitleLine = mdContent.includes('title:');
  if (isBlogRoute) {
    // Blog sources must have frontmatter; fall back to length check if no title: line.
    if (!hasTitleLine && mdContent.length <= 200) {
      verifyErrors.push(`${target.path}: markdown sibling has no title: line and is too short (${mdContent.length} chars)`);
    }
  } else {
    if (!hasTitleLine) {
      verifyErrors.push(`${target.path}: markdown sibling has no title: line`);
    }
  }
}

// The sitemap must contain exactly the prerendered URL set + /llms.txt.
const sitemapLocs = new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
const expectedLocs = new Set([
  ...targets.map((t) => (t.path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${t.path}`)),
  `${SITE_ORIGIN}/llms.txt`,
]);
for (const loc of expectedLocs) {
  if (!sitemapLocs.has(loc)) verifyErrors.push(`sitemap.xml: missing <loc>${loc}</loc>`);
}
for (const loc of sitemapLocs) {
  if (!expectedLocs.has(loc)) verifyErrors.push(`sitemap.xml: unexpected <loc>${loc}</loc>`);
}

// llms.txt must link every unique page exactly once and every published post.
for (const page of [...corePages, ...optionalPages]) {
  const link = `(${mdUrlFor(SITE_ORIGIN, page.path)})`;
  const count = llmsTxt.split(link).length - 1;
  if (count !== 1) verifyErrors.push(`llms.txt: expected exactly 1 link to ${page.path}, found ${count}`);
}
for (const post of publishedPosts) {
  if (!llmsTxt.includes(`(${SITE_ORIGIN}/blog/${post.slug}.md)`)) {
    verifyErrors.push(`llms.txt: missing blog link for ${post.slug}`);
  }
}
if (llmsTxt.includes('localhost')) verifyErrors.push('llms.txt: preview origin leaked');
// llms-full.txt must inline every core page exactly once and no legal page.
// Match on the canonical frontmatter line — unique per page, unlike titles.
for (const page of corePages) {
  const needle = page.canonical
    ? `canonical: ${page.canonical}\n`
    : `title: "${page.title.replace(/"/g, '\\"')}"`;
  const count = llmsFullTxt.split(needle).length - 1;
  if (count !== 1) {
    verifyErrors.push(`llms-full.txt: expected exactly 1 section for ${page.path}, found ${count}`);
  }
}
for (const legalPath of LEGAL_PATHS) {
  if (llmsFullTxt.includes(`canonical: ${SITE_ORIGIN}${legalPath}`)) {
    verifyErrors.push(`llms-full.txt: legal page ${legalPath} must not be inlined`);
  }
}

if (verifyErrors.length > 0) {
  fail(`Output verification failed:\n  ${verifyErrors.join('\n  ')}`);
}

console.log(`\n🎉 Prerendered ${targets.length} routes; wrote ${targets.length} .md siblings, llms.txt (${corePages.length} pages + ${optionalPages.length} optional + ${publishedPosts.length} posts), llms-full.txt, 404.html, and sitemap.xml.`);
