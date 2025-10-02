# Analytics Service with UTM Tracking

This document describes the enhanced analytics service that automatically includes UTM parameters with all tracked events and provides specialized methods for conversion and landing page tracking.

## Overview

The analytics service has been enhanced to:
- Automatically include UTM parameters with all tracked events
- Provide specialized conversion tracking
- Track landing page views with referrer information
- Respect cookie consent for all tracking operations

## Prerequisites

Before using the enhanced analytics features, ensure that:
1. UTM parameters are being captured on page load (see `src/utils/utm-tracking.ts`)
2. Analytics consent has been granted by the user
3. The analytics service is properly initialized

## Features

### 1. Automatic UTM Parameter Inclusion

All tracking methods now automatically include stored UTM parameters when available:

```typescript
import { analyticsService } from '@/lib/analytics';

// Initialize the service
analyticsService.initialize({
  measurementId: 'G-XXXXXXXXX',
  debug: true, // Enable debug logging to see UTM parameters
});

// Grant consent
analyticsService.setConsent(true);

// Track an event - UTM parameters are automatically included
analyticsService.trackEvent('button_click', {
  button_id: 'cta-1',
  button_text: 'Get Started',
});

// If UTM parameters exist in session storage, the event will include:
// {
//   button_id: 'cta-1',
//   button_text: 'Get Started',
//   utm_source: 'google',
//   utm_medium: 'cpc',
//   utm_campaign: 'spring-sale',
//   ...
// }
```

**Important:** Explicitly provided parameters take precedence over UTM parameters. If you provide a parameter with the same key as a UTM parameter, your value will be used.

### 2. Conversion Tracking

Track conversions with automatic UTM parameter inclusion:

```typescript
// Track a signup conversion
analyticsService.trackConversion('signup', 'dashboard', {
  user_type: 'premium',
  plan: 'monthly',
});

// This sends a 'conversion' event with:
// - conversion_type: 'signup'
// - destination: 'dashboard'
// - timestamp: ISO timestamp
// - page_location: current URL
// - page_path: current path
// - user_type: 'premium'
// - plan: 'monthly'
// - utm_source, utm_medium, etc. (if available)
```

**Use cases:**
- User signups
- Form submissions
- Purchase completions
- Newsletter subscriptions
- Download initiations

### 3. Landing Page View Tracking

Track landing page views with UTM parameters and referrer information:

```typescript
// Track a landing page view
analyticsService.trackLandingPageView('/landing/spring-sale', 'Spring Sale Landing Page');

// This sends a pageview event with:
// - page_location: '/landing/spring-sale'
// - page_title: 'Spring Sale Landing Page'
// - referrer: document.referrer (if available)
// - is_landing_page: true (if UTM parameters exist)
// - utm_source, utm_medium, etc. (if available)
```

**When to use:**
- First page view after arriving from a marketing campaign
- Dedicated landing pages
- Pages with UTM parameters in the URL

### 4. Enhanced Page View Tracking

Regular page views now also include UTM parameters:

```typescript
// Track a page view
analyticsService.trackPageView('/products', 'Products Page');

// UTM parameters are automatically included if available
```

## Debug Mode

Enable debug mode to see detailed logging of UTM parameter inclusion:

```typescript
analyticsService.initialize({
  measurementId: 'G-XXXXXXXXX',
  debug: true, // Enable debug logging
});

// You'll see console logs like:
// [analytics] Including UTM parameters in event: { utm_source: 'google', ... }
// [analytics] Event tracked: button_click { button_id: 'cta-1', utm_source: 'google', ... }
```

## Cookie Consent Integration

All tracking methods respect cookie consent:

```typescript
// Before consent is granted
analyticsService.trackEvent('button_click'); // No event sent

// After consent is granted
analyticsService.setConsent(true);
analyticsService.trackEvent('button_click'); // Event sent with UTM parameters
```

## UTM Parameter Precedence

When merging parameters:
1. **Explicitly provided parameters** always take precedence
2. **UTM parameters** are added only if not already present
3. **No UTM parameters** are added if none are stored in session storage

Example:

```typescript
// Stored UTM parameters: { utm_source: 'google', utm_medium: 'cpc' }

analyticsService.trackEvent('click', {
  utm_source: 'custom-source', // This overrides the stored UTM source
  button_id: 'cta-1',
});

// Sent parameters:
// {
//   utm_source: 'custom-source', // Your explicit value
//   utm_medium: 'cpc',            // From stored UTM parameters
//   button_id: 'cta-1',
// }
```

## Example: Complete Flow

```typescript
import { analyticsService } from '@/lib/analytics';
import { captureUtmParameters } from '@/utils/utm-tracking';

// 1. On page load, capture UTM parameters
// URL: https://example.com/?utm_source=google&utm_medium=cpc&utm_campaign=spring
captureUtmParameters();

// 2. Initialize analytics
analyticsService.initialize({
  measurementId: 'G-XXXXXXXXX',
  debug: true,
});

// 3. Grant consent (after user accepts cookies)
analyticsService.setConsent(true);

// 4. Track landing page view
analyticsService.trackLandingPageView();

// 5. Track user interactions
analyticsService.trackEvent('video_play', {
  video_id: 'intro-video',
  video_duration: 120,
});

// 6. Track conversion
analyticsService.trackConversion('signup', 'dashboard', {
  user_type: 'free',
});

// All events automatically include:
// utm_source: 'google'
// utm_medium: 'cpc'
// utm_campaign: 'spring'
```

## TypeScript Types

The service exports TypeScript types for all methods:

```typescript
interface AnalyticsService {
  initialize: (config: AnalyticsConfig) => void;
  isInitialized: () => boolean;
  trackPageView: (path?: string, title?: string) => void;
  trackEvent: (eventName: string, parameters?: Record<string, unknown>) => void;
  trackConversion: (
    conversionType: string,
    destination: string,
    additionalParams?: Record<string, unknown>
  ) => void;
  trackLandingPageView: (path?: string, title?: string) => void;
  setConsent: (granted: boolean) => void;
  disable: () => void;
  getMeasurementId: () => string | null;
}
```

## Testing

Tests are available in `tests/unit/lib/analytics.test.ts` covering:
- UTM parameter inclusion in events
- Parameter precedence
- Conversion tracking
- Landing page view tracking
- Consent checking
- Debug logging

Run tests with:
```bash
npm test -- tests/unit/lib/analytics.test.ts
```

## Related Documentation

- [UTM Parameter Tracking](./utm-tracking.md) - UTM capture and storage utilities
- [Cookie Consent](./cookie-consent.md) - Cookie consent system integration

