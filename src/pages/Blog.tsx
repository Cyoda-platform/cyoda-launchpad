import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, User, ArrowRight, Clock, Search, X, Loader2 } from 'lucide-react';
import { useBlogPostPreviews, useFeaturedBlogPosts, useBlogCategories, useSearchBlogPosts } from '@/hooks/use-blog';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BlogListingSkeleton, SearchResultsSkeleton } from '@/components/BlogSkeletons';
import {
  BlogPostsErrorFallback,
  NetworkErrorFallback,
  SearchNoResultsFallback,
  EmptyBlogFallback
} from '@/components/BlogFallbacks';

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Utility function to highlight search terms
const highlightSearchTerm = (text: string, searchTerm: string) => {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-primary/20 text-primary px-1 rounded">
        {part}
      </mark>
    ) : part
  );
};

const Blog = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { previews: blogPosts, loading: postsLoading, error: postsError, refetch: refetchPosts } = useBlogPostPreviews();
  const { featuredPosts, loading: featuredLoading, error: featuredError, refetch: refetchFeatured } = useFeaturedBlogPosts();
  const { categories, loading: categoriesLoading } = useBlogCategories();
  const { results: searchResults, loading: searchLoading, error: searchError, search, clearSearch, refetch: refetchSearch } = useSearchBlogPosts();

  // Initialize state from URL parameters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Update URL when category or search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'All') {
      params.set('category', selectedCategory);
    }
    if (searchQuery.trim()) {
      params.set('search', searchQuery);
    }
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchQuery, setSearchParams]);

  // Effect to trigger search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      search(debouncedSearchQuery);
    } else {
      clearSearch();
    }
  }, [debouncedSearchQuery, search, clearSearch]);

  // Get the first featured post or fallback to first post
  const featuredPost = featuredPosts?.[0] || blogPosts?.[0];

  // Determine which posts to display based on search and category
  const getDisplayPosts = () => {
    // If there's a search query, use search results
    if (searchQuery.trim()) {
      const posts = searchResults || [];
      // Apply category filter to search results if not "All"
      return selectedCategory === 'All'
        ? posts
        : posts.filter(post => post.category === selectedCategory);
    }

    // Otherwise use regular posts with category filter
    return selectedCategory === 'All'
      ? (blogPosts || [])
      : (blogPosts || []).filter(post => post.category === selectedCategory);
  };

  const filteredPosts = getDisplayPosts();

  // Clear search function
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    clearSearch();
  }, [clearSearch]);

  // Retry function for errors
  const handleRetry = useCallback(() => {
    if (postsError) refetchPosts();
    if (featuredError) refetchFeatured();
  }, [postsError, featuredError, refetchPosts, refetchFeatured]);

  // Loading state - show skeleton
  if (postsLoading || featuredLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <BlogListingSkeleton />
        <Footer />
      </div>
    );
  }

  // Error state - determine error type and show appropriate fallback
  if (postsError || featuredError) {
    const errorMessage = postsError || featuredError || '';
    const isNetworkError = errorMessage.toLowerCase().includes('network') ||
                           errorMessage.toLowerCase().includes('fetch') ||
                           errorMessage.toLowerCase().includes('connection');

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            {isNetworkError ? (
              <NetworkErrorFallback onRetry={handleRetry} />
            ) : (
              <BlogPostsErrorFallback onRetry={handleRetry} />
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-dark relative">
          <div className="absolute inset-0 texture-overlay opacity-30" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gradient-hero mb-6">
                Developer Insights & Updates
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Stay up to date with the latest in application development, AI-powered tools, and industry best practices.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-card/30 backdrop-blur border border-border/50 rounded-2xl overflow-hidden glow-hover">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="p-8">
                    <div className="mb-4">
                      <span className="inline-block bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                        Featured
                      </span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                      {featuredPost?.title || 'No Featured Post Available'}
                    </h2>

                    <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                      {featuredPost?.excerpt || 'No excerpt available.'}
                    </p>

                    <div className="flex items-center text-sm text-muted-foreground mb-6">
                      <User className="w-4 h-4 mr-2" />
                      <span className="mr-4">{featuredPost?.author || 'Unknown'}</span>
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="mr-4">{featuredPost?.date || 'No date'}</span>
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{featuredPost?.readTime || '0 min read'}</span>
                    </div>
                    
                    <Button
                      className="bg-gradient-primary text-white glow-primary"
                      onClick={() => featuredPost?.slug && navigate(`/blog/${featuredPost.slug}`)}
                      disabled={!featuredPost?.slug}
                      aria-label={`Read featured article: ${featuredPost?.title || 'No featured post available'}`}
                    >
                      Read Article <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  
                  <div className="bg-gradient-primary/10 flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-32 h-32 rounded-2xl bg-gradient-primary/20 flex items-center justify-center mb-4">
                        <div className="text-4xl">📝</div>
                      </div>
                      <p className="text-muted-foreground">Featured Article</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-card/20 backdrop-blur border-primary/30 focus:border-primary glow-hover"
                    aria-label="Search blog articles"
                    role="searchbox"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-primary/10"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                      <span className="sr-only">Clear search</span>
                    </Button>
                  )}
                </div>
                {searchQuery && (
                  <div className="mt-2 text-center text-sm text-muted-foreground">
                    {searchLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Searching...</span>
                      </div>
                    ) : searchError ? (
                      <div className="flex items-center justify-center gap-2 text-destructive">
                        <span>Search failed: {searchError}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => refetchSearch()}
                          className="h-6 px-2 text-xs"
                        >
                          Retry
                        </Button>
                      </div>
                    ) : (
                      <span>
                        {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} found
                        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-4 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-3 justify-center" role="group" aria-label="Filter posts by category">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`bg-card/20 backdrop-blur border-primary/30 hover:bg-primary/10 hover:border-primary glow-hover ${
                      selectedCategory === category ? 'bg-primary/20 border-primary' : ''
                    }`}
                    aria-pressed={selectedCategory === category}
                    aria-label={`Filter posts by ${category} category`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16 bg-gradient-dark relative">
          <div className="absolute inset-0 texture-overlay opacity-20" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Show search loading skeleton when searching */}
              {searchLoading && searchQuery ? (
                <SearchResultsSkeleton />
              ) : filteredPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post, index) => (
                    <article
                      key={post.slug || index}
                      className="group bg-card/20 backdrop-blur border border-border/50 rounded-xl overflow-hidden hover:bg-card/40 transition-all duration-300 glow-hover"
                    >
                      <div className="p-6">
                        <div className="mb-4">
                          <span className="inline-block bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                            {post.category}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {searchQuery ? highlightSearchTerm(post.title, searchQuery) : post.title}
                        </h3>

                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {searchQuery ? highlightSearchTerm(post.excerpt, searchQuery) : post.excerpt}
                        </p>

                        <div className="flex items-center text-xs text-muted-foreground mb-4">
                          <User className="w-3 h-3 mr-1" />
                          <span className="mr-3">{post.author}</span>
                          <Calendar className="w-3 h-3 mr-1" />
                          <span className="mr-3">{post.date}</span>
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{post.readTime}</span>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary hover:bg-primary/10 p-0"
                          onClick={() => navigate(`/blog/${post.slug}`)}
                          aria-label={`Read more about ${post.title}`}
                        >
                          Read More <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                // Show appropriate empty state based on context
                <>
                  {searchQuery ? (
                    <SearchNoResultsFallback
                      searchQuery={searchQuery}
                      onClearSearch={handleClearSearch}
                    />
                  ) : blogPosts && blogPosts.length === 0 ? (
                    <EmptyBlogFallback />
                  ) : (
                    // Category filter with no results
                    <div className="text-center py-16">
                      <div className="max-w-md mx-auto">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-primary/20 flex items-center justify-center mx-auto mb-6">
                          <div className="text-4xl">📂</div>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-4">
                          No Posts in "{selectedCategory}"
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          No posts found in the "{selectedCategory}" category. Try selecting a different category or check back later.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedCategory('All')}
                          className="bg-card/20 backdrop-blur border-primary/30 hover:bg-primary/10 hover:border-primary"
                        >
                          View All Posts
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gradient-accent mb-6">
                Stay Updated
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get the latest articles and updates delivered straight to your inbox.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-12 px-4 rounded-lg border border-border/50 bg-background/50 backdrop-blur focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Button className="bg-gradient-primary text-white glow-primary">
                  Subscribe
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                No spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;