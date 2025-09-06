import React, { createContext, useContext, useReducer, useEffect, useCallback, useState, useMemo } from 'react';
import {
  CookieConsentContextValue,
  CookieConsentProviderProps,
  CookieConsentState,
  CookieCategory,
  UpdateConsentOptions,
  ConsentEventType,
  ConsentEventData,
  ConsentError,
  ConsentErrorType,
  CookieConsentConfig,
  SerializedConsentData,
} from '@/types/cookie-consent';
import {
  saveConsentState,
  loadConsentState,
  createDefaultConsentState,
  clearConsentState,
  isConsentExpired,
} from '@/lib/cookie-consent-storage';
import { logConsentEvent } from '@/lib/cookie-consent-audit';

/**
 * Actions for the consent state reducer
 */
type ConsentAction =
  | { type: 'INITIALIZE'; payload: CookieConsentState }
  | { type: 'UPDATE_CONSENT'; payload: { category: CookieCategory; granted: boolean } }
  | { type: 'UPDATE_MULTIPLE_CONSENT'; payload: Partial<Record<CookieCategory, boolean>> }
  | { type: 'ACCEPT_ALL' }
  | { type: 'REJECT_ALL' }
  | { type: 'RESET_CONSENT' }
  | { type: 'HIDE_BANNER' }
  | { type: 'SET_HAS_CONSENTED'; payload: boolean };

/**
 * Reducer for managing consent state
 */
function consentReducer(state: CookieConsentState, action: ConsentAction): CookieConsentState {
  const now = new Date();

  switch (action.type) {
    case 'INITIALIZE':
      return action.payload;

    case 'UPDATE_CONSENT': {
      const { category, granted } = action.payload;
      return {
        ...state,
        preferences: {
          ...state.preferences,
          [category]: {
            granted,
            updatedAt: now,
          },
        },
        hasConsented: true,
        consentDate: state.consentDate || now,
      };
    }

    case 'UPDATE_MULTIPLE_CONSENT': {
      const updates = action.payload;
      const updatedPreferences = { ...state.preferences };
      
      Object.entries(updates).forEach(([category, granted]) => {
        if (granted !== undefined && Object.values(CookieCategory).includes(category as CookieCategory)) {
          updatedPreferences[category as CookieCategory] = {
            granted,
            updatedAt: now,
          };
        }
      });

      return {
        ...state,
        preferences: updatedPreferences,
        hasConsented: true,
        consentDate: state.consentDate || now,
      };
    }

    case 'ACCEPT_ALL':
      return {
        ...state,
        preferences: {
          [CookieCategory.ESSENTIAL]: { granted: true, updatedAt: now },
          [CookieCategory.ANALYTICS]: { granted: true, updatedAt: now },
          [CookieCategory.MARKETING]: { granted: true, updatedAt: now },
          [CookieCategory.PERSONALIZATION]: { granted: true, updatedAt: now },
        },
        hasConsented: true,
        consentDate: state.consentDate || now,
        showBanner: false,
      };

    case 'REJECT_ALL':
      return {
        ...state,
        preferences: {
          [CookieCategory.ESSENTIAL]: { granted: true, updatedAt: now }, // Essential always true
          [CookieCategory.ANALYTICS]: { granted: false, updatedAt: now },
          [CookieCategory.MARKETING]: { granted: false, updatedAt: now },
          [CookieCategory.PERSONALIZATION]: { granted: false, updatedAt: now },
        },
        hasConsented: true,
        consentDate: state.consentDate || now,
        showBanner: false,
      };

    case 'RESET_CONSENT':
      return {
        ...createDefaultConsentState(),
        showBanner: true,
      };

    case 'HIDE_BANNER':
      return {
        ...state,
        showBanner: false,
      };

    case 'SET_HAS_CONSENTED':
      return {
        ...state,
        hasConsented: action.payload,
        consentDate: action.payload ? (state.consentDate || now) : null,
      };

    default:
      return state;
  }
}

/**
 * Default configuration for the cookie consent system
 */
const defaultConfig: Required<CookieConsentConfig> = {
  expirationDays: 365,
  version: '1.0.0',
  showBannerByDefault: true,
  defaultPreferences: {},
  callbacks: {},
};

/**
 * Cookie Consent Context
 */
const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

/**
 * Cookie Consent Provider Component
 */
export function CookieConsentProvider({ children, config = {} }: CookieConsentProviderProps) {
  const mergedConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);
  const [state, dispatch] = useReducer(consentReducer, createDefaultConsentState());
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Trigger consent event callbacks
   */
  const triggerCallback = useCallback((eventData: ConsentEventData) => {
    const { callbacks } = mergedConfig;
    
    try {
      // General consent change callback
      callbacks.onConsentChange?.(eventData);
      // Audit log (best-effort)
      try {
        logConsentEvent(eventData);
      } catch {
        // Ignore audit logging errors
      }

      // Specific category callbacks
      if (eventData.category) {
        const { category, newState } = eventData;
        
        if (newState === true) {
          switch (category) {
            case CookieCategory.ANALYTICS:
              callbacks.onAnalyticsEnabled?.(eventData);
              break;
            case CookieCategory.MARKETING:
              callbacks.onMarketingEnabled?.(eventData);
              break;
            case CookieCategory.PERSONALIZATION:
              callbacks.onPersonalizationEnabled?.(eventData);
              break;
          }
        } else if (newState === false) {
          switch (category) {
            case CookieCategory.ANALYTICS:
              callbacks.onAnalyticsDisabled?.(eventData);
              break;
            case CookieCategory.MARKETING:
              callbacks.onMarketingDisabled?.(eventData);
              break;
            case CookieCategory.PERSONALIZATION:
              callbacks.onPersonalizationDisabled?.(eventData);
              break;
          }
        }
      }

      // Banner-specific callbacks
      if (eventData.type === ConsentEventType.BANNER_SHOWN) {
        callbacks.onBannerShown?.(eventData);
      } else if (eventData.type === ConsentEventType.BANNER_DISMISSED) {
        callbacks.onBannerDismissed?.(eventData);
      }
    } catch (error) {
      console.error('Error in consent callback:', error);
      // Don't throw here to prevent breaking the consent flow
    }
  }, [mergedConfig]);

  /**
   * Initialize consent state from localStorage or defaults
   */
  useEffect(() => {
    if (isInitialized) return; // Prevent re-initialization

    try {
      // Check if stored consent is expired
      if (isConsentExpired()) {
        clearConsentState();
      }

      const storedState = loadConsentState();

      if (storedState) {
        dispatch({ type: 'INITIALIZE', payload: storedState });
      } else {
        // Apply default preferences from config
        const defaultState = createDefaultConsentState();
        if (mergedConfig.defaultPreferences) {
          Object.entries(mergedConfig.defaultPreferences).forEach(([category, granted]) => {
            if (granted !== undefined && Object.values(CookieCategory).includes(category as CookieCategory)) {
              defaultState.preferences[category as CookieCategory].granted = granted;
            }
          });
        }

        defaultState.showBanner = mergedConfig.showBannerByDefault;
        dispatch({ type: 'INITIALIZE', payload: defaultState });
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing consent state:', error);
      // Fall back to default state
      dispatch({ type: 'INITIALIZE', payload: createDefaultConsentState() });
      setIsInitialized(true);
    }
  }, [mergedConfig, isInitialized]);

  /**
   * Save state to localStorage whenever it changes (but not during initialization)
   */
  useEffect(() => {
    if (!isInitialized) return; // Don't save during initialization

    try {
      saveConsentState(state, mergedConfig.expirationDays);
    } catch (error) {
      console.error('Error saving consent state:', error);
    }
  }, [state, mergedConfig.expirationDays, isInitialized]);

  /**
   * Update consent for a specific category
   */
  const updateConsent = useCallback((
    category: CookieCategory,
    granted: boolean,
    options: UpdateConsentOptions = {}
  ) => {
    const { triggerCallbacks = true, metadata = {} } = options;
    const previousState = state.preferences[category]?.granted;

    dispatch({ type: 'UPDATE_CONSENT', payload: { category, granted } });

    if (triggerCallbacks) {
      const eventData: ConsentEventData = {
        type: ConsentEventType.CONSENT_UPDATED,
        category,
        previousState,
        newState: granted,
        timestamp: new Date(),
        metadata,
      };
      triggerCallback(eventData);
    }
  }, [state.preferences, triggerCallback]);

  /**
   * Update multiple consent preferences at once
   */
  const updateMultipleConsent = useCallback((
    preferences: Partial<Record<CookieCategory, boolean>>,
    options: UpdateConsentOptions = {}
  ) => {
    const { triggerCallbacks = true, metadata = {} } = options;

    dispatch({ type: 'UPDATE_MULTIPLE_CONSENT', payload: preferences });

    if (triggerCallbacks) {
      Object.entries(preferences).forEach(([category, granted]) => {
        if (granted !== undefined && Object.values(CookieCategory).includes(category as CookieCategory)) {
          const previousState = state.preferences[category as CookieCategory]?.granted;
          const eventData: ConsentEventData = {
            type: ConsentEventType.CONSENT_UPDATED,
            category: category as CookieCategory,
            previousState,
            newState: granted,
            timestamp: new Date(),
            metadata,
          };
          triggerCallback(eventData);
        }
      });
    }
  }, [state.preferences, triggerCallback]);

  /**
   * Accept all non-essential cookies
   */
  const acceptAll = useCallback((options: UpdateConsentOptions = {}) => {
    const { triggerCallbacks = true, metadata = {} } = options;

    dispatch({ type: 'ACCEPT_ALL' });

    if (triggerCallbacks) {
      const eventData: ConsentEventData = {
        type: ConsentEventType.CONSENT_GIVEN,
        timestamp: new Date(),
        metadata,
      };
      triggerCallback(eventData);
    }
  }, [triggerCallback]);

  /**
   * Reject all non-essential cookies
   */
  const rejectAll = useCallback((options: UpdateConsentOptions = {}) => {
    const { triggerCallbacks = true, metadata = {} } = options;

    dispatch({ type: 'REJECT_ALL' });

    if (triggerCallbacks) {
      const eventData: ConsentEventData = {
        type: ConsentEventType.CONSENT_WITHDRAWN,
        timestamp: new Date(),
        metadata,
      };
      triggerCallback(eventData);
    }
  }, [triggerCallback]);

  /**
   * Reset consent state (show banner again)
   */
  const resetConsent = useCallback(() => {
    dispatch({ type: 'RESET_CONSENT' });
    clearConsentState();
  }, []);

  /**
   * Hide the consent banner
   */
  const hideBanner = useCallback(() => {
    dispatch({ type: 'HIDE_BANNER' });
    
    const eventData: ConsentEventData = {
      type: ConsentEventType.BANNER_DISMISSED,
      timestamp: new Date(),
    };
    triggerCallback(eventData);
  }, [triggerCallback]);

  /**
   * Check if a specific category is consented
   */
  const hasConsent = useCallback((category: CookieCategory): boolean => {
    return state.preferences[category]?.granted ?? false;
  }, [state.preferences]);

  /**
   * Get consent preference for a specific category
   */
  const getPreference = useCallback((category: CookieCategory) => {
    return state.preferences[category];
  }, [state.preferences]);

  /**
   * Check if consent data is expired
   */
  const isExpired = useCallback((): boolean => {
    return isConsentExpired();
  }, []);

  /**
   * Export current consent record in a portable format
   */
  const getConsentRecord = useCallback((): SerializedConsentData => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + mergedConfig.expirationDays * 24 * 60 * 60 * 1000);
    const preferences: Record<string, { granted: boolean; updatedAt: string }> = {};
    Object.entries(state.preferences).forEach(([cat, pref]) => {
      preferences[cat] = { granted: !!pref.granted, updatedAt: pref.updatedAt.toISOString() };
    });
    return {
      preferences,
      hasConsented: state.hasConsented,
      consentDate: state.consentDate ? state.consentDate.toISOString() : null,
      version: state.version,
      showBanner: state.showBanner,
      expiresAt: expiresAt.toISOString(),
    };
  }, [state, mergedConfig.expirationDays]);

  /**
   * Delete consent record (erasure) and show banner again
   */
  const deleteConsentRecord = useCallback(() => {
    try {
      clearConsentState();
    } catch {
      // Ignore storage clear errors
    }
    dispatch({ type: 'RESET_CONSENT' });
  }, []);

  const contextValue: CookieConsentContextValue = {
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
  };

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}
    </CookieConsentContext.Provider>
  );
}

/**
 * Hook to access the cookie consent context
 * @internal - Use the hooks from use-cookie-consent.ts instead
 */
export function useCookieConsentContext(): CookieConsentContextValue {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new ConsentError(
      ConsentErrorType.VALIDATION_ERROR,
      'useCookieConsentContext must be used within a CookieConsentProvider'
    );
  }

  return context;
}
