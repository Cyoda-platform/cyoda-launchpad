/**
 * ThreeStepSection Mobile Layout Test Script
 * 
 * This script validates the mobile optimizations for the ThreeStepSection component:
 * - Icon sizing is proportional for mobile screens
 * - Section spacing is appropriate between Hero and ThreeStepSection
 * - Typography scales properly
 * - Touch targets remain accessible
 * 
 * Run this in browser console on mobile viewport (375px-414px width)
 */

console.log('🔍 Testing ThreeStepSection Mobile Optimizations...');

function testIconSizing() {
  console.log('\n🎯 Testing Icon Sizing...');
  
  const iconContainers = document.querySelectorAll('[class*="rounded-2xl"][class*="gradient"]');
  const icons = document.querySelectorAll('[class*="rounded-2xl"][class*="gradient"] svg');
  
  if (iconContainers.length === 0) {
    console.log('❌ No icon containers found - make sure you\'re on the homepage');
    return false;
  }
  
  const viewportWidth = window.innerWidth;
  const isMobile = viewportWidth < 640; // sm breakpoint
  const isTablet = viewportWidth >= 640 && viewportWidth < 768; // md breakpoint
  
  console.log(`📱 Viewport: ${viewportWidth}px (${isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'})`);
  
  let correctlySizedContainers = 0;
  let correctlySizedIcons = 0;
  
  iconContainers.forEach((container, index) => {
    const rect = container.getBoundingClientRect();
    const size = Math.round(rect.width);
    
    let expectedSize;
    if (isMobile) expectedSize = 48; // w-12 h-12 = 48px
    else if (isTablet) expectedSize = 56; // w-14 h-14 = 56px  
    else expectedSize = 64; // w-16 h-16 = 64px
    
    const tolerance = 4; // Allow 4px tolerance
    const isCorrectSize = Math.abs(size - expectedSize) <= tolerance;
    
    if (isCorrectSize) {
      correctlySizedContainers++;
    }
    
    console.log(`   Container ${index + 1}: ${size}px (expected ~${expectedSize}px) ${isCorrectSize ? '✅' : '❌'}`);
  });
  
  icons.forEach((icon, index) => {
    const rect = icon.getBoundingClientRect();
    const size = Math.round(rect.width);
    
    let expectedSize;
    if (isMobile) expectedSize = 24; // w-6 h-6 = 24px
    else if (isTablet) expectedSize = 28; // w-7 h-7 = 28px
    else expectedSize = 32; // w-8 h-8 = 32px
    
    const tolerance = 2;
    const isCorrectSize = Math.abs(size - expectedSize) <= tolerance;
    
    if (isCorrectSize) {
      correctlySizedIcons++;
    }
    
    console.log(`   Icon ${index + 1}: ${size}px (expected ~${expectedSize}px) ${isCorrectSize ? '✅' : '❌'}`);
  });
  
  const allCorrect = correctlySizedContainers === iconContainers.length && correctlySizedIcons === icons.length;
  console.log(`\n📊 Icon Sizing: ${correctlySizedContainers}/${iconContainers.length} containers, ${correctlySizedIcons}/${icons.length} icons correctly sized`);
  
  return allCorrect;
}

function testSectionSpacing() {
  console.log('\n📐 Testing Section Spacing...');
  
  const heroSection = document.querySelector('section[class*="min-h-screen"]');
  const threeStepSection = document.querySelector('section[class*="py-16"], section[class*="py-20"], section[class*="py-24"]');
  
  if (!heroSection || !threeStepSection) {
    console.log('❌ Could not find Hero or ThreeStepSection - make sure you\'re on the homepage');
    return false;
  }
  
  const heroRect = heroSection.getBoundingClientRect();
  const threeStepRect = threeStepSection.getBoundingClientRect();
  const gap = threeStepRect.top - heroRect.bottom;
  
  console.log(`📏 Gap between Hero and ThreeStepSection: ${Math.round(gap)}px`);
  
  // Check section padding
  const sectionStyle = window.getComputedStyle(threeStepSection);
  const paddingTop = parseFloat(sectionStyle.paddingTop);
  const paddingBottom = parseFloat(sectionStyle.paddingBottom);
  
  const viewportWidth = window.innerWidth;
  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 768;
  
  let expectedPadding;
  if (isMobile) expectedPadding = 64; // py-16 = 64px
  else if (isTablet) expectedPadding = 80; // py-20 = 80px
  else expectedPadding = 96; // py-24 = 96px
  
  const tolerance = 8;
  const isPaddingCorrect = Math.abs(paddingTop - expectedPadding) <= tolerance;
  
  console.log(`📱 Section padding: ${Math.round(paddingTop)}px (expected ~${expectedPadding}px) ${isPaddingCorrect ? '✅' : '❌'}`);
  
  // Check if spacing feels appropriate (not too much white space)
  const isSpacingAppropriate = gap < 100; // Less than 100px gap is reasonable
  console.log(`🎯 Spacing appropriateness: ${isSpacingAppropriate ? '✅' : '❌'} (${Math.round(gap)}px gap)`);
  
  return isPaddingCorrect && isSpacingAppropriate;
}

function testTypography() {
  console.log('\n📝 Testing Typography Scaling...');
  
  const heading = document.querySelector('h2[class*="text-gradient-primary"]');
  const subtitle = document.querySelector('h2[class*="text-gradient-primary"] + p');
  const stepTitles = document.querySelectorAll('h3[class*="font-bold"]');
  const stepDescriptions = document.querySelectorAll('h3[class*="font-bold"] + p');
  
  if (!heading) {
    console.log('❌ Could not find section heading');
    return false;
  }
  
  const viewportWidth = window.innerWidth;
  const isMobile = viewportWidth < 640;
  
  // Test main heading
  const headingStyle = window.getComputedStyle(heading);
  const headingSize = parseFloat(headingStyle.fontSize);
  const expectedHeadingSize = isMobile ? 30 : 36; // mobile-text-3xl scales from text-2xl to text-3xl
  const headingSizeOk = Math.abs(headingSize - expectedHeadingSize) <= 6;
  
  console.log(`📰 Main heading: ${Math.round(headingSize)}px (expected ~${expectedHeadingSize}px) ${headingSizeOk ? '✅' : '❌'}`);
  
  // Test subtitle
  if (subtitle) {
    const subtitleStyle = window.getComputedStyle(subtitle);
    const subtitleSize = parseFloat(subtitleStyle.fontSize);
    const expectedSubtitleSize = isMobile ? 18 : 20; // mobile-text-lg
    const subtitleSizeOk = Math.abs(subtitleSize - expectedSubtitleSize) <= 4;
    
    console.log(`📄 Subtitle: ${Math.round(subtitleSize)}px (expected ~${expectedSubtitleSize}px) ${subtitleSizeOk ? '✅' : '❌'}`);
  }
  
  // Test step titles
  let correctStepTitles = 0;
  stepTitles.forEach((title, index) => {
    const titleStyle = window.getComputedStyle(title);
    const titleSize = parseFloat(titleStyle.fontSize);
    const expectedTitleSize = isMobile ? 20 : 24; // mobile-text-xl
    const titleSizeOk = Math.abs(titleSize - expectedTitleSize) <= 4;
    
    if (titleSizeOk) correctStepTitles++;
    console.log(`   Step ${index + 1} title: ${Math.round(titleSize)}px (expected ~${expectedTitleSize}px) ${titleSizeOk ? '✅' : '❌'}`);
  });
  
  // Test step descriptions
  let correctStepDescriptions = 0;
  stepDescriptions.forEach((desc, index) => {
    const descStyle = window.getComputedStyle(desc);
    const descSize = parseFloat(descStyle.fontSize);
    const expectedDescSize = isMobile ? 14 : 16; // mobile-text-sm
    const descSizeOk = Math.abs(descSize - expectedDescSize) <= 2;
    
    if (descSizeOk) correctStepDescriptions++;
    console.log(`   Step ${index + 1} description: ${Math.round(descSize)}px (expected ~${expectedDescSize}px) ${descSizeOk ? '✅' : '❌'}`);
  });
  
  const typographyOk = headingSizeOk && correctStepTitles === stepTitles.length && correctStepDescriptions === stepDescriptions.length;
  console.log(`\n📊 Typography: ${correctStepTitles}/${stepTitles.length} titles, ${correctStepDescriptions}/${stepDescriptions.length} descriptions correctly sized`);
  
  return typographyOk;
}

function testAccessibility() {
  console.log('\n♿ Testing Accessibility...');
  
  const interactiveElements = document.querySelectorAll('button, a, [role="button"], [tabindex="0"]');
  let accessibleElements = 0;
  
  interactiveElements.forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    const minSize = 44;
    const isAccessible = rect.width >= minSize && rect.height >= minSize;
    
    if (isAccessible) accessibleElements++;
  });
  
  console.log(`✅ ${accessibleElements}/${interactiveElements.length} interactive elements meet 44px minimum touch target`);
  
  return accessibleElements === interactiveElements.length;
}

function runAllTests() {
  console.log('🚀 Running ThreeStepSection Mobile Tests...\n');
  
  const results = {
    iconSizing: testIconSizing(),
    sectionSpacing: testSectionSpacing(),
    typography: testTypography(),
    accessibility: testAccessibility()
  };
  
  console.log('\n📊 Test Summary:');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  console.log(`\n${allPassed ? '🎉' : '⚠️'} Overall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME ISSUES FOUND'}`);
  
  if (allPassed) {
    console.log('\n💡 Great! The ThreeStepSection mobile optimizations are working correctly.');
  } else {
    console.log('\n💡 Some issues found. Check the individual test results above.');
  }
  
  return results;
}

// Auto-run tests
runAllTests();

// Export for manual testing
window.threeStepMobileTest = {
  runAllTests,
  testIconSizing,
  testSectionSpacing,
  testTypography,
  testAccessibility
};

console.log('\n💡 Tip: You can run individual tests by calling:');
console.log('   window.threeStepMobileTest.testIconSizing()');
console.log('   window.threeStepMobileTest.testSectionSpacing()');
console.log('   etc.');
