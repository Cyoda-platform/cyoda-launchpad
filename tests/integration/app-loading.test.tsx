import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '@/App';

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

// Mock cookie consent hooks
vi.mock('@/hooks/use-cookie-consent', () => ({
  useTrackingPermissions: () => ({
    canTrackAnalytics: false,
    canTrackMarketing: false,
    canTrackPersonalization: false
  }),
  useCookieConsent: () => ({
    consentState: {
      hasConsented: false,
      categories: {
        essential: true,
        analytics: false,
        marketing: false,
        personalization: false
      },
      timestamp: null
    },
    updateConsent: vi.fn(),
    revokeConsent: vi.fn(),
    isConsentRequired: true,
    getPreference: vi.fn(() => ({ granted: true }))
  })
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

// Mock matchMedia for theme provider
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock blog loading to avoid network requests
vi.mock('@/lib/blog-loader', () => ({
  loadBlogPosts: vi.fn(() => Promise.resolve([])),
  loadBlogPostPreviews: vi.fn(() => Promise.resolve([])),
  loadBlogPost: vi.fn(() => Promise.resolve(null)),
  getFeaturedBlogPosts: vi.fn(() => Promise.resolve([])),
  getBlogPostsByCategory: vi.fn(() => Promise.resolve([])),
  getBlogCategories: vi.fn(() => Promise.resolve(['All'])),
  searchBlogPosts: vi.fn(() => Promise.resolve([])),
  clearBlogCache: vi.fn()
}));

describe('App Loading Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the main app without crashing', async () => {
    // This test should catch Router context errors
    expect(() => {
      render(<App />);
    }).not.toThrow();
  });

  it('should load the homepage successfully', async () => {
    render(<App />);

    // Wait for the app to load and check for key elements
    await waitFor(() => {
      // Should find the main navigation or header
      expect(screen.getByRole('banner')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Should not show any error boundaries
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('should not throw useLocation errors', async () => {
    // Capture console errors
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    // Check that no Router-related errors were logged
    const routerErrors = consoleSpy.mock.calls.filter(call =>
      call.some(arg =>
        typeof arg === 'string' &&
        (arg.includes('useLocation') || arg.includes('Router') || arg.includes('context'))
      )
    );

    expect(routerErrors).toHaveLength(0);

    consoleSpy.mockRestore();
  });

  it('should initialize analytics tracking without errors', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    // Should not have any analytics-related errors
    const analyticsErrors = consoleSpy.mock.calls.filter(call =>
      call.some(arg =>
        typeof arg === 'string' &&
        (arg.includes('analytics') || arg.includes('tracking'))
      )
    );

    expect(analyticsErrors).toHaveLength(0);

    consoleSpy.mockRestore();
  });

  it('should render main content areas', async () => {
    render(<App />);

    await waitFor(() => {
      // Should have main navigation
      expect(screen.getByRole('banner')).toBeInTheDocument();

      // Should have main content area
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });
});
