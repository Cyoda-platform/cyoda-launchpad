import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUtmTracking } from '@/hooks/use-utm-tracking';
import { MemoryRouter } from 'react-router-dom';
import { ReactNode } from 'react';

// Mock the utm-tracking utilities
const mockCaptureUtmParameters = vi.fn();
const mockHasUtmParameters = vi.fn();

vi.mock('@/utils/utm-tracking', () => ({
  captureUtmParameters: () => mockCaptureUtmParameters(),
  hasUtmParameters: () => mockHasUtmParameters(),
}));

// Mock the analytics service
const mockTrackLandingPageView = vi.fn();
const mockTrackEvent = vi.fn();

vi.mock('@/lib/analytics', () => ({
  analyticsService: {
    trackLandingPageView: (path?: string, title?: string) => mockTrackLandingPageView(path, title),
    trackEvent: (name: string, params?: Record<string, unknown>) => mockTrackEvent(name, params),
    isInitialized: () => true,
  },
}));

// Mock the cookie consent hook
const mockUseTrackingPermissions = vi.fn();
vi.mock('@/hooks/use-cookie-consent', () => ({
  useTrackingPermissions: () => mockUseTrackingPermissions(),
}));

describe('useUtmTracking', () => {
  // Helper to create a wrapper with MemoryRouter
  const createWrapper = (initialPath = '/') => {
    return ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[initialPath]}>
        {children}
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock values
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: false,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true,
    });
    
    mockCaptureUtmParameters.mockReturnValue(null);
    mockHasUtmParameters.mockReturnValue(false);
    
    // Mock document.title
    Object.defineProperty(document, 'title', {
      value: 'Test Page',
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not capture UTM parameters when consent is not granted', () => {
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: false,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true,
    });

    renderHook(() => useUtmTracking(), {
      wrapper: createWrapper('/'),
    });

    expect(mockCaptureUtmParameters).not.toHaveBeenCalled();
    expect(mockTrackLandingPageView).not.toHaveBeenCalled();
  });

  it('should capture UTM parameters when consent is granted', () => {
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: true,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true,
    });

    renderHook(() => useUtmTracking(), {
      wrapper: createWrapper('/'),
    });

    expect(mockCaptureUtmParameters).toHaveBeenCalled();
  });

  it('should track landing page view when UTM parameters are captured', async () => {
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: true,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true,
    });

    // Simulate UTM parameters being captured
    mockCaptureUtmParameters.mockReturnValue({
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'spring_sale',
    });

    renderHook(() => useUtmTracking(), {
      wrapper: createWrapper('/?utm_source=google&utm_medium=cpc'),
    });

    await waitFor(() => {
      expect(mockTrackLandingPageView).toHaveBeenCalledWith(
        '/?utm_source=google&utm_medium=cpc',
        'Test Page'
      );
    });
  });

  it('should track landing page view event with page variant for home page', async () => {
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: true,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true,
    });

    mockCaptureUtmParameters.mockReturnValue({
      utm_source: 'google',
      utm_medium: 'cpc',
    });

    renderHook(() => useUtmTracking(), {
      wrapper: createWrapper('/'),
    });

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith('landing_page_view', {
        page_path: '/',
        page_variant: 'home',
        page_title: 'Test Page',
      });
    });
  });

  it('should track landing page view event with page variant for dev page', async () => {
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: true,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true,
    });

    mockCaptureUtmParameters.mockReturnValue({
      utm_source: 'linkedin',
      utm_medium: 'social',
    });

    renderHook(() => useUtmTracking(), {
      wrapper: createWrapper('/dev'),
    });

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith('landing_page_view', {
        page_path: '/dev',
        page_variant: 'dev',
        page_title: 'Test Page',
      });
    });
  });

  it('should track landing page view event with page variant for cto page', async () => {
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: true,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true,
    });

    mockCaptureUtmParameters.mockReturnValue({
      utm_source: 'twitter',
      utm_medium: 'social',
    });

    renderHook(() => useUtmTracking(), {
      wrapper: createWrapper('/cto'),
    });

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith('landing_page_view', {
        page_path: '/cto',
        page_variant: 'cto',
        page_title: 'Test Page',
      });
    });
  });

  it('should track landing page view event with page variant "other" for other pages', async () => {
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: true,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true,
    });

    mockCaptureUtmParameters.mockReturnValue({
      utm_source: 'email',
      utm_medium: 'newsletter',
    });

    renderHook(() => useUtmTracking(), {
      wrapper: createWrapper('/products'),
    });

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith('landing_page_view', {
        page_path: '/products',
        page_variant: 'other',
        page_title: 'Test Page',
      });
    });
  });

  it('should only track landing page view once per session', async () => {
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: true,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true,
    });

    mockCaptureUtmParameters.mockReturnValue({
      utm_source: 'google',
      utm_medium: 'cpc',
    });

    const { rerender } = renderHook(() => useUtmTracking(), {
      wrapper: createWrapper('/'),
    });

    await waitFor(() => {
      expect(mockTrackLandingPageView).toHaveBeenCalledTimes(1);
    });

    // Rerender the hook
    rerender();

    // Should still only be called once
    expect(mockTrackLandingPageView).toHaveBeenCalledTimes(1);
  });

  it('should not track landing page view if no UTM parameters are captured', () => {
    mockUseTrackingPermissions.mockReturnValue({
      canTrackAnalytics: true,
      canTrackMarketing: false,
      canPersonalize: false,
      canUseEssential: true,
    });

    mockCaptureUtmParameters.mockReturnValue(null);

    renderHook(() => useUtmTracking(), {
      wrapper: createWrapper('/'),
    });

    expect(mockTrackLandingPageView).not.toHaveBeenCalled();
    expect(mockTrackEvent).not.toHaveBeenCalled();
  });
});

