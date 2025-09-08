#!/usr/bin/env node

/**
 * Comprehensive test script for the Guides routing and validation functionality
 * Tests all the acceptance criteria from the task:
 * - Routes /guides and /guides/:slug are properly configured and functional
 * - Navigation from header menu to guides works seamlessly
 * - Individual guide pages load correctly with proper URL slugs
 * - 404 handling works for non-existent guide pages
 * - SEO metadata and social sharing function properly
 * - Breadcrumb navigation works correctly
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8080';
const TEST_RESULTS = [];

// Helper function to log test results
function logTest(testName, passed, details = '') {
  const result = {
    test: testName,
    passed,
    details,
    timestamp: new Date().toISOString()
  };
  TEST_RESULTS.push(result);
  console.log(`${passed ? '✅' : '❌'} ${testName}${details ? ': ' + details : ''}`);
}

// Helper function to wait for element
async function waitForElement(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    return false;
  }
}

// Test 1: Verify /guides route loads correctly
async function testGuidesListingRoute(page) {
  console.log('\n🧪 Testing /guides route...');
  
  try {
    await page.goto(`${BASE_URL}/guides`, { waitUntil: 'networkidle0' });
    
    // Check if page loaded successfully
    const title = await page.title();
    const hasGuidesTitle = title.includes('Guides') || title.includes('Cyoda');
    logTest('Guides listing page loads', hasGuidesTitle, `Title: ${title}`);
    
    // Check for guides listing elements
    const hasHeader = await waitForElement(page, 'header');
    logTest('Header is present', hasHeader);
    
    const hasFooter = await waitForElement(page, 'footer');
    logTest('Footer is present', hasFooter);
    
    // Check for guides content
    const hasGuidesContent = await page.$('h1, h2, .guide-card, [data-testid="guides"]') !== null;
    logTest('Guides content is present', hasGuidesContent);
    
    return true;
  } catch (error) {
    logTest('Guides listing route test', false, error.message);
    return false;
  }
}

// Test 2: Verify individual guide routes work
async function testIndividualGuideRoutes(page) {
  console.log('\n🧪 Testing individual guide routes...');
  
  const testSlugs = [
    'building-hello-world-application-with-cyoda',
    'building-agentic-ai-applications-with-cyoda-online-platform'
  ];
  
  for (const slug of testSlugs) {
    try {
      await page.goto(`${BASE_URL}/guides/${slug}`, { waitUntil: 'networkidle0' });
      
      const title = await page.title();
      const hasValidTitle = title && title !== 'Page Not Found';
      logTest(`Guide route /guides/${slug}`, hasValidTitle, `Title: ${title}`);
      
      // Check for guide content elements
      const hasArticle = await page.$('article, main, .guide-content') !== null;
      logTest(`Guide content for ${slug}`, hasArticle);
      
      // Check for breadcrumbs
      const hasBreadcrumbs = await page.$('[role="navigation"], .breadcrumb, nav') !== null;
      logTest(`Breadcrumbs for ${slug}`, hasBreadcrumbs);
      
    } catch (error) {
      logTest(`Guide route /guides/${slug}`, false, error.message);
    }
  }
}

// Test 3: Test 404 handling for non-existent guides
async function test404Handling(page) {
  console.log('\n🧪 Testing 404 handling...');
  
  const nonExistentSlugs = [
    'non-existent-guide',
    'fake-guide-slug',
    'this-guide-does-not-exist'
  ];
  
  for (const slug of nonExistentSlugs) {
    try {
      const response = await page.goto(`${BASE_URL}/guides/${slug}`, { waitUntil: 'networkidle0' });
      
      // Check if it shows 404 content or guide not found
      const pageContent = await page.content();
      const is404 = pageContent.includes('Not Found') || 
                   pageContent.includes('404') || 
                   pageContent.includes('doesn\'t exist') ||
                   response.status() === 404;
      
      logTest(`404 handling for /guides/${slug}`, is404);
      
    } catch (error) {
      logTest(`404 test for /guides/${slug}`, false, error.message);
    }
  }
}

// Test 4: Test navigation from header menu
async function testHeaderNavigation(page) {
  console.log('\n🧪 Testing header navigation...');
  
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    
    // Look for guides link in navigation
    const guidesLink = await page.$('a[href="/guides"], a[href*="guides"]');
    const hasGuidesLink = guidesLink !== null;
    logTest('Guides link in header navigation', hasGuidesLink);
    
    if (hasGuidesLink) {
      // Click the guides link
      await guidesLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      const currentUrl = page.url();
      const navigatedToGuides = currentUrl.includes('/guides');
      logTest('Navigation to guides from header', navigatedToGuides, `URL: ${currentUrl}`);
    }
    
  } catch (error) {
    logTest('Header navigation test', false, error.message);
  }
}

// Test 5: Test SEO metadata
async function testSEOMetadata(page) {
  console.log('\n🧪 Testing SEO metadata...');
  
  try {
    // Test guides listing page SEO
    await page.goto(`${BASE_URL}/guides`, { waitUntil: 'networkidle0' });
    
    const title = await page.title();
    const hasTitle = title && title.length > 0;
    logTest('Guides listing has title', hasTitle, title);
    
    const metaDescription = await page.$eval('meta[name="description"]', el => el.content).catch(() => null);
    const hasDescription = metaDescription && metaDescription.length > 0;
    logTest('Guides listing has meta description', hasDescription, metaDescription);
    
    // Test individual guide SEO
    await page.goto(`${BASE_URL}/guides/building-hello-world-application-with-cyoda`, { waitUntil: 'networkidle0' });
    
    const guideTitle = await page.title();
    const hasGuideTitle = guideTitle && guideTitle.length > 0;
    logTest('Individual guide has title', hasGuideTitle, guideTitle);
    
    const guideDescription = await page.$eval('meta[name="description"]', el => el.content).catch(() => null);
    const hasGuideDescription = guideDescription && guideDescription.length > 0;
    logTest('Individual guide has meta description', hasGuideDescription);
    
    // Check for Open Graph tags
    const ogTitle = await page.$eval('meta[property="og:title"]', el => el.content).catch(() => null);
    const hasOgTitle = ogTitle && ogTitle.length > 0;
    logTest('Guide has Open Graph title', hasOgTitle, ogTitle);
    
    const ogDescription = await page.$eval('meta[property="og:description"]', el => el.content).catch(() => null);
    const hasOgDescription = ogDescription && ogDescription.length > 0;
    logTest('Guide has Open Graph description', hasOgDescription);
    
  } catch (error) {
    logTest('SEO metadata test', false, error.message);
  }
}

// Test 6: Test social sharing functionality
async function testSocialSharing(page) {
  console.log('\n🧪 Testing social sharing...');
  
  try {
    await page.goto(`${BASE_URL}/guides/building-hello-world-application-with-cyoda`, { waitUntil: 'networkidle0' });
    
    // Look for social sharing buttons
    const socialButtons = await page.$$('button[title*="Twitter"], button[title*="LinkedIn"], button[title*="Facebook"], a[href*="twitter.com"], a[href*="linkedin.com"], a[href*="facebook.com"]');
    const hasSocialSharing = socialButtons.length > 0;
    logTest('Social sharing buttons present', hasSocialSharing, `Found ${socialButtons.length} social buttons`);
    
    // Test copy link functionality if present
    const copyButton = await page.$('button[title*="Copy"], button[title*="Link"]');
    if (copyButton) {
      logTest('Copy link button present', true);
    }
    
  } catch (error) {
    logTest('Social sharing test', false, error.message);
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Guides Routing and Validation Tests...\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport and user agent
  await page.setViewport({ width: 1280, height: 720 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
  try {
    // Run all tests
    await testGuidesListingRoute(page);
    await testIndividualGuideRoutes(page);
    await test404Handling(page);
    await testHeaderNavigation(page);
    await testSEOMetadata(page);
    await testSocialSharing(page);
    
  } catch (error) {
    console.error('Test runner error:', error);
  } finally {
    await browser.close();
  }
  
  // Generate test report
  console.log('\n📊 Test Results Summary:');
  const passedTests = TEST_RESULTS.filter(r => r.passed).length;
  const totalTests = TEST_RESULTS.length;
  
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Guides routing and validation is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the results above.');
  }
  
  // Save detailed results to file
  const reportPath = path.join(__dirname, 'test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(TEST_RESULTS, null, 2));
  console.log(`\n📄 Detailed test results saved to: ${reportPath}`);
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };
