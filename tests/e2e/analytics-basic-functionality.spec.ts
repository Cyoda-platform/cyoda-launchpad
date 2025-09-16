import { test, expect } from '@playwright/test';

// Type declarations for Google Analytics globals
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

test.describe('Google Analytics Basic Functionality', () => {
  test('should load Google Analytics script and track events when consent is granted', async ({ page }) => {
    // Start listening for network requests
    const analyticsRequests: Array<{ url: string; method: string }> = [];
    page.on('request', request => {
      if (request.url().includes('google-analytics.com/g/collect') ||
          request.url().includes('googletagmanager.com/gtag')) {
        analyticsRequests.push({
          url: request.url(),
          method: request.method()
        });
      }
    });

    await page.goto('/');

    // Check if cookie banner is visible (if consent not already granted)
    const bannerVisible = await page.getByText('Cookie Consent Required').isVisible();
    
    if (bannerVisible) {
      // Accept all cookies if banner is shown
      await page.getByRole('button', { name: 'Accept all cookies' }).click();
      
      // Wait for banner to disappear
      await expect(page.getByText('Cookie Consent Required')).not.toBeVisible();
    }

    // Wait for Google Analytics script to load
    await page.waitForFunction(() => 
      Array.from(document.querySelectorAll('script')).some(s => s.src.includes('googletagmanager.com/gtag'))
    );

    // Verify Google Analytics is properly initialized
    const analyticsState = await page.evaluate(() => ({
      gtagExists: typeof window.gtag === 'function',
      dataLayerExists: typeof window.dataLayer !== 'undefined',
      dataLayerLength: window.dataLayer ? window.dataLayer.length : 0,
      scripts: Array.from(document.querySelectorAll('script')).map(s => s.src).filter(src => src.includes('google')),
    }));

    expect(analyticsState.gtagExists).toBe(true);
    expect(analyticsState.dataLayerExists).toBe(true);
    expect(analyticsState.dataLayerLength).toBeGreaterThan(0);
    expect(analyticsState.scripts).toHaveLength(1);
    expect(analyticsState.scripts[0]).toMatch(/googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]+/);

    // Navigate to another page to trigger page view
    await page.getByLabel('Main').getByRole('link', { name: 'Pricing' }).click();
    await page.waitForURL('/pricing');

    // Wait for analytics requests
    await page.waitForTimeout(2000);

    // Verify analytics requests were made
    expect(analyticsRequests.length).toBeGreaterThan(0);
    
    // Check that GA script was loaded
    const scriptRequests = analyticsRequests.filter(req => 
      req.url.includes('googletagmanager.com/gtag')
    );
    expect(scriptRequests.length).toBeGreaterThan(0);

    // Check that tracking requests were made
    const trackingRequests = analyticsRequests.filter(req => 
      req.url.includes('google-analytics.com/g/collect')
    );
    expect(trackingRequests.length).toBeGreaterThan(0);

    // Verify measurement ID is included in tracking requests
    const measurementIdPattern = /tid=G-[A-Z0-9]+/;
    expect(trackingRequests[0].url).toMatch(measurementIdPattern);
  });

  test('should have functional Google Analytics integration', async ({ page }) => {
    await page.goto('/');

    // Check if cookie banner is visible
    const bannerVisible = await page.getByText('Cookie Consent Required').isVisible();

    if (bannerVisible) {
      // Accept cookies
      await page.getByRole('button', { name: 'Accept all cookies' }).click();
    }

    // Wait for GA to initialize
    await page.waitForFunction(() =>
      typeof window.gtag === 'function' && window.dataLayer && window.dataLayer.length > 0
    );

    // Verify basic GA4 functionality
    const gaState = await page.evaluate(() => ({
      gtagExists: typeof window.gtag === 'function',
      dataLayerExists: typeof window.dataLayer !== 'undefined',
      dataLayerLength: window.dataLayer.length,
      hasGoogleScript: Array.from(document.querySelectorAll('script')).some(s =>
        s.src.includes('googletagmanager.com/gtag')
      )
    }));

    expect(gaState.gtagExists).toBe(true);
    expect(gaState.dataLayerExists).toBe(true);
    expect(gaState.dataLayerLength).toBeGreaterThan(0);
    expect(gaState.hasGoogleScript).toBe(true);
  });
});
