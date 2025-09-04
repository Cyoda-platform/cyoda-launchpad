import matter from 'gray-matter';
import { BlogPost, BlogPostFrontmatter, BlogPostPreview } from '@/types/blog';

/**
 * Parse markdown content with frontmatter and enhanced error handling
 */
export function parseMarkdown(content: string): {
  frontmatter: BlogPostFrontmatter;
  content: string;
} {
  if (!content || typeof content !== 'string') {
    throw new Error('Content must be a non-empty string');
  }

  try {
    const { data, content: markdownContent } = matter(content);

    // Validate and sanitize frontmatter data
    const frontmatter: BlogPostFrontmatter = {
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

    return {
      frontmatter,
      content: markdownContent || '',
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse markdown frontmatter: ${error.message}`);
    }
    throw new Error('Failed to parse markdown frontmatter: Unknown error');
  }
}

/**
 * Validate and sanitize string fields
 */
function validateAndSanitizeString(value: any, defaultValue?: string): string | undefined {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  if (typeof value !== 'string') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Expected string but got ${typeof value}`);
  }

  const sanitized = value.trim();
  if (sanitized.length === 0 && defaultValue !== undefined) {
    return defaultValue;
  }

  return sanitized || undefined;
}

/**
 * Validate date field
 */
function validateDate(value: any): string {
  if (!value) {
    return new Date().toISOString();
  }

  if (typeof value !== 'string') {
    return new Date().toISOString();
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${value}`);
  }

  return value;
}

/**
 * Validate tags array
 */
function validateTags(value: any): string[] {
  if (!value) {
    return [];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
    .map(tag => tag.trim());
}

/**
 * Extract first N words from markdown content (excluding frontmatter)
 */
export function extractExcerpt(content: string, wordCount: number = 50): string {
  // Remove markdown formatting
  const plainText = content
    .replace(/^#{1,6}\s+/gm, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
    .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  return words.slice(0, wordCount).join(' ') + (words.length > wordCount ? '...' : '');
}

/**
 * Calculate estimated reading time based on word count
 */
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).filter(word => word.length > 0);
  const minutes = Math.ceil(words.length / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Count words in content
 */
export function countWords(content: string): number {
  return content.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Extract image URLs from markdown content and frontmatter
 */
export function extractImages(content: string, frontmatter: BlogPostFrontmatter): string[] {
  const images: string[] = [];
  
  // Add frontmatter image if exists
  if (frontmatter.image) {
    images.push(frontmatter.image);
  }
  
  // Extract images from markdown content
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    const imageUrl = match[2];
    if (!images.includes(imageUrl)) {
      images.push(imageUrl);
    }
  }
  
  return images;
}

/**
 * Create a slug from filename
 */
export function createSlug(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Process raw markdown content into a BlogPost object with enhanced error handling
 */
export function processBlogPost(filename: string, rawContent: string): BlogPost {
  if (!filename || typeof filename !== 'string') {
    throw new Error('Filename must be a non-empty string');
  }

  if (!rawContent || typeof rawContent !== 'string') {
    throw new Error(`Content for file ${filename} must be a non-empty string`);
  }

  try {
    const { frontmatter, content } = parseMarkdown(rawContent);
    const slug = createSlug(filename);

    // Validate slug generation
    if (!slug || slug.length === 0) {
      throw new Error(`Failed to generate valid slug from filename: ${filename}`);
    }

    // Generate excerpt if not provided in frontmatter
    let excerpt: string;
    try {
      excerpt = frontmatter.excerpt || extractExcerpt(content);
    } catch (error) {
      console.warn(`Failed to extract excerpt for ${filename}:`, error);
      excerpt = 'No excerpt available';
    }

    // Calculate read time if not provided in frontmatter
    let readTime: string;
    try {
      readTime = frontmatter.readTime || calculateReadTime(content);
    } catch (error) {
      console.warn(`Failed to calculate read time for ${filename}:`, error);
      readTime = '1 min read';
    }

    // Extract images
    let images: string[];
    try {
      images = extractImages(content, frontmatter);
    } catch (error) {
      console.warn(`Failed to extract images for ${filename}:`, error);
      images = [];
    }

    // Count words
    let wordCount: number;
    try {
      wordCount = countWords(content);
    } catch (error) {
      console.warn(`Failed to count words for ${filename}:`, error);
      wordCount = 0;
    }

    return {
      slug,
      frontmatter,
      content,
      excerpt,
      readTime,
      wordCount,
      images,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to process blog post ${filename}: ${error.message}`);
    }
    throw new Error(`Failed to process blog post ${filename}: Unknown error`);
  }
}

/**
 * Convert BlogPost to BlogPostPreview
 */
export function createBlogPostPreview(blogPost: BlogPost): BlogPostPreview {
  return {
    slug: blogPost.slug,
    title: blogPost.frontmatter.title,
    excerpt: blogPost.excerpt,
    author: blogPost.frontmatter.author,
    date: blogPost.frontmatter.date,
    readTime: blogPost.readTime,
    category: blogPost.frontmatter.category,
    tags: blogPost.frontmatter.tags,
    image: blogPost.frontmatter.image,
    featured: blogPost.frontmatter.featured,
  };
}
