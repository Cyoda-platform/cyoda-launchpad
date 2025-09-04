import { BlogPost, BlogPostPreview } from '@/types/blog';
import { processBlogPost, createBlogPostPreview } from './markdown';
import { logBlogPostsLoad, logMarkdownProcessing, logCacheOperation } from '@/lib/logger';

// Since we're in a browser environment, we'll need to handle file loading differently
// For now, we'll create a system that can be easily extended to work with a build-time
// static generation or a server-side API

/**
 * Blog posts data - For now using static imports since we're in a browser environment
 * In a production setup, this would be replaced with build-time static generation
 * or server-side file system reading
 */

// Cache for loaded markdown files to avoid re-processing
let markdownFilesCache: Record<string, string> | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in development

/**
 * Load all markdown files from the blogs directory using Vite's glob import
 * This approach works in both development and production builds
 */
async function loadMarkdownFiles(): Promise<Record<string, string>> {
  try {
    // Check cache first (only in development for auto-refresh)
    const now = Date.now();
    if (markdownFilesCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return markdownFilesCache;
    }

    const files: Record<string, string> = {};

    // Use Vite's glob import to dynamically load all markdown files
    // This works in both development and production builds
    const modules = import.meta.glob('/src/docs/blogs/*.md', {
      query: '?raw',
      import: 'default',
      eager: false
    });

    // Load all markdown files
    const loadPromises = Object.entries(modules).map(async ([path, importFn]) => {
      try {
        const content = await importFn();
        const filename = path.split('/').pop() || path;
        files[filename] = content as string;
      } catch (error) {
        console.error(`Error loading markdown file ${path}:`, error);
        // Continue loading other files even if one fails
      }
    });

    await Promise.all(loadPromises);

    // Update cache
    markdownFilesCache = files;
    cacheTimestamp = now;

    return files;
  } catch (error) {
    console.error('Error loading markdown files:', error);

    // Fallback: try to load the known file directly
    try {
      const cyodaComparison = await import('/src/docs/blogs/cyoda_comparison_by_category.md?raw');
      return {
        'cyoda_comparison_by_category.md': cyodaComparison.default
      };
    } catch (fallbackError) {
      console.error('Fallback loading also failed:', fallbackError);

      // Last resort: return empty object
      return {};
    }
  }
}

/**
 * Load all blog posts with enhanced error handling
 */
export async function loadBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];
  const errors: Array<{ filename: string; error: string }> = [];

  try {
    const markdownFiles = await loadMarkdownFiles();

    if (Object.keys(markdownFiles).length === 0) {
      console.warn('No markdown files found in src/docs/blogs directory');
      return [];
    }

    for (const [filename, content] of Object.entries(markdownFiles)) {
      try {
        // Validate content is not empty
        if (!content || content.trim().length === 0) {
          errors.push({ filename, error: 'File is empty' });
          continue;
        }

        const blogPost = processBlogPost(filename, content);

        // Validate required frontmatter fields
        if (!blogPost.frontmatter.title || blogPost.frontmatter.title.trim() === '') {
          errors.push({ filename, error: 'Missing or empty title in frontmatter' });
          continue;
        }

        if (!blogPost.frontmatter.date) {
          errors.push({ filename, error: 'Missing date in frontmatter' });
          continue;
        }

        // Validate date format
        const dateObj = new Date(blogPost.frontmatter.date);
        if (isNaN(dateObj.getTime())) {
          errors.push({ filename, error: 'Invalid date format in frontmatter' });
          continue;
        }

        // Only include published posts
        if (blogPost.frontmatter.published) {
          posts.push(blogPost);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ filename, error: errorMessage });
        console.error(`Error processing blog post ${filename}:`, error);
      }
    }

    // Log summary of errors if any
    if (errors.length > 0) {
      console.warn(`Failed to process ${errors.length} blog post(s):`, errors);
    }

    console.log(`Successfully loaded ${posts.length} blog post(s)`);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    throw new Error(`Failed to load blog posts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

/**
 * Load blog post previews (lighter weight for listing pages)
 */
export async function loadBlogPostPreviews(): Promise<BlogPostPreview[]> {
  const posts = await loadBlogPosts();
  return posts.map(createBlogPostPreview);
}

/**
 * Load a single blog post by slug
 */
export async function loadBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await loadBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}

/**
 * Get featured blog posts
 */
export async function getFeaturedBlogPosts(): Promise<BlogPostPreview[]> {
  const previews = await loadBlogPostPreviews();
  return previews.filter(post => post.featured);
}

/**
 * Get blog posts by category
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPostPreview[]> {
  const previews = await loadBlogPostPreviews();
  
  if (category.toLowerCase() === 'all') {
    return previews;
  }
  
  return previews.filter(post => 
    post.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get all unique categories from blog posts
 */
export async function getBlogCategories(): Promise<string[]> {
  const previews = await loadBlogPostPreviews();
  const categories = new Set(previews.map(post => post.category));
  return ['All', ...Array.from(categories).sort()];
}

/**
 * Search blog posts by title or content
 */
export async function searchBlogPosts(query: string): Promise<BlogPostPreview[]> {
  const posts = await loadBlogPosts();
  const searchTerm = query.toLowerCase();

  return posts
    .filter(post =>
      post.frontmatter.title.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      (post.frontmatter.tags && post.frontmatter.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm)
      ))
    )
    .map(createBlogPostPreview);
}

/**
 * Clear the markdown files cache - useful for development
 */
export function clearBlogCache(): void {
  markdownFilesCache = null;
  cacheTimestamp = 0;
  console.log('Blog cache cleared');
}

/**
 * Get cache status - useful for debugging
 */
export function getBlogCacheStatus(): { cached: boolean; age: number; fileCount: number } {
  const now = Date.now();
  const age = cacheTimestamp > 0 ? now - cacheTimestamp : 0;

  return {
    cached: markdownFilesCache !== null,
    age,
    fileCount: markdownFilesCache ? Object.keys(markdownFilesCache).length : 0
  };
}

// TODO: Replace mock data with actual file system reading
// This would typically be done at build time for static sites
// or server-side for dynamic sites

/**
 * Future implementation for reading actual markdown files
 * This would be used in a Node.js environment or build process
 */
/*
import fs from 'fs';
import path from 'path';

const BLOGS_DIRECTORY = path.join(process.cwd(), 'src/docs/blogs');

export async function loadBlogPostsFromFiles(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];
  
  try {
    const files = fs.readdirSync(BLOGS_DIRECTORY);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    for (const filename of markdownFiles) {
      const filePath = path.join(BLOGS_DIRECTORY, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      try {
        const blogPost = processBlogPost(filename, content);
        
        if (blogPost.frontmatter.published) {
          posts.push(blogPost);
        }
      } catch (error) {
        console.error(`Error processing blog post ${filename}:`, error);
      }
    }
    
    return posts.sort((a, b) => 
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    );
  } catch (error) {
    console.error('Error loading blog posts from files:', error);
    return [];
  }
}
*/
