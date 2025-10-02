import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { AnalyticsManager } from '@/components/AnalyticsManager';

// Get the actual measurement ID from the test environment
// This is set in tests/setup.ts via vi.stubGlobal
const testMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Mock the analytics service
vi.mock('@/lib/analytics', () => {
  const mockAnalyticsService = {
    initialize: vi.fn(),
    isInitialized: vi.fn(() => false),
    trackEvent: vi.fn(),
    trackPageView: vi.fn(),
    setConsent: vi.fn(),
    disable: vi.fn(),
    getMeasurementId: vi.fn(() => 'G-FALLBACK')
  };

  return {
    analyticsService: mockAnalyticsService,
    default: mockAnalyticsService
  };
});

// Mock the cookie consent hook
const mockUseTrackingPermissions = vi.fn();
vi.mock('@/hooks/use-cookie-consent', () => ({
  useTrackingPermissions: () => mockUseTrackingPermissions()
}));

// Import the mocked analytics service for type checking
import { analyticsService } from '@/lib/analytics';

describe('AnalyticsManager', () => {
  const mockAnalyticsService = vi.mocked(analyticsService);

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock return value
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: false,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<AnalyticsManager />);
  });

  it('should initialize analytics on mount', async () => {
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: false,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true
    });

    render(<AnalyticsManager />);

    await waitFor(() => {
      expect(mockAnalyticsService.initialize).toHaveBeenCalledWith({
        measurementId: testMeasurementId,
        debug: true,
        gtagOptions: {
          anonymize_ip: true
        }
      });
    });
  });

  it('should set consent to false when analytics tracking is not allowed', async () => {
    mockAnalyticsService.isInitialized.mockReturnValue(true);

    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: false,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true
    });

    render(<AnalyticsManager />);

    await waitFor(() => {
      expect(mockAnalyticsService.setConsent).toHaveBeenCalledWith(false);
      expect(mockAnalyticsService.disable).toHaveBeenCalled();
    });
  });

  it('should set consent to true when analytics tracking is allowed', async () => {
    mockAnalyticsService.isInitialized.mockReturnValue(true);

    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: true,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true
    });

    render(<AnalyticsManager />);

    await waitFor(() => {
      expect(mockAnalyticsService.setConsent).toHaveBeenCalledWith(true);
      expect(mockAnalyticsService.disable).not.toHaveBeenCalled();
    });
  });

  it('should disable analytics when consent is withdrawn', async () => {
    mockAnalyticsService.isInitialized.mockReturnValue(true);

    // Start with consent granted
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: true,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true
    });

    const { rerender } = render(<AnalyticsManager />);

    await waitFor(() => {
      expect(mockAnalyticsService.setConsent).toHaveBeenCalledWith(true);
    });

    vi.clearAllMocks();

    // Change to consent withdrawn
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: false,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true
    });

    rerender(<AnalyticsManager />);

    await waitFor(() => {
      expect(mockAnalyticsService.setConsent).toHaveBeenCalledWith(false);
      expect(mockAnalyticsService.disable).toHaveBeenCalled();
    });
  });

  it('should use measurement ID from environment when available', async () => {
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: true,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true
    });

    render(<AnalyticsManager />);

    await waitFor(() => {
      expect(mockAnalyticsService.initialize).toHaveBeenCalledWith({
        measurementId: testMeasurementId,
        debug: true,
        gtagOptions: {
          anonymize_ip: true
        }
      });
    });
  });


});
