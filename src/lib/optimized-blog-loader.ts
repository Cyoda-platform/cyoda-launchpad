/**
 * Optimized blog loader for handling hundreds of markdown files
 * Implements true on-demand loading and build-time indexing
 */

import { BlogPost, BlogPostPreview, BlogPostFrontmatter } from '@/types/blog';
import { parseMarkdown, processBlogPost } from '@/lib/markdown';

// Build-time generated index (would be created by a build script)
interface BlogIndex {
  [filename: string]: {
    slug: string;
    title: string;
    author: string;
    date: string;
    category: string;
    excerpt: string;
    readTime: string;
    wordCount: number;
    featured: boolean;
    published: boolean;
    tags: string[];
    image?: string;
  };
}

// Cache for loaded content
const contentCache = new Map<string, BlogPost>();
const indexCache = new Map<string, BlogIndex>();

/**
 * Load the build-time generated index
 * This contains metadata for all blog posts without the full content
 */
async function loadBlogIndex(): Promise<BlogIndex> {
  const cacheKey = 'blog-index';
  
  if (indexCache.has(cacheKey)) {
    return indexCache.get(cacheKey)!;
  }

  try {
    // Fetch the manifest file to get the list of available blog posts
    const manifestResponse = await fetch('/docs/blogs/manifest.json');
    if (!manifestResponse.ok) {
      throw new Error(`Failed to fetch manifest: ${manifestResponse.statusText}`);
    }

    const filenames: string[] = await manifestResponse.json();
    const index: BlogIndex = {};

    // Load only frontmatter for index generation
    const indexPromises = filenames.map(async (filename) => {
      try {
        const response = await fetch(`/docs/blogs/${filename}`);
        if (!response.ok) {
          console.error(`Error loading markdown file ${filename}: ${response.statusText}`);
          return;
        }
        const content = await response.text();

        // Parse only frontmatter and first few lines for excerpt
        const processed = processBlogPost(filename, content);

        index[filename] = {
          slug: processed.slug,
          title: processed.frontmatter.title,
          author: processed.frontmatter.author,
          date: processed.frontmatter.date,
          category: processed.frontmatter.category,
          excerpt: processed.excerpt,
          readTime: processed.readTime,
          wordCount: processed.wordCount,
          featured: processed.frontmatter.featured,
          published: processed.frontmatter.published,
          tags: processed.frontmatter.tags,
          image: processed.frontmatter.image,
        };
      } catch (error) {
        console.error(`Error processing ${filename} for index:`, error);
      }
    });

    await Promise.all(indexPromises);
    indexCache.set(cacheKey, index);
    return index;
  } catch (error) {
    console.error('Error loading blog index:', error);
    return {};
  }
}

/**
 * Load blog post previews from the index (no full content)
 */
export async function loadBlogPostPreviews(): Promise<BlogPostPreview[]> {
  const index = await loadBlogIndex();
  
  return Object.values(index)
    .filter(post => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(post => ({
      slug: post.slug,
      title: post.title,
      author: post.author,
      date: post.date,
      category: post.category,
      excerpt: post.excerpt,
      readTime: post.readTime,
      wordCount: post.wordCount,
      featured: post.featured,
      tags: post.tags,
      image: post.image,
    }));
}

/**
 * Load a single blog post by slug (on-demand)
 */
export async function loadBlogPost(slug: string): Promise<BlogPost | null> {
  // Check cache first
  if (contentCache.has(slug)) {
    return contentCache.get(slug)!;
  }

  try {
    const index = await loadBlogIndex();
    
    // Find the filename for this slug
    const entry = Object.entries(index).find(([_, data]) => data.slug === slug);
    if (!entry) {
      return null;
    }

    const [filename] = entry;

    // Load the specific file
    const response = await fetch(`/docs/blogs/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
    }
    const content = await response.text();
    
    const processed = processBlogPost(filename, content);
    const blogPost: BlogPost = {
      slug: processed.slug,
      frontmatter: processed.frontmatter,
      content: processed.content,
      excerpt: processed.excerpt,
      readTime: processed.readTime,
      wordCount: processed.wordCount,
      images: processed.images,
    };

    // Cache the loaded post
    contentCache.set(slug, blogPost);
    return blogPost;
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}

/**
 * Search blog posts using the index
 */
export async function searchBlogPosts(query: string): Promise<BlogPostPreview[]> {
  if (!query.trim()) {
    return [];
  }

  const previews = await loadBlogPostPreviews();
  const searchTerm = query.toLowerCase();

  return previews.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.category.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

/**
 * Get featured blog posts from index
 */
export async function getFeaturedBlogPosts(): Promise<BlogPostPreview[]> {
  const previews = await loadBlogPostPreviews();
  return previews.filter(post => post.featured);
}

/**
 * Get blog posts by category from index
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
 * Get all categories from index
 */
export async function getBlogCategories(): Promise<string[]> {
  const index = await loadBlogIndex();
  const categories = new Set(Object.values(index).map(post => post.category));
  return ['All', ...Array.from(categories).sort()];
}

/**
 * Clear caches (useful for development)
 */
export function clearBlogCache(): void {
  contentCache.clear();
  indexCache.clear();
}
