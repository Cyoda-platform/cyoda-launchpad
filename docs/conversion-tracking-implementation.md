# Conversion Event Tracking for ai.cyoda.net Clicks

This document describes the implementation of specialized conversion tracking that captures the complete user journey from ad click (UTM parameters) through landing page to CTA conversion, enabling ad campaign ROI analysis.

## Overview

The conversion tracking system provides enhanced tracking specifically for ai.cyoda.net destinations, automatically enriching conversion events with:

- Complete UTM attribution data
- Time-to-conversion calculations
- Full conversion context (page, referrer, session info)
- User journey information

## Implementation

### Core Module: `src/utils/conversion-tracking.ts`

This module exports the following functions:

#### `trackAdConversion(params, explicitUtmParams?)`

Main function for tracking ad conversions. Automatically includes:
- UTM parameters from session storage
- Time-to-conversion calculation
- Conversion context (page path, title, variant, referrer)
- Timestamp

**Parameters:**
- `params: AdConversionParams` - Conversion parameters (location, page_variant, cta, destination, label)
- `explicitUtmParams?: Record<string, string>` - Optional explicit UTM parameters that override stored values

**Example:**
```typescript
trackAdConversion({
  location: "hero",
  page_variant: "home",
  cta: "try_now",
  destination: "https://ai.cyoda.net",
  label: "Try CYODA Now"
});
```

#### `calculateTimeToConversion()`

Calculates the time difference in seconds between when UTM parameters were captured and the current time.

**Returns:** `number | null` - Duration in seconds, or null if no UTM timestamp exists

#### `getConversionContext(pageVariant)`

Gathers all relevant conversion context data including:
- Page information (path, title, variant)
- Referrer information
- Session information (is this a direct conversion from ad?)

**Returns:** `ConversionContext` object

#### `isAiCyodaNetDestination(url)`

Validates if a URL points to ai.cyoda.net.

**Returns:** `boolean`

### Integration with `trackCtaConversion()`

The existing `trackCtaConversion()` function in `src/utils/analytics.ts` has been enhanced to automatically use the specialized conversion tracking for ai.cyoda.net destinations:

```typescript
// For ai.cyoda.net URLs - uses enhanced tracking
trackCtaConversion({
  location: "hero",
  page_variant: "home",
  cta: "try_now",
  url: "https://ai.cyoda.net"
});

// For other URLs - uses standard tracking
trackCtaConversion({
  location: "cta_section",
  page_variant: "cto",
  cta: "talk_to_sales",
  url: "https://calendly.com/cyoda/demo"
});
```

## Data Structure

### Conversion Event Data

Each conversion event includes:

```typescript
{
  // UTM parameters (if available)
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  
  // CTA metadata
  location: string;
  page_variant: string;
  cta: string;
  label?: string;
  
  // Destination
  destination: string;
  
  // User journey data
  time_to_conversion: number | null;  // seconds
  page_path: string;
  page_title: string;
  page_location: string;
  
  // Additional context
  referrer?: string;
  is_direct_conversion: boolean;
  
  // Timestamp
  timestamp: string;  // ISO 8601 format
}
```

## Cookie Consent

All conversion tracking respects cookie consent settings:
- Only tracks when analytics consent is granted
- Uses the same consent system as UTM parameter capture
- No data is collected or stored without user consent

## Testing

### Unit Tests

Comprehensive unit tests are provided in `tests/unit/utils/conversion-tracking.test.ts`:

- ✅ URL validation for ai.cyoda.net destinations
- ✅ Time-to-conversion calculation
- ✅ Conversion context gathering
- ✅ Complete conversion tracking with UTM parameters
- ✅ Conversion tracking without UTM parameters
- ✅ Explicit UTM parameter override

### Integration Tests

The analytics utility tests in `tests/unit/utils/analytics.test.ts` verify:

- ✅ Automatic routing to enhanced tracking for ai.cyoda.net
- ✅ Standard tracking for non-ai.cyoda.net destinations
- ✅ Explicit UTM parameter pass-through

## Usage Examples

### Basic Conversion Tracking

```typescript
import { trackCtaConversion } from '@/utils/analytics';

// Automatically uses enhanced tracking for ai.cyoda.net
trackCtaConversion({
  location: "hero",
  page_variant: "home",
  cta: "try_now",
  url: "https://ai.cyoda.net"
});
```

### With Explicit UTM Parameters

```typescript
// Override stored UTM parameters with explicit values
trackCtaConversion({
  location: "pricing_card",
  page_variant: "pricing",
  cta: "get_started",
  url: "https://ai.cyoda.net/signup",
  utm_source: "linkedin",
  utm_medium: "social",
  utm_campaign: "product-launch"
});
```

### Direct Usage of trackAdConversion

```typescript
import { trackAdConversion } from '@/utils/conversion-tracking';

trackAdConversion({
  location: "footer",
  page_variant: "home",
  cta: "try_now",
  destination: "https://ai.cyoda.net"
});
```

## Analytics Events

Conversion events are sent to Google Analytics 4 with the event name `conversion` and include all the enriched data described above. This allows for:

- Campaign ROI analysis
- Time-to-conversion analysis by campaign
- Conversion funnel analysis
- A/B testing of landing pages
- CTA performance comparison

## Related Documentation

- [UTM Parameter Tracking](./utm-parameter-tracking.md) - UTM parameter capture and storage
- [Analytics Service with UTM Tracking](./analytics-utm-tracking.md) - Analytics service integration
- [Cookie Consent System](./cookie-consent-system.md) - Cookie consent implementation

## Troubleshooting

### Conversions Not Being Tracked

1. **Check cookie consent**: Ensure analytics consent is granted
2. **Verify URL**: Confirm the destination URL is exactly `ai.cyoda.net` (not `www.ai.cyoda.net` or other variants)
3. **Check browser console**: Look for any error messages from the conversion tracking module

### Time-to-Conversion is Null

This is expected when:
- User didn't arrive via a UTM-tagged URL
- UTM parameters were captured in a previous session
- sessionStorage was cleared

### Missing UTM Parameters

UTM parameters will be missing if:
- User didn't arrive via a UTM-tagged URL
- Analytics consent was not granted when the user landed
- sessionStorage is not available (e.g., private browsing mode)

## Future Enhancements

Potential improvements for future iterations:

1. **Multi-touch attribution**: Track multiple touchpoints in the user journey
2. **Conversion value tracking**: Add monetary value to conversions
3. **Custom conversion goals**: Define different conversion types with different tracking
4. **Offline conversion tracking**: Track conversions that happen outside the website
5. **Cross-device tracking**: Track conversions across multiple devices

