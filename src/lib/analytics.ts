/* Google Analytics Integration Service
 * - Loads GA4 script only when analytics consent is granted
 * - Provides enable/disable/isEnabled/trackEvent APIs
 * - Cleans GA cookies/localStorage on disable
 */
import type { AnalyticsConfig, AnalyticsServiceAPI, AnalyticsConsent } from '@/types/analytics';

const DEFAULTS: Required<Pick<AnalyticsConfig, 'anonymizeIp' | 'dataLayerName' | 'scriptId' | 'debug'>> &
  Pick<AnalyticsConfig, 'consentDefaults'> = {
  anonymizeIp: true,
  dataLayerName: 'dataLayer',
  scriptId: 'ga4-script',
  debug: false,
  consentDefaults: undefined,
};

// Internal state
let loaded = false;
let currentConfig: AnalyticsConfig = {};

// Guard for browser context
function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function getMeasurementId(config?: Partial<AnalyticsConfig>): string | null {
  const envId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  return (
    config?.measurementId ||
    currentConfig.measurementId ||
    (envId && envId !== 'undefined' ? envId : null) ||
    null
  );
}

function logDebug(msg: string, ...args: unknown[]) {
  if (currentConfig.debug) {
    console.debug(`[analytics] ${msg}`, ...args);
  }
}

function setGtagStub(dataLayerName: string) {
  const w = window as Record<string, unknown> & {
    gtag?: (...args: unknown[]) => void;
  };
  if (!w[dataLayerName]) w[dataLayerName] = [];
  if (!w.gtag) {
    w.gtag = function (...args: unknown[]) {
      (w[dataLayerName] as unknown[]).push(args);
    };
  }
}

function applyConsent(consent?: AnalyticsConsent) {
  if (!consent) return;
  try {
    (window as { gtag?: (...args: unknown[]) => void }).gtag?.('consent', 'default', consent);
  } catch {
    // Ignore consent application errors
  }
}

function initConfig(provided?: Partial<AnalyticsConfig>) {
  // Set defaults first, then apply provided config
  const defaults: Partial<AnalyticsConfig> = {
    consentDefaults: {
      ad_storage: 'denied',
      analytics_storage: 'denied',
    }
  };

  currentConfig = {
    ...DEFAULTS,
    ...currentConfig,
    ...defaults,
    ...provided, // This will override defaults if provided
  } as AnalyticsConfig;
}

function injectScript(measurementId: string, onLoad: () => void, onError: () => void) {
  if (!isBrowser()) return;

  // Do not inject twice
  if (document.getElementById(currentConfig.scriptId!)) {
    onLoad();
    return;
  }

  // Ensure gtag stub and initial events are queued before external script loads
  setGtagStub(currentConfig.dataLayerName!);

  // Queue consent defaults first
  applyConsent(currentConfig.consentDefaults);

  // Queue GA init and config
  (window as { gtag?: (...args: unknown[]) => void }).gtag?.('js', new Date());
  (window as { gtag?: (...args: unknown[]) => void }).gtag?.('config', measurementId, {
    anonymize_ip: currentConfig.anonymizeIp !== false,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.id = currentConfig.scriptId!;
  script.onload = onLoad;
  script.onerror = onError;

  document.head.appendChild(script);
}

function removeScript() {
  if (!isBrowser()) return;
  const el = document.getElementById(currentConfig.scriptId!);
  if (el && el.parentNode) el.parentNode.removeChild(el);
}

// Attempt to clear GA cookies created by this domain
function clearGaCookies() {
  if (!isBrowser()) return;
  const cookieNames = (document.cookie || '')
    .split(';')
    .map((c) => c.trim().split('=')[0])
    .filter((name) => name && (name === '_gid' || name === '_ga' || name.startsWith('_ga_')));

  const domains = [undefined, window.location.hostname, `.${window.location.hostname}`];
  const paths = [undefined, '/', import.meta?.env?.BASE_URL || '/'];

  cookieNames.forEach((name) => {
    domains.forEach((domain) => {
      paths.forEach((path) => {
        try {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${
            path ? `path=${path}; ` : ''
          }${domain ? `domain=${domain}; ` : ''}SameSite=Lax`;
        } catch {
          // Ignore cookie deletion errors
        }
      });
    });
  });
}

function clearGaStorage() {
  if (!isBrowser()) return;
  try {
    // Some sites use flags like ga-disable-<ID>
    const id = getMeasurementId() || '';
    if (id) {
      localStorage.removeItem(`ga-disable-${id}`);
      (window as Record<string, unknown>)[`ga-disable-${id}`] = true; // prevent accidental firing
    }
  } catch {
    // Ignore storage cleanup errors
  }
}

export const analyticsService: AnalyticsServiceAPI = {
  async enableAnalytics(config?: Partial<AnalyticsConfig>) {
    if (!isBrowser()) return;

    initConfig(config);
    const measurementId = getMeasurementId(config);
    if (!measurementId) {
      logDebug('No measurementId provided; skipping GA init');
      return;
    }

    if (loaded) {
      logDebug('Analytics already enabled');
      return;
    }

    await new Promise<void>((resolve) => {
      injectScript(
        measurementId,
        () => {
          loaded = true;
          logDebug('GA script loaded');
          resolve();
        },
        () => {
          loaded = false;
          logDebug('Failed to load GA script');
          resolve();
        }
      );
    });
  },

  disableAnalytics() {
    if (!isBrowser()) return;

    // Remove script and try to cleanup cookies/storage
    removeScript();
    clearGaCookies();
    clearGaStorage();

    // Remove gtag reference and datalayer to prevent future usage until re-enabled
    try {
      const w = window as Record<string, unknown>;
      if (w.gtag) delete w.gtag;
      if (w[currentConfig.dataLayerName!]) delete w[currentConfig.dataLayerName!];
    } catch {
      // Ignore cleanup errors
    }

    // Reset internal state
    loaded = false;
    currentConfig = {};
    logDebug('Analytics disabled and cleaned up');
  },

  isEnabled() {
    return loaded;
  },

  trackEvent(name: string, params?: Record<string, unknown>) {
    if (!isBrowser()) return;
    if (!loaded) return; // respect consent and loading state

    try {
      (window as { gtag?: (...args: unknown[]) => void }).gtag?.('event', name, params || {});
    } catch (e) {
      logDebug('trackEvent error', e);
    }
  },

  getMeasurementId() {
    return getMeasurementId();
  },
};

export default analyticsService;

