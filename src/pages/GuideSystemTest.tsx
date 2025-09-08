import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import {
  loadGuides,
  loadGuidePreviews,
  loadGuide,
  getFeaturedGuides,
  getGuidesByCategory,
  getGuideCategories,
  searchGuides,
  clearGuideCache,
  getGuideCacheStatus,
} from '@/lib/guide-loader';
import { Guide, GuidePreview } from '@/types/guide';

const GuideSystemTest = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [previews, setPreviews] = useState<GuidePreview[]>([]);
  const [featuredGuides, setFeaturedGuides] = useState<GuidePreview[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GuidePreview[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredGuides, setFilteredGuides] = useState<GuidePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState<{ cached: boolean; age: number; fileCount: number }>({
    cached: false,
    age: 0,
    fileCount: 0
  });

  // Load all data
  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        guidesData,
        previewsData,
        featuredData,
        categoriesData,
      ] = await Promise.all([
        loadGuides(),
        loadGuidePreviews(),
        getFeaturedGuides(),
        getGuideCategories(),
      ]);

      setGuides(guidesData);
      setPreviews(previewsData);
      setFeaturedGuides(featuredData);
      setCategories(categoriesData);
      setFilteredGuides(previewsData);
      setCacheStatus(getGuideCacheStatus());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load specific guide
  const handleLoadGuide = async (slug: string) => {
    try {
      const guide = await loadGuide(slug);
      setSelectedGuide(guide);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load guide');
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchGuides(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    }
  };

  // Handle category filter
  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    try {
      const filtered = await getGuidesByCategory(category);
      setFilteredGuides(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Category filter failed');
    }
  };

  // Clear cache
  const handleClearCache = () => {
    clearGuideCache();
    setCacheStatus(getGuideCacheStatus());
  };

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Guide System Test</h1>
        <p className="text-muted-foreground">
          Testing the guide loading and processing system
        </p>
      </div>

      {error && (
        <Alert className="border-destructive">
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4 items-center">
        <Button onClick={loadAllData} disabled={loading}>
          {loading ? 'Loading...' : 'Reload Data'}
        </Button>
        <Button variant="outline" onClick={handleClearCache}>
          Clear Cache
        </Button>
        <div className="text-sm text-muted-foreground">
          Cache: {cacheStatus.cached ? 'Active' : 'Empty'} | 
          Files: {cacheStatus.fileCount} | 
          Age: {Math.round(cacheStatus.age / 1000)}s
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="previews">Previews</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="viewer">Viewer</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{guides.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Featured Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{featuredGuides.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{categories.length - 1}</div>
                <div className="text-sm text-muted-foreground">
                  (excluding "All")
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Guide Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {guides.map((guide) => (
                  <div key={guide.slug} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{guide.frontmatter.title}</h3>
                      <Badge variant={guide.frontmatter.featured ? 'default' : 'secondary'}>
                        {guide.frontmatter.featured ? 'Featured' : 'Regular'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                      <div>Slug: {guide.slug}</div>
                      <div>Author: {guide.frontmatter.author}</div>
                      <div>Date: {guide.frontmatter.date}</div>
                      <div>Category: {guide.frontmatter.category}</div>
                      <div>Read Time: {guide.readTime}</div>
                      <div>Word Count: {guide.wordCount}</div>
                      <div>Images: {guide.images.length}</div>
                      <div>Published: {guide.frontmatter.published ? 'Yes' : 'No'}</div>
                    </div>
                    <div className="mt-2">
                      <div className="text-sm font-medium">Excerpt:</div>
                      <div className="text-sm text-muted-foreground">{guide.excerpt}</div>
                    </div>
                    {guide.frontmatter.tags && (
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {guide.frontmatter.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="previews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Guide Previews ({previews.length})</CardTitle>
              <CardDescription>
                Lightweight preview objects for listing pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {previews.map((preview) => (
                  <div key={preview.slug} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{preview.title}</h3>
                      <div className="flex gap-2">
                        {preview.featured && <Badge>Featured</Badge>}
                        <Badge variant="outline">{preview.category}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{preview.excerpt}</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>By {preview.author}</span>
                      <span>{preview.date} • {preview.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Featured Guides ({featuredGuides.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {featuredGuides.map((guide) => (
                  <div key={guide.slug} className="border rounded p-4 bg-muted/50">
                    <h3 className="font-semibold mb-2">{guide.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{guide.excerpt}</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{guide.category}</span>
                      <span>{guide.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Categories & Filtering</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Available Categories:</h4>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleCategoryFilter(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">
                  Filtered Results ({filteredGuides.length}):
                </h4>
                <div className="grid gap-2">
                  {filteredGuides.map((guide) => (
                    <div key={guide.slug} className="flex justify-between items-center p-2 border rounded">
                      <span className="font-medium">{guide.title}</span>
                      <Badge variant="outline">{guide.category}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Functionality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>Search</Button>
              </div>
              
              {searchResults.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">
                    Search Results ({searchResults.length}):
                  </h4>
                  <div className="grid gap-2">
                    {searchResults.map((guide) => (
                      <div key={guide.slug} className="p-3 border rounded">
                        <h5 className="font-medium">{guide.title}</h5>
                        <p className="text-sm text-muted-foreground">{guide.excerpt}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{guide.category}</Badge>
                          {guide.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viewer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Guide Viewer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Select a guide to view:</h4>
                <div className="flex gap-2 flex-wrap">
                  {previews.map((preview) => (
                    <Button
                      key={preview.slug}
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadGuide(preview.slug)}
                    >
                      {preview.title}
                    </Button>
                  ))}
                </div>
              </div>
              
              {selectedGuide && (
                <div className="border rounded p-4">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-2">{selectedGuide.frontmatter.title}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                      <span>By {selectedGuide.frontmatter.author}</span>
                      <span>{selectedGuide.frontmatter.date}</span>
                      <span>{selectedGuide.readTime}</span>
                      <Badge>{selectedGuide.frontmatter.category}</Badge>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    <MarkdownRenderer content={selectedGuide.content} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuideSystemTest;
