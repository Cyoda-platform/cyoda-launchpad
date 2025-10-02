/**
 * Integration Tests: UTM Conversion Flow
 * 
 * These tests verify the complete end-to-end flow of UTM tracking and conversion:
 * 1. User lands with UTM parameters
 * 2. UTM parameters are captured and stored
 * 3. User navigates the site (UTM parameters persist)
 * 4. User clicks a conversion CTA
 * 5. Conversion is tracked with complete attribution data
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { captureUtmParameters, getUtmParameters, clearUtmParameters } from '@/utils/utm-tracking';
import { trackCtaConversion } from '@/utils/analytics';
import { CookieCategory } from '@/types/cookie-consent';
import * as cookieConsentStorage from '@/lib/cookie-consent-storage';
import * as analyticsLib from '@/lib/analytics';
import * as conversionTracking from '@/utils/conversion-tracking';

// Mock dependencies
vi.mock('@/lib/cookie-consent-storage');
vi.mock('@/lib/analytics');
vi.mock('@/utils/conversion-tracking', async () => {
  const actual = await vi.importActual('@/utils/conversion-tracking');
  return {
    ...actual,
    trackAdConversion: vi.fn(),
  };
});

describe('UTM Conversion Flow Integration', () => {
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

    // Mock analytics consent as granted
    vi.mocked(cookieConsentStorage.loadConsentState).mockReturnValue({
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      preferences: {
        [CookieCategory.ESSENTIAL]: { granted: true, timestamp: new Date().toISOString() },
        [CookieCategory.ANALYTICS]: { granted: true, timestamp: new Date().toISOString() },
        [CookieCategory.MARKETING]: { granted: false, timestamp: new Date().toISOString() },
        [CookieCategory.PERSONALIZATION]: { granted: false, timestamp: new Date().toISOString() },
      },
    });

    // Mock analytics service
    vi.mocked(analyticsLib.analyticsService.trackEvent).mockImplementation(() => {});
    vi.mocked(analyticsLib.analyticsService.trackConversion).mockImplementation(() => {});
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

  describe('Complete Conversion Flow', () => {
    it('should capture UTM parameters on landing and include them in conversion', () => {
      // STEP 1: User lands with UTM parameters
      mockLocation('https://example.com/?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale');

      // STEP 2: Capture UTM parameters (simulates useUtmTracking hook)
      const capturedParams = captureUtmParameters();

      // Verify capture
      expect(capturedParams).toEqual({
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'spring_sale',
      });

      // Verify storage
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'cyoda_utm_params',
        expect.stringContaining('"utm_source":"google"')
      );

      // STEP 3: User navigates (UTM parameters should persist)
      const retrievedParams = getUtmParameters();
      expect(retrievedParams).toEqual({
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'spring_sale',
      });

      // STEP 4: User clicks a conversion CTA
      trackCtaConversion({
        location: 'hero',
        page_variant: 'home',
        cta: 'try_now',
        url: 'https://ai.cyoda.net',
      });

      // STEP 5: Verify conversion was tracked
      // Note: trackCtaConversion calls trackAdConversion for ai.cyoda.net URLs
      expect(conversionTracking.trackAdConversion).toHaveBeenCalledWith(
        expect.objectContaining({
          location: 'hero',
          page_variant: 'home',
          cta: 'try_now',
          destination: 'https://ai.cyoda.net',
        }),
        {} // empty explicit UTM params (will use stored params)
      );
    });

    it('should persist UTM parameters across page navigation', () => {
      // STEP 1: Land with UTM parameters
      mockLocation('https://example.com/?utm_source=linkedin&utm_medium=social&utm_campaign=product_launch');
      captureUtmParameters();

      // STEP 2: Navigate to different page (no UTM in URL)
      mockLocation('https://example.com/dev');
      
      // STEP 3: Verify UTM parameters still available
      const params = getUtmParameters();
      expect(params).toEqual({
        utm_source: 'linkedin',
        utm_medium: 'social',
        utm_campaign: 'product_launch',
      });

      // STEP 4: Navigate to another page
      mockLocation('https://example.com/cto');
      
      // STEP 5: Verify UTM parameters still available
      const paramsAfterSecondNav = getUtmParameters();
      expect(paramsAfterSecondNav).toEqual({
        utm_source: 'linkedin',
        utm_medium: 'social',
        utm_campaign: 'product_launch',
      });
    });

    it('should include correct attribution data in conversion events', () => {
      // STEP 1: Land with full UTM parameters
      mockLocation('https://example.com/?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_term=data_platform&utm_content=hero_cta');
      captureUtmParameters();

      // STEP 2: Track conversion
      trackCtaConversion({
        location: 'hero',
        page_variant: 'home',
        cta: 'try_now',
        label: 'Try CYODA Now',
        url: 'https://ai.cyoda.net',
      });

      // STEP 3: Verify trackAdConversion was called with correct params
      expect(conversionTracking.trackAdConversion).toHaveBeenCalledWith(
        {
          location: 'hero',
          page_variant: 'home',
          cta: 'try_now',
          destination: 'https://ai.cyoda.net',
          label: 'Try CYODA Now',
        },
        {} // empty explicit UTM params
      );
    });

    it('should handle conversions without UTM parameters', () => {
      // STEP 1: Land without UTM parameters
      mockLocation('https://example.com/');
      captureUtmParameters();

      // STEP 2: Verify no UTM parameters captured
      const params = getUtmParameters();
      expect(params).toBeNull();

      // STEP 3: Track conversion anyway
      trackCtaConversion({
        location: 'hero',
        page_variant: 'home',
        cta: 'try_now',
        url: 'https://ai.cyoda.net',
      });

      // STEP 4: Verify conversion was still tracked (just without UTM data)
      expect(conversionTracking.trackAdConversion).toHaveBeenCalledWith(
        expect.objectContaining({
          location: 'hero',
          page_variant: 'home',
          cta: 'try_now',
          destination: 'https://ai.cyoda.net',
        }),
        {}
      );
    });
  });

  describe('Cookie Consent Blocking', () => {
    it('should not capture UTM parameters without analytics consent', () => {
      // STEP 1: Mock consent as denied
      vi.mocked(cookieConsentStorage.loadConsentState).mockReturnValue({
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        preferences: {
          [CookieCategory.ESSENTIAL]: { granted: true, timestamp: new Date().toISOString() },
          [CookieCategory.ANALYTICS]: { granted: false, timestamp: new Date().toISOString() },
          [CookieCategory.MARKETING]: { granted: false, timestamp: new Date().toISOString() },
          [CookieCategory.PERSONALIZATION]: { granted: false, timestamp: new Date().toISOString() },
        },
      });

      // STEP 2: Try to capture UTM parameters
      mockLocation('https://example.com/?utm_source=google&utm_medium=cpc');
      const result = captureUtmParameters();

      // STEP 3: Verify capture was blocked
      expect(result).toBeNull();
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });

    it('should not retrieve UTM parameters without analytics consent', () => {
      // STEP 1: Capture with consent
      mockLocation('https://example.com/?utm_source=google&utm_medium=cpc');
      captureUtmParameters();

      // STEP 2: Revoke consent
      vi.mocked(cookieConsentStorage.loadConsentState).mockReturnValue({
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        preferences: {
          [CookieCategory.ESSENTIAL]: { granted: true, timestamp: new Date().toISOString() },
          [CookieCategory.ANALYTICS]: { granted: false, timestamp: new Date().toISOString() },
          [CookieCategory.MARKETING]: { granted: false, timestamp: new Date().toISOString() },
          [CookieCategory.PERSONALIZATION]: { granted: false, timestamp: new Date().toISOString() },
        },
      });

      // STEP 3: Try to retrieve
      const result = getUtmParameters();

      // STEP 4: Verify retrieval was blocked
      expect(result).toBeNull();
    });

    it('should capture UTM parameters when consent is granted after page load', () => {
      // STEP 1: Land with UTM parameters but no consent
      mockLocation('https://example.com/?utm_source=google&utm_medium=cpc');
      
      vi.mocked(cookieConsentStorage.loadConsentState).mockReturnValue({
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        preferences: {
          [CookieCategory.ESSENTIAL]: { granted: true, timestamp: new Date().toISOString() },
          [CookieCategory.ANALYTICS]: { granted: false, timestamp: new Date().toISOString() },
          [CookieCategory.MARKETING]: { granted: false, timestamp: new Date().toISOString() },
          [CookieCategory.PERSONALIZATION]: { granted: false, timestamp: new Date().toISOString() },
        },
      });

      const resultWithoutConsent = captureUtmParameters();
      expect(resultWithoutConsent).toBeNull();

      // STEP 2: Grant consent
      vi.mocked(cookieConsentStorage.loadConsentState).mockReturnValue({
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        preferences: {
          [CookieCategory.ESSENTIAL]: { granted: true, timestamp: new Date().toISOString() },
          [CookieCategory.ANALYTICS]: { granted: true, timestamp: new Date().toISOString() },
          [CookieCategory.MARKETING]: { granted: false, timestamp: new Date().toISOString() },
          [CookieCategory.PERSONALIZATION]: { granted: false, timestamp: new Date().toISOString() },
        },
      });

      // STEP 3: Capture again (simulates consent change handler)
      const resultWithConsent = captureUtmParameters();

      // STEP 4: Verify capture succeeded
      expect(resultWithConsent).toEqual({
        utm_source: 'google',
        utm_medium: 'cpc',
      });
    });
  });

  describe('Session Lifecycle', () => {
    it('should clear UTM parameters when explicitly cleared', () => {
      // STEP 1: Capture UTM parameters
      mockLocation('https://example.com/?utm_source=google&utm_medium=cpc');
      captureUtmParameters();

      // STEP 2: Verify parameters exist
      expect(getUtmParameters()).not.toBeNull();

      // STEP 3: Clear parameters
      clearUtmParameters();

      // STEP 4: Verify parameters are gone
      expect(getUtmParameters()).toBeNull();
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('cyoda_utm_params');
    });

    it('should overwrite UTM parameters when landing with new UTM values', () => {
      // STEP 1: First landing
      mockLocation('https://example.com/?utm_source=google&utm_medium=cpc');
      captureUtmParameters();

      // STEP 2: Second landing with different UTM parameters
      mockLocation('https://example.com/?utm_source=linkedin&utm_medium=social&utm_campaign=new_campaign');
      captureUtmParameters();

      // STEP 3: Verify new parameters replaced old ones
      const params = getUtmParameters();
      expect(params).toEqual({
        utm_source: 'linkedin',
        utm_medium: 'social',
        utm_campaign: 'new_campaign',
      });
    });
  });
});

