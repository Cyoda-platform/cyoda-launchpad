#!/usr/bin/env node

/**
 * Build-time script to generate blog post index
 * This creates a lightweight JSON index of all blog posts for fast loading
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility functions (simplified versions from markdown.ts)
function createSlug(filename) {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractExcerpt(content, maxWords = 30) {
  const text = content
    .replace(/^#+\s+.*$/gm, '') // Remove headings
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/[*_~`]/g, '') // Remove markdown formatting
    .replace(/\s+/g, ' ')
    .trim();

  const words = text.split(' ').slice(0, maxWords);
  return words.join(' ') + (words.length >= maxWords ? '...' : '');
}

function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

function countWords(content) {
  return content.trim().split(/\s+/).length;
}

function validateAndSanitizeString(value, defaultValue = '') {
  if (typeof value !== 'string') return defaultValue;
  return value.trim() || defaultValue;
}

function validateDate(date) {
  if (!date) return new Date().toISOString().split('T')[0];
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? new Date().toISOString().split('T')[0] : date;
}

function validateTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags.filter(tag => typeof tag === 'string' && tag.trim()).map(tag => tag.trim());
}

async function generateBlogIndex() {
  const blogsDir = path.join(__dirname, '../src/docs/blogs');
  const outputPath = path.join(__dirname, '../src/data/blog-index.json');
  
  console.log('🔍 Scanning for blog posts...');
  
  if (!fs.existsSync(blogsDir)) {
    console.error(`❌ Blog directory not found: ${blogsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(blogsDir).filter(file => file.endsWith('.md'));
  console.log(`📄 Found ${files.length} markdown files`);

  const index = {};
  let processed = 0;
  let errors = 0;

  for (const filename of files) {
    try {
      const filePath = path.join(blogsDir, filename);
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      
      const { data, content } = matter(rawContent);
      
      // Process frontmatter with validation
      const frontmatter = {
        title: validateAndSanitizeString(data.title, 'Untitled'),
        author: validateAndSanitizeString(data.author, 'Anonymous'),
        date: validateDate(data.date),
        category: validateAndSanitizeString(data.category, 'General'),
        excerpt: data.excerpt ? validateAndSanitizeString(data.excerpt) : undefined,
        readTime: data.readTime ? validateAndSanitizeString(data.readTime) : undefined,
        tags: validateTags(data.tags),
        image: data.image ? validateAndSanitizeString(data.image) : undefined,
        featured: Boolean(data.featured),
        published: data.published !== false, // Default to true unless explicitly false
      };

      const slug = createSlug(filename);
      const excerpt = frontmatter.excerpt || extractExcerpt(content);
      const readTime = frontmatter.readTime || calculateReadTime(content);
      const wordCount = countWords(content);

      index[filename] = {
        slug,
        title: frontmatter.title,
        author: frontmatter.author,
        date: frontmatter.date,
        category: frontmatter.category,
        excerpt,
        readTime,
        wordCount,
        featured: frontmatter.featured,
        published: frontmatter.published,
        tags: frontmatter.tags,
        image: frontmatter.image,
      };

      processed++;
      console.log(`✅ Processed: ${filename} -> ${slug}`);
    } catch (error) {
      errors++;
      console.error(`❌ Error processing ${filename}:`, error.message);
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write index file
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
  
  console.log('\n📊 Generation Summary:');
  console.log(`   Total files: ${files.length}`);
  console.log(`   Processed: ${processed}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Output: ${outputPath}`);
  console.log(`   Index size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
  
  if (errors > 0) {
    console.log('\n⚠️  Some files had errors. Check the logs above.');
    process.exit(1);
  }
  
  console.log('\n🎉 Blog index generated successfully!');
}

// Run the script
generateBlogIndex().catch(error => {
  console.error('❌ Failed to generate blog index:', error);
  process.exit(1);
});
