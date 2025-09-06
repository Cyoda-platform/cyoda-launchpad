import React, { useState, useEffect, useRef } from 'react';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { cookieConsentLegalConfig } from '@/config/cookie-consent';

/**
 * Props for the CookieConsentBanner component
 */
export interface CookieConsentBannerProps {
  /** Additional CSS classes */
  className?: string;
  /** Callback when manage preferences is clicked */
  onManagePreferences?: () => void;
  /** Custom policy URL (defaults to /cookie-policy) */
  policyUrl?: string;
  /** Custom privacy policy URL (defaults to /privacy-policy) */
  privacyUrl?: string;
}

/**
 * GDPR-compliant cookie consent banner component
 * 
 * Displays at the bottom of the screen when consent is required.
 * Provides clear Accept/Decline options with legal compliance messaging.
 * Integrates with the cookie consent context for state management.
 */
export function CookieConsentBanner({
  className,
  onManagePreferences,
  policyUrl = cookieConsentLegalConfig.policyUrl,
  privacyUrl = cookieConsentLegalConfig.privacyUrl,
}: CookieConsentBannerProps) {
  const { showBanner, acceptAll, rejectAll } = useCookieConsent();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState<'accept' | 'decline' | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Handle banner visibility with animation
  useEffect(() => {
    if (showBanner) {
      // Show banner with slight delay for smooth animation
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [showBanner]);

  // Focus management for accessibility
  useEffect(() => {
    if (showBanner && isVisible && bannerRef.current) {
      // Focus the banner when it becomes visible for screen readers
      const focusableElements = bannerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        // Focus the first button (Accept All) for better UX
        const acceptButton = Array.from(focusableElements).find(
          el => el.getAttribute('aria-label')?.includes('Accept all')
        ) as HTMLElement;
        if (acceptButton) {
          acceptButton.focus();
        }
      }
    }
  }, [showBanner, isVisible]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showBanner || !isVisible) return;

      // Escape key to focus on manage preferences (less intrusive than closing)
      if (event.key === 'Escape') {
        event.preventDefault();
        const manageButton = bannerRef.current?.querySelector(
          '[aria-label*="Manage cookie preferences"]'
        ) as HTMLElement;
        if (manageButton) {
          manageButton.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showBanner, isVisible]);

  // Don't render if banner shouldn't be shown
  if (!showBanner) {
    return null;
  }

  /**
   * Handle accept all cookies with smooth animation
   */
  const handleAcceptAll = async () => {
    if (isProcessing) return;

    setIsProcessing('accept');
    setIsAnimating(true);
    setIsVisible(false);

    // Wait for slide-down animation to complete
    setTimeout(async () => {
      try {
        await acceptAll();
      } catch (error) {
        console.error('Failed to accept cookies:', error);
        // Reset visibility on error
        setIsVisible(true);
      } finally {
        setIsAnimating(false);
        setIsProcessing(null);
      }
    }, 300);
  };

  /**
   * Handle decline all non-essential cookies with smooth animation
   */
  const handleDeclineAll = async () => {
    if (isProcessing) return;

    setIsProcessing('decline');
    setIsAnimating(true);
    setIsVisible(false);

    // Wait for slide-down animation to complete
    setTimeout(async () => {
      try {
        await rejectAll();
      } catch (error) {
        console.error('Failed to decline cookies:', error);
        // Reset visibility on error
        setIsVisible(true);
      } finally {
        setIsAnimating(false);
        setIsProcessing(null);
      }
    }, 300);
  };

  /**
   * Handle manage preferences click
   */
  const handleManagePreferences = () => {
    if (onManagePreferences) {
      onManagePreferences();
    }
  };

  return (
    <div
      ref={bannerRef}
      className={cn(
        // Fixed positioning at bottom with high z-index
        'fixed bottom-0 left-0 right-0',
        'z-[9999]', // Ensure banner appears above all other content
        // Smooth animations
        'transform transition-all duration-300 ease-in-out',
        // Animation states
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
        // Responsive padding
        'p-4 sm:p-6',
        // Backdrop blur for better visibility
        'backdrop-blur-sm',
        className
      )}
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
      aria-live="polite"
      aria-modal="false"
      aria-atomic="true"
      tabIndex={-1}
    >
      <Card className="mx-auto max-w-7xl shadow-2xl border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Message Content */}
            <div className="flex-1 space-y-2">
              <h2
                id="cookie-banner-title"
                className="text-sm font-semibold text-foreground"
                role="heading"
                aria-level={2}
              >
                {cookieConsentLegalConfig.banner.title}
              </h2>
              <p
                id="cookie-banner-description"
                className="text-sm text-muted-foreground leading-relaxed"
              >
                {cookieConsentLegalConfig.banner.disclaimer}{' '}
                See our{' '}
                <a
                  href={policyUrl}
                  className="text-primary underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Read our Cookie Policy in a new tab"
                  role="link"
                >
                  Cookie Policy
                </a>{' '}and{' '}
                <a
                  href={privacyUrl}
                  className="text-primary underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Read our Privacy Policy in a new tab"
                  role="link"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 sm:ml-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleManagePreferences}
                className="order-3 sm:order-1"
                aria-label="Manage cookie preferences"
                disabled={isProcessing !== null}
              >
                Manage Preferences
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeclineAll}
                className="order-2"
                aria-label="Decline all non-essential cookies"
                disabled={isProcessing !== null}
              >
                {isProcessing === 'decline' ? 'Declining...' : 'Decline All'}
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="order-1 sm:order-3"
                aria-label="Accept all cookies"
                disabled={isProcessing !== null}
              >
                {isProcessing === 'accept' ? 'Accepting...' : 'Accept All'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Hook to conditionally render the cookie consent banner
 *
 * @returns JSX element or null based on consent state
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <div>
 *       <main>Your app content</main>
 *       <CookieConsentBannerRenderer />
 *     </div>
 *   );
 * }
 * ```
 */
export function CookieConsentBannerRenderer(props: Omit<CookieConsentBannerProps, 'showBanner'>) {
  const { showBanner } = useCookieConsent();

  if (!showBanner) {
    return null;
  }

  return <CookieConsentBanner {...props} />;
}

// Export default for easier imports
export default CookieConsentBanner;
