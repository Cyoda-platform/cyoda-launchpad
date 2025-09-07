import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { CookieCategory } from '@/types/cookie-consent';
import { toast } from '@/components/ui/use-toast';
import { cookieConsentLegalConfig } from '@/config/cookie-consent';

export interface CookiePreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policyUrl?: string;
  privacyUrl?: string;
}

/**
 * Cookie Preferences Modal
 * - Allows users to manage consent per category
 * - Essential is always on and disabled
 */
export function CookiePreferencesModal({ open, onOpenChange, policyUrl = '/cookie-policy', privacyUrl = '/privacy-policy' }: CookiePreferencesModalProps) {
  const { hasConsent, updateMultipleConsent, acceptAll, rejectAll, deleteConsentRecord, getPreference } = useCookieConsent();

  // Local draft state for toggles (non-essential only)
  const [analytics, setAnalytics] = useState<boolean>(false);
  const [marketing, setMarketing] = useState<boolean>(false);
  const [personalization, setPersonalization] = useState<boolean>(false);

  // Sync local state when opening or when underlying consent changes
  useEffect(() => {
    if (!open) return;
    setAnalytics(hasConsent(CookieCategory.ANALYTICS));
    setMarketing(hasConsent(CookieCategory.MARKETING));
    setPersonalization(hasConsent(CookieCategory.PERSONALIZATION));
  }, [open, hasConsent]);

  const essentialGranted = useMemo(() => getPreference(CookieCategory.ESSENTIAL)?.granted ?? true, [getPreference]);

  const handleSave = () => {
    updateMultipleConsent(
      {
        [CookieCategory.ANALYTICS]: analytics,
        [CookieCategory.MARKETING]: marketing,
        [CookieCategory.PERSONALIZATION]: personalization,
      },
      { triggerCallbacks: true }
    );
    toast({ title: 'Preferences saved', description: 'Your cookie preferences have been updated.' });
    onOpenChange(false);
  };

  const handleAcceptAll = () => {
    acceptAll();
    toast({ title: 'All cookies accepted', description: 'All non-essential cookies have been enabled.' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl sm:min-h-[600px] max-w-[calc(100vw-2rem)] mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Cookie Preferences</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {cookieConsentLegalConfig.modal.intro} See our{' '}
            <a
              href={policyUrl}
              className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded text-primary"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read our Cookie Policy in a new tab"
              role="link"
            >
              Cookie Policy
            </a> and{' '}
            <a
              href={privacyUrl}
              className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded text-primary"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read our Privacy Policy in a new tab"
              role="link"
            >
              Privacy Policy
            </a>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5">
          {/* Essential */}
          <section className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm sm:text-base">Essential</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">These are necessary for the website to function properly. Always On.</p>
              <p className="text-xs text-muted-foreground mt-1">{cookieConsentLegalConfig.modal.essentialNote}</p>
            </div>
            <div className="flex-shrink-0">
              <Switch checked={essentialGranted} disabled aria-readonly aria-label="Essential cookies are always on" />
            </div>
          </section>

          <Separator />

          {/* Analytics */}
          <section className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm sm:text-base">Analytics</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Measures usage and improves your experience. (e.g., Google Analytics).</p>
            </div>
            <div className="flex-shrink-0">
              <Switch checked={analytics} onCheckedChange={setAnalytics} aria-label="Toggle analytics cookies" />
            </div>
          </section>

          {/* Marketing */}
          <section className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm sm:text-base">Marketing</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">These may be used to deliver personalized ads and track effectiveness across websites (e.g., Facebook Pixel, Google Ads).</p>
            </div>
            <div className="flex-shrink-0">
              <Switch checked={marketing} onCheckedChange={setMarketing} aria-label="Toggle marketing cookies" />
            </div>
          </section>

          {/* Personalization */}
          <section className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm sm:text-base">Personalization</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Remembers your preferences and provides enhanced features.</p>
            </div>
            <div className="flex-shrink-0">
              <Switch checked={personalization} onCheckedChange={setPersonalization} aria-label="Toggle personalization cookies" />
            </div>
          </section>
        </div>

        <DialogFooter className="flex flex-col gap-3 pt-4 sm:pt-6">
          {/* Mobile-first: Stack buttons vertically, then horizontal on larger screens */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* Primary actions - most important buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:ml-auto">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={handleSave}
                aria-label="Save cookie preferences"
                className="w-full sm:w-auto"
              >
                Save Preferences
              </Button>
              <Button
                variant="destructive"
                onClick={() => { rejectAll(); toast({ title: 'All non-essential cookies rejected', description: 'You have withdrawn consent for non-essential cookies.' }); onOpenChange(false); }}
                aria-label="Reject all non-essential cookies"
                className="w-full sm:w-auto"
              >
                Reject All
              </Button>
              <Button
                onClick={handleAcceptAll}
                aria-label="Accept all cookies"
                className="w-full sm:w-auto"
              >
                Accept All
              </Button>
            </div>
          </div>

          {/* Secondary action - less prominent */}
          <div className="flex justify-center sm:justify-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { deleteConsentRecord(); toast({ title: 'Consent data erased', description: 'Your consent record has been deleted. You can set your preferences again.' }); onOpenChange(false); }}
              aria-label="Delete consent record"
              className="text-xs sm:text-sm"
            >
              Delete consent record
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CookiePreferencesModal;

