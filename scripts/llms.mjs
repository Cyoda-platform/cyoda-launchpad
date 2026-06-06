/**
 * Pure llms.txt / llms-full.txt builders — consumed by scripts/prerender.mjs
 * and unit-tested in tests/unit/scripts/llms.test.js.
 *
 * Format follows https://llmstxt.org: the hand-written preamble
 * (scripts/llms-preamble.md) carries the H1 + narrative; generated link
 * sections follow. `## Optional` is the spec's marker for content consumers
 * may skip when context is tight — legal pages and blog posts live there.
 *
 * llms-full.txt inlines the .md siblings of the core pages only (no blog
 * posts, no legal boilerplate) so its size is bounded by the route table,
 * not by content growth.
 */

// '/' -> https://cyoda.com/index.md ; '/about' -> https://cyoda.com/about.md
export function mdUrlFor(siteOrigin, routePath) {
  return routePath === '/' ? `${siteOrigin}/index.md` : `${siteOrigin}${routePath}.md`;
}

// Descriptions come from meta tags / blog excerpts — collapse any wrapping.
const oneLine = (s) => (s ?? '').replace(/\s+/g, ' ').trim();

const linkLine = (siteOrigin, { path, title, description }) => {
  const desc = oneLine(description);
  return `- [${oneLine(title)}](${mdUrlFor(siteOrigin, path)})${desc ? `: ${desc}` : ''}`;
};

export function buildLlmsTxt({ siteOrigin, preamble, pages, optionalPages, blogPosts }) {
  const lines = [preamble.trim(), '', '## Pages', ''];
  lines.push(...pages.map((p) => linkLine(siteOrigin, p)));
  lines.push('', '## Optional', '');
  lines.push(...optionalPages.map((p) => linkLine(siteOrigin, p)));
  lines.push(
    ...blogPosts.map((post) =>
      linkLine(siteOrigin, { path: `/blog/${post.slug}`, title: post.title, description: post.excerpt }),
    ),
  );
  return `${lines.join('\n')}\n`;
}

export function buildLlmsFullTxt({ siteOrigin, sections }) {
  const header = [
    '# Cyoda — cyoda.com full content',
    '',
    `Generated from the prerendered core pages of ${siteOrigin}. Each section`,
    'begins with YAML frontmatter (title / description / canonical). Blog posts',
    `and legal pages are not inlined — see ${siteOrigin}/llms.txt for links.`,
  ].join('\n');
  return `${[header, ...sections.map((s) => s.markdown.trim())].join('\n\n')}\n`;
}
