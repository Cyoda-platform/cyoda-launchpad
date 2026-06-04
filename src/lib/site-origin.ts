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
