// Mobile Cookie Preferences Verification Script
// Run this in browser console on the test page

function verifyMobileFix() {
  console.log('🧪 Starting Mobile Cookie Preferences Verification...');
  console.log('🔧 Testing fixes for z-index layering and positioning issues');

  // Check if we're on the test page
  if (!window.location.pathname.includes('cookie-consent-test')) {
    console.warn('⚠️  Please navigate to /cookie-consent-test first');
    return;
  }
  
  // Test 1: Check if preferences button exists
  const preferencesButton = document.querySelector('[aria-label="Open cookie preferences"]');
  console.log('✅ Preferences button found:', !!preferencesButton);
  
  if (!preferencesButton) {
    console.error('❌ Preferences button not found');
    return;
  }
  
  // Test 2: Simulate mobile viewport
  const originalWidth = window.innerWidth;
  console.log('📱 Original viewport width:', originalWidth);
  
  // Test 3: Check if cookie banner is visible initially
  const cookieBanner = document.querySelector('[class*="z-[9999]"]') ||
                      document.querySelector('[class*="fixed"][class*="bottom-0"]');
  console.log('🍪 Cookie banner found:', !!cookieBanner);

  // Test 4: Click preferences button
  console.log('🖱️  Clicking preferences button...');
  preferencesButton.click();

  // Wait for modal to open
  setTimeout(() => {
    // Test 5: Check if modal is open
    const modal = document.querySelector('[role="dialog"]');
    console.log('✅ Modal opened:', !!modal);

    if (!modal) {
      console.error('❌ Modal did not open');
      return;
    }

    // Test 6: Check if cookie banner is hidden when modal is open
    const bannerHidden = !document.querySelector('[class*="z-[9999]"]:not([style*="display: none"])') ||
                         cookieBanner?.style.display === 'none' ||
                         !cookieBanner?.offsetParent;
    console.log('🍪 Cookie banner hidden when modal open:', bannerHidden);
    
    // Test 7: Check z-index hierarchy
    const modalOverlay = modal.closest('[class*="z-[10000]"]') || modal.querySelector('[class*="z-[10000]"]');
    const modalContent = modal.querySelector('[class*="z-[10001]"]') || modal.closest('[class*="z-[10001]"]');
    console.log('✅ Modal overlay z-index (10000):', !!modalOverlay);
    console.log('✅ Modal content z-index (10001):', !!modalContent);

    // Test 8: Check mobile-specific classes
    const dialogContent = modal.querySelector('[class*="inset-x-4"]');
    console.log('✅ Mobile positioning classes found:', !!dialogContent);

    // Test 9: Check desktop positioning classes
    const desktopPositioning = modal.querySelector('[class*="sm:left-[50%]"]');
    console.log('✅ Desktop centering classes found:', !!desktopPositioning);

    // Test 10: Check button layout
    const buttons = modal.querySelectorAll('button');
    console.log('✅ Number of buttons found:', buttons.length);

    // Test 11: Check responsive text classes
    const title = modal.querySelector('h2');
    const hasResponsiveText = title && title.className.includes('sm:text-');
    console.log('✅ Responsive text classes found:', hasResponsiveText);

    // Test 12: Check switch components
    const switches = modal.querySelectorAll('[role="switch"]');
    console.log('✅ Cookie switches found:', switches.length);

    // Test 13: Check if modal is scrollable
    const hasScrollable = modal.querySelector('[class*="overflow-y-auto"]');
    console.log('✅ Scrollable content area found:', !!hasScrollable);

    // Test 14: Check max height constraint
    const hasMaxHeight = modal.querySelector('[class*="max-h-"]');
    console.log('✅ Max height constraint found:', !!hasMaxHeight);

    // Test 15: Check modal positioning on desktop
    const modalRect = modal.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const isDesktop = viewportWidth >= 768;
    if (isDesktop) {
      const isCentered = Math.abs(modalRect.left + modalRect.width/2 - viewportWidth/2) < 50;
      console.log('🖥️  Desktop modal centered:', isCentered);
      console.log('📐 Modal position - left:', modalRect.left, 'width:', modalRect.width, 'viewport:', viewportWidth);
    }
    
    console.log('🎉 Mobile verification complete!');
    
    // Close modal
    const closeButton = modal.querySelector('[aria-label="Close"]') || 
                       modal.querySelector('button[aria-label*="Cancel"]');
    if (closeButton) {
      setTimeout(() => {
        closeButton.click();
        console.log('🔄 Modal closed');
      }, 2000);
    }
    
  }, 500);
}

// Auto-run if on test page
if (window.location.pathname.includes('cookie-consent-test')) {
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', verifyMobileFix);
  } else {
    setTimeout(verifyMobileFix, 1000);
  }
} else {
  console.log('📍 Navigate to /cookie-consent-test to run verification');
}

// Export for manual use
window.verifyMobileFix = verifyMobileFix;
