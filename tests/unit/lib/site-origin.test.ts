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
