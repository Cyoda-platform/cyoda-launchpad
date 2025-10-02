import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  trackAdConversion,
  calculateTimeToConversion,
  getConversionContext,
  isAiCyodaNetDestination,
  type AdConversionParams,
} from '@/utils/conversion-tracking';
import * as analyticsLib from '@/lib/analytics';
import * as utmTracking from '@/utils/utm-tracking';

// Mock dependencies
vi.mock('@/lib/analytics');
vi.mock('@/utils/utm-tracking');

describe('conversion-tracking', () => {
  // Mock sessionStorage
  let mockSessionStorage: Record<string, string> = {};

  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionStorage = {};

    // Mock sessionStorage
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

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://example.com/test',
        pathname: '/test',
      },
      writable: true,
    });

    // Mock document
    Object.defineProperty(document, 'title', {
      value: 'Test Page',
      writable: true,
    });

    Object.defineProperty(document, 'referrer', {
      value: 'https://google.com',
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isAiCyodaNetDestination', () => {
    it('should return true for ai.cyoda.net URLs', () => {
      expect(isAiCyodaNetDestination('https://ai.cyoda.net')).toBe(true);
      expect(isAiCyodaNetDestination('https://ai.cyoda.net/')).toBe(true);
      expect(isAiCyodaNetDestination('https://ai.cyoda.net/signup')).toBe(true);
      expect(isAiCyodaNetDestination('https://ai.cyoda.net/path?query=value')).toBe(true);
    });

    it('should return false for non-ai.cyoda.net URLs', () => {
      expect(isAiCyodaNetDestination('https://cyoda.net')).toBe(false);
      expect(isAiCyodaNetDestination('https://www.cyoda.net')).toBe(false);
      expect(isAiCyodaNetDestination('https://github.com/cyoda')).toBe(false);
      expect(isAiCyodaNetDestination('https://example.com')).toBe(false);
    });

    it('should return false for invalid URLs', () => {
      expect(isAiCyodaNetDestination('not-a-url')).toBe(false);
      expect(isAiCyodaNetDestination('')).toBe(false);
      expect(isAiCyodaNetDestination('javascript:alert(1)')).toBe(false);
    });
  });

  describe('calculateTimeToConversion', () => {
    it('should calculate time difference in seconds when UTM data exists', () => {
      // Arrange
      const capturedTime = new Date('2024-01-01T12:00:00Z');
      const currentTime = new Date('2024-01-01T12:05:30Z'); // 5 minutes 30 seconds later

      mockSessionStorage['cyoda_utm_params'] = JSON.stringify({
        parameters: { utm_source: 'google' },
        capturedAt: capturedTime.toISOString(),
        version: '1.0.0',
      });

      // Mock Date constructor to return our test time
      vi.useFakeTimers();
      vi.setSystemTime(currentTime);

      // Act
      const result = calculateTimeToConversion();

      // Assert
      expect(result).toBe(330); // 5 minutes 30 seconds = 330 seconds

      // Cleanup
      vi.useRealTimers();
    });

    it('should return null when no UTM data exists', () => {
      // Act
      const result = calculateTimeToConversion();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when UTM data is invalid', () => {
      // Arrange
      mockSessionStorage['cyoda_utm_params'] = JSON.stringify({
        parameters: { utm_source: 'google' },
        // Missing capturedAt
        version: '1.0.0',
      });

      // Act
      const result = calculateTimeToConversion();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when sessionStorage data is malformed', () => {
      // Arrange
      mockSessionStorage['cyoda_utm_params'] = 'invalid-json';

      // Act
      const result = calculateTimeToConversion();

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('getConversionContext', () => {
    it('should return conversion context with UTM parameters present', () => {
      // Arrange
      vi.mocked(utmTracking.getUtmParameters).mockReturnValue({
        utm_source: 'google',
        utm_medium: 'cpc',
      });

      // Act
      const result = getConversionContext('home');

      // Assert
      expect(result).toEqual({
        page_path: '/test',
        page_title: 'Test Page',
        page_variant: 'home',
        referrer: 'https://google.com',
        is_direct_conversion: true,
        page_location: 'https://example.com/test',
      });
    });

    it('should return conversion context without UTM parameters', () => {
      // Arrange
      vi.mocked(utmTracking.getUtmParameters).mockReturnValue(null);

      // Act
      const result = getConversionContext('dev');

      // Assert
      expect(result).toEqual({
        page_path: '/test',
        page_title: 'Test Page',
        page_variant: 'dev',
        referrer: 'https://google.com',
        is_direct_conversion: false,
        page_location: 'https://example.com/test',
      });
    });

    it('should handle empty referrer', () => {
      // Arrange
      Object.defineProperty(document, 'referrer', {
        value: '',
        writable: true,
      });
      vi.mocked(utmTracking.getUtmParameters).mockReturnValue(null);

      // Act
      const result = getConversionContext('cto');

      // Assert
      expect(result.referrer).toBeUndefined();
    });
  });

  describe('trackAdConversion', () => {
    it('should track conversion with complete data when UTM parameters exist', () => {
      // Arrange
      const capturedTime = new Date('2024-01-01T12:00:00Z');
      const currentTime = new Date('2024-01-01T12:05:00Z');

      mockSessionStorage['cyoda_utm_params'] = JSON.stringify({
        parameters: {
          utm_source: 'google',
          utm_medium: 'cpc',
          utm_campaign: 'spring_sale',
        },
        capturedAt: capturedTime.toISOString(),
        version: '1.0.0',
      });

      vi.mocked(utmTracking.getUtmParameters).mockReturnValue({
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'spring_sale',
      });

      // Mock Date using fake timers
      vi.useFakeTimers();
      vi.setSystemTime(currentTime);

      const params: AdConversionParams = {
        location: 'hero',
        page_variant: 'home',
        cta: 'try_now',
        destination: 'https://ai.cyoda.net',
        label: 'Try CYODA Now',
      };

      // Act
      trackAdConversion(params);

      // Assert
      expect(analyticsLib.analyticsService.trackConversion).toHaveBeenCalledWith(
        'try_now',
        'https://ai.cyoda.net',
        expect.objectContaining({
          utm_source: 'google',
          utm_medium: 'cpc',
          utm_campaign: 'spring_sale',
          location: 'hero',
          page_variant: 'home',
          cta: 'try_now',
          label: 'Try CYODA Now',
          destination: 'https://ai.cyoda.net',
          time_to_conversion: 300, // 5 minutes
          page_path: '/test',
          page_title: 'Test Page',
          page_location: 'https://example.com/test',
          referrer: 'https://google.com',
          is_direct_conversion: true,
          timestamp: currentTime.toISOString(),
        })
      );

      // Cleanup
      vi.useRealTimers();
    });

    it('should track conversion without UTM parameters', () => {
      // Arrange
      vi.mocked(utmTracking.getUtmParameters).mockReturnValue(null);

      const params: AdConversionParams = {
        location: 'pricing_card',
        page_variant: 'pricing',
        cta: 'get_started',
        destination: 'https://ai.cyoda.net/signup',
      };

      // Act
      trackAdConversion(params);

      // Assert
      expect(analyticsLib.analyticsService.trackConversion).toHaveBeenCalledWith(
        'get_started',
        'https://ai.cyoda.net/signup',
        expect.objectContaining({
          location: 'pricing_card',
          page_variant: 'pricing',
          cta: 'get_started',
          destination: 'https://ai.cyoda.net/signup',
          time_to_conversion: null,
          is_direct_conversion: false,
        })
      );
    });

    it('should not include label if not provided', () => {
      // Arrange
      vi.mocked(utmTracking.getUtmParameters).mockReturnValue(null);

      const params: AdConversionParams = {
        location: 'footer',
        page_variant: 'home',
        cta: 'try_now',
        destination: 'https://ai.cyoda.net',
      };

      // Act
      trackAdConversion(params);

      // Assert
      const callArgs = vi.mocked(analyticsLib.analyticsService.trackConversion).mock.calls[0];
      expect(callArgs[2]).not.toHaveProperty('label');
    });
  });
});

