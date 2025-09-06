import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CookiePreferencesModal } from '@/components/CookiePreferencesModal';
import { Settings2 } from 'lucide-react';

export interface CookiePreferencesProps {
  policyUrl?: string;
  privacyUrl?: string;
  /* Show the persistent button fixed in the left corner */
  showPersistentButton?: boolean;
}

/**
 * CookiePreferences
 * - Renders a persistent "Preferences" button in the bottom-left corner
 * - Hosts the CookiePreferencesModal
 */
export function CookiePreferences({ policyUrl = '/cookie-policy', privacyUrl = '/privacy-policy', showPersistentButton = true }: CookiePreferencesProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {showPersistentButton && (
        <div className="fixed left-4 bottom-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            aria-label="Open cookie preferences"
            className="shadow-md"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Preferences
          </Button>
        </div>
      )}

      <CookiePreferencesModal open={open} onOpenChange={setOpen} policyUrl={policyUrl} privacyUrl={privacyUrl} />
    </>
  );
}

export default CookiePreferences;

