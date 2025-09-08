export interface GuideFrontmatter {
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

export interface Guide {
  slug: string;
  frontmatter: GuideFrontmatter;
  content: string;
  excerpt: string;
  readTime: string;
  wordCount: number;
  images: string[];
}

export interface GuidePreview {
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
