// Theme Debug Script - Run in browser console
// Navigate to http://localhost:8081/blog first

function debugThemeIssues() {
  console.log('🔍 Debugging Theme Issues...');
  
  // 1. Check if theme provider is working
  const htmlElement = document.documentElement;
  console.log('📋 Current HTML classes:', htmlElement.className);
  console.log('📋 Has dark class:', htmlElement.classList.contains('dark'));
  
  // 2. Test theme switching
  console.log('\n🔄 Testing theme switching...');
  
  // Force light mode
  htmlElement.classList.remove('dark');
  console.log('☀️ Switched to light mode');
  console.log('📋 HTML classes after light:', htmlElement.className);
  
  setTimeout(() => {
    // Check CSS variables in light mode
    const computedStyle = getComputedStyle(htmlElement);
    console.log('\n🎨 Light mode CSS variables:');
    console.log('--primary:', computedStyle.getPropertyValue('--primary'));
    console.log('--card:', computedStyle.getPropertyValue('--card'));
    console.log('--foreground:', computedStyle.getPropertyValue('--foreground'));
    console.log('--border:', computedStyle.getPropertyValue('--border'));
    
    // Check blog elements in light mode
    console.log('\n🔍 Blog elements in light mode:');
    const categoryBadges = document.querySelectorAll('[class*="bg-primary"]');
    console.log('Category badges found:', categoryBadges.length);
    
    if (categoryBadges.length > 0) {
      const firstBadge = categoryBadges[0];
      console.log('First badge classes:', firstBadge.className);
      const badgeStyle = getComputedStyle(firstBadge);
      console.log('Badge computed background:', badgeStyle.backgroundColor);
      console.log('Badge computed color:', badgeStyle.color);
    }
    
    const blogCards = document.querySelectorAll('[class*="bg-card"]');
    console.log('Blog cards found:', blogCards.length);
    
    if (blogCards.length > 0) {
      const firstCard = blogCards[0];
      console.log('First card classes:', firstCard.className);
      const cardStyle = getComputedStyle(firstCard);
      console.log('Card computed background:', cardStyle.backgroundColor);
    }
    
    // Force dark mode
    setTimeout(() => {
      htmlElement.classList.add('dark');
      console.log('\n🌙 Switched to dark mode');
      console.log('📋 HTML classes after dark:', htmlElement.className);
      
      setTimeout(() => {
        // Check CSS variables in dark mode
        const computedStyleDark = getComputedStyle(htmlElement);
        console.log('\n🎨 Dark mode CSS variables:');
        console.log('--primary:', computedStyleDark.getPropertyValue('--primary'));
        console.log('--card:', computedStyleDark.getPropertyValue('--card'));
        console.log('--foreground:', computedStyleDark.getPropertyValue('--foreground'));
        console.log('--border:', computedStyleDark.getPropertyValue('--border'));
        
        // Compare values
        console.log('\n📊 Comparison:');
        console.log('Primary changed:', 
          computedStyle.getPropertyValue('--primary') !== computedStyleDark.getPropertyValue('--primary'));
        console.log('Card changed:', 
          computedStyle.getPropertyValue('--card') !== computedStyleDark.getPropertyValue('--card'));
        
        // Check if Tailwind classes are working
        console.log('\n🎯 Tailwind class test:');
        const testElement = document.createElement('div');
        testElement.className = 'bg-primary/30 dark:bg-primary/20 text-primary';
        document.body.appendChild(testElement);
        
        const testStyle = getComputedStyle(testElement);
        console.log('Test element background:', testStyle.backgroundColor);
        console.log('Test element color:', testStyle.color);
        
        document.body.removeChild(testElement);
        
        console.log('\n✅ Theme debug complete!');
      }, 100);
    }, 1000);
  }, 100);
}

// Auto-run if on blog page
if (window.location.pathname.includes('/blog')) {
  debugThemeIssues();
} else {
  console.log('⚠️ Please navigate to /blog first, then run debugThemeIssues()');
}
