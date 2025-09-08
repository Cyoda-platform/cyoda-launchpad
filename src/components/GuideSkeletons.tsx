import { Skeleton } from '@/components/ui/skeleton';

// Skeleton for individual guide cards in the listing
export const GuideCardSkeleton = () => {
  return (
    <div className="bg-card/20 backdrop-blur border border-border/50 rounded-lg overflow-hidden glow-hover">
      {/* Image skeleton */}
      <Skeleton className="w-full h-48" />
      
      <div className="p-6">
        {/* Category badge skeleton */}
        <Skeleton className="h-5 w-20 mb-3" />
        
        {/* Title skeleton */}
        <Skeleton className="h-7 w-full mb-2" />
        <Skeleton className="h-7 w-3/4 mb-4" />
        
        {/* Excerpt skeleton */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        
        {/* Meta info skeleton */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        
        {/* Read more button skeleton */}
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};

// Skeleton for featured guide cards
export const FeaturedGuideSkeleton = () => {
  return (
    <div className="bg-card/20 backdrop-blur border border-border/50 rounded-lg overflow-hidden glow-hover">
      {/* Image skeleton */}
      <Skeleton className="w-full h-64" />
      
      <div className="p-6">
        {/* Featured badge skeleton */}
        <Skeleton className="h-5 w-16 mb-3" />
        
        {/* Title skeleton */}
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-4/5 mb-4" />
        
        {/* Excerpt skeleton */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        
        {/* Meta info skeleton */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        
        {/* Read more button skeleton */}
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
};

// Skeleton for guides listing page
export const GuideListingSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header skeleton */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
          </div>

          {/* Search and filters skeleton */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
              <Skeleton className="h-10 w-full md:w-80" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-18" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>

          {/* Featured guides skeleton */}
          <div className="max-w-6xl mx-auto mb-16">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <FeaturedGuideSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* All guides skeleton */}
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-8 w-32 mb-8" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <GuideCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton for individual guide page
export const GuideSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb skeleton */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <article className="max-w-4xl mx-auto">
            {/* Header skeleton */}
            <header className="mb-12">
              <div className="mb-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-12 w-full mb-2" />
                <Skeleton className="h-12 w-4/5 mb-6" />
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
              
              {/* Featured image skeleton */}
              <Skeleton className="w-full h-96 rounded-lg" />
            </header>

            {/* Content skeleton */}
            <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
              {/* Paragraphs */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="mb-6">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
              
              {/* Heading skeleton */}
              <Skeleton className="h-8 w-2/3 mb-4 mt-8" />
              
              {/* More paragraphs */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i + 8} className="mb-6">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>

            {/* Tags skeleton */}
            <div className="mb-8">
              <Skeleton className="h-6 w-16 mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16" />
                ))}
              </div>
            </div>

            {/* Social share skeleton */}
            <div className="mb-12">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10" />
                ))}
              </div>
            </div>
          </article>

          {/* Navigation skeleton */}
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton for search results
export const GuideSearchResultsSkeleton = () => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card/20 backdrop-blur border border-border/50 rounded-lg p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
