# Cookie Consent Banner Integration Guide

This guide explains how to integrate the GDPR-compliant cookie consent banner into your application.

## Quick Start

### 1. Basic Integration

Wrap your app with the `CookieConsentProvider` and add the banner component:

```tsx
import { CookieConsentProvider } from '@/components/CookieConsentProvider';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';

function App() {
  return (
    <CookieConsentProvider>
      <div className="app">
        {/* Your app content */}
        <main>
          <h1>My Application</h1>
          {/* ... rest of your content */}
        </main>
        
        {/* Cookie consent banner */}
        <CookieConsentBanner />
      </div>
    </CookieConsentProvider>
  );
}
```

### 2. Using the Renderer Component

For automatic conditional rendering:

```tsx
import { CookieConsentProvider } from '@/components/CookieConsentProvider';
import { CookieConsentBannerRenderer } from '@/components/CookieConsentBanner';

function App() {
  return (
    <CookieConsentProvider>
      <div className="app">
        <main>Your content</main>
        <CookieConsentBannerRenderer />
      </div>
    </CookieConsentProvider>
  );
}
```

## Configuration Options

### Provider Configuration

```tsx
<CookieConsentProvider
  config={{
    expirationDays: 365,           // How long consent lasts
    version: '1.0.0',              // Version for migration
    showBannerByDefault: true,     // Show banner on first visit
    defaultPreferences: {          // Default consent states
      analytics: false,
      marketing: false,
      personalization: false,
    },
    callbacks: {                   // Event callbacks
      onConsentGiven: (data) => console.log('Consent given:', data),
      onConsentUpdated: (data) => console.log('Consent updated:', data),
      onBannerShown: (data) => console.log('Banner shown:', data),
      onBannerDismissed: (data) => console.log('Banner dismissed:', data),
    },
  }}
>
  {/* Your app */}
</CookieConsentProvider>
```

### Banner Configuration

```tsx
<CookieConsentBanner
  onManagePreferences={() => setShowPreferencesModal(true)}
  policyUrl="/cookie-policy"
  privacyUrl="/privacy-policy"
  className="custom-banner-styles"
/>
```

## Banner Features

### ✅ GDPR Compliance
- Clear, legally compliant messaging based on EU cookie policy
- Explicit consent for non-essential cookies
- Easy withdrawal of consent
- Links to cookie policy and privacy policy

### ✅ Accessibility (WCAG 2.1 AA)
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- High contrast support

### ✅ Responsive Design
- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly buttons
- Optimal spacing and typography

### ✅ Smooth Animations
- Slide-up/slide-down transitions
- Loading states for buttons
- Backdrop blur effects
- Non-blocking animations

## Integration with Existing State

### Using Cookie Consent State

```tsx
import { useCookieConsent } from '@/hooks/use-cookie-consent';

function MyComponent() {
  const { 
    hasConsented, 
    showBanner, 
    acceptAll, 
    rejectAll, 
    hasConsent 
  } = useCookieConsent();

  // Check specific consent
  const canUseAnalytics = hasConsent(CookieCategory.ANALYTICS);
  
  // Programmatically manage consent
  const handleAcceptAll = () => acceptAll();
  const handleRejectAll = () => rejectAll();

  return (
    <div>
      {canUseAnalytics && <AnalyticsComponent />}
      {showBanner && <div>Banner is visible</div>}
    </div>
  );
}
```

## Styling and Customization

### CSS Classes
The banner uses Tailwind CSS classes and can be customized via the `className` prop:

```tsx
<CookieConsentBanner 
  className="custom-banner-class"
/>
```

### Theme Integration
The banner automatically adapts to your shadcn/ui theme:
- Uses theme colors (`bg-background`, `text-foreground`, etc.)
- Respects dark/light mode
- Follows your design system

## Testing

### Demo Component
Use the demo component for testing:

```tsx
import { CookieConsentBannerDemo } from '@/components/CookieConsentBannerDemo';

// In your development/testing environment
<CookieConsentBannerDemo />
```

### Manual Testing Checklist
- [ ] Banner appears on first visit
- [ ] Accept All button works and hides banner
- [ ] Decline All button works and hides banner
- [ ] Manage Preferences button triggers callback
- [ ] Banner is responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces banner properly
- [ ] Links open in new tabs
- [ ] Animation is smooth and non-jarring

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Next Steps

After implementing the banner, you'll want to:

1. **Implement Cookie Preference Management** (Task 4)
   - Detailed preference modal
   - Individual cookie category toggles
   - Persistent preferences button

2. **Add Legal Compliance Documentation** (Task 6)
   - Validate messaging against legal requirements
   - Add audit logging
   - Configure policy links

3. **Integrate with Analytics/Marketing Tools**
   - Conditionally load tracking scripts
   - Respect user preferences
   - Handle consent changes

## Troubleshooting

### Banner Not Showing
- Ensure `CookieConsentProvider` wraps your app
- Check if consent has already been given (stored in localStorage)
- Verify `showBannerByDefault` is true in config

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check for CSS conflicts with existing styles
- Verify shadcn/ui components are installed

### Accessibility Issues
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Verify keyboard navigation works
- Check color contrast ratios
