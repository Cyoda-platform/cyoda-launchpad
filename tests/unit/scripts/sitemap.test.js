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
