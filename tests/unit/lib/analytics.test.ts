/**
 * Tests for Analytics Service with UTM Parameter Integration
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import ReactGA from 'react-ga4';
import { analyticsService } from '@/lib/analytics';
import * as utmTracking from '@/utils/utm-tracking';

// Mock react-ga4
vi.mock('react-ga4', () => ({
  default: {
    initialize: vi.fn(),
    gtag: vi.fn(),
    send: vi.fn(),
    event: vi.fn(),
  },
}));

// Mock utm-tracking utilities
vi.mock('@/utils/utm-tracking', () => ({
  getUtmParameters: vi.fn(),
}));

describe('Analytics Service with UTM Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the service state by creating a new instance
    // Since it's a singleton, we need to reset its internal state
    (analyticsService as any).initialized = false;
    (analyticsService as any).consentGranted = false;
    (analyticsService as any).measurementId = null;
    (analyticsService as any).debug = false;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('trackEvent with UTM parameters', () => {
    beforeEach(() => {
      analyticsService.initialize({ measurementId: 'G-TEST123', debug: true });
      analyticsService.setConsent(true);
      vi.clearAllMocks(); // Clear initialization calls
    });

    it('should include UTM parameters when available', () => {
      // Arrange
      const mockUtmParams = {
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'test-campaign',
      };
      vi.mocked(utmTracking.getUtmParameters).mockReturnValue(mockUtmParams);

      // Act
      analyticsService.trackEvent('button_click', { button_id: 'cta-1' });

      // Assert
      expect(ReactGA.event).toHaveBeenCalledWith('button_click', {
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'test-campaign',
        button_id: 'cta-1',
      });
    });

    it('should not overwrite explicit parameters with UTM parameters', () => {
      // Arrange
      const mockUtmParams = {
        utm_source: 'google',
        utm_medium: 'cpc',
      };
      vi.mocked(utmTracking.getUtmParameters).mockReturnValue(mockUtmParams);

      // Act - Provide explicit utm_source that should take precedence
      analyticsService.trackEvent('button_click', {
        utm_source: 'explicit-source',
        button_id: 'cta-1',
      });

      // Assert - Explicit parameter should override UTM parameter
      expect(ReactGA.event).toHaveBeenCalledWith('button_click', {
        utm_source: 'explicit-source',
        utm_medium: 'cpc',
        button_id: 'cta-1',
      });
    });

    it('should work without UTM parameters', () => {
      // Arrange
      vi.mocked(utmTracking.getUtmParameters).mockReturnValue(null);

      // Act
      analyticsService.trackEvent('button_click', { button_id: 'cta-1' });

      // Assert
      expect(ReactGA.event).toHaveBeenCalledWith('button_click', {
        button_id: 'cta-1',
      });
    });

    it('should respect consent checking', () => {
      // Arrange
      analyticsService.setConsent(false);
      vi.mocked(utmTracking.getUtmParameters).mockReturnValue({
        utm_source: 'google',
      });

      // Act
      analyticsService.trackEvent('button_click');

      // Assert
      expect(ReactGA.event).not.toHaveBeenCalled();
    });
  });

  describe('trackConversion', () => {
    beforeEach(() => {
      analyticsService.initialize({ measurementId: 'G-TEST123', debug: true });
      analyticsService.setConsent(true);
      vi.clearAllMocks();
    });

    it('should track conversion with UTM parameters', () => {
      // Arrange
      const mockUtmParams = {
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'test-campaign',
      };
      vi.mocked(utmTracking.getUtmParameters).mockReturnValue(mockUtmParams);

      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: {
          href: 'https://example.com/page',
          pathname: '/page',
        },
        writable: true,
      });

      // Act
      analyticsService.trackConversion('signup', 'dashboard', { user_type: 'premium' });

      // Assert
      expect(ReactGA.event).toHaveBeenCalledWith('conversion', expect.objectContaining({
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'test-campaign',
        conversion_type: 'signup',
        destination: 'dashboard',
        user_type: 'premium',
        page_location: 'https://example.com/page',
        page_path: '/page',
        timestamp: expect.any(String),
      }));
    });

    it('should track conversion without UTM parameters', () => {
      // Arrange
      vi.mocked(utmTracking.getUtmParameters).mockReturnValue(null);

      // Act
      analyticsService.trackConversion('signup', 'dashboard');

      // Assert
      expect(ReactGA.event).toHaveBeenCalledWith('conversion', expect.objectContaining({
        conversion_type: 'signup',
        destination: 'dashboard',
      }));
      expect(ReactGA.event).toHaveBeenCalledWith('conversion', expect.not.objectContaining({
        utm_source: expect.anything(),
      }));
    });

    it('should respect consent checking', () => {
      // Arrange
      analyticsService.setConsent(false);

      // Act
      analyticsService.trackConversion('signup', 'dashboard');

      // Assert
      expect(ReactGA.event).not.toHaveBeenCalled();
    });
  });

  describe('trackLandingPageView', () => {
    beforeEach(() => {
      analyticsService.initialize({ measurementId: 'G-TEST123', debug: true });
      analyticsService.setConsent(true);
      vi.clearAllMocks();
    });

    it('should track landing page view with UTM parameters', () => {
      // Arrange
      const mockUtmParams = {
        utm_source: 'google',
        utm_medium: 'cpc',
      };
      vi.mocked(utmTracking.getUtmParameters).mockReturnValue(mockUtmParams);

      // Mock document.referrer
      Object.defineProperty(document, 'referrer', {
        value: 'https://google.com',
        writable: true,
      });

      // Act
      analyticsService.trackLandingPageView('/landing', 'Landing Page');

      // Assert
      expect(ReactGA.send).toHaveBeenCalledWith({
        hitType: 'pageview',
        page_location: '/landing',
        page_title: 'Landing Page',
        referrer: 'https://google.com',
        utm_source: 'google',
        utm_medium: 'cpc',
        is_landing_page: true,
      });
    });

    it('should track landing page view without UTM parameters', () => {
      // Arrange
      vi.mocked(utmTracking.getUtmParameters).mockReturnValue(null);

      // Mock document.referrer as empty
      Object.defineProperty(document, 'referrer', {
        value: '',
        writable: true,
      });

      // Act
      analyticsService.trackLandingPageView('/landing', 'Landing Page');

      // Assert
      expect(ReactGA.send).toHaveBeenCalledWith({
        hitType: 'pageview',
        page_location: '/landing',
        page_title: 'Landing Page',
      });
      expect(ReactGA.send).toHaveBeenCalledWith(expect.not.objectContaining({
        is_landing_page: expect.anything(),
      }));
    });

    it('should respect consent checking', () => {
      // Arrange
      analyticsService.setConsent(false);

      // Act
      analyticsService.trackLandingPageView('/landing');

      // Assert
      expect(ReactGA.send).not.toHaveBeenCalled();
    });
  });

  describe('trackPageView with UTM parameters', () => {
    beforeEach(() => {
      analyticsService.initialize({ measurementId: 'G-TEST123', debug: true });
      analyticsService.setConsent(true);
      vi.clearAllMocks();
    });

    it('should include UTM parameters in page view', () => {
      // Arrange
      const mockUtmParams = {
        utm_source: 'facebook',
        utm_campaign: 'social-campaign',
      };
      vi.mocked(utmTracking.getUtmParameters).mockReturnValue(mockUtmParams);

      // Act
      analyticsService.trackPageView('/page', 'Test Page');

      // Assert
      expect(ReactGA.send).toHaveBeenCalledWith({
        hitType: 'pageview',
        page_location: '/page',
        page_title: 'Test Page',
        utm_source: 'facebook',
        utm_campaign: 'social-campaign',
      });
    });

    it('should work without UTM parameters', () => {
      // Arrange
      vi.mocked(utmTracking.getUtmParameters).mockReturnValue(null);

      // Act
      analyticsService.trackPageView('/page', 'Test Page');

      // Assert
      expect(ReactGA.send).toHaveBeenCalledWith({
        hitType: 'pageview',
        page_location: '/page',
        page_title: 'Test Page',
      });
    });
  });
});

