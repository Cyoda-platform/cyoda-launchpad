export type ConsentSetting = 'granted' | 'denied';

export interface AnalyticsConsent {
  ad_storage?: ConsentSetting;
  analytics_storage?: ConsentSetting;
}

export interface AnalyticsConfig {
  /** GA4 measurement ID (e.g., G-XXXXXXX). If omitted, will try VITE_GA_MEASUREMENT_ID */
  measurementId?: string;
  /** Anonymize IP for privacy compliance */
  anonymizeIp?: boolean;
  /** Optional dataLayer name; default 'dataLayer' */
  dataLayerName?: string;
  /** Optional DOM id used for the injected script tag */
  scriptId?: string;
  /** Initial/default consent values for Google Consent Mode */
  consentDefaults?: AnalyticsConsent;
  /** Log debug info to console */
  debug?: boolean;
}

export interface TrackingEvent {
  name: string;
  params?: Record<string, unknown>;
}

export interface AnalyticsServiceAPI {
  enableAnalytics: (config?: Partial<AnalyticsConfig>) => Promise<void>;
  disableAnalytics: () => void;
  isEnabled: () => boolean;
  trackEvent: (name: string, params?: Record<string, unknown>) => void;
  trackPageView: (path?: string, title?: string) => void;
  getMeasurementId: () => string | null;
}

