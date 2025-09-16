import { useEffect } from 'react';
import { useTrackingPermissions } from '@/hooks/use-cookie-consent';
import analyticsService from '@/lib/analytics';
import type { AnalyticsConfig } from '@/types/analytics';

// Reads GA id from env; can be overridden by passing config to enableAnalytics
const ENV_GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function AnalyticsManager() {
  const { canTrackAnalytics } = useTrackingPermissions();

  useEffect(() => {
    const cfg: Partial<AnalyticsConfig> = {
      measurementId: ENV_GA_ID,
      anonymizeIp: true,
      debug: import.meta.env.MODE === 'test' || import.meta.env.MODE === 'development',
      consentDefaults: {
        // Start with denied by default; real consent is reflected by rendering this component effect
        ad_storage: 'denied',
        analytics_storage: canTrackAnalytics ? 'granted' : 'denied',
      },
    };

    if (canTrackAnalytics) {
      analyticsService.enableAnalytics(cfg).then(() => {
        // Send initial page view when analytics is first enabled
        const path = window.location.pathname + window.location.search;
        const title = document.title;
        analyticsService.trackPageView(path, title);
      }).catch(() => {});
    } else {
      // If consent withdrawn, disable and cleanup
      analyticsService.disableAnalytics();
    }
  }, [canTrackAnalytics]);

  return null;
}

export default AnalyticsManager;

