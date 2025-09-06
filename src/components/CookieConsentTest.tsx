import React from 'react';
import { useCookieConsent, useCookiePreferences, useTrackingPermissions } from '@/hooks/use-cookie-consent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

/**
 * Test component to verify cookie consent functionality
 * This component demonstrates all the features of the cookie consent system
 */
export function CookieConsentTest() {
  const {
    state,
    hasConsented,
    showBanner,
    isExpired,
    acceptAll,
    rejectAll,
    resetConsent,
    hideBanner,
  } = useCookieConsent();

  const {
    essential,
    analytics,
    marketing,
    personalization,
    setAnalytics,
    setMarketing,
    setPersonalization,
    toggleAnalytics,
    toggleMarketing,
    togglePersonalization,
  } = useCookiePreferences();

  const {
    canTrackAnalytics,
    canTrackMarketing,
    canPersonalize,
    canUseEssential,
  } = useTrackingPermissions();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cookie Consent System Test</CardTitle>
          <CardDescription>
            This component demonstrates the cookie consent system functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current State Display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge variant={hasConsented ? "default" : "secondary"}>
                {hasConsented ? "Consented" : "Not Consented"}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">Consent Status</p>
            </div>
            <div className="text-center">
              <Badge variant={showBanner ? "destructive" : "default"}>
                {showBanner ? "Show Banner" : "Hide Banner"}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">Banner State</p>
            </div>
            <div className="text-center">
              <Badge variant={isExpired ? "destructive" : "default"}>
                {isExpired ? "Expired" : "Valid"}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">Expiration</p>
            </div>
            <div className="text-center">
              <Badge variant="outline">
                v{state.version}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">Version</p>
            </div>
          </div>

          {/* Consent Date */}
          {state.consentDate && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Consent given on: {state.consentDate.toLocaleString()}
              </p>
            </div>
          )}

          {/* Cookie Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cookie Categories</h3>
            
            <div className="grid gap-4">
              {/* Essential Cookies */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="essential">Essential Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Required for basic site functionality
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="essential"
                    checked={essential}
                    disabled={true}
                  />
                  <Badge variant={essential ? "default" : "secondary"}>
                    {essential ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="analytics">Analytics Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how visitors interact with our website
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="analytics"
                    checked={analytics}
                    onCheckedChange={setAnalytics}
                  />
                  <Badge variant={analytics ? "default" : "secondary"}>
                    {analytics ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="marketing">Marketing Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Used to deliver relevant advertisements
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="marketing"
                    checked={marketing}
                    onCheckedChange={setMarketing}
                  />
                  <Badge variant={marketing ? "default" : "secondary"}>
                    {marketing ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>

              {/* Personalization Cookies */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="personalization">Personalization Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Remember your preferences and settings
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="personalization"
                    checked={personalization}
                    onCheckedChange={setPersonalization}
                  />
                  <Badge variant={personalization ? "default" : "secondary"}>
                    {personalization ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tracking Permissions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Badge variant={canUseEssential ? "default" : "secondary"}>
                  {canUseEssential ? "Allowed" : "Blocked"}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Essential</p>
              </div>
              <div className="text-center">
                <Badge variant={canTrackAnalytics ? "default" : "secondary"}>
                  {canTrackAnalytics ? "Allowed" : "Blocked"}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Analytics</p>
              </div>
              <div className="text-center">
                <Badge variant={canTrackMarketing ? "default" : "secondary"}>
                  {canTrackMarketing ? "Allowed" : "Blocked"}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Marketing</p>
              </div>
              <div className="text-center">
                <Badge variant={canPersonalize ? "default" : "secondary"}>
                  {canPersonalize ? "Allowed" : "Blocked"}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Personalization</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => acceptAll()}>
                Accept All
              </Button>
              <Button onClick={() => rejectAll()} variant="outline">
                Reject All
              </Button>
              <Button onClick={() => toggleAnalytics()} variant="outline">
                Toggle Analytics
              </Button>
              <Button onClick={() => toggleMarketing()} variant="outline">
                Toggle Marketing
              </Button>
              <Button onClick={() => togglePersonalization()} variant="outline">
                Toggle Personalization
              </Button>
              <Button onClick={() => hideBanner()} variant="outline">
                Hide Banner
              </Button>
              <Button onClick={() => resetConsent()} variant="destructive">
                Reset Consent
              </Button>
            </div>
          </div>

          {/* Debug Information */}
          <details className="space-y-2">
            <summary className="cursor-pointer text-lg font-semibold">
              Debug Information
            </summary>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
              {JSON.stringify(state, null, 2)}
            </pre>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}
