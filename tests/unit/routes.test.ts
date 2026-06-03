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
