import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BlogPost, BlogPostPreview } from '@/types/blog';
import {
  loadBlogPosts,
  loadBlogPostPreviews,
  loadBlogPost,
  getFeaturedBlogPosts,
  getBlogPostsByCategory,
  getBlogCategories,
  searchBlogPosts,
  clearBlogCache,
} from '@/lib/blog-loader';

// Query keys for React Query
export const BLOG_QUERY_KEYS = {
  all: ['blog'] as const,
  posts: () => [...BLOG_QUERY_KEYS.all, 'posts'] as const,
  previews: () => [...BLOG_QUERY_KEYS.all, 'previews'] as const,
  post: (slug: string) => [...BLOG_QUERY_KEYS.all, 'post', slug] as const,
  featured: () => [...BLOG_QUERY_KEYS.all, 'featured'] as const,
  categories: () => [...BLOG_QUERY_KEYS.all, 'categories'] as const,
  byCategory: (category: string) => [...BLOG_QUERY_KEYS.all, 'category', category] as const,
  search: (query: string) => [...BLOG_QUERY_KEYS.all, 'search', query] as const,
} as const;

/**
 * Hook for loading all blog posts with React Query caching
 */
export function useBlogPosts() {
  const {
    data: posts = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: BLOG_QUERY_KEYS.posts(),
    queryFn: loadBlogPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    posts,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}

/**
 * Hook for loading blog post previews with React Query caching
 */
export function useBlogPostPreviews() {
  const {
    data: previews = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: BLOG_QUERY_KEYS.previews(),
    queryFn: loadBlogPostPreviews,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    previews,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}

/**
 * Hook for loading a single blog post by slug with React Query caching
 */
export function useBlogPost(slug: string) {
  const {
    data: post = null,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: BLOG_QUERY_KEYS.post(slug),
    queryFn: () => loadBlogPost(slug),
    enabled: !!slug, // Only run query if slug is provided
    staleTime: 10 * 60 * 1000, // 10 minutes (individual posts change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    post,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}

/**
 * Hook for loading featured blog posts with React Query caching
 */
export function useFeaturedBlogPosts() {
  const {
    data: featuredPosts = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: BLOG_QUERY_KEYS.featured(),
    queryFn: getFeaturedBlogPosts,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    featuredPosts,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}

/**
 * Hook for loading blog categories with React Query caching
 */
export function useBlogCategories() {
  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: BLOG_QUERY_KEYS.categories(),
    queryFn: getBlogCategories,
    staleTime: 15 * 60 * 1000, // 15 minutes (categories change infrequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    categories,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}

/**
 * Hook for filtering blog posts by category with React Query caching
 */
export function useBlogPostsByCategory(category: string) {
  const {
    data: posts = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: BLOG_QUERY_KEYS.byCategory(category),
    queryFn: () => getBlogPostsByCategory(category),
    enabled: !!category, // Only run query if category is provided
    staleTime: 8 * 60 * 1000, // 8 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    posts,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}

/**
 * Hook for searching blog posts with React Query caching
 */
export function useSearchBlogPosts() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    data: results = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: BLOG_QUERY_KEYS.search(searchQuery),
    queryFn: () => searchBlogPosts(searchQuery),
    enabled: !!searchQuery.trim(), // Only run query if search query is provided
    staleTime: 2 * 60 * 1000, // 2 minutes (search results can change more frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Fewer retries for search
    retryDelay: 1000,
  });

  const search = (query: string) => {
    setSearchQuery(query.trim());
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return {
    results,
    loading,
    error: error ? (error as Error).message : null,
    search,
    clearSearch,
    refetch,
  };
}

/**
 * Hook for cache management and development utilities
 */
export function useBlogCacheManager() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.all });
  };

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.posts() });
  };

  const invalidatePreviews = () => {
    queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.previews() });
  };

  const clearAllCache = () => {
    queryClient.removeQueries({ queryKey: BLOG_QUERY_KEYS.all });
    clearBlogCache(); // Also clear the internal markdown cache
  };

  const refreshAll = async () => {
    clearBlogCache(); // Clear internal cache first
    await queryClient.refetchQueries({ queryKey: BLOG_QUERY_KEYS.all });
  };

  return {
    invalidateAll,
    invalidatePosts,
    invalidatePreviews,
    clearAllCache,
    refreshAll,
  };
}

/**
 * Development hook for auto-refresh functionality
 * Only active in development mode
 */
export function useBlogAutoRefresh(intervalMs: number = 30000) { // 30 seconds default
  const { refreshAll } = useBlogCacheManager();
  const [isEnabled, setIsEnabled] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Only enable in development
  const isDevelopment = import.meta.env.DEV;

  React.useEffect(() => {
    if (!isDevelopment || !isEnabled) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        console.log('Auto-refreshing blog data...');
        await refreshAll();
        setLastRefresh(new Date());
        console.log('Blog data refreshed successfully');
      } catch (error) {
        console.error('Failed to auto-refresh blog data:', error);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isDevelopment, isEnabled, intervalMs, refreshAll]);

  const enable = () => setIsEnabled(true);
  const disable = () => setIsEnabled(false);
  const toggle = () => setIsEnabled(prev => !prev);

  const manualRefresh = async () => {
    try {
      await refreshAll();
      setLastRefresh(new Date());
      return true;
    } catch (error) {
      console.error('Manual refresh failed:', error);
      return false;
    }
  };

  return {
    isEnabled,
    isDevelopment,
    lastRefresh,
    enable,
    disable,
    toggle,
    manualRefresh,
  };
}
