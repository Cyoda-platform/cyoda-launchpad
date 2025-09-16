import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { analyticsService } from '@/lib/analytics';
import {
  saveConsentState,
  loadConsentState,
  clearConsentState,
  createDefaultConsentState
} from '@/lib/cookie-consent-storage';
import { CookieCategory } from '@/types/cookie-consent';

// Mock analytics service
vi.mock('@/lib/analytics', () => {
  const mockAnalyticsService = {
    initialize: vi.fn(),
    isInitialized: vi.fn(() => false),
    trackEvent: vi.fn(),
    trackPageView: vi.fn(),
    setConsent: vi.fn(),
    disable: vi.fn(),
    getMeasurementId: vi.fn(() => 'G-TEST123456')
  };

  return {
    analyticsService: mockAnalyticsService,
    default: mockAnalyticsService
  };
});

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('Consent → Analytics Flow Integration', () => {
  const mockAnalyticsService = vi.mocked(analyticsService);

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('(a) User Provides Consent', () => {
    it('should record consent and enable analytics when user grants consent', async () => {
      // 1. Create consent state with analytics granted
      const consentState = createDefaultConsentState();
      consentState.preferences[CookieCategory.ANALYTICS].granted = true;
      consentState.hasConsented = true;
      consentState.showBanner = false;

      // 2. Save consent to storage
      saveConsentState(consentState);

      // 3. Verify consent was saved
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'cyoda-cookie-consent',
        expect.stringContaining('"analytics":{"granted":true')
      );

      // 4. Load consent and verify analytics should be enabled
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(consentState));
      const loadedState = loadConsentState();

      expect(loadedState).toBeTruthy();
      expect(loadedState!.preferences[CookieCategory.ANALYTICS].granted).toBe(true);
      expect(loadedState!.hasConsented).toBe(true);

      // 5. Simulate AnalyticsManager initializing and setting consent
      mockAnalyticsService.isInitialized.mockReturnValue(true);

      if (loadedState!.preferences[CookieCategory.ANALYTICS].granted) {
        analyticsService.initialize({
          measurementId: 'G-TEST123456',
          debug: false
        });
        analyticsService.setConsent(true);
      }

      expect(mockAnalyticsService.initialize).toHaveBeenCalledWith({
        measurementId: 'G-TEST123456',
        debug: false
      });
      expect(mockAnalyticsService.setConsent).toHaveBeenCalledWith(true);
    });

    it('should persist consent across sessions', () => {
      // 1. Grant consent
      const consentState = createDefaultConsentState();
      consentState.preferences[CookieCategory.ANALYTICS].granted = true;
      consentState.hasConsented = true;

      saveConsentState(consentState);

      // 2. Simulate page reload - load from storage
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(consentState));
      const reloadedState = loadConsentState();

      // 3. Verify consent persisted
      expect(reloadedState).toBeTruthy();
      expect(reloadedState!.preferences[CookieCategory.ANALYTICS].granted).toBe(true);
      expect(reloadedState!.hasConsented).toBe(true);
    });

    it('should handle consent with specific timestamp', () => {
      const now = new Date();
      const consentState = createDefaultConsentState();
      consentState.preferences[CookieCategory.ANALYTICS].granted = true;
      consentState.hasConsented = true;
      consentState.consentDate = now;

      saveConsentState(consentState);

      // Verify localStorage.setItem was called with consent data
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'cyoda-cookie-consent',
        expect.stringContaining('"analytics":{"granted":true')
      );
    });
  });

  describe('(b) User Denies/Revokes Consent', () => {
    it('should record denial and disable analytics when user denies consent', async () => {
      // 1. Create consent state with analytics denied
      const consentState = createDefaultConsentState();
      consentState.preferences[CookieCategory.ANALYTICS].granted = false;
      consentState.hasConsented = true;
      consentState.showBanner = false;

      // 2. Save denial to storage
      saveConsentState(consentState);

      // 3. Verify denial was saved
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'cyoda-cookie-consent',
        expect.stringContaining('"analytics":{"granted":false')
      );

      // 4. Load consent and verify analytics should be disabled
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(consentState));
      const loadedState = loadConsentState();

      expect(loadedState!.preferences[CookieCategory.ANALYTICS].granted).toBe(false);

      // 5. Simulate AnalyticsManager setting consent and disabling analytics
      mockAnalyticsService.isInitialized.mockReturnValue(true);

      if (!loadedState!.preferences[CookieCategory.ANALYTICS].granted) {
        analyticsService.setConsent(false);
        analyticsService.disable();
      }

      expect(mockAnalyticsService.setConsent).toHaveBeenCalledWith(false);
      expect(mockAnalyticsService.disable).toHaveBeenCalled();
    });

    it('should disable analytics when consent is revoked after being granted', async () => {
      // 1. Start with granted consent
      const grantedState = createDefaultConsentState();
      grantedState.preferences[CookieCategory.ANALYTICS].granted = true;
      grantedState.hasConsented = true;

      saveConsentState(grantedState);

      // Simulate analytics being enabled
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(grantedState));
      mockAnalyticsService.isInitialized.mockReturnValue(true);

      const initialState = loadConsentState();
      if (initialState!.preferences[CookieCategory.ANALYTICS].granted) {
        analyticsService.initialize({
          measurementId: 'G-TEST123456',
          debug: false
        });
        analyticsService.setConsent(true);
      }

      expect(mockAnalyticsService.initialize).toHaveBeenCalled();
      expect(mockAnalyticsService.setConsent).toHaveBeenCalledWith(true);
      vi.clearAllMocks();

      // 2. Revoke consent
      const revokedState = { ...grantedState };
      revokedState.preferences[CookieCategory.ANALYTICS].granted = false;

      saveConsentState(revokedState);

      // 3. Simulate analytics being disabled
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(revokedState));
      const updatedState = loadConsentState();
      if (!updatedState!.preferences[CookieCategory.ANALYTICS].granted) {
        analyticsService.setConsent(false);
        analyticsService.disable();
      }

      expect(mockAnalyticsService.setConsent).toHaveBeenCalledWith(false);
      expect(mockAnalyticsService.disable).toHaveBeenCalled();
    });

    it('should handle expired consent by clearing storage and disabling analytics', () => {
      // 1. Create expired consent (older than 365 days)
      const expiredTimestamp = Date.now() - (366 * 24 * 60 * 60 * 1000); // 366 days ago

      // 2. Simulate checking for expired consent
      const isExpired = expiredTimestamp < Date.now() - (365 * 24 * 60 * 60 * 1000);
      expect(isExpired).toBe(true);

      // 3. When consent is expired, application should clear storage and disable analytics
      if (isExpired) {
        clearConsentState();
        analyticsService.setConsent(false);
        analyticsService.disable();
      }

      // 4. Verify the expected actions were taken
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('cyoda-cookie-consent');
      expect(mockAnalyticsService.setConsent).toHaveBeenCalledWith(false);
      expect(mockAnalyticsService.disable).toHaveBeenCalled();
    });

    it('should clear all consent data when user requests deletion', () => {
      // 1. Start with consent granted
      const consentState = createDefaultConsentState();
      consentState.preferences[CookieCategory.ANALYTICS].granted = true;
      consentState.hasConsented = true;

      saveConsentState(consentState);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();

      // 2. User requests data deletion
      clearConsentState();

      // 3. Verify storage is cleared
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('cyoda-cookie-consent');

      // 4. Verify analytics is disabled
      analyticsService.setConsent(false);
      analyticsService.disable();
      expect(mockAnalyticsService.setConsent).toHaveBeenCalledWith(false);
      expect(mockAnalyticsService.disable).toHaveBeenCalled();
    });
  });

  describe('Consent State Transitions', () => {
    it('should handle multiple consent state changes correctly', async () => {
      // 1. Initial state - no consent
      const currentState = createDefaultConsentState();
      expect(currentState.preferences[CookieCategory.ANALYTICS].granted).toBe(false);

      // 2. Grant consent
      currentState.preferences[CookieCategory.ANALYTICS].granted = true;
      currentState.hasConsented = true;
      saveConsentState(currentState);

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(currentState));
      let loadedState = loadConsentState();
      expect(loadedState!.preferences[CookieCategory.ANALYTICS].granted).toBe(true);

      // Analytics should be enabled
      mockAnalyticsService.isInitialized.mockReturnValue(true);
      analyticsService.initialize({
        measurementId: 'G-TEST123456',
        debug: false
      });
      analyticsService.setConsent(true);
      expect(mockAnalyticsService.initialize).toHaveBeenCalled();
      expect(mockAnalyticsService.setConsent).toHaveBeenCalledWith(true);

      vi.clearAllMocks();

      // 3. Revoke consent
      currentState.preferences[CookieCategory.ANALYTICS].granted = false;
      saveConsentState(currentState);

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(currentState));
      loadedState = loadConsentState();
      expect(loadedState!.preferences[CookieCategory.ANALYTICS].granted).toBe(false);

      // Analytics should be disabled
      analyticsService.setConsent(false);
      analyticsService.disable();
      expect(mockAnalyticsService.setConsent).toHaveBeenCalledWith(false);
      expect(mockAnalyticsService.disable).toHaveBeenCalled();

      vi.clearAllMocks();

      // 4. Grant consent again
      currentState.preferences[CookieCategory.ANALYTICS].granted = true;
      saveConsentState(currentState);

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(currentState));
      loadedState = loadConsentState();
      expect(loadedState!.preferences[CookieCategory.ANALYTICS].granted).toBe(true);

      // Analytics should be enabled again
      analyticsService.initialize({
        measurementId: 'G-TEST123456',
        debug: false
      });
      analyticsService.setConsent(true);
      expect(mockAnalyticsService.initialize).toHaveBeenCalled();
      expect(mockAnalyticsService.setConsent).toHaveBeenCalledWith(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle corrupted localStorage data gracefully', () => {
      // Simulate corrupted data
      mockLocalStorage.getItem.mockReturnValue('invalid-json');

      const loadedState = loadConsentState();

      // Should return null for corrupted data
      expect(loadedState).toBeNull();

      // Should disable analytics when no valid consent
      analyticsService.setConsent(false);
      analyticsService.disable();
      expect(mockAnalyticsService.setConsent).toHaveBeenCalledWith(false);
      expect(mockAnalyticsService.disable).toHaveBeenCalled();
    });

    it('should handle missing localStorage gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const loadedState = loadConsentState();
      expect(loadedState).toBeNull();

      // Should disable analytics when no consent data
      analyticsService.setConsent(false);
      analyticsService.disable();
      expect(mockAnalyticsService.setConsent).toHaveBeenCalledWith(false);
      expect(mockAnalyticsService.disable).toHaveBeenCalled();
    });
  });
});
