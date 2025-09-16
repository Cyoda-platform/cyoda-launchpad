import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { AnalyticsManager } from '@/components/AnalyticsManager';
import analyticsService from '@/lib/analytics';

// Get the actual measurement ID from the test environment
const testMeasurementId = process.env.VITE_GA_MEASUREMENT_ID || 'G-FALLBACK';

// Mock the analytics service
vi.mock('@/lib/analytics', () => ({
  default: {
    enableAnalytics: vi.fn(() => Promise.resolve()),
    disableAnalytics: vi.fn(),
    isEnabled: vi.fn(() => false),
    trackEvent: vi.fn(),
    getMeasurementId: vi.fn(() => testMeasurementId)
  }
}));

// Mock the cookie consent hook
const mockUseTrackingPermissions = vi.fn();
vi.mock('@/hooks/use-cookie-consent', () => ({
  useTrackingPermissions: () => mockUseTrackingPermissions()
}));

// Mock import.meta.env
vi.mock('import.meta', () => ({
  env: {
    VITE_GA_MEASUREMENT_ID: testMeasurementId
  }
}));

describe('AnalyticsManager', () => {
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

  it('should not enable analytics when consent is not granted', async () => {
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: false,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true
    });

    render(<AnalyticsManager />);

    await waitFor(() => {
      expect(analyticsService.disableAnalytics).toHaveBeenCalled();
      expect(analyticsService.enableAnalytics).not.toHaveBeenCalled();
    });
  });

  it('should enable analytics when consent is granted', async () => {
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: true,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true
    });

    render(<AnalyticsManager />);

    await waitFor(() => {
      expect(analyticsService.enableAnalytics).toHaveBeenCalledWith({
        measurementId: testMeasurementId,
        anonymizeIp: true,
        debug: true,
        consentDefaults: {
          ad_storage: 'denied',
          analytics_storage: 'granted'
        }
      });
    });
  });

  it('should disable analytics when consent is withdrawn', async () => {
    const { rerender } = render(<AnalyticsManager />);

    // First render with consent granted
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: true,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true
    });

    rerender(<AnalyticsManager />);

    await waitFor(() => {
      expect(analyticsService.enableAnalytics).toHaveBeenCalled();
    });

    vi.clearAllMocks();

    // Second render with consent withdrawn
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: false,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true
    });

    rerender(<AnalyticsManager />);

    await waitFor(() => {
      expect(analyticsService.disableAnalytics).toHaveBeenCalled();
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
      expect(analyticsService.enableAnalytics).toHaveBeenCalledWith({
        measurementId: testMeasurementId,
        anonymizeIp: true,
        debug: true,
        consentDefaults: {
          ad_storage: 'denied',
          analytics_storage: 'granted'
        }
      });
    });
  });

  it('should set correct consent defaults based on tracking permissions', async () => {
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: true,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true
    });

    render(<AnalyticsManager />);

    await waitFor(() => {
      expect(analyticsService.enableAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          consentDefaults: {
            ad_storage: 'denied',
            analytics_storage: 'granted'
          }
        })
      );
    });
  });

  it('should handle analytics service errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock analytics service to throw an error
    vi.mocked(analyticsService.enableAnalytics).mockRejectedValue(new Error('GA failed to load'));

    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: true,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true
    });

    render(<AnalyticsManager />);

    await waitFor(() => {
      expect(analyticsService.enableAnalytics).toHaveBeenCalled();
    });

    // Should not crash the component
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
