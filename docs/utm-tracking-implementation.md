# UTM Tracking Implementation

This document describes the implementation of automatic UTM parameter capture and landing page view tracking.

## Overview

The `useUtmTracking` hook automatically captures UTM parameters from the URL and tracks landing page views when users arrive from external campaigns. It respects cookie consent and only tracks when analytics consent is granted.

## Features

1. **Automatic UTM Parameter Capture**: Captures UTM parameters from the URL on page load and URL changes
2. **Landing Page View Tracking**: Tracks landing page views with UTM parameters and page variant information
3. **Cookie Consent Respect**: Only captures and tracks when analytics consent is granted
4. **Consent Change Handling**: Listens for consent changes and captures UTM parameters when consent is granted after page load
5. **Page Variant Detection**: Automatically detects page variant (home/dev/cto/other) based on the current route

## Implementation Details

### Hook Location

- **File**: `src/hooks/use-utm-tracking.ts`
- **Integration**: Used in `src/App.tsx` via the `AnalyticsTracker` component

### Page Variant Detection

The hook automatically detects the page variant based on the current route:

- `/` or empty → `home`
- `/dev` → `dev`
- `/cto` → `cto`
- All other routes → `other`

### Tracking Behavior

1. **On Mount/URL Change** (with consent):
   - Captures UTM parameters from the URL
   - If UTM parameters exist and landing page hasn't been tracked yet:
     - Tracks a `landing_page_view` event via `analyticsService.trackLandingPageView()`
     - Tracks a custom `landing_page_view` event with page variant information

2. **On Consent Change**:
   - If consent is granted after page load:
     - Captures UTM parameters from the URL
     - Tracks landing page view if UTM parameters exist and haven't been tracked yet

3. **Session Tracking**:
   - Landing page view is only tracked once per session
   - Uses a ref to prevent duplicate tracking

## Usage

The hook is automatically used at the app level in `src/App.tsx`:

```tsx
const AnalyticsTracker = () => {
  useAnalyticsTracking();
  useUtmTracking(); // Capture UTM parameters on app load
  return null;
};
```

No additional setup is required. The hook will automatically:
- Capture UTM parameters when present in the URL
- Track landing page views with campaign attribution
- Respect cookie consent settings

## Testing

### Manual Testing

To test the implementation manually:

1. **Test UTM Parameter Capture**:
   ```
   http://localhost:5173/?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale
   ```
   - Accept analytics cookies
   - Check browser console for UTM parameter capture logs (in debug mode)
   - Check Google Analytics for landing page view event

2. **Test Page Variant Detection**:
   ```
   http://localhost:5173/?utm_source=linkedin&utm_medium=social
   http://localhost:5173/dev?utm_source=linkedin&utm_medium=social
   http://localhost:5173/cto?utm_source=linkedin&utm_medium=social
   ```
   - Each should track with the correct page variant (home, dev, cto)

3. **Test Consent Handling**:
   ```
   http://localhost:5173/?utm_source=test&utm_medium=test
   ```
   - Load page without accepting cookies
   - UTM parameters should not be captured
   - Accept analytics cookies
   - UTM parameters should be captured and landing page view tracked

### Automated Testing

Unit tests are located in `tests/unit/hooks/use-utm-tracking.test.tsx`.

Run tests with:
```bash
npm test -- tests/unit/hooks/use-utm-tracking.test.tsx
```

Test coverage includes:
- ✅ No capture without consent
- ✅ Capture with consent
- ✅ Landing page view tracking
- ✅ Page variant detection (home, dev, cto, other)
- ✅ Single tracking per session
- ✅ No tracking without UTM parameters

## Events Tracked

### 1. Landing Page View (via `trackLandingPageView`)

Sent as a pageview event with:
- `page_location`: Current URL path with query string
- `page_title`: Document title
- `referrer`: Document referrer (if available)
- `is_landing_page`: `true` (if UTM parameters exist)
- All UTM parameters (if available)

### 2. Landing Page View Event (custom event)

Sent as a custom `landing_page_view` event with:
- `page_path`: Current pathname
- `page_variant`: Detected page variant (home/dev/cto/other)
- `page_title`: Document title
- All UTM parameters (automatically included by analytics service)

## Integration with Analytics Service

The hook uses the following analytics service methods:

1. **`analyticsService.trackLandingPageView(path, title)`**:
   - Tracks a pageview with landing page marker
   - Automatically includes UTM parameters and referrer information

2. **`analyticsService.trackEvent('landing_page_view', params)`**:
   - Tracks a custom event with page variant information
   - Automatically includes UTM parameters from session storage

## Dependencies

- `react-router-dom`: For `useLocation()` hook
- `@/utils/utm-tracking`: For `captureUtmParameters()` and `hasUtmParameters()`
- `@/hooks/use-cookie-consent`: For `useTrackingPermissions()` hook
- `@/lib/analytics`: For `analyticsService` methods

## Related Documentation

- [UTM Parameter Tracking](./utm-parameter-tracking.md) - UTM parameter capture and storage system
- [Analytics Service with UTM Tracking](./analytics-utm-tracking.md) - Analytics service integration
- [Cookie Consent System](./cookie-consent-system.md) - Cookie consent implementation

## Troubleshooting

### UTM Parameters Not Being Captured

1. Check that analytics consent is granted
2. Verify UTM parameters are in the URL
3. Check browser console for error messages
4. Enable debug mode in analytics service to see detailed logs

### Landing Page View Not Tracked

1. Verify analytics service is initialized
2. Check that consent is granted before page load or granted after
3. Verify UTM parameters exist in the URL
4. Check that landing page hasn't already been tracked in the session

### Page Variant Not Correct

1. Check the route path matches expected patterns
2. Verify `getPageVariant()` function logic in the hook
3. Check browser console for tracked event parameters

