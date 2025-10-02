# UTM Tracking and Conversion System Guide

This guide explains how to use the UTM tracking and conversion system in the CYODA Launchpad application.

## Overview

The UTM tracking system automatically captures marketing campaign parameters from URLs and associates them with user actions throughout their session. This enables comprehensive campaign attribution and ROI analysis.

### Key Features

- **Automatic UTM Parameter Capture**: Captures UTM parameters from URL query strings on page load
- **Session Persistence**: Stores UTM data in sessionStorage for the duration of the user's session
- **Cookie Consent Compliance**: Respects analytics consent - no tracking without user permission
- **Conversion Tracking**: Tracks conversions with complete attribution data
- **Time-to-Conversion**: Calculates how long it takes users to convert after landing
- **Enhanced ai.cyoda.net Tracking**: Special handling for product destination conversions

## How UTM Parameters Are Captured and Stored

### Automatic Capture

UTM parameters are automatically captured when:
1. A user lands on any page with UTM parameters in the URL
2. Analytics consent has been granted
3. The `useUtmTracking` hook is active (integrated at app level)

### Supported UTM Parameters

- `utm_source` - Identifies the traffic source (e.g., "google", "linkedin", "newsletter")
- `utm_medium` - Identifies the marketing medium (e.g., "cpc", "email", "social")
- `utm_campaign` - Identifies the specific campaign (e.g., "spring_sale", "product_launch")
- `utm_term` - Identifies paid search keywords (e.g., "data_platform")
- `utm_content` - Differentiates similar content or links (e.g., "hero_cta", "footer_link")

### Storage Mechanism

UTM parameters are stored in **sessionStorage** (not cookies) under the key `cyoda_utm_params`. The stored data includes:

```typescript
{
  parameters: {
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "spring_sale"
  },
  capturedAt: "2024-01-15T10:30:00.000Z",  // ISO timestamp
  version: "1.0.0"                          // Storage format version
}
```

**Important Notes:**
- SessionStorage data persists only for the current browser tab/window
- Data is cleared when the tab is closed
- Data does NOT persist across different tabs or browser sessions
- No cookies are used for UTM storage

## Using Tracking Functions in Components

### trackCta() - General CTA Click Tracking

Use `trackCta()` for general call-to-action clicks that don't represent conversions:

```typescript
import { trackCta } from '@/utils/analytics';

// Track a GitHub repo link click
trackCta({
  location: "header",
  page_variant: "dev",
  cta: "github_repo",
  label: "View on GitHub",
  url: "https://github.com/cyoda/example"
});
```

**When to use:**
- Navigation links
- Social media links
- Documentation links
- Any non-conversion CTA

### trackCtaConversion() - Conversion Tracking

Use `trackCtaConversion()` for CTAs that represent meaningful conversions:

```typescript
import { trackCtaConversion } from '@/utils/analytics';

// Track a conversion to ai.cyoda.net (uses enhanced tracking)
trackCtaConversion({
  location: "hero",
  page_variant: "home",
  cta: "try_now",
  label: "Try CYODA Now",
  url: "https://ai.cyoda.net"
});

// Track a "Talk to Sales" conversion
trackCtaConversion({
  location: "cta_section",
  page_variant: "cto",
  cta: "talk_to_sales",
  label: "Schedule a Demo",
  url: "https://calendly.com/cyoda/demo"
});
```

**When to use:**
- Clicks to ai.cyoda.net (product access)
- "Talk to Sales" or "Contact Us" CTAs
- Sign-up or registration CTAs
- Any CTA that represents a conversion goal

### Key Differences Between trackCta() and trackCtaConversion()

| Feature | trackCta() | trackCtaConversion() |
|---------|-----------|---------------------|
| **Purpose** | General engagement tracking | Conversion goal tracking |
| **Event Type** | `cta_click` | `conversion` |
| **UTM Inclusion** | ✅ Automatic | ✅ Automatic |
| **Time-to-Conversion** | ❌ No | ✅ Yes (for ai.cyoda.net) |
| **Enhanced Tracking** | ❌ No | ✅ Yes (for ai.cyoda.net) |
| **Use Cases** | Navigation, social links | Product access, sales CTAs |

## How Conversion Tracking Works End-to-End

### Standard Conversion Flow

1. **User Lands with UTM Parameters**
   ```
   https://cyoda.com/?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale
   ```
   - UTM parameters are captured and stored in sessionStorage
   - Landing page view is tracked with UTM attribution
   - Capture timestamp is recorded

2. **User Navigates the Site**
   - UTM parameters persist in sessionStorage
   - All tracked events include UTM attribution automatically

3. **User Clicks a Conversion CTA**
   ```typescript
   trackCtaConversion({
     location: "hero",
     page_variant: "home",
     cta: "try_now",
     url: "https://ai.cyoda.net"
   });
   ```

4. **Conversion Event is Tracked**
   - Event includes all UTM parameters
   - Time-to-conversion is calculated (for ai.cyoda.net)
   - Complete conversion context is captured

### Enhanced ai.cyoda.net Conversion Flow

For ai.cyoda.net destinations, enhanced tracking includes:

- **Time-to-Conversion**: Seconds from landing to conversion
- **Complete Attribution**: All UTM parameters + referrer
- **User Journey Data**: Page path, title, variant
- **Conversion Context**: Direct conversion flag, timestamp

**Event Data Structure:**
```typescript
{
  // UTM Attribution
  utm_source: "google",
  utm_medium: "cpc",
  utm_campaign: "spring_sale",
  
  // CTA Metadata
  location: "hero",
  page_variant: "home",
  cta: "try_now",
  label: "Try CYODA Now",
  destination: "https://ai.cyoda.net",
  
  // User Journey
  time_to_conversion: 45,  // seconds
  page_path: "/",
  page_title: "CYODA - Data Platform",
  page_location: "https://cyoda.com/",
  
  // Context
  referrer: "https://google.com/search",
  is_direct_conversion: true,
  timestamp: "2024-01-15T10:30:45.000Z"
}
```

## Example UTM URLs for Testing

### Example 1: Google Ads Campaign
```
http://localhost:5173/?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_term=data_platform&utm_content=hero_cta
```

**Use Case**: Paid search campaign targeting "data platform" keyword

**Expected Behavior**:
- Landing page view tracked with all UTM parameters
- All subsequent events include UTM attribution
- Conversions show Google Ads as source

### Example 2: LinkedIn Social Campaign
```
http://localhost:5173/dev?utm_source=linkedin&utm_medium=social&utm_campaign=product_launch&utm_content=dev_audience
```

**Use Case**: LinkedIn post promoting developer features

**Expected Behavior**:
- Landing on /dev page tracked
- Page variant detected as "dev"
- Social campaign attribution maintained

### Example 3: Email Newsletter Campaign
```
http://localhost:5173/cto?utm_source=newsletter&utm_medium=email&utm_campaign=monthly_update&utm_content=cto_feature
```

**Use Case**: Monthly newsletter targeting CTOs

**Expected Behavior**:
- Landing on /cto page tracked
- Page variant detected as "cto"
- Email campaign attribution maintained

## Verifying Tracking in Google Analytics

### Using GA4 Debug Mode

1. **Enable Debug Mode**:
   - Install the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger) Chrome extension
   - Or add `?debug_mode=true` to your URL

2. **Open GA4 DebugView**:
   - Go to Google Analytics 4
   - Navigate to Admin → DebugView
   - Select your property

3. **Test UTM Tracking**:
   - Visit a test URL with UTM parameters
   - Accept analytics cookies
   - Check DebugView for events

### Expected Events in GA4

**Landing Page View Event**:
- Event name: `landing_page_view`
- Parameters: `utm_source`, `utm_medium`, `utm_campaign`, `page_variant`, `is_landing_page: true`

**CTA Click Event**:
- Event name: `cta_click`
- Parameters: `location`, `page_variant`, `cta`, `label`, `url`, plus UTM parameters

**Conversion Event**:
- Event name: `conversion`
- Parameters: All CTA metadata + UTM parameters + time_to_conversion (for ai.cyoda.net)

## Cookie Consent Requirements and Behavior

### Consent Requirements

UTM tracking requires **Analytics consent** to be granted. The system respects the cookie consent banner:

- ✅ **Consent Granted**: UTM parameters are captured and tracked
- ❌ **Consent Denied**: No UTM capture, no tracking
- 🔄 **Consent Changed**: If consent is granted after page load, UTM parameters are captured immediately

### Behavior Without Consent

When analytics consent is not granted:
- `captureUtmParameters()` returns `null`
- `getUtmParameters()` returns `null`
- `hasUtmParameters()` returns `false`
- No events are sent to Google Analytics
- SessionStorage is not accessed

### Behavior With Consent

When analytics consent is granted:
- UTM parameters are captured from URL
- Data is stored in sessionStorage
- All events include UTM attribution
- Conversions are tracked with full context

### Consent Change Handling

The system listens for consent changes:
- If user grants consent after landing, UTM parameters are captured immediately
- Landing page view is tracked retroactively if UTM parameters exist
- Subsequent events include UTM attribution

## Testing Checklist

### Manual Testing Steps

#### Test 1: UTM Parameter Capture
- [ ] Visit site with UTM parameters in URL
- [ ] Accept analytics cookies
- [ ] Open browser DevTools → Application → Session Storage
- [ ] Verify `cyoda_utm_params` key exists with correct data
- [ ] Check GA4 DebugView for `landing_page_view` event

#### Test 2: UTM Persistence
- [ ] Land with UTM parameters and accept cookies
- [ ] Navigate to different pages (/, /dev, /cto)
- [ ] Click various CTAs
- [ ] Verify all events in GA4 include UTM parameters

#### Test 3: Conversion Tracking
- [ ] Land with UTM parameters
- [ ] Click a CTA to ai.cyoda.net
- [ ] Verify conversion event in GA4 includes:
  - All UTM parameters
  - `time_to_conversion` value
  - Complete conversion context

#### Test 4: Cookie Consent Blocking
- [ ] Visit site with UTM parameters
- [ ] Reject analytics cookies
- [ ] Verify no `cyoda_utm_params` in sessionStorage
- [ ] Verify no events in GA4 DebugView

#### Test 5: Consent Change
- [ ] Visit site with UTM parameters
- [ ] Initially reject cookies
- [ ] Open cookie preferences and accept analytics
- [ ] Verify UTM parameters are captured
- [ ] Verify landing page view is tracked

### Automated Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run specific test files
npm test utm-tracking.test.ts
npm test analytics.test.ts
npm test utm-conversion-flow.test.tsx

# Run with coverage
npm test -- --coverage
```

### Expected Test Coverage

- UTM tracking utilities: >80% coverage
- Analytics functions: >80% coverage
- Integration tests: Complete conversion flow

## Troubleshooting

### UTM Parameters Not Captured

**Possible Causes**:
- Analytics consent not granted
- UTM parameters not in URL
- JavaScript errors preventing capture

**Solutions**:
- Check cookie consent status
- Verify URL format
- Check browser console for errors

### Events Not Appearing in GA4

**Possible Causes**:
- Analytics consent not granted
- GA4 not initialized
- Network blocking (ad blockers)

**Solutions**:
- Verify consent is granted
- Check GA4 measurement ID
- Disable ad blockers for testing

### Time-to-Conversion Not Calculated

**Possible Causes**:
- Not an ai.cyoda.net destination
- UTM data missing capturedAt timestamp
- SessionStorage cleared

**Solutions**:
- Verify destination URL
- Check sessionStorage data structure
- Ensure user hasn't cleared browser data

## Related Documentation

- [Analytics Service with UTM Tracking](./analytics-utm-tracking.md)
- [Conversion Tracking Implementation](./conversion-tracking-implementation.md)
- [UTM Tracking Implementation](./utm-tracking-implementation.md)
- [Cookie Compliance Guide](./cookie_compliance_guide.md)

