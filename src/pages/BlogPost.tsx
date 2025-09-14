import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogBreadcrumb from '@/components/BlogBreadcrumb';
import { Button } from '@/components/ui/button';
import { Calendar, User, Clock, ArrowLeft, ArrowRight, Tag } from 'lucide-react';
import { useBlogPost, useBlogPostPreviews } from '@/hooks/use-blog';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import SocialShare from '@/components/SocialShare';
import SEO from '@/components/SEO';
import { BlogPostSkeleton } from '@/components/BlogSkeletons';
import {
  BlogPostNotFoundFallback,
  NetworkErrorFallback,
  CorruptedMarkdownFallback
} from '@/components/BlogFallbacks';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { post, loading, error, refetch } = useBlogPost(slug || '');
  const { previews: allPosts } = useBlogPostPreviews();

  // Find adjacent posts for navigation
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Loading state - show skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <BlogPostSkeleton />
        <Footer />
      </div>
    );
  }

  // Error state - determine error type and show appropriate fallback
  if (error || !post) {
    const errorMessage = error || '';
    const isNetworkError = errorMessage.toLowerCase().includes('network') ||
                           errorMessage.toLowerCase().includes('fetch') ||
                           errorMessage.toLowerCase().includes('connection');
    const isCorruptedMarkdown = errorMessage.toLowerCase().includes('markdown') ||
                               errorMessage.toLowerCase().includes('parse') ||
                               errorMessage.toLowerCase().includes('corrupt');

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Breadcrumb for error state */}
          <section className="pt-24 pb-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <BlogBreadcrumb />
              </div>
            </div>
          </section>

          <section className="pb-16">
            <div className="container mx-auto px-4">
              {isNetworkError ? (
                <NetworkErrorFallback onRetry={refetch} />
              ) : isCorruptedMarkdown ? (
                <CorruptedMarkdownFallback
                  postTitle={slug}
                  onRetry={refetch}
                />
              ) : (
                <BlogPostNotFoundFallback />
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        author={post.frontmatter.author}
        publishedTime={new Date(post.frontmatter.date).toISOString()}
        tags={post.frontmatter.tags}
        image={post.frontmatter.image}
        url={window.location.href}
        type="article"
      />
      <Header />
      <main>
        {/* Breadcrumb */}
        <section className="pt-24 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <BlogBreadcrumb
                title={post.frontmatter.title}
                category={post.frontmatter.category}
              />
            </div>
          </div>
        </section>

        {/* Article Header */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <article>
                <header className="mb-12">
                  <div className="mb-6">
                    <span className="inline-block bg-primary text-primary-foreground dark:bg-primary/20 dark:text-primary px-3 py-1 rounded-full text-sm font-medium dark:border dark:border-primary/30">
                      {post.frontmatter.category}
                    </span>
                    {post.frontmatter.featured && (
                      <span className="inline-block bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-medium ml-2">
                        Featured
                      </span>
                    )}
                  </div>

	                  {post.frontmatter.image && (
	                    <div className="mb-8">
	                      <img
	                        src={post.frontmatter.image}
	                        alt={post.frontmatter.title}
	                        className="w-full h-64 md:h-80 object-cover rounded-lg border border-border"
	                        loading="eager"
	                      />
	                    </div>
	                  )}


                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                    {post.frontmatter.title}
                  </h1>

                  {post.excerpt && (
                    <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>{post.frontmatter.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-6">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      {post.frontmatter.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-secondary text-secondary-foreground dark:bg-card/20 dark:text-muted-foreground backdrop-blur border border-border dark:border-border/50 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </header>

                {/* Article Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                  <MarkdownRenderer content={post.content} />
                </div>

                {/* Article Footer */}
                <footer className="border-t border-border/50 pt-8 space-y-6">
                  {/* Social Sharing */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <SocialShare
                      title={post.frontmatter.title}
                      url={window.location.href}
                      description={post.excerpt}
                      showLabels={true}
                      className="order-2 sm:order-1"
                    />

                    <Button
                      onClick={() => navigate('/blog')}
                      variant="outline"
                      className="bg-card/20 backdrop-blur border-primary/30 hover:bg-primary/10 hover:border-primary order-1 sm:order-2"
                      aria-label="Go back to blog listing"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Blog
                    </Button>
                  </div>

                  {/* Article Meta */}
                  <div className="text-sm text-muted-foreground pt-4 border-t border-border/20">
                    <p>Published on {new Date(post.frontmatter.date).toLocaleDateString()}</p>
                    <p>{post.wordCount} words • {post.readTime}</p>
                  </div>
                </footer>
              </article>
            </div>
          </div>
        </section>

        {/* Navigation to Previous/Next Posts */}
        {(previousPost || nextPost) && (
          <section className="py-16 bg-gradient-dark relative">
            <div className="absolute inset-0 texture-overlay opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                  {previousPost && (
                    <div className="bg-card/20 backdrop-blur border border-border/50 rounded-xl p-6 glow-hover">
                      <p className="text-sm text-muted-foreground mb-2">Previous Post</p>
                      <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                        {previousPost.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/blog/${previousPost.slug}`)}
                        className="text-primary hover:text-primary hover:bg-primary/10 p-0"
                        aria-label={`Read previous post: ${previousPost.title}`}
                      >
                        <ArrowLeft className="w-3 h-3 mr-1" />
                        Read Previous
                      </Button>
                    </div>
                  )}

                  {nextPost && (
                    <div className="bg-card/20 backdrop-blur border border-border/50 rounded-xl p-6 glow-hover">
                      <p className="text-sm text-muted-foreground mb-2">Next Post</p>
                      <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                        {nextPost.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/blog/${nextPost.slug}`)}
                        className="text-primary hover:text-primary hover:bg-primary/10 p-0"
                      >
                        Read Next
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
