/**
 * Conversion Event Tracking for ai.cyoda.net Clicks
 *
 * This module provides specialized conversion tracking that captures the complete
 * user journey from ad click (UTM parameters) through landing page to CTA conversion,
 * enabling ad campaign ROI analysis.
 *
 * **Key Features:**
 * - Tracks conversions specifically for ai.cyoda.net destinations
 * - Calculates time-to-conversion from landing to CTA click
 * - Enriches conversion events with complete UTM attribution data
 * - Captures full conversion context (page, referrer, session info)
 * - Respects cookie consent throughout the tracking flow
 *
 * **Usage:**
 * ```typescript
 * // Track a conversion when user clicks a CTA to ai.cyoda.net
 * trackAdConversion({
 *   location: "hero",
 *   page_variant: "home",
 *   cta: "try_now",
 *   destination: "https://ai.cyoda.net"
 * });
 * ```
 */

import { analyticsService } from "@/lib/analytics";
import { getUtmParameters, type UtmParameters } from "@/utils/utm-tracking";

/**
 * Storage key for UTM data in sessionStorage
 * This must match the key used in utm-tracking.ts
 */
const UTM_STORAGE_KEY = 'cyoda_utm_params';

/**
 * Parameters for tracking ad conversions
 */
export interface AdConversionParams {
    /** Location of the CTA on the page */
    location: "header" | "header_mobile" | "hero" | "cta_section" | "footer" | "nav" | "pricing_card";
    /** Page variant where the conversion occurred */
    page_variant: "dev" | "cto" | "home" | "products" | "pricing";
    /** CTA identifier (e.g., "try_now", "talk_to_sales") */
    cta: string;
    /** Destination URL */
    destination: string;
    /** Optional label for the CTA */
    label?: string;
}

/**
 * Conversion context data structure
 */
export interface ConversionContext {
    /** Current page path */
    page_path: string;
    /** Current page title */
    page_title: string;
    /** Page variant */
    page_variant: string;
    /** Referrer URL (if available) */
    referrer?: string;
    /** Whether this is a direct conversion from an ad (has UTM parameters) */
    is_direct_conversion: boolean;
    /** Full page URL */
    page_location: string;
}

/**
 * Complete conversion event data structure
 */
export interface ConversionEventData {
    /** All UTM parameters */
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    /** CTA metadata */
    location: string;
    page_variant: string;
    cta: string;
    label?: string;
    /** Destination URL */
    destination: string;
    /** User journey data */
    time_to_conversion: number | null;
    page_path: string;
    page_title: string;
    page_location: string;
    /** Additional context */
    referrer?: string;
    is_direct_conversion: boolean;
    /** Timestamp */
    timestamp: string;
}

/**
 * Calculate time-to-conversion in seconds
 *
 * Retrieves the UTM capture timestamp from sessionStorage and calculates
 * the difference between capture time and current time.
 *
 * @returns Duration in seconds, or null if no UTM timestamp exists
 *
 * @example
 * ```typescript
 * const timeToConversion = calculateTimeToConversion();
 * if (timeToConversion !== null) {
 *   console.log(`User converted after ${timeToConversion} seconds`);
 * }
 * ```
 */
export function calculateTimeToConversion(): number | null {
    try {
        // Retrieve UTM data from sessionStorage
        // This data was stored when the user first landed with UTM parameters
        const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
        if (!stored) {
            return null;
        }

        // Parse the stored data
        const data = JSON.parse(stored);

        // Validate that capturedAt exists
        // capturedAt is an ISO timestamp string set when UTM parameters were first captured
        if (!data.capturedAt || typeof data.capturedAt !== 'string') {
            return null;
        }

        // Calculate time difference in seconds
        // This measures the user journey from landing (with UTM params) to conversion
        //
        // Time-to-conversion calculation:
        // 1. Get the timestamp when UTM parameters were captured (landing time)
        // 2. Get the current timestamp (conversion time)
        // 3. Calculate the difference in milliseconds
        // 4. Convert to seconds and round down
        //
        // Example:
        // - User lands at 10:00:00 with UTM parameters
        // - User converts at 10:02:30
        // - Time-to-conversion = 150 seconds
        const capturedTime = new Date(data.capturedAt).getTime();
        const currentTime = new Date().getTime();
        const durationMs = currentTime - capturedTime;
        const durationSeconds = Math.floor(durationMs / 1000);

        return durationSeconds;
    } catch (error) {
        console.error('[conversion-tracking] Failed to calculate time to conversion:', error);
        return null;
    }
}

/**
 * Get conversion context data
 *
 * Gathers all relevant conversion context including page information,
 * referrer, and session information.
 *
 * @param pageVariant - The page variant where conversion occurred
 * @returns Structured conversion context object
 *
 * @example
 * ```typescript
 * const context = getConversionContext("home");
 * console.log(context.is_direct_conversion); // true if user came from ad
 * ```
 */
export function getConversionContext(pageVariant: string): ConversionContext {
    // Get UTM parameters to determine if this is a direct conversion
    const utmParams = getUtmParameters();
    const hasUtmParams = utmParams !== null && Object.keys(utmParams).length > 0;

    return {
        page_path: window.location.pathname,
        page_title: document.title,
        page_variant: pageVariant,
        referrer: document.referrer || undefined,
        is_direct_conversion: hasUtmParams,
        page_location: window.location.href,
    };
}

/**
 * Check if a URL is an ai.cyoda.net destination
 *
 * @param url - URL to check
 * @returns True if URL points to ai.cyoda.net
 *
 * @example
 * ```typescript
 * isAiCyodaNetDestination("https://ai.cyoda.net"); // true
 * isAiCyodaNetDestination("https://github.com/cyoda"); // false
 * ```
 */
export function isAiCyodaNetDestination(url: string): boolean {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname === 'ai.cyoda.net';
    } catch {
        // Invalid URL
        return false;
    }
}

/**
 * Track an ad conversion event
 *
 * This function tracks conversions specifically for ai.cyoda.net destinations.
 * It enriches the conversion event with:
 * - Complete UTM attribution data
 * - Time-to-conversion calculation
 * - Full conversion context
 * - User journey information
 *
 * **Important:** This function should only be called for ai.cyoda.net destinations.
 * Use `isAiCyodaNetDestination()` to validate before calling.
 *
 * @param params - Ad conversion parameters
 * @param explicitUtmParams - Optional explicit UTM parameters that override stored values
 *
 * @example
 * ```typescript
 * // Track a conversion from hero CTA
 * trackAdConversion({
 *   location: "hero",
 *   page_variant: "home",
 *   cta: "try_now",
 *   destination: "https://ai.cyoda.net",
 *   label: "Try CYODA Now"
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Track a conversion with explicit UTM parameters
 * trackAdConversion({
 *   location: "pricing_card",
 *   page_variant: "pricing",
 *   cta: "get_started",
 *   destination: "https://ai.cyoda.net/signup"
 * }, {
 *   utm_source: "linkedin",
 *   utm_medium: "social"
 * });
 * ```
 */
export function trackAdConversion(
    params: AdConversionParams,
    explicitUtmParams?: Record<string, string>
): void {
    try {
        // STEP 1: Retrieve stored UTM parameters
        // These were captured when the user first landed with UTM parameters in the URL
        const storedUtmParams = getUtmParameters();

        // STEP 2: Merge UTM parameters with explicit override capability
        // Merging strategy allows components to override stored UTM data if needed
        //
        // Priority order (highest to lowest):
        // 1. Explicit UTM parameters passed to this function
        // 2. Stored UTM parameters from sessionStorage
        //
        // Example scenario:
        // - User lands from Google Ads: { utm_source: "google", utm_medium: "cpc" }
        // - Later, a specific CTA wants to override: { utm_content: "special_offer" }
        // - Result: { utm_source: "google", utm_medium: "cpc", utm_content: "special_offer" }
        const utmParams = {
            ...(storedUtmParams || {}),
            ...(explicitUtmParams || {}),
        };

        // STEP 3: Calculate time-to-conversion
        // Measures seconds from landing (UTM capture) to conversion
        // Returns null if no UTM capture timestamp exists
        const timeToConversion = calculateTimeToConversion();

        // STEP 4: Gather conversion context
        // Collects page information, referrer, and determines if this is a direct conversion
        // (direct conversion = user came from an ad campaign with UTM parameters)
        const context = getConversionContext(params.page_variant);

        // STEP 5: Build complete conversion event data
        // This enriched data structure enables comprehensive ad campaign ROI analysis
        // by combining attribution (UTM), user journey (time), and context (page, referrer)
        const conversionData: ConversionEventData = {
            // UTM parameters (stored + explicit)
            // Provides campaign attribution: which ad/campaign drove this conversion?
            ...utmParams,

            // CTA metadata
            // Identifies which specific CTA was clicked and where
            location: params.location,
            page_variant: params.page_variant,
            cta: params.cta,
            ...(params.label && { label: params.label }),

            // Destination
            // Where the user is being sent (e.g., https://ai.cyoda.net)
            destination: params.destination,

            // User journey data
            // Measures conversion velocity and captures page context
            time_to_conversion: timeToConversion,
            page_path: context.page_path,
            page_title: context.page_title,
            page_location: context.page_location,

            // Additional context
            // Referrer helps understand traffic sources, is_direct_conversion flags ad-driven conversions
            ...(context.referrer && { referrer: context.referrer }),
            is_direct_conversion: context.is_direct_conversion,

            // Timestamp
            // Exact moment of conversion for temporal analysis
            timestamp: new Date().toISOString(),
        };

        // Track the conversion using analyticsService
        // The conversion type is the CTA identifier
        // The destination is the URL
        // Additional params include all the enriched conversion data
        analyticsService.trackConversion(
            params.cta,
            params.destination,
            conversionData
        );
    } catch (error) {
        console.error('[conversion-tracking] Failed to track ad conversion:', error);
    }
}

