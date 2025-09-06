import { useCallback, useMemo } from 'react';
import { useCookieConsentContext } from '@/components/CookieConsentProvider';
import {
  CookieCategory,
  CookiePreference,
  UpdateConsentOptions,
  CookieConsentState,
} from '@/types/cookie-consent';

/**
 * Return type for the useCookieConsent hook
 */
export interface UseCookieConsentReturn {
  /** Current consent state */
  state: CookieConsentState;
  /** Whether the user has made an initial consent decision */
  hasConsented: boolean;
  /** Whether the consent banner should be shown */
  showBanner: boolean;
  /** Whether consent data is expired */
  isExpired: boolean;
  /** Update consent for a specific category */
  updateConsent: (category: CookieCategory, granted: boolean, options?: UpdateConsentOptions) => void;
  /** Update multiple consent preferences at once */
  updateMultipleConsent: (preferences: Partial<Record<CookieCategory, boolean>>, options?: UpdateConsentOptions) => void;
  /** Accept all non-essential cookies */
  acceptAll: (options?: UpdateConsentOptions) => void;
  /** Reject all non-essential cookies */
  rejectAll: (options?: UpdateConsentOptions) => void;
  /** Reset consent state (show banner again) */
  resetConsent: () => void;
  /** Hide the consent banner */
  hideBanner: () => void;
  /** Check if a specific category is consented */
  hasConsent: (category: CookieCategory) => boolean;
  /** Get consent preference for a specific category */
  getPreference: (category: CookieCategory) => CookiePreference;
  /** Export consent record for access/portability */
  getConsentRecord: () => import('@/types/cookie-consent').SerializedConsentData;
  /** Erase consent record (GDPR erasure) */
  deleteConsentRecord: () => void;
}

/**
 * Main hook for interacting with cookie consent system
 * 
 * @returns Object with consent state and methods to manage consent
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { hasConsent, updateConsent, acceptAll, showBanner } = useCookieConsent();
 *   
 *   const handleAnalyticsToggle = () => {
 *     updateConsent(CookieCategory.ANALYTICS, !hasConsent(CookieCategory.ANALYTICS));
 *   };
 *   
 *   if (showBanner) {
 *     return <CookieConsentBanner onAcceptAll={acceptAll} />;
 *   }
 *   
 *   return <div>Content with analytics: {hasConsent(CookieCategory.ANALYTICS)}</div>;
 * }
 * ```
 */
export function useCookieConsent(): UseCookieConsentReturn {
  const context = useCookieConsentContext();

  const {
    state,
    updateConsent,
    updateMultipleConsent,
    acceptAll,
    rejectAll,
    resetConsent,
    hideBanner,
    hasConsent,
    getPreference,
    isExpired,
    getConsentRecord,
    deleteConsentRecord,
  } = context;

  // Memoize derived state values
  const derivedState = useMemo(() => ({
    hasConsented: state.hasConsented,
    showBanner: state.showBanner,
    isExpired: isExpired(),
  }), [state.hasConsented, state.showBanner, isExpired]);

  return {
    state,
    ...derivedState,
    updateConsent,
    updateMultipleConsent,
    acceptAll,
    rejectAll,
    resetConsent,
    hideBanner,
    hasConsent,
    getPreference,
    getConsentRecord,
    deleteConsentRecord,
  };
}

/**
 * Return type for the useCookiePreferences hook
 */
export interface UseCookiePreferencesReturn {
  /** All consent preferences */
  preferences: Record<CookieCategory, CookiePreference>;
  /** Essential cookies consent (always true) */
  essential: boolean;
  /** Analytics cookies consent */
  analytics: boolean;
  /** Marketing cookies consent */
  marketing: boolean;
  /** Personalization cookies consent */
  personalization: boolean;
  /** Update essential cookies consent (no-op, always true) */
  setEssential: (granted: boolean, options?: UpdateConsentOptions) => void;
  /** Update analytics cookies consent */
  setAnalytics: (granted: boolean, options?: UpdateConsentOptions) => void;
  /** Update marketing cookies consent */
  setMarketing: (granted: boolean, options?: UpdateConsentOptions) => void;
  /** Update personalization cookies consent */
  setPersonalization: (granted: boolean, options?: UpdateConsentOptions) => void;
  /** Toggle analytics cookies consent */
  toggleAnalytics: (options?: UpdateConsentOptions) => void;
  /** Toggle marketing cookies consent */
  toggleMarketing: (options?: UpdateConsentOptions) => void;
  /** Toggle personalization cookies consent */
  togglePersonalization: (options?: UpdateConsentOptions) => void;
}

/**
 * Hook for managing individual cookie category preferences
 * 
 * @returns Object with individual category states and setters
 * 
 * @example
 * ```tsx
 * function CookiePreferencesForm() {
 *   const {
 *     analytics,
 *     marketing,
 *     personalization,
 *     setAnalytics,
 *     setMarketing,
 *     setPersonalization,
 *   } = useCookiePreferences();
 *   
 *   return (
 *     <form>
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={analytics}
 *           onChange={(e) => setAnalytics(e.target.checked)}
 *         />
 *         Analytics Cookies
 *       </label>
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={marketing}
 *           onChange={(e) => setMarketing(e.target.checked)}
 *         />
 *         Marketing Cookies
 *       </label>
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={personalization}
 *           onChange={(e) => setPersonalization(e.target.checked)}
 *         />
 *         Personalization Cookies
 *       </label>
 *     </form>
 *   );
 * }
 * ```
 */
export function useCookiePreferences(): UseCookiePreferencesReturn {
  const { state, updateConsent, hasConsent } = useCookieConsentContext();

  // Memoize preference values
  const preferences = useMemo(() => state.preferences, [state.preferences]);
  
  const essential = useMemo(() => hasConsent(CookieCategory.ESSENTIAL), [hasConsent]);
  const analytics = useMemo(() => hasConsent(CookieCategory.ANALYTICS), [hasConsent]);
  const marketing = useMemo(() => hasConsent(CookieCategory.MARKETING), [hasConsent]);
  const personalization = useMemo(() => hasConsent(CookieCategory.PERSONALIZATION), [hasConsent]);

  // Create setter functions
  const setEssential = useCallback((granted: boolean, options?: UpdateConsentOptions) => {
    // Essential cookies cannot be disabled, so this is a no-op
    // We still call updateConsent to maintain consistency and trigger callbacks if needed
    updateConsent(CookieCategory.ESSENTIAL, true, options);
  }, [updateConsent]);

  const setAnalytics = useCallback((granted: boolean, options?: UpdateConsentOptions) => {
    updateConsent(CookieCategory.ANALYTICS, granted, options);
  }, [updateConsent]);

  const setMarketing = useCallback((granted: boolean, options?: UpdateConsentOptions) => {
    updateConsent(CookieCategory.MARKETING, granted, options);
  }, [updateConsent]);

  const setPersonalization = useCallback((granted: boolean, options?: UpdateConsentOptions) => {
    updateConsent(CookieCategory.PERSONALIZATION, granted, options);
  }, [updateConsent]);

  // Create toggle functions
  const toggleAnalytics = useCallback((options?: UpdateConsentOptions) => {
    setAnalytics(!analytics, options);
  }, [analytics, setAnalytics]);

  const toggleMarketing = useCallback((options?: UpdateConsentOptions) => {
    setMarketing(!marketing, options);
  }, [marketing, setMarketing]);

  const togglePersonalization = useCallback((options?: UpdateConsentOptions) => {
    setPersonalization(!personalization, options);
  }, [personalization, setPersonalization]);

  return {
    preferences,
    essential,
    analytics,
    marketing,
    personalization,
    setEssential,
    setAnalytics,
    setMarketing,
    setPersonalization,
    toggleAnalytics,
    toggleMarketing,
    togglePersonalization,
  };
}

/**
 * Return type for the useCookieCategory hook
 */
export interface UseCookieCategoryReturn {
  /** Whether this category is consented */
  granted: boolean;
  /** Preference object for this category */
  preference: CookiePreference;
  /** Update consent for this category */
  setConsent: (granted: boolean, options?: UpdateConsentOptions) => void;
  /** Toggle consent for this category */
  toggle: (options?: UpdateConsentOptions) => void;
}

/**
 * Hook for managing a specific cookie category
 * 
 * @param category - The cookie category to manage
 * @returns Object with category state and methods
 * 
 * @example
 * ```tsx
 * function AnalyticsToggle() {
 *   const { granted, toggle } = useCookieCategory(CookieCategory.ANALYTICS);
 *   
 *   return (
 *     <button onClick={() => toggle()}>
 *       Analytics: {granted ? 'Enabled' : 'Disabled'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useCookieCategory(category: CookieCategory): UseCookieCategoryReturn {
  const { hasConsent, getPreference, updateConsent } = useCookieConsentContext();

  const granted = useMemo(() => hasConsent(category), [hasConsent, category]);
  const preference = useMemo(() => getPreference(category), [getPreference, category]);

  const setConsent = useCallback((granted: boolean, options?: UpdateConsentOptions) => {
    updateConsent(category, granted, options);
  }, [updateConsent, category]);

  const toggle = useCallback((options?: UpdateConsentOptions) => {
    setConsent(!granted, options);
  }, [granted, setConsent]);

  return {
    granted,
    preference,
    setConsent,
    toggle,
  };
}

/**
 * Hook to check if specific analytics/tracking should be enabled
 * 
 * @returns Object with boolean flags for different tracking types
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { canTrackAnalytics, canTrackMarketing } = useTrackingPermissions();
 *   
 *   useEffect(() => {
 *     if (canTrackAnalytics) {
 *       // Initialize Google Analytics
 *     }
 *     if (canTrackMarketing) {
 *       // Initialize marketing pixels
 *     }
 *   }, [canTrackAnalytics, canTrackMarketing]);
 *   
 *   return <div>Component content</div>;
 * }
 * ```
 */
export function useTrackingPermissions() {
  const { hasConsent } = useCookieConsentContext();

  return useMemo(() => ({
    canTrackAnalytics: hasConsent(CookieCategory.ANALYTICS),
    canTrackMarketing: hasConsent(CookieCategory.MARKETING),
    canPersonalize: hasConsent(CookieCategory.PERSONALIZATION),
    canUseEssential: hasConsent(CookieCategory.ESSENTIAL), // Always true
  }), [hasConsent]);
}
