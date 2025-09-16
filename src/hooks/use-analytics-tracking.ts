/**
 * Analytics tracking hooks using react-ga4
 * - Automatically tracks page views on route changes
 * - Provides event tracking utilities
 * - Respects cookie consent
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '@/lib/analytics';

/**
 * Hook to automatically track page views on route changes
 * Should be used once at the app level
 */
export function useAnalyticsTracking() {
  const location = useLocation();

  useEffect(() => {
    // Track page view when route changes
    if (analyticsService.isInitialized()) {
      const path = location.pathname + location.search;
      const title = document.title;
      
      analyticsService.trackPageView(path, title);
    }
  }, [location.pathname, location.search]);
}

/**
 * Hook to track custom events
 * @returns Object with tracking functions
 */
export function useAnalyticsEvents() {
  const trackEvent = (name: string, params?: Record<string, unknown>) => {
    analyticsService.trackEvent(name, params);
  };

  const trackPageView = (path?: string, title?: string) => {
    analyticsService.trackPageView(path, title);
  };

  return {
    trackEvent,
    trackPageView,
    isEnabled: analyticsService.isInitialized(),
  };
}
