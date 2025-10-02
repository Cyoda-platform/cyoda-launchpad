import { analyticsService } from "@/lib/analytics";
import { trackAdConversion, isAiCyodaNetDestination } from "@/utils/conversion-tracking";

/**
 * Parameters for tracking CTA (Call-to-Action) clicks
 *
 * UTM parameters are automatically included when available from session storage.
 * You can also explicitly provide UTM parameters which will take precedence.
 */
export type CtaParams = {
    location: "header" | "header_mobile" | "hero" | "cta_section" | "footer" | "nav" | "pricing_card";
    page_variant: "dev" | "cto" | "home" | "products" | "pricing";
    cta: string;          // e.g. "try_now" | "github_repo" | "talk_to_sales"
    label?: string;       // optional extra label
    url?: string;         // optional destination
    // Optional UTM parameters (automatically included if available in session)
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
};

/**
 * Track a CTA (Call-to-Action) click event
 *
 * This function tracks general CTA interactions across the website. It automatically
 * includes UTM parameters from session storage if available, allowing you to track
 * which marketing campaigns are driving CTA engagement.
 *
 * **Use this function for:**
 * - General CTA click tracking
 * - Button clicks that don't lead to conversions
 * - Navigation and engagement tracking
 *
 * **For conversion tracking (e.g., clicks to ai.cyoda.net), use `trackCtaConversion()` instead.**
 *
 * @param params - CTA parameters including location, page variant, CTA identifier, and optional metadata
 *
 * @example
 * ```typescript
 * // Track a "Try Now" button click in the hero section
 * trackCta({
 *   location: "hero",
 *   page_variant: "home",
 *   cta: "try_now",
 *   label: "Get Started",
 *   url: "https://ai.cyoda.net"
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Track a GitHub repo link click in the header
 * trackCta({
 *   location: "header",
 *   page_variant: "dev",
 *   cta: "github_repo",
 *   url: "https://github.com/cyoda/example"
 * });
 * ```
 *
 * @see trackCtaConversion - For tracking conversion-specific CTA clicks
 */
export function trackCta(params: CtaParams) {
    // Note: analyticsService.trackEvent() automatically includes UTM parameters
    // from session storage via getUtmParameters(). Explicitly provided UTM
    // parameters in params will take precedence.
    analyticsService.trackEvent("cta_click", params);
}

/**
 * Track a CTA (Call-to-Action) conversion event
 *
 * This function is specifically designed for tracking CTA clicks that represent
 * conversions - meaningful actions that indicate user intent to engage with the
 * product or service. It uses the specialized `trackConversion()` method which
 * provides enhanced conversion tracking in analytics.
 *
 * **Special handling for ai.cyoda.net destinations:**
 * - Uses enhanced ad conversion tracking with time-to-conversion calculation
 * - Includes complete UTM attribution and user journey data
 * - Enables ad campaign ROI analysis
 *
 * **Use this function for:**
 * - Clicks to ai.cyoda.net (product/demo access)
 * - "Talk to Sales" or "Contact Us" CTAs
 * - Sign-up or registration CTAs
 * - Any CTA that represents a conversion goal
 *
 * **For general CTA tracking (non-conversion), use `trackCta()` instead.**
 *
 * The function automatically includes:
 * - All CTA metadata (location, page_variant, cta, label, url)
 * - UTM parameters from session storage
 * - Timestamp and page location
 * - Time-to-conversion (for ai.cyoda.net destinations)
 *
 * @param params - CTA parameters including location, page variant, CTA identifier, and optional metadata
 *
 * @example
 * ```typescript
 * // Track a conversion click to ai.cyoda.net (uses enhanced tracking)
 * trackCtaConversion({
 *   location: "hero",
 *   page_variant: "home",
 *   cta: "try_now",
 *   label: "Try CYODA Now",
 *   url: "https://ai.cyoda.net"
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Track a "Talk to Sales" conversion (uses standard tracking)
 * trackCtaConversion({
 *   location: "cta_section",
 *   page_variant: "cto",
 *   cta: "talk_to_sales",
 *   label: "Schedule a Demo",
 *   url: "https://calendly.com/cyoda/demo"
 * });
 * ```
 *
 * @see trackCta - For tracking general (non-conversion) CTA clicks
 * @see trackAdConversion - For the enhanced ai.cyoda.net conversion tracking
 */
export function trackCtaConversion(params: CtaParams) {
    // Check if this is an ai.cyoda.net destination
    const destination = params.url || params.cta;
    const isAiCyodaNet = params.url && isAiCyodaNetDestination(params.url);

    // Use enhanced ad conversion tracking for ai.cyoda.net destinations
    if (isAiCyodaNet && params.url) {
        // Build explicit UTM parameters if provided
        const explicitUtmParams: Record<string, string> = {};
        if (params.utm_source) explicitUtmParams.utm_source = params.utm_source;
        if (params.utm_medium) explicitUtmParams.utm_medium = params.utm_medium;
        if (params.utm_campaign) explicitUtmParams.utm_campaign = params.utm_campaign;
        if (params.utm_term) explicitUtmParams.utm_term = params.utm_term;
        if (params.utm_content) explicitUtmParams.utm_content = params.utm_content;

        trackAdConversion({
            location: params.location,
            page_variant: params.page_variant,
            cta: params.cta,
            destination: params.url,
            label: params.label,
        }, explicitUtmParams);
        return;
    }

    // For non-ai.cyoda.net destinations, use standard conversion tracking
    // Determine conversion type based on CTA identifier
    const conversionType = params.cta;

    // Build additional parameters including all CTA metadata
    const additionalParams: Record<string, unknown> = {
        location: params.location,
        page_variant: params.page_variant,
        cta: params.cta,
    };

    // Include optional fields if provided
    if (params.label) {
        additionalParams.label = params.label;
    }

    if (params.url) {
        additionalParams.url = params.url;
    }

    // Include any explicitly provided UTM parameters
    if (params.utm_source) additionalParams.utm_source = params.utm_source;
    if (params.utm_medium) additionalParams.utm_medium = params.utm_medium;
    if (params.utm_campaign) additionalParams.utm_campaign = params.utm_campaign;
    if (params.utm_term) additionalParams.utm_term = params.utm_term;
    if (params.utm_content) additionalParams.utm_content = params.utm_content;

    // Track as a conversion event
    // Note: analyticsService.trackConversion() automatically includes UTM parameters
    // from session storage via getUtmParameters(). Explicitly provided UTM
    // parameters in additionalParams will take precedence.
    analyticsService.trackConversion(conversionType, destination, additionalParams);
}