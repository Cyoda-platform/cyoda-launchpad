import { 
  parseMarkdown, 
  extractExcerpt, 
  calculateReadTime, 
  countWords, 
  extractImages, 
  createSlug, 
  processBlogPost 
} from '../markdown';

describe('Markdown Processing', () => {
  const sampleMarkdown = `---
title: "Test Blog Post"
author: "Test Author"
date: "2025-01-15"
category: "Testing"
featured: true
tags: ["test", "markdown"]
image: "/test-image.jpg"
---

# Test Blog Post

This is a **test** blog post with some *italic* text and a [link](https://example.com).

## Section 2

Here's a list:
- Item 1
- Item 2
- Item 3

And an image: ![Alt text](/content-image.jpg)

\`\`\`javascript
console.log("Hello, world!");
\`\`\`

This is the end of the test content.`;

  describe('parseMarkdown', () => {
    it('should parse frontmatter and content correctly', () => {
      const result = parseMarkdown(sampleMarkdown);
      
      expect(result.frontmatter.title).toBe('Test Blog Post');
      expect(result.frontmatter.author).toBe('Test Author');
      expect(result.frontmatter.category).toBe('Testing');
      expect(result.frontmatter.featured).toBe(true);
      expect(result.frontmatter.tags).toEqual(['test', 'markdown']);
      expect(result.content).toContain('# Test Blog Post');
    });

    it('should provide defaults for missing frontmatter fields', () => {
      const minimalMarkdown = `---
title: "Minimal Post"
---

Content here.`;
      
      const result = parseMarkdown(minimalMarkdown);
      
      expect(result.frontmatter.title).toBe('Minimal Post');
      expect(result.frontmatter.author).toBe('Anonymous');
      expect(result.frontmatter.category).toBe('General');
      expect(result.frontmatter.published).toBe(true);
    });
  });

  describe('extractExcerpt', () => {
    it('should extract first 50 words by default', () => {
      const content = 'This is a test content with many words. '.repeat(10);
      const excerpt = extractExcerpt(content);
      
      const wordCount = excerpt.replace('...', '').split(' ').length;
      expect(wordCount).toBeLessThanOrEqual(50);
      expect(excerpt).toContain('...');
    });

    it('should remove markdown formatting', () => {
      const content = '# Header\n\n**Bold text** and *italic text* with `code` and [link](url).';
      const excerpt = extractExcerpt(content, 10);
      
      expect(excerpt).not.toContain('#');
      expect(excerpt).not.toContain('**');
      expect(excerpt).not.toContain('*');
      expect(excerpt).not.toContain('`');
      expect(excerpt).not.toContain('[');
      expect(excerpt).not.toContain(']');
      expect(excerpt).not.toContain('(');
      expect(excerpt).not.toContain(')');
    });
  });

  describe('calculateReadTime', () => {
    it('should calculate reading time based on word count', () => {
      const shortContent = 'Short content with few words.';
      const longContent = 'Word '.repeat(400); // 400 words
      
      expect(calculateReadTime(shortContent)).toBe('1 min read');
      expect(calculateReadTime(longContent)).toBe('2 min read');
    });
  });

  describe('countWords', () => {
    it('should count words correctly', () => {
      const content = 'This is a test with five words.';
      expect(countWords(content)).toBe(7);
    });

    it('should handle empty content', () => {
      expect(countWords('')).toBe(0);
      expect(countWords('   ')).toBe(0);
    });
  });

  describe('extractImages', () => {
    it('should extract images from content and frontmatter', () => {
      const content = 'Here is an image: ![Alt](/image1.jpg) and another ![Alt2](/image2.png)';
      const frontmatter = { image: '/frontmatter-image.jpg' } as any;
      
      const images = extractImages(content, frontmatter);
      
      expect(images).toContain('/frontmatter-image.jpg');
      expect(images).toContain('/image1.jpg');
      expect(images).toContain('/image2.png');
      expect(images).toHaveLength(3);
    });

    it('should not duplicate images', () => {
      const content = 'Image: ![Alt](/image.jpg) and again ![Alt](/image.jpg)';
      const frontmatter = {} as any;
      
      const images = extractImages(content, frontmatter);
      
      expect(images).toEqual(['/image.jpg']);
    });
  });

  describe('createSlug', () => {
    it('should create URL-friendly slugs', () => {
      expect(createSlug('My Blog Post.md')).toBe('my-blog-post');
      expect(createSlug('Special Characters & Symbols!.md')).toBe('special-characters-symbols');
      expect(createSlug('Multiple   Spaces.md')).toBe('multiple-spaces');
    });
  });

  describe('processBlogPost', () => {
    it('should process a complete blog post', () => {
      const result = processBlogPost('test-post.md', sampleMarkdown);
      
      expect(result.slug).toBe('test-post');
      expect(result.frontmatter.title).toBe('Test Blog Post');
      expect(result.excerpt).toBeTruthy();
      expect(result.readTime).toContain('min read');
      expect(result.wordCount).toBeGreaterThan(0);
      expect(result.images).toContain('/test-image.jpg');
      expect(result.images).toContain('/content-image.jpg');
    });
  });
});

// Note: These tests would need a testing framework like Jest to run
// For now, they serve as documentation of expected behavior
