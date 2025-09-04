export interface BlogPostFrontmatter {
  title: string;
  excerpt?: string;
  author: string;
  date: string;
  readTime?: string;
  category: string;
  tags?: string[];
  image?: string;
  featured?: boolean;
  published?: boolean;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogPostFrontmatter;
  content: string;
  excerpt: string;
  readTime: string;
  wordCount: number;
  images: string[];
}

export interface BlogPostPreview {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags?: string[];
  image?: string;
  featured?: boolean;
}
