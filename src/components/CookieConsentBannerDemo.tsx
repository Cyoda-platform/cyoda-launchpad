import React, { useState } from 'react';
import { CookieConsentProvider } from '@/components/CookieConsentProvider';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CookiePreferencesModal } from '@/components/CookiePreferencesModal';
import { CookiePreferences } from '@/components/CookiePreferences';

/**
 * Demo content component that shows the banner integration
 */
function DemoContent() {
  const { showBanner, hasConsented, resetConsent, state } = useCookieConsent();
  const [showPreferences, setShowPreferences] = useState(false);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cookie Consent Banner Demo</CardTitle>
            <CardDescription>
              This demo shows the cookie consent banner in action. The banner will appear 
              when consent is required and disappear after user interaction.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current State Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Badge variant={hasConsented ? "default" : "secondary"}>
                  {hasConsented ? "Consented" : "Not Consented"}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Consent Status</p>
              </div>
              <div className="text-center">
                <Badge variant={showBanner ? "destructive" : "default"}>
                  {showBanner ? "Banner Visible" : "Banner Hidden"}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Banner State</p>
              </div>
              <div className="text-center">
                <Badge variant="outline">
                  {state.preferences.analytics.granted ? "Analytics On" : "Analytics Off"}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Analytics</p>
              </div>
            </div>

            {/* Demo Controls */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={resetConsent}
                disabled={showBanner}
              >
                Reset Consent (Show Banner)
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreferences(true)}
              >
                Open Preferences Modal
              </Button>
            </div>

            {/* Demo Content */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">Sample Page Content</h3>
              <p className="text-muted-foreground">
                This is sample content to demonstrate how the cookie banner appears over 
                regular page content. The banner is positioned at the bottom of the screen 
                and doesn't block critical content.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Feature 1</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Sample feature content that remains accessible even when the 
                      cookie banner is displayed.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Feature 2</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Another feature demonstrating responsive design compatibility 
                      with the cookie consent banner.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Test Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Responsive Design Test</CardTitle>
            <CardDescription>
              Resize your browser window to test the banner's responsive behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">Item {i + 1}</h4>
                  <p className="text-sm text-muted-foreground">Sample content</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cookie Consent Banner */}
      <CookieConsentBanner
        onManagePreferences={() => setShowPreferences(true)}
        policyUrl="/cookie-policy"
        privacyUrl="/privacy-policy"
      />

      {/* Preferences Modal */}
      <CookiePreferencesModal open={showPreferences} onOpenChange={setShowPreferences} />

      {/* Persistent Preferences Button */}
      <CookiePreferences />
    </div>
  );
}

/**
 * Complete demo component with provider wrapper
 */
export function CookieConsentBannerDemo() {
  return (
    <CookieConsentProvider
      config={{
        expirationDays: 365,
        version: '1.0.0',
        showBannerByDefault: true,
        callbacks: {
          onConsentGiven: (data) => {
            console.log('Consent given:', data);
          },
          onConsentUpdated: (data) => {
            console.log('Consent updated:', data);
          },
          onBannerShown: (data) => {
            console.log('Banner shown:', data);
          },
          onBannerDismissed: (data) => {
            console.log('Banner dismissed:', data);
          },
        },
      }}
    >
      <DemoContent />
    </CookieConsentProvider>
  );
}

/**
 * Simple integration example for existing applications
 */
export function SimpleCookieConsentIntegration({ children }: { children: React.ReactNode }) {
  return (
    <CookieConsentProvider>
      {children}
      <CookieConsentBanner />
    </CookieConsentProvider>
  );
}
