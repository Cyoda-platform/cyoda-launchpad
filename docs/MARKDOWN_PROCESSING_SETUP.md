# Markdown Processing Infrastructure Setup

## Overview

This document outlines the markdown processing infrastructure that has been set up for the blog system. The infrastructure allows for parsing markdown files with frontmatter, extracting content previews, and rendering blog posts dynamically.

## Dependencies Installed

The following packages were installed to support markdown processing:

- `react-markdown` - React component for rendering markdown content
- `gray-matter` - Parse frontmatter from markdown files
- `remark-gfm` - GitHub Flavored Markdown support for react-markdown

## File Structure

```
src/
├── types/
│   └── blog.ts                    # TypeScript interfaces for blog data
├── lib/
│   ├── markdown.ts                # Core markdown processing utilities
│   ├── blog-loader.ts             # Blog post loading and management
│   └── __tests__/
│       └── markdown.test.ts       # Tests for markdown processing
├── hooks/
│   └── use-blog.ts                # React hooks for blog data management
├── components/
│   └── MarkdownRenderer.tsx       # React component for rendering markdown
├── pages/
│   ├── Blog.tsx                   # Updated blog page using new infrastructure
│   └── BlogTest.tsx               # Test page for verifying functionality
└── docs/
    └── blogs/
        └── cyoda_comparison_by_category.md  # Sample blog post with frontmatter
```

## Key Features

### 1. TypeScript Interfaces (`src/types/blog.ts`)

- `BlogPostFrontmatter` - Structure for frontmatter data
- `BlogPost` - Complete blog post with processed content
- `BlogPostPreview` - Lightweight version for listing pages

### 2. Markdown Processing (`src/lib/markdown.ts`)

- `parseMarkdown()` - Parse frontmatter and content
- `extractExcerpt()` - Generate content previews (first N words)
- `calculateReadTime()` - Estimate reading time based on word count
- `extractImages()` - Find images in content and frontmatter
- `processBlogPost()` - Complete processing pipeline

### 3. Blog Data Management (`src/lib/blog-loader.ts`)

- `loadBlogPosts()` - Load all published blog posts
- `loadBlogPostPreviews()` - Load lightweight previews
- `getFeaturedBlogPosts()` - Get featured posts only
- `getBlogPostsByCategory()` - Filter by category
- `searchBlogPosts()` - Search functionality

### 4. React Hooks (`src/hooks/use-blog.ts`)

- `useBlogPosts()` - Hook for loading all posts
- `useBlogPostPreviews()` - Hook for loading previews
- `useFeaturedBlogPosts()` - Hook for featured posts
- `useBlogCategories()` - Hook for category management
- `useSearchBlogPosts()` - Hook for search functionality

### 5. Markdown Renderer (`src/components/MarkdownRenderer.tsx`)

- Custom styled React component for rendering markdown
- Supports GitHub Flavored Markdown
- Tailwind CSS styling with dark mode support
- Custom components for headings, links, code blocks, tables, etc.

## Frontmatter Structure

Blog posts should include frontmatter with the following structure:

```yaml
---
title: "Your Blog Post Title"
author: "Author Name"
date: "2025-01-15"
category: "Category Name"
excerpt: "Optional custom excerpt"
featured: true
published: true
tags: ["tag1", "tag2", "tag3"]
image: "/path/to/featured-image.jpg"
---
```

### Required Fields
- `title` - Post title
- `author` - Author name
- `date` - Publication date (ISO format recommended)
- `category` - Post category

### Optional Fields
- `excerpt` - Custom excerpt (auto-generated if not provided)
- `featured` - Whether post should be featured (default: false)
- `published` - Whether post is published (default: true)
- `tags` - Array of tags
- `image` - Featured image URL

## Usage Examples

### Loading Blog Posts in a Component

```tsx
import { useBlogPostPreviews } from '@/hooks/use-blog';

function BlogList() {
  const { previews, loading, error } = useBlogPostPreviews();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {previews.map(post => (
        <article key={post.slug}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <span>{post.readTime}</span>
        </article>
      ))}
    </div>
  );
}
```

### Rendering Markdown Content

```tsx
import MarkdownRenderer from '@/components/MarkdownRenderer';

function BlogPost({ content }: { content: string }) {
  return (
    <article>
      <MarkdownRenderer content={content} />
    </article>
  );
}
```

## Testing

- Visit `/blog-test` to see the markdown processing in action
- The test page shows parsed frontmatter, generated excerpts, and rendered content
- Check browser console for any loading errors

## Current Limitations

1. **File Loading**: Currently uses static imports for markdown files. In production, you'd want to implement build-time static generation or server-side file reading.

2. **Dynamic File Discovery**: The system currently requires manually adding new markdown files to the loader. A build-time process could automatically discover all markdown files.

3. **Image Handling**: Images referenced in markdown need to be available in the public directory or properly imported.

## Future Enhancements

1. **Build-time Static Generation**: Implement a build process to automatically discover and process all markdown files
2. **Image Optimization**: Add automatic image optimization and responsive image handling
3. **Search Indexing**: Implement full-text search with indexing
4. **RSS Feed**: Generate RSS feed from blog posts
5. **Pagination**: Add pagination for large numbers of posts
6. **Related Posts**: Implement related post suggestions based on tags/categories

## Acceptance Criteria Met

✅ All required markdown processing dependencies are installed  
✅ Utility functions can successfully parse markdown files with frontmatter  
✅ TypeScript interfaces are defined for blog post structure  
✅ Helper functions can extract content previews and images from markdown files  
✅ Blog page updated to use new infrastructure  
✅ Test page created to verify functionality
