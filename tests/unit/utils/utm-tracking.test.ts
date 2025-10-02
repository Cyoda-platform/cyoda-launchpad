import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  captureUtmParameters,
  getUtmParameters,
  clearUtmParameters,
  hasUtmParameters,
  type UtmParameters,
} from '@/utils/utm-tracking';
import { CookieCategory } from '@/types/cookie-consent';
import * as cookieConsentStorage from '@/lib/cookie-consent-storage';

// Mock cookie consent storage
vi.mock('@/lib/cookie-consent-storage');

describe('utm-tracking', () => {
  let mockSessionStorage: Record<string, string>;
  let originalLocation: Location;

  beforeEach(() => {
    // Reset session storage mock
    mockSessionStorage = {};
    
    global.sessionStorage = {
      getItem: vi.fn((key: string) => mockSessionStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockSessionStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockSessionStorage[key];
      }),
      clear: vi.fn(() => {
        mockSessionStorage = {};
      }),
      length: 0,
      key: vi.fn(),
    } as Storage;

    // Save original location
    originalLocation = window.location;
  });

  afterEach(() => {
    // Restore original location
    window.location = originalLocation;
    vi.clearAllMocks();
  });

  // Helper to mock window.location
  function mockLocation(url: string) {
    delete (window as any).location;
    window.location = new URL(url) as any;
  }

  // Helper to mock consent state
  function mockConsent(analyticsGranted: boolean) {
    vi.mocked(cookieConsentStorage.loadConsentState).mockReturnValue({
      preferences: {
        [CookieCategory.ESSENTIAL]: { granted: true, updatedAt: new Date() },
        [CookieCategory.ANALYTICS]: { granted: analyticsGranted, updatedAt: new Date() },
        [CookieCategory.MARKETING]: { granted: false, updatedAt: new Date() },
        [CookieCategory.PERSONALIZATION]: { granted: false, updatedAt: new Date() },
      },
      hasConsented: true,
      consentDate: new Date(),
      version: '1.0.0',
      showBanner: false,
    });
  }

  describe('captureUtmParameters', () => {
    it('should capture UTM parameters from URL when consent granted', () => {
      // Arrange
      mockConsent(true);
      mockLocation('https://example.com/?utm_source=google&utm_medium=cpc&utm_campaign=test');

      // Act
      const result = captureUtmParameters();

      // Assert
      expect(result).toEqual({
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'test',
      });
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'cyoda_utm_params',
        expect.stringContaining('"utm_source":"google"')
      );
    });

    it('should return null when no UTM parameters in URL', () => {
      // Arrange
      mockConsent(true);
      mockLocation('https://example.com/?page=home&ref=email');

      // Act
      const result = captureUtmParameters();

      // Assert
      expect(result).toBeNull();
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });

    it('should return null when analytics consent not granted', () => {
      // Arrange
      mockConsent(false);
      mockLocation('https://example.com/?utm_source=google&utm_medium=cpc');

      // Act
      const result = captureUtmParameters();

      // Assert
      expect(result).toBeNull();
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });

    it('should store data with correct structure including timestamp and version', () => {
      // Arrange
      mockConsent(true);
      mockLocation('https://example.com/?utm_source=facebook');
      const beforeTime = new Date().toISOString();

      // Act
      captureUtmParameters();

      // Assert
      const storedData = JSON.parse(mockSessionStorage['cyoda_utm_params']);
      expect(storedData).toHaveProperty('parameters');
      expect(storedData).toHaveProperty('capturedAt');
      expect(storedData).toHaveProperty('version', '1.0.0');
      expect(storedData.parameters).toEqual({ utm_source: 'facebook' });
      expect(new Date(storedData.capturedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(beforeTime).getTime()
      );
    });

    it('should capture only UTM parameters and ignore other query params', () => {
      // Arrange
      mockConsent(true);
      mockLocation('https://example.com/?utm_source=twitter&page=home&ref=link&utm_medium=social');

      // Act
      const result = captureUtmParameters();

      // Assert
      expect(result).toEqual({
        utm_source: 'twitter',
        utm_medium: 'social',
      });
      expect(result).not.toHaveProperty('page');
      expect(result).not.toHaveProperty('ref');
    });

    it('should handle storage errors gracefully', () => {
      // Arrange
      mockConsent(true);
      mockLocation('https://example.com/?utm_source=google');
      vi.mocked(sessionStorage.setItem).mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      // Act
      const result = captureUtmParameters();

      // Assert
      expect(result).toBeNull();
      // Should not throw error
    });
  });

  describe('getUtmParameters', () => {
    it('should retrieve stored UTM parameters when consent granted', () => {
      // Arrange
      mockConsent(true);
      const storedData = {
        parameters: {
          utm_source: 'google',
          utm_medium: 'cpc',
        },
        capturedAt: new Date().toISOString(),
        version: '1.0.0',
      };
      mockSessionStorage['cyoda_utm_params'] = JSON.stringify(storedData);

      // Act
      const result = getUtmParameters();

      // Assert
      expect(result).toEqual({
        utm_source: 'google',
        utm_medium: 'cpc',
      });
    });

    it('should return null when no data stored', () => {
      // Arrange
      mockConsent(true);

      // Act
      const result = getUtmParameters();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when analytics consent not granted', () => {
      // Arrange
      mockConsent(false);
      mockSessionStorage['cyoda_utm_params'] = JSON.stringify({
        parameters: { utm_source: 'google' },
        capturedAt: new Date().toISOString(),
        version: '1.0.0',
      });

      // Act
      const result = getUtmParameters();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null and clear storage when data is invalid', () => {
      // Arrange
      mockConsent(true);
      mockSessionStorage['cyoda_utm_params'] = JSON.stringify({
        invalid: 'data',
      });

      // Act
      const result = getUtmParameters();

      // Assert
      expect(result).toBeNull();
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('cyoda_utm_params');
    });

    it('should handle malformed JSON gracefully', () => {
      // Arrange
      mockConsent(true);
      mockSessionStorage['cyoda_utm_params'] = 'invalid json {';

      // Act
      const result = getUtmParameters();

      // Assert
      expect(result).toBeNull();
      // Should not throw error
    });
  });

  describe('clearUtmParameters', () => {
    it('should remove UTM data from sessionStorage', () => {
      // Arrange
      mockSessionStorage['cyoda_utm_params'] = JSON.stringify({
        parameters: { utm_source: 'google' },
        capturedAt: new Date().toISOString(),
        version: '1.0.0',
      });

      // Act
      clearUtmParameters();

      // Assert
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('cyoda_utm_params');
      expect(mockSessionStorage['cyoda_utm_params']).toBeUndefined();
    });

    it('should handle storage errors gracefully', () => {
      // Arrange
      vi.mocked(sessionStorage.removeItem).mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Act & Assert
      expect(() => clearUtmParameters()).not.toThrow();
    });
  });

  describe('hasUtmParameters', () => {
    it('should return true when valid parameters stored and consent granted', () => {
      // Arrange
      mockConsent(true);
      mockSessionStorage['cyoda_utm_params'] = JSON.stringify({
        parameters: { utm_source: 'google' },
        capturedAt: new Date().toISOString(),
        version: '1.0.0',
      });

      // Act
      const result = hasUtmParameters();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when no parameters stored', () => {
      // Arrange
      mockConsent(true);

      // Act
      const result = hasUtmParameters();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when analytics consent not granted', () => {
      // Arrange
      mockConsent(false);
      mockSessionStorage['cyoda_utm_params'] = JSON.stringify({
        parameters: { utm_source: 'google' },
        capturedAt: new Date().toISOString(),
        version: '1.0.0',
      });

      // Act
      const result = hasUtmParameters();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when stored data is invalid', () => {
      // Arrange
      mockConsent(true);
      mockSessionStorage['cyoda_utm_params'] = JSON.stringify({
        invalid: 'structure',
      });

      // Act
      const result = hasUtmParameters();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Integration', () => {
    it('should capture and retrieve UTM parameters in full flow', () => {
      // Arrange
      mockConsent(true);
      mockLocation('https://example.com/?utm_source=google&utm_medium=cpc&utm_campaign=test');

      // Act - Capture
      const captured = captureUtmParameters();

      // Assert - Capture
      expect(captured).toEqual({
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'test',
      });

      // Act - Check
      expect(hasUtmParameters()).toBe(true);

      // Act - Retrieve
      const retrieved = getUtmParameters();

      // Assert - Retrieve
      expect(retrieved).toEqual(captured);

      // Act - Clear
      clearUtmParameters();

      // Assert - Clear
      expect(hasUtmParameters()).toBe(false);
      expect(getUtmParameters()).toBeNull();
    });

    it('should not overwrite existing parameters when URL has no UTM params', () => {
      // Arrange
      mockConsent(true);

      // First visit with UTM parameters
      mockLocation('https://example.com/?utm_source=google&utm_medium=cpc');
      captureUtmParameters();

      const firstCapture = getUtmParameters();

      // Second visit without UTM parameters
      mockLocation('https://example.com/?page=about');
      captureUtmParameters();

      // Assert - Original parameters should still be there
      const secondRetrieve = getUtmParameters();
      expect(secondRetrieve).toEqual(firstCapture);
    });
  });
});