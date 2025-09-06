import { useEffect } from 'react';
import { useTrackingPermissions } from '@/hooks/use-cookie-consent';
import analyticsService from '@/lib/analytics';
import type { AnalyticsConfig } from '@/types/analytics';

// Reads GA id from env; can be overridden by passing config to enableAnalytics
const ENV_GA_ID = (import.meta as { env?: { VITE_GA_MEASUREMENT_ID?: string } })?.env?.VITE_GA_MEASUREMENT_ID;

export function AnalyticsManager() {
  const { canTrackAnalytics } = useTrackingPermissions();

  useEffect(() => {
    const cfg: Partial<AnalyticsConfig> = {
      measurementId: ENV_GA_ID,
      anonymizeIp: true,
      debug: false,
      consentDefaults: {
        // Start with denied by default; real consent is reflected by rendering this component effect
        ad_storage: 'denied',
        analytics_storage: canTrackAnalytics ? 'granted' : 'denied',
      },
    };

    if (canTrackAnalytics) {
      analyticsService.enableAnalytics(cfg).catch(() => {});
    } else {
      // If consent withdrawn, disable and cleanup
      analyticsService.disableAnalytics();
    }
  }, [canTrackAnalytics]);

  return null;
}

export default AnalyticsManager;

