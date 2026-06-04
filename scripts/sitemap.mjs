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
const escapeXml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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
      const lastmod = entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '';
      return `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>${lastmod}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
