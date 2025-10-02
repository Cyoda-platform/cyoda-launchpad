import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { trackCta, trackCtaConversion, type CtaParams } from '@/utils/analytics';
import * as analyticsLib from '@/lib/analytics';
import * as conversionTracking from '@/utils/conversion-tracking';

// Mock dependencies
vi.mock('@/lib/analytics');
vi.mock('@/utils/utm-tracking');
vi.mock('@/utils/conversion-tracking');

describe('analytics utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('trackCta', () => {
    it('should call analyticsService.trackEvent with cta_click event name', () => {
      // Arrange
      const params: CtaParams = {
        location: 'hero',
        page_variant: 'home',
        cta: 'try_now',
        label: 'Get Started',
        url: 'https://ai.cyoda.net',
      };

      // Act
      trackCta(params);

      // Assert
      expect(analyticsLib.analyticsService.trackEvent).toHaveBeenCalledWith('cta_click', params);
      expect(analyticsLib.analyticsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('should work with minimal required parameters', () => {
      // Arrange
      const params: CtaParams = {
        location: 'header',
        page_variant: 'dev',
        cta: 'github_repo',
      };

      // Act
      trackCta(params);

      // Assert
      expect(analyticsLib.analyticsService.trackEvent).toHaveBeenCalledWith('cta_click', params);
    });

    it('should pass through optional UTM parameters if provided', () => {
      // Arrange
      const params: CtaParams = {
        location: 'footer',
        page_variant: 'cto',
        cta: 'talk_to_sales',
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'spring-sale',
      };

      // Act
      trackCta(params);

      // Assert
      expect(analyticsLib.analyticsService.trackEvent).toHaveBeenCalledWith('cta_click', params);
    });

    it('should maintain backward compatibility with existing calls', () => {
      // Arrange - old-style call without UTM parameters
      const params: CtaParams = {
        location: 'nav',
        page_variant: 'home',
        cta: 'documentation',
        label: 'View Docs',
      };

      // Act
      trackCta(params);

      // Assert
      expect(analyticsLib.analyticsService.trackEvent).toHaveBeenCalledWith('cta_click', params);
    });
  });

  describe('trackCtaConversion', () => {
    beforeEach(() => {
      // Mock isAiCyodaNetDestination to return true for ai.cyoda.net URLs
      vi.mocked(conversionTracking.isAiCyodaNetDestination).mockImplementation((url: string) => {
        return url.includes('ai.cyoda.net');
      });
    });

    it('should use trackAdConversion for ai.cyoda.net destinations', () => {
      // Arrange
      const params: CtaParams = {
        location: 'hero',
        page_variant: 'home',
        cta: 'try_now',
        label: 'Try CYODA Now',
        url: 'https://ai.cyoda.net',
      };

      // Act
      trackCtaConversion(params);

      // Assert
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
      expect(analyticsLib.analyticsService.trackConversion).not.toHaveBeenCalled();
    });

    it('should use standard tracking for non-ai.cyoda.net destinations', () => {
      // Arrange
      const params: CtaParams = {
        location: 'cta_section',
        page_variant: 'cto',
        cta: 'talk_to_sales',
        label: 'Schedule Demo',
        url: 'https://calendly.com/cyoda/demo',
      };

      // Act
      trackCtaConversion(params);

      // Assert
      expect(conversionTracking.trackAdConversion).not.toHaveBeenCalled();
      expect(analyticsLib.analyticsService.trackConversion).toHaveBeenCalledWith(
        'talk_to_sales',
        'https://calendly.com/cyoda/demo',
        expect.objectContaining({
          location: 'cta_section',
          page_variant: 'cto',
          cta: 'talk_to_sales',
          label: 'Schedule Demo',
          url: 'https://calendly.com/cyoda/demo',
        })
      );
    });

    it('should use cta as destination when url is not provided', () => {
      // Arrange
      const params: CtaParams = {
        location: 'cta_section',
        page_variant: 'cto',
        cta: 'talk_to_sales',
      };

      // Act
      trackCtaConversion(params);

      // Assert
      expect(analyticsLib.analyticsService.trackConversion).toHaveBeenCalledWith(
        'talk_to_sales', // conversionType
        'talk_to_sales', // destination (fallback to cta)
        expect.objectContaining({
          location: 'cta_section',
          page_variant: 'cto',
          cta: 'talk_to_sales',
        })
      );
    });

    it('should include optional label when provided', () => {
      // Arrange
      const params: CtaParams = {
        location: 'footer',
        page_variant: 'dev',
        cta: 'contact_us',
        label: 'Get in Touch',
        url: 'https://example.com/contact',
      };

      // Act
      trackCtaConversion(params);

      // Assert
      expect(analyticsLib.analyticsService.trackConversion).toHaveBeenCalledWith(
        'contact_us',
        'https://example.com/contact',
        expect.objectContaining({
          label: 'Get in Touch',
        })
      );
    });

    it('should pass through explicitly provided UTM parameters for ai.cyoda.net', () => {
      // Arrange
      const params: CtaParams = {
        location: 'hero',
        page_variant: 'home',
        cta: 'try_now',
        url: 'https://ai.cyoda.net',
        utm_source: 'linkedin',
        utm_medium: 'social',
        utm_campaign: 'product-launch',
        utm_term: 'data-platform',
        utm_content: 'hero-cta',
      };

      // Act
      trackCtaConversion(params);

      // Assert - should use trackAdConversion with explicit UTM params
      expect(conversionTracking.trackAdConversion).toHaveBeenCalledWith(
        {
          location: 'hero',
          page_variant: 'home',
          cta: 'try_now',
          destination: 'https://ai.cyoda.net',
        },
        {
          utm_source: 'linkedin',
          utm_medium: 'social',
          utm_campaign: 'product-launch',
          utm_term: 'data-platform',
          utm_content: 'hero-cta',
        }
      );
      expect(analyticsLib.analyticsService.trackConversion).not.toHaveBeenCalled();
    });

    it('should only include UTM parameters that are provided', () => {
      // Arrange
      const params: CtaParams = {
        location: 'header',
        page_variant: 'cto',
        cta: 'demo_request',
        url: 'https://example.com/demo',
        utm_source: 'twitter',
        utm_campaign: 'awareness',
        // utm_medium, utm_term, utm_content not provided
      };

      // Act
      trackCtaConversion(params);

      // Assert
      const callArgs = vi.mocked(analyticsLib.analyticsService.trackConversion).mock.calls[0];
      const additionalParams = callArgs[2] as Record<string, unknown>;
      
      expect(additionalParams).toHaveProperty('utm_source', 'twitter');
      expect(additionalParams).toHaveProperty('utm_campaign', 'awareness');
      expect(additionalParams).not.toHaveProperty('utm_medium');
      expect(additionalParams).not.toHaveProperty('utm_term');
      expect(additionalParams).not.toHaveProperty('utm_content');
    });

    it('should work with minimal required parameters', () => {
      // Arrange
      const params: CtaParams = {
        location: 'nav',
        page_variant: 'home',
        cta: 'signup',
      };

      // Act
      trackCtaConversion(params);

      // Assert
      expect(analyticsLib.analyticsService.trackConversion).toHaveBeenCalledWith(
        'signup',
        'signup',
        expect.objectContaining({
          location: 'nav',
          page_variant: 'home',
          cta: 'signup',
        })
      );
    });

    it('should not include label or url in additionalParams if not provided', () => {
      // Arrange
      const params: CtaParams = {
        location: 'header_mobile',
        page_variant: 'dev',
        cta: 'learn_more',
      };

      // Act
      trackCtaConversion(params);

      // Assert
      const callArgs = vi.mocked(analyticsLib.analyticsService.trackConversion).mock.calls[0];
      const additionalParams = callArgs[2] as Record<string, unknown>;
      
      expect(additionalParams).not.toHaveProperty('label');
      expect(additionalParams).not.toHaveProperty('url');
    });
  });

  describe('CtaParams type', () => {
    it('should accept all location types', () => {
      // This is a compile-time test - if it compiles, the test passes
      const locations: CtaParams['location'][] = [
        'header',
        'header_mobile',
        'hero',
        'cta_section',
        'footer',
        'nav',
      ];

      expect(locations).toHaveLength(6);
    });

    it('should accept all page_variant types', () => {
      // This is a compile-time test - if it compiles, the test passes
      const variants: CtaParams['page_variant'][] = ['dev', 'cto', 'home'];

      expect(variants).toHaveLength(3);
    });
  });
});

