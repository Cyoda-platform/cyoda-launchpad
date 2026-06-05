import { describe, it, expect } from 'vitest';
import { buildLlmsTxt, buildLlmsFullTxt, mdUrlFor } from '../../../scripts/llms.mjs';

const ORIGIN = 'https://cyoda.com';

describe('mdUrlFor', () => {
  it('maps the root route to /index.md', () => {
    expect(mdUrlFor(ORIGIN, '/')).toBe(`${ORIGIN}/index.md`);
  });

  it('maps nested routes to flat .md siblings', () => {
    expect(mdUrlFor(ORIGIN, '/use-cases/loan-lifecycle')).toBe(`${ORIGIN}/use-cases/loan-lifecycle.md`);
  });
});

describe('buildLlmsTxt', () => {
  const txt = buildLlmsTxt({
    siteOrigin: ORIGIN,
    preamble: '# Cyoda\n\nNarrative preamble.\n',
    pages: [
      { path: '/', title: 'Cyoda | Home', description: 'Enterprise Cyoda.' },
      { path: '/about', title: 'About', description: 'Multi\n  line   description.' },
    ],
    optionalPages: [
      { path: '/privacy-policy', title: 'Privacy Policy', description: 'How we handle data.' },
    ],
    blogPosts: [
      { slug: 'querying-the-past', title: 'Querying the Past', excerpt: 'Point-in-time queries.' },
    ],
  });

  it('starts with the trimmed preamble', () => {
    expect(txt.startsWith('# Cyoda\n\nNarrative preamble.\n\n## Pages')).toBe(true);
  });

  it('lists core pages as md links under ## Pages', () => {
    expect(txt).toContain(`- [Cyoda | Home](${ORIGIN}/index.md): Enterprise Cyoda.`);
    expect(txt).toContain(`- [About](${ORIGIN}/about.md): Multi line description.`);
  });

  it('lists legal pages and blog posts under ## Optional', () => {
    const optional = txt.split('## Optional')[1];
    expect(optional).toContain(`- [Privacy Policy](${ORIGIN}/privacy-policy.md): How we handle data.`);
    expect(optional).toContain(`- [Querying the Past](${ORIGIN}/blog/querying-the-past.md): Point-in-time queries.`);
  });

  it('omits the description suffix when description is empty', () => {
    const bare = buildLlmsTxt({
      siteOrigin: ORIGIN,
      preamble: '# X',
      pages: [{ path: '/about', title: 'About', description: '' }],
      optionalPages: [],
      blogPosts: [],
    });
    expect(bare).toContain(`- [About](${ORIGIN}/about.md)\n`);
  });
});

describe('buildLlmsFullTxt', () => {
  const full = buildLlmsFullTxt({
    siteOrigin: ORIGIN,
    sections: [
      { markdown: '---\ntitle: "Home"\n---\n\nHome body.\n' },
      { markdown: '---\ntitle: "About"\n---\n\nAbout body.\n' },
    ],
  });

  it('starts with a generated header that names the origin', () => {
    expect(full.startsWith('# Cyoda — cyoda.com full content')).toBe(true);
    expect(full).toContain(`${ORIGIN}/llms.txt`);
  });

  it('concatenates every section in order', () => {
    expect(full.indexOf('title: "Home"')).toBeGreaterThan(-1);
    expect(full.indexOf('title: "About"')).toBeGreaterThan(full.indexOf('title: "Home"'));
    expect(full).toContain('Home body.');
    expect(full).toContain('About body.');
  });

  it('ends with a single trailing newline', () => {
    expect(full.endsWith('\n')).toBe(true);
    expect(full.endsWith('\n\n')).toBe(false);
  });
});
