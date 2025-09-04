import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BlogDevTools } from '@/components/BlogDevTools';
import { 
  useBlogPosts, 
  useBlogPostPreviews, 
  useFeaturedBlogPosts,
  useBlogCategories,
  useSearchBlogPosts,
  useBlogPost,
} from '@/hooks/use-blog';
import { Search, Clock, User, Calendar, Tag, Star, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const BlogSystemTest = () => {
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gradient-hero mb-4">Blog System Test</h1>
            <p className="text-xl text-muted-foreground">
              Test all blog data management system functionality
            </p>
          </div>

        <BlogDevTools />

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-card/20 backdrop-blur border-primary/30">
            <TabsTrigger value="posts" className="glow-hover">All Posts</TabsTrigger>
            <TabsTrigger value="previews" className="glow-hover">Previews</TabsTrigger>
            <TabsTrigger value="featured" className="glow-hover">Featured</TabsTrigger>
            <TabsTrigger value="categories" className="glow-hover">Categories</TabsTrigger>
            <TabsTrigger value="search" className="glow-hover">Search</TabsTrigger>
            <TabsTrigger value="single" className="glow-hover">Single Post</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <PostsTest />
          </TabsContent>

          <TabsContent value="previews">
            <PreviewsTest />
          </TabsContent>

          <TabsContent value="featured">
            <FeaturedTest />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesTest selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
          </TabsContent>

          <TabsContent value="search">
            <SearchTest searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </TabsContent>

          <TabsContent value="single">
            <SinglePostTest selectedSlug={selectedSlug} setSelectedSlug={setSelectedSlug} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function PostsTest() {
  const { posts, loading, error, refetch } = useBlogPosts();

  return (
    <Card className="bg-card/20 backdrop-blur border border-border/50 glow-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <CheckCircle className="h-5 w-5 text-primary" />
          All Blog Posts Test
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Tests loading all blog posts with full content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <StatusIndicator loading={loading} error={error} />
          <Button
            onClick={() => refetch()}
            disabled={loading}
            size="sm"
            className="bg-gradient-primary text-white glow-primary hover:bg-gradient-primary/90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refetch'}
          </Button>
        </div>

        {error && (
          <Alert className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Loaded {posts.length} posts
          </p>
          
          {posts.map((post) => (
            <Card key={post.slug} className="bg-card/20 backdrop-blur border border-border/50 glow-hover transition-all duration-300 hover:bg-card/40">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">{post.frontmatter.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">{post.frontmatter.author}</Badge>
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">{post.frontmatter.category}</Badge>
                    <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">{post.readTime}</Badge>
                    <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">{post.wordCount} words</Badge>
                    {post.frontmatter.featured && (
                      <Badge className="bg-gradient-primary text-white">Featured</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
                  {post.frontmatter.tags && (
                    <div className="flex flex-wrap gap-2">
                      {post.frontmatter.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-card/20 backdrop-blur border border-border/50 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PreviewsTest() {
  const { previews, loading, error, refetch } = useBlogPostPreviews();

  return (
    <Card className="bg-card/20 backdrop-blur border border-border/50 glow-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <CheckCircle className="h-5 w-5 text-primary" />
          Blog Post Previews Test
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Tests loading lightweight blog post previews
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <StatusIndicator loading={loading} error={error} />
          <Button
            onClick={() => refetch()}
            disabled={loading}
            size="sm"
            className="bg-gradient-primary text-white glow-primary hover:bg-gradient-primary/90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refetch'}
          </Button>
        </div>

        {error && (
          <Alert className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {previews.map((preview) => (
            <Card key={preview.slug} className="bg-card/20 backdrop-blur border border-border/50 glow-hover transition-all duration-300 hover:bg-card/40">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">{preview.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {preview.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(preview.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {preview.readTime}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{preview.excerpt}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                      {preview.category}
                    </Badge>
                    {preview.featured && (
                      <Badge className="bg-gradient-primary text-white flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FeaturedTest() {
  const { featuredPosts, loading, error, refetch } = useFeaturedBlogPosts();

  return (
    <Card className="bg-card/20 backdrop-blur border border-border/50 glow-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Star className="h-5 w-5 text-accent" />
          Featured Posts Test
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Tests loading only featured blog posts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <StatusIndicator loading={loading} error={error} />
          <Button
            onClick={() => refetch()}
            disabled={loading}
            size="sm"
            className="bg-gradient-primary text-white glow-primary hover:bg-gradient-primary/90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refetch'}
          </Button>
        </div>

        {error && (
          <Alert className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Found {featuredPosts.length} featured posts
          </p>
          
          {featuredPosts.map((post) => (
            <Card key={post.slug} className="p-4 border-yellow-200 dark:border-yellow-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <h3 className="font-semibold">{post.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{post.category}</Badge>
                  <Badge variant="outline">{post.readTime}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusIndicator({ loading, error }: { loading: boolean; error: string | null }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-blue-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <XCircle className="h-4 w-4" />
        <span className="text-sm">Error</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-600">
      <CheckCircle className="h-4 w-4" />
      <span className="text-sm">Success</span>
    </div>
  );
}

function CategoriesTest({ selectedCategory, setSelectedCategory }: {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}) {
  const { categories, loading, error, refetch } = useBlogCategories();
  const { posts: categoryPosts, loading: postsLoading } = useBlogPostsByCategory(selectedCategory);

  return (
    <Card className="bg-card/20 backdrop-blur border border-border/50 glow-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Tag className="h-5 w-5 text-primary" />
          Categories Test
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Tests loading categories and filtering posts by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <StatusIndicator loading={loading} error={error} />
          <Button
            onClick={() => refetch()}
            disabled={loading}
            size="sm"
            className="bg-gradient-primary text-white glow-primary hover:bg-gradient-primary/90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refetch'}
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Available Categories ({categories.length})</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {selectedCategory && (
            <div>
              <h4 className="font-medium mb-2">
                Posts in "{selectedCategory}" ({categoryPosts.length})
                {postsLoading && <Loader2 className="h-4 w-4 animate-spin inline ml-2" />}
              </h4>
              <div className="space-y-2">
                {categoryPosts.map((post) => (
                  <Card key={post.slug} className="p-3">
                    <h5 className="font-medium">{post.title}</h5>
                    <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SearchTest({ searchQuery, setSearchQuery }: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  const { results, loading, error, search, clearSearch } = useSearchBlogPosts();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      search(searchQuery);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    clearSearch();
  };

  return (
    <Card className="bg-card/20 backdrop-blur border border-border/50 glow-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Search className="h-5 w-5 text-primary" />
          Search Test
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Tests searching blog posts by title, content, and tags
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-card/20 backdrop-blur border-primary/30 focus:border-primary glow-hover"
            />
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-primary text-white glow-primary hover:bg-gradient-primary/90"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              onClick={handleClear}
              className="bg-card/20 backdrop-blur border-primary/30 hover:bg-primary/10 hover:border-primary glow-hover"
            >
              Clear
            </Button>
          </div>

          {error && (
            <Alert>
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Search Results ({results.length})</h4>
              <div className="space-y-2">
                {results.map((post) => (
                  <Card key={post.slug} className="p-3">
                    <h5 className="font-medium">{post.title}</h5>
                    <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{post.category}</Badge>
                      {post.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SinglePostTest({ selectedSlug, setSelectedSlug }: {
  selectedSlug: string;
  setSelectedSlug: (slug: string) => void;
}) {
  const { previews } = useBlogPostPreviews();
  const { post, loading, error, refetch } = useBlogPost(selectedSlug);

  return (
    <Card className="bg-card/20 backdrop-blur border border-border/50 glow-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <CheckCircle className="h-5 w-5 text-primary" />
          Single Post Test
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Tests loading a single blog post with full content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Select a Post</h4>
            <div className="flex flex-wrap gap-2">
              {previews.map((preview) => (
                <Button
                  key={preview.slug}
                  variant={selectedSlug === preview.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSlug(preview.slug)}
                  className={selectedSlug === preview.slug
                    ? "bg-gradient-primary text-white glow-primary"
                    : "bg-card/20 backdrop-blur border-primary/30 hover:bg-primary/10 hover:border-primary glow-hover"
                  }
                >
                  {preview.title}
                </Button>
              ))}
            </div>
          </div>

          {selectedSlug && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <StatusIndicator loading={loading} error={error} />
                <Button
                  onClick={() => refetch()}
                  disabled={loading}
                  size="sm"
                  className="bg-gradient-primary text-white glow-primary hover:bg-gradient-primary/90"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refetch'}
                </Button>
              </div>

              {post && (
                <Card className="bg-card/20 backdrop-blur border border-border/50 glow-hover">
                  <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold">{post.frontmatter.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <User className="h-4 w-4" />
                        {post.frontmatter.author}
                        <Calendar className="h-4 w-4" />
                        {new Date(post.frontmatter.date).toLocaleDateString()}
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>

                    <Separator />

                    <div className="prose dark:prose-invert max-w-none">
                      <MarkdownRenderer content={post.content} />
                    </div>
                  </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default BlogSystemTest;
