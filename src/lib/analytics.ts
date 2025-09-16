/**
 * Google Analytics 4 Integration using react-ga4
 * - Integrates with cookie consent system
 * - Respects granted/denied/revoked consent states
 * - Provides clean API for tracking events and page views
 */

import ReactGA from 'react-ga4';

export interface AnalyticsConfig {
  /** GA4 measurement ID (e.g., G-XXXXXXX) */
  measurementId: string;
  /** Enable debug mode */
  debug?: boolean;
  /** Additional gtag config options */
  gtagOptions?: Record<string, unknown>;
}

export interface AnalyticsService {
  /** Initialize analytics with given config */
  initialize: (config: AnalyticsConfig) => void;
  /** Check if analytics is initialized */
  isInitialized: () => boolean;
  /** Track a page view */
  trackPageView: (path?: string, title?: string) => void;
  /** Track a custom event */
  trackEvent: (eventName: string, parameters?: Record<string, unknown>) => void;
  /** Set user consent for analytics */
  setConsent: (granted: boolean) => void;
  /** Disable analytics and clear data */
  disable: () => void;
  /** Get current measurement ID */
  getMeasurementId: () => string | null;
}

class AnalyticsServiceImpl implements AnalyticsService {
  private initialized = false;
  private measurementId: string | null = null;
  private consentGranted = false;
  private debug = false;

  initialize(config: AnalyticsConfig): void {
    if (this.initialized) {
      if (this.debug) {
        console.debug('[analytics] Already initialized');
      }
      return;
    }

    // Check if measurement ID is valid (not a placeholder)
    if (!config.measurementId ||
        config.measurementId === 'undefined' ||
        config.measurementId.includes('REPLACE_ME') ||
        !config.measurementId.match(/^G-[A-Z0-9]+$/)) {
      if (this.debug) {
        console.debug('[analytics] Invalid or placeholder measurement ID, skipping initialization:', config.measurementId);
      }
      return;
    }

    this.measurementId = config.measurementId;
    this.debug = config.debug || false;

    try {
      // Initialize react-ga4
      ReactGA.initialize(config.measurementId, {
        testMode: false, // Always load the real script, even in debug mode
        gtagOptions: config.gtagOptions,
      });

      // Set initial consent to denied
      ReactGA.gtag('consent', 'default', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
      });

      this.initialized = true;

      if (this.debug) {
        console.debug('[analytics] Initialized with measurement ID:', config.measurementId);
      }
    } catch (error) {
      console.error('[analytics] Failed to initialize:', error);
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  setConsent(granted: boolean): void {
    if (!this.initialized) {
      if (this.debug) {
        console.debug('[analytics] Cannot set consent - not initialized');
      }
      return;
    }

    this.consentGranted = granted;

    try {
      // Update consent using react-ga4's gtag wrapper
      ReactGA.gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
        ad_storage: granted ? 'granted' : 'denied',
      });

      if (this.debug) {
        console.debug('[analytics] Consent updated:', granted ? 'granted' : 'denied');
      }

      // If consent is granted and we haven't sent initial page view, send it now
      if (granted) {
        // Give a small delay to ensure gtag is available
        setTimeout(() => {
          this.trackPageView();
        }, 100);
      }
    } catch (error) {
      console.error('[analytics] Failed to update consent:', error);
    }
  }

  trackPageView(path?: string, title?: string): void {
    if (!this.initialized || !this.consentGranted) {
      if (this.debug) {
        console.debug('[analytics] Cannot track page view - not initialized or consent not granted');
      }
      return;
    }

    try {
      const options: Record<string, unknown> = {};
      
      if (path) {
        options.page_location = path;
      }
      
      if (title) {
        options.page_title = title;
      }

      ReactGA.send({ hitType: 'pageview', ...options });

      if (this.debug) {
        console.debug('[analytics] Page view tracked:', { path, title });
      }
    } catch (error) {
      console.error('[analytics] Failed to track page view:', error);
    }
  }

  trackEvent(eventName: string, parameters?: Record<string, unknown>): void {
    if (!this.initialized || !this.consentGranted) {
      if (this.debug) {
        console.debug('[analytics] Cannot track event - not initialized or consent not granted');
      }
      return;
    }

    try {
      ReactGA.event(eventName, parameters);

      if (this.debug) {
        console.debug('[analytics] Event tracked:', eventName, parameters);
      }
    } catch (error) {
      console.error('[analytics] Failed to track event:', error);
    }
  }

  disable(): void {
    if (!this.initialized) {
      return;
    }

    try {
      // Revoke consent
      ReactGA.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });

      // Reset internal state
      this.consentGranted = false;

      if (this.debug) {
        console.debug('[analytics] Analytics disabled');
      }
    } catch (error) {
      console.error('[analytics] Failed to disable analytics:', error);
    }
  }

  getMeasurementId(): string | null {
    return this.measurementId;
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsServiceImpl();

// Export default for backward compatibility
export default analyticsService;
