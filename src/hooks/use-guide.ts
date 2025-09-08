import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Guide, GuidePreview } from '@/types/guide';
import {
  loadGuides,
  loadGuidePreviews,
  loadGuide,
  getFeaturedGuides,
  getGuidesByCategory,
  getGuideCategories,
  searchGuides,
  clearGuideCache,
} from '@/lib/guide-loader';

// Query keys for React Query
export const GUIDE_QUERY_KEYS = {
  all: ['guide'] as const,
  posts: () => [...GUIDE_QUERY_KEYS.all, 'posts'] as const,
  previews: () => [...GUIDE_QUERY_KEYS.all, 'previews'] as const,
  post: (slug: string) => [...GUIDE_QUERY_KEYS.all, 'post', slug] as const,
  featured: () => [...GUIDE_QUERY_KEYS.all, 'featured'] as const,
  categories: () => [...GUIDE_QUERY_KEYS.all, 'categories'] as const,
  byCategory: (category: string) => [...GUIDE_QUERY_KEYS.all, 'category', category] as const,
  search: (query: string) => [...GUIDE_QUERY_KEYS.all, 'search', query] as const,
} as const;

/**
 * Hook for loading all guides with React Query caching
 */
export function useGuides() {
  const {
    data: guides = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: GUIDE_QUERY_KEYS.posts(),
    queryFn: loadGuides,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    guides,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}

/**
 * Hook for loading guide previews with React Query caching
 */
export function useGuidePreviews() {
  const {
    data: previews = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: GUIDE_QUERY_KEYS.previews(),
    queryFn: loadGuidePreviews,
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
 * Hook for loading a single guide by slug with React Query caching
 */
export function useGuide(slug: string) {
  const {
    data: guide = null,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: GUIDE_QUERY_KEYS.post(slug),
    queryFn: () => loadGuide(slug),
    enabled: !!slug, // Only run query if slug is provided
    staleTime: 10 * 60 * 1000, // 10 minutes (individual guides change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    guide,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}

/**
 * Hook for loading featured guides with React Query caching
 */
export function useFeaturedGuides() {
  const {
    data: featuredGuides = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: GUIDE_QUERY_KEYS.featured(),
    queryFn: getFeaturedGuides,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    featuredGuides,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}

/**
 * Hook for loading guide categories with React Query caching
 */
export function useGuideCategories() {
  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: GUIDE_QUERY_KEYS.categories(),
    queryFn: getGuideCategories,
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
 * Hook for filtering guides by category with React Query caching
 */
export function useGuidesByCategory(category: string) {
  const {
    data: guides = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: GUIDE_QUERY_KEYS.byCategory(category),
    queryFn: () => getGuidesByCategory(category),
    enabled: !!category, // Only run query if category is provided
    staleTime: 8 * 60 * 1000, // 8 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    guides,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}

/**
 * Hook for searching guides with React Query caching
 */
export function useSearchGuides() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    data: results = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: GUIDE_QUERY_KEYS.search(searchQuery),
    queryFn: () => searchGuides(searchQuery),
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
export function useGuideCacheManager() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: GUIDE_QUERY_KEYS.all });
  };

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: GUIDE_QUERY_KEYS.posts() });
  };

  const invalidatePreviews = () => {
    queryClient.invalidateQueries({ queryKey: GUIDE_QUERY_KEYS.previews() });
  };

  const clearAllCache = () => {
    queryClient.removeQueries({ queryKey: GUIDE_QUERY_KEYS.all });
    clearGuideCache(); // Also clear the internal markdown cache
  };

  const refreshAll = async () => {
    clearGuideCache(); // Clear internal cache first
    await queryClient.refetchQueries({ queryKey: GUIDE_QUERY_KEYS.all });
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
export function useGuideAutoRefresh(intervalMs: number = 30000) { // 30 seconds default
  const { refreshAll } = useGuideCacheManager();
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
        console.log('Auto-refreshing guide data...');
        await refreshAll();
        setLastRefresh(new Date());
        console.log('Guide data refreshed successfully');
      } catch (error) {
        console.error('Failed to auto-refresh guide data:', error);
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
