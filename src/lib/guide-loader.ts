import { Guide, GuidePreview } from '@/types/guide';
import { processGuide, createGuidePreview } from './markdown';

// Since we're in a browser environment, we'll need to handle file loading differently
// For now, we'll create a system that can be easily extended to work with a build-time
// static generation or a server-side API

/**
 * Guide data - For now using static imports since we're in a browser environment
 * In a production setup, this would be replaced with build-time static generation
 * or server-side file system reading
 */

// Cache for loaded markdown files to avoid re-processing
let markdownFilesCache: Record<string, string> | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in development

/**
 * Load all markdown files from the public/docs/guides directory via HTTP
 * Files are fetched from /docs/guides/ which maps to public/docs/guides/
 */
async function loadMarkdownFiles(): Promise<Record<string, string>> {
  try {
    // Check cache first (only in development for auto-refresh)
    const now = Date.now();
    if (markdownFilesCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return markdownFilesCache;
    }

    const files: Record<string, string> = {};

    // Fetch the manifest file to get the list of available guides
    const manifestResponse = await fetch('/docs/guides/manifest.json');
    if (!manifestResponse.ok) {
      throw new Error(`Failed to fetch manifest: ${manifestResponse.statusText}`);
    }

    const filenames: string[] = await manifestResponse.json();

    // Fetch all markdown files in parallel
    const loadPromises = filenames.map(async (filename) => {
      try {
        const response = await fetch(`/docs/guides/${filename}`);
        if (!response.ok) {
          console.error(`Error loading markdown file ${filename}: ${response.statusText}`);
          return;
        }
        const content = await response.text();
        files[filename] = content;
      } catch (error) {
        console.error(`Error loading markdown file ${filename}:`, error);
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

    // Fallback: try to load a known file directly
    try {
      const response = await fetch('/docs/guides/building_hello_world_app.md');
      if (response.ok) {
        const content = await response.text();
        return {
          'building_hello_world_app.md': content
        };
      }
    } catch (fallbackError) {
      console.error('Fallback loading also failed:', fallbackError);
    }

    // Last resort: return empty object
    return {};
  }
}

/**
 * Load all guides with enhanced error handling
 */
export async function loadGuides(): Promise<Guide[]> {
  const guides: Guide[] = [];
  const errors: Array<{ filename: string; error: string }> = [];

  try {
    const markdownFiles = await loadMarkdownFiles();

    if (Object.keys(markdownFiles).length === 0) {
      console.warn('No markdown files found in /docs/guides directory');
      return [];
    }

    for (const [filename, content] of Object.entries(markdownFiles)) {
      try {
        // Validate content is not empty
        if (!content || content.trim().length === 0) {
          errors.push({ filename, error: 'File is empty' });
          continue;
        }

        const guide = processGuide(filename, content);

        // Validate required frontmatter fields
        if (!guide.frontmatter.title || guide.frontmatter.title.trim() === '') {
          errors.push({ filename, error: 'Missing or empty title in frontmatter' });
          continue;
        }

        if (!guide.frontmatter.date) {
          errors.push({ filename, error: 'Missing date in frontmatter' });
          continue;
        }

        // Validate date format
        const dateObj = new Date(guide.frontmatter.date);
        if (isNaN(dateObj.getTime())) {
          errors.push({ filename, error: 'Invalid date format in frontmatter' });
          continue;
        }

        // Only include published guides
        if (guide.frontmatter.published) {
          guides.push(guide);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ filename, error: errorMessage });
        console.error(`Error processing guide ${filename}:`, error);
      }
    }

    // Log summary of errors if any
    if (errors.length > 0) {
      console.warn(`Failed to process ${errors.length} guide(s):`, errors);
    }

    console.log(`Successfully loaded ${guides.length} guide(s)`);
  } catch (error) {
    console.error('Error loading guides:', error);
    throw new Error(`Failed to load guides: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Sort by date (newest first)
  return guides.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

/**
 * Load guide previews (lighter weight for listing pages)
 */
export async function loadGuidePreviews(): Promise<GuidePreview[]> {
  const guides = await loadGuides();
  return guides.map(createGuidePreview);
}

/**
 * Load a single guide by slug
 */
export async function loadGuide(slug: string): Promise<Guide | null> {
  const guides = await loadGuides();
  return guides.find(guide => guide.slug === slug) || null;
}

/**
 * Get featured guides
 */
export async function getFeaturedGuides(): Promise<GuidePreview[]> {
  const previews = await loadGuidePreviews();
  return previews.filter(guide => guide.featured);
}

/**
 * Get guides by category
 */
export async function getGuidesByCategory(category: string): Promise<GuidePreview[]> {
  const previews = await loadGuidePreviews();
  
  if (category.toLowerCase() === 'all') {
    return previews;
  }
  
  return previews.filter(guide => 
    guide.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get all unique categories from guides
 */
export async function getGuideCategories(): Promise<string[]> {
  const previews = await loadGuidePreviews();
  const categories = new Set(previews.map(guide => guide.category));
  return ['All', ...Array.from(categories).sort()];
}

/**
 * Search guides by title or content
 */
export async function searchGuides(query: string): Promise<GuidePreview[]> {
  const guides = await loadGuides();
  const searchTerm = query.toLowerCase();

  return guides
    .filter(guide =>
      guide.frontmatter.title.toLowerCase().includes(searchTerm) ||
      guide.content.toLowerCase().includes(searchTerm) ||
      guide.excerpt.toLowerCase().includes(searchTerm) ||
      (guide.frontmatter.tags && guide.frontmatter.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm)
      ))
    )
    .map(createGuidePreview);
}

/**
 * Clear the markdown files cache - useful for development
 */
export function clearGuideCache(): void {
  markdownFilesCache = null;
  cacheTimestamp = 0;
  console.log('Guide cache cleared');
}

/**
 * Get cache status - useful for debugging
 */
export function getGuideCacheStatus(): { cached: boolean; age: number; fileCount: number } {
  const now = Date.now();
  const age = cacheTimestamp > 0 ? now - cacheTimestamp : 0;

  return {
    cached: markdownFilesCache !== null,
    age,
    fileCount: markdownFilesCache ? Object.keys(markdownFilesCache).length : 0
  };
}
