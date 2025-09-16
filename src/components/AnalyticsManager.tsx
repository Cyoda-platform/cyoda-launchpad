/**
 * Analytics Manager using react-ga4
 * - Integrates with cookie consent system
 * - Initializes Google Analytics when component mounts
 * - Updates consent when user preferences change
 */

import { useEffect, useRef } from 'react';
import { useTrackingPermissions } from '@/hooks/use-cookie-consent';
import { analyticsService } from '@/lib/analytics';

// Get GA measurement ID from environment
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function AnalyticsManager() {
  const { canTrackAnalytics } = useTrackingPermissions();
  const initializedRef = useRef(false);

  // Initialize analytics on mount
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'undefined') {
      console.warn('[AnalyticsManager] No GA measurement ID found in environment');
      return;
    }

    if (!initializedRef.current) {
      analyticsService.initialize({
        measurementId: GA_MEASUREMENT_ID,
        debug: import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test',
        gtagOptions: {
          // Additional gtag configuration can be added here
          anonymize_ip: true,
        },
      });
      initializedRef.current = true;
    }
  }, []);

  // Update consent when tracking permissions change
  useEffect(() => {
    if (analyticsService.isInitialized()) {
      analyticsService.setConsent(canTrackAnalytics);
      
      // If consent was revoked, disable analytics
      if (!canTrackAnalytics) {
        analyticsService.disable();
      }
    }
  }, [canTrackAnalytics]);

  return null;
}

export default AnalyticsManager;
