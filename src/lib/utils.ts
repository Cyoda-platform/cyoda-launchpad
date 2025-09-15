import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Prefix app base path (Vite BASE_URL) for assets referenced with leading "/"
// Works locally ("/") and on custom domain ("/")
export function resolveAppAssetUrl(src?: string): string | undefined {
  if (!src) return src
  // Leave fully-qualified and data URLs as-is
  if (/^(?:https?:)?\/\//i.test(src) || src.startsWith('data:')) return src
  const base = import.meta.env.BASE_URL || '/'
  const clean = src.startsWith('/') ? src.slice(1) : src
  return `${base}${clean}`
}

// Convert a possibly-relative URL to an absolute URL using window.location.origin when available
export function toAbsoluteUrl(url?: string): string | undefined {
  if (!url) return url
  if (/^(?:https?:)?\/\//i.test(url)) return url
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  if (!origin) return url
  if (url.startsWith('//')) return `${window.location.protocol}${url}`
  if (url.startsWith('/')) return `${origin}${url}`
  return `${origin}/${url}`
}
