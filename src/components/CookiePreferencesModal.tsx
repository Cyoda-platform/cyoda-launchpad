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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cookie Preferences</DialogTitle>
          <DialogDescription>
            {cookieConsentLegalConfig.modal.intro} See our{' '}
            <a
              href={policyUrl}
              className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read our Cookie Policy in a new tab"
              role="link"
            >
              Cookie Policy
            </a> and{' '}
            <a
              href={privacyUrl}
              className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read our Privacy Policy in a new tab"
              role="link"
            >
              Privacy Policy
            </a>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Essential */}
          <section className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-medium">Essential</h4>
              <p className="text-sm text-muted-foreground">These are necessary for the website to function properly. Always On.</p>
              <p className="text-xs text-muted-foreground mt-1">{cookieConsentLegalConfig.modal.essentialNote}</p>
            </div>
            <Switch checked={essentialGranted} disabled aria-readonly aria-label="Essential cookies are always on" />
          </section>

          <Separator />

          {/* Analytics */}
          <section className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-medium">Analytics</h4>
              <p className="text-sm text-muted-foreground">Measures usage and improves your experience. (e.g., Google Analytics).</p>
            </div>
            <Switch checked={analytics} onCheckedChange={setAnalytics} aria-label="Toggle analytics cookies" />
          </section>

          {/* Marketing */}
          <section className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-medium">Marketing</h4>
              <p className="text-sm text-muted-foreground">These may be used to deliver personalized ads and track effectiveness across websites (e.g., Facebook Pixel, Google Ads).</p>
            </div>
            <Switch checked={marketing} onCheckedChange={setMarketing} aria-label="Toggle marketing cookies" />
          </section>

          {/* Personalization */}
          <section className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-medium">Personalization</h4>
              <p className="text-sm text-muted-foreground">Remembers your preferences and provides enhanced features.</p>
            </div>
            <Switch checked={personalization} onCheckedChange={setPersonalization} aria-label="Toggle personalization cookies" />
          </section>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4">
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { deleteConsentRecord(); toast({ title: 'Consent data erased', description: 'Your consent record has been deleted. You can set your preferences again.' }); onOpenChange(false); }} aria-label="Delete consent record">Delete consent record</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button variant="outline" onClick={handleSave} aria-label="Save cookie preferences">Save Preferences</Button>
            <Button variant="destructive" onClick={() => { rejectAll(); toast({ title: 'All non-essential cookies rejected', description: 'You have withdrawn consent for non-essential cookies.' }); onOpenChange(false); }} aria-label="Reject all non-essential cookies">Reject All</Button>
            <Button onClick={handleAcceptAll} aria-label="Accept all cookies">Accept All</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CookiePreferencesModal;

