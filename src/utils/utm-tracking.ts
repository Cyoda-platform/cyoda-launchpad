/**
 * UTM Parameter Tracking Utilities
 * 
 * This module provides utilities to capture, store, and retrieve UTM parameters
 * from URL query strings. All operations respect cookie consent settings.
 */

import { CookieCategory } from '@/types/cookie-consent';
import { loadConsentState } from '@/lib/cookie-consent-storage';

/**
 * Key used to store UTM data in sessionStorage
 */
const STORAGE_KEY = 'cyoda_utm_params';

/**
 * Current version of the UTM storage format
 */
const STORAGE_VERSION = '1.0.0';

/**
 * UTM parameter keys supported by the tracking system
 */
export type UtmParameterKey = 
  | 'utm_source'
  | 'utm_medium'
  | 'utm_campaign'
  | 'utm_term'
  | 'utm_content';

/**
 * List of all supported UTM parameter keys
 */
const UTM_KEYS: UtmParameterKey[] = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
];

/**
 * UTM parameters object with optional values
 */
export interface UtmParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/**
 * Stored UTM data structure including metadata
 */
export interface StoredUtmData {
  /** UTM parameters captured from URL */
  parameters: UtmParameters;
  /** Timestamp when parameters were captured (ISO string) */
  capturedAt: string;
  /** Version of the storage format for future migrations */
  version: string;
}

/**
 * Validate stored UTM data structure
 * 
 * @param data - Data to validate
 * @returns True if data is valid StoredUtmData
 */
function isValidStoredData(data: unknown): data is StoredUtmData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const d = data as Partial<StoredUtmData>;

  return (
    typeof d.parameters === 'object' &&
    d.parameters !== null &&
    typeof d.capturedAt === 'string' &&
    typeof d.version === 'string'
  );
}

/**
 * Check if analytics consent has been granted
 * 
 * @returns True if analytics consent is granted
 */
function hasAnalyticsConsent(): boolean {
  try {
    const consentState = loadConsentState();
    return consentState?.preferences[CookieCategory.ANALYTICS]?.granted ?? false;
  } catch {
    return false;
  }
}

/**
 * Capture UTM parameters from the current URL and store them in sessionStorage.
 * Only stores parameters if analytics consent has been granted.
 * Only overwrites existing UTM data if new UTM parameters are present in the URL.
 * 
 * @returns The captured UTM parameters, or null if none were found or consent not granted
 * 
 * @example
 * ```typescript
 * // On page load with URL: https://example.com/?utm_source=google&utm_medium=cpc
 * const params = captureUtmParameters();
 * // Returns: { utm_source: 'google', utm_medium: 'cpc' }
 * ```
 */
export function captureUtmParameters(): UtmParameters | null {
  try {
    // Check consent
    if (!hasAnalyticsConsent()) {
      return null;
    }

    // Extract from URL
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    const parameters: UtmParameters = {};
    let hasParams = false;

    UTM_KEYS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        parameters[key] = value;
        hasParams = true;
      }
    });

    // Check if new parameters exist
    if (!hasParams) {
      return null;
    }

    // Store in sessionStorage
    const storedData: StoredUtmData = {
      parameters,
      capturedAt: new Date().toISOString(),
      version: STORAGE_VERSION,
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));

    return parameters;
  } catch (error) {
    console.error('[utm-tracking] Failed to capture UTM parameters:', error);
    return null;
  }
}

/**
 * Retrieve stored UTM parameters from sessionStorage.
 * Returns null if no parameters are stored, consent not granted, or data is invalid.
 * 
 * @returns The stored UTM parameters, or null if none available
 * 
 * @example
 * ```typescript
 * const params = getUtmParameters();
 * if (params) {
 *   console.log('UTM Source:', params.utm_source);
 *   console.log('UTM Medium:', params.utm_medium);
 * }
 * ```
 */
export function getUtmParameters(): UtmParameters | null {
  try {
    // Check consent
    if (!hasAnalyticsConsent()) {
      return null;
    }

    // Retrieve from sessionStorage
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    // Parse and validate
    const data = JSON.parse(stored) as StoredUtmData;
    
    if (!isValidStoredData(data)) {
      // Invalid data, clear it
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return data.parameters;
  } catch (error) {
    console.error('[utm-tracking] Failed to retrieve UTM parameters:', error);
    return null;
  }
}

/**
 * Clear stored UTM parameters from sessionStorage.
 * This is useful when you want to reset tracking or when user logs out.
 * 
 * @example
 * ```typescript
 * clearUtmParameters();
 * ```
 */
export function clearUtmParameters(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[utm-tracking] Failed to clear UTM parameters:', error);
  }
}

/**
 * Check if UTM parameters are currently stored in sessionStorage.
 * Respects cookie consent - returns false if analytics consent not granted.
 * 
 * @returns True if UTM parameters are stored and consent is granted, false otherwise
 * 
 * @example
 * ```typescript
 * if (hasUtmParameters()) {
 *   const params = getUtmParameters();
 *   // Use params for analytics tracking
 * }
 * ```
 */
export function hasUtmParameters(): boolean {
  try {
    // Check consent first
    if (!hasAnalyticsConsent()) {
      return false;
    }

    // Check if data exists and is valid
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return false;
    }

    const data = JSON.parse(stored);
    return isValidStoredData(data);
  } catch {
    return false;
  }
}

