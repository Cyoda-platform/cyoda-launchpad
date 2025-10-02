/**
 * UTM Tracking Hook
 *
 * Automatically captures UTM parameters from the URL and tracks landing page views
 * when users arrive from external campaigns. Respects cookie consent and only
 * tracks when analytics consent is granted.
 *
 * Features:
 * - Captures UTM parameters on mount and URL changes
 * - Tracks landing page views with UTM parameters
 * - Detects page variant (home/dev/cto/other) based on route
 * - Respects cookie consent - no tracking without consent
 * - Listens for consent changes and captures UTM parameters when consent is granted
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { captureUtmParameters, hasUtmParameters } from '@/utils/utm-tracking';
import { useTrackingPermissions } from '@/hooks/use-cookie-consent';
import { analyticsService } from '@/lib/analytics';

/**
 * Determine the page variant based on the current route path
 *
 * @param pathname - The current route pathname
 * @returns Page variant identifier
 */
function getPageVariant(pathname: string): string {
  // Normalize pathname by removing trailing slashes
  const normalizedPath = pathname.replace(/\/$/, '');

  switch (normalizedPath) {
    case '':
    case '/':
      return 'home';
    case '/dev':
      return 'dev';
    case '/cto':
      return 'cto';
    default:
      return 'other';
  }
}

/**
 * Hook to automatically capture UTM parameters and track landing page views.
 * Should be used once at the app level.
 *
 * This hook:
 * 1. Captures UTM parameters from the URL when present
 * 2. Tracks landing page views when UTM parameters exist
 * 3. Respects cookie consent - only tracks when analytics consent is granted
 * 4. Listens for consent changes and captures UTM parameters if consent is granted after page load
 * 5. Detects page variant based on the current route
 *
 * @example
 * ```tsx
 * function App() {
 *   useUtmTracking();
 *
 *   return (
 *     <BrowserRouter>
 *       <Routes>
 *         <Route path="/" element={<Home />} />
 *         <Route path="/dev" element={<Dev />} />
 *       </Routes>
 *     </BrowserRouter>
 *   );
 * }
 * ```
 */
export function useUtmTracking() {
  const location = useLocation();
  const { canTrackAnalytics } = useTrackingPermissions();
  const hasTrackedLandingPageRef = useRef(false);
  const previousConsentRef = useRef(canTrackAnalytics);

  // Effect to capture UTM parameters and track landing page views
  useEffect(() => {
    // Only proceed if analytics consent is granted
    if (!canTrackAnalytics) {
      return;
    }

    // Capture UTM parameters from the current URL
    const capturedParams = captureUtmParameters();

    // If UTM parameters were captured and we haven't tracked a landing page yet,
    // track this as a landing page view
    if (capturedParams && !hasTrackedLandingPageRef.current) {
      const path = location.pathname + location.search;
      const title = document.title;
      const pageVariant = getPageVariant(location.pathname);

      // Track landing page view with UTM parameters
      analyticsService.trackLandingPageView(path, title);

      // Also track as a custom event with page variant
      analyticsService.trackEvent('landing_page_view', {
        page_path: location.pathname,
        page_variant: pageVariant,
        page_title: title,
      });

      hasTrackedLandingPageRef.current = true;
    }
  }, [location.pathname, location.search, canTrackAnalytics]);

  // Effect to handle consent changes
  useEffect(() => {
    // Check if consent was just granted (changed from false to true)
    const consentJustGranted = canTrackAnalytics && !previousConsentRef.current;

    if (consentJustGranted) {
      // Capture UTM parameters now that consent is granted
      const capturedParams = captureUtmParameters();

      // If UTM parameters exist and we haven't tracked a landing page yet,
      // track it now
      if (capturedParams && !hasTrackedLandingPageRef.current) {
        const path = location.pathname + location.search;
        const title = document.title;
        const pageVariant = getPageVariant(location.pathname);

        // Track landing page view with UTM parameters
        analyticsService.trackLandingPageView(path, title);

        // Also track as a custom event with page variant
        analyticsService.trackEvent('landing_page_view', {
          page_path: location.pathname,
          page_variant: pageVariant,
          page_title: title,
        });

        hasTrackedLandingPageRef.current = true;
      }
    }

    // Update previous consent state
    previousConsentRef.current = canTrackAnalytics;
  }, [canTrackAnalytics, location.pathname, location.search]);
}

