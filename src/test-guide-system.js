// Quick test script to verify guide loading works
// This can be run in the browser console or as a Node.js script

import { loadGuides, loadGuidePreviews, getGuideCategories } from './lib/guide-loader.js';

async function testGuideSystem() {
  console.log('🧪 Testing Guide System...\n');

  try {
    // Test loading guides
    console.log('📚 Loading guides...');
    const guides = await loadGuides();
    console.log(`✅ Successfully loaded ${guides.length} guides`);
    
    guides.forEach((guide, index) => {
      console.log(`  ${index + 1}. ${guide.frontmatter.title}`);
      console.log(`     - Slug: ${guide.slug}`);
      console.log(`     - Author: ${guide.frontmatter.author}`);
      console.log(`     - Category: ${guide.frontmatter.category}`);
      console.log(`     - Date: ${guide.frontmatter.date}`);
      console.log(`     - Featured: ${guide.frontmatter.featured ? 'Yes' : 'No'}`);
      console.log(`     - Published: ${guide.frontmatter.published ? 'Yes' : 'No'}`);
      console.log(`     - Read Time: ${guide.readTime}`);
      console.log(`     - Word Count: ${guide.wordCount}`);
      console.log(`     - Images: ${guide.images.length}`);
      console.log(`     - Tags: ${guide.frontmatter.tags ? guide.frontmatter.tags.join(', ') : 'None'}`);
      console.log(`     - Excerpt: ${guide.excerpt.substring(0, 100)}...`);
      console.log('');
    });

    // Test loading previews
    console.log('📋 Loading guide previews...');
    const previews = await loadGuidePreviews();
    console.log(`✅ Successfully loaded ${previews.length} guide previews`);

    // Test categories
    console.log('🏷️  Loading categories...');
    const categories = await getGuideCategories();
    console.log(`✅ Successfully loaded ${categories.length} categories: ${categories.join(', ')}`);

    console.log('\n🎉 All tests passed! Guide system is working correctly.');
    
    return {
      guides,
      previews,
      categories,
      success: true
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      error: error.message,
      success: false
    };
  }
}

// Export for use in other modules
export { testGuideSystem };

// If running directly in browser console, you can call:
// testGuideSystem().then(result => console.log('Test result:', result));
