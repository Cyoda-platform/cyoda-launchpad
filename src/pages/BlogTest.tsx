import { useEffect, useState } from 'react';
import { loadBlogPosts } from '@/lib/blog-loader';
import { BlogPost } from '@/types/blog';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const BlogTest = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const blogPosts = await loadBlogPosts();
        setPosts(blogPosts);
        console.log('Loaded blog posts:', blogPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Blog Test - Loading...</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-red-500">Blog Test - Error</h1>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Blog Test - Markdown Processing</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Loaded Posts: {posts.length}</h2>
          
          {posts.map((post, index) => (
            <div key={post.slug} className="mb-12 p-6 border border-border rounded-lg">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{post.frontmatter.title}</h3>
                <div className="text-sm text-muted-foreground mb-4">
                  <span>By {post.frontmatter.author}</span>
                  <span className="mx-2">•</span>
                  <span>{post.frontmatter.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                  <span className="mx-2">•</span>
                  <span>{post.wordCount} words</span>
                  <span className="mx-2">•</span>
                  <span>Category: {post.frontmatter.category}</span>
                </div>
                
                <div className="mb-4">
                  <strong>Excerpt:</strong> {post.excerpt}
                </div>
                
                {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                  <div className="mb-4">
                    <strong>Tags:</strong> {post.frontmatter.tags.join(', ')}
                  </div>
                )}
                
                {post.images.length > 0 && (
                  <div className="mb-4">
                    <strong>Images found:</strong> {post.images.join(', ')}
                  </div>
                )}
                
                <div className="mb-4">
                  <strong>Featured:</strong> {post.frontmatter.featured ? 'Yes' : 'No'}
                </div>
              </div>
              
              <div className="border-t border-border pt-6">
                <h4 className="text-lg font-semibold mb-4">Rendered Content:</h4>
                <MarkdownRenderer content={post.content} />
              </div>
            </div>
          ))}
        </div>
        
        {posts.length === 0 && (
          <p className="text-muted-foreground">No blog posts found.</p>
        )}
      </div>
    </div>
  );
};

export default BlogTest;
