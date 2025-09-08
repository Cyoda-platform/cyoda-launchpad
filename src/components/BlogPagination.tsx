import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { BlogPostPreview } from '@/types/blog';

interface BlogPaginationProps {
  posts: BlogPostPreview[];
  currentPage: number;
  postsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

interface PaginatedBlogListProps {
  posts: BlogPostPreview[];
  postsPerPage?: number;
  renderPost: (post: BlogPostPreview) => React.ReactNode;
  className?: string;
}

export function BlogPagination({ 
  posts, 
  currentPage, 
  postsPerPage, 
  onPageChange,
  className = ""
}: BlogPaginationProps) {
  const totalPages = Math.ceil(posts.length / postsPerPage);
  
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`} aria-label="Blog pagination">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => (
          page === '...' ? (
            <div key={`dots-${index}`} className="px-2">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className="min-w-[40px]"
            >
              {page}
            </Button>
          )
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

export function PaginatedBlogList({ 
  posts, 
  postsPerPage = 12, 
  renderPost,
  className = ""
}: PaginatedBlogListProps) {
  const [currentPage, setCurrentPage] = React.useState(1);

  // Reset to page 1 when posts change (e.g., after filtering)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [posts]);

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of blog list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={className}>
      {/* Posts Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {currentPosts.map(renderPost)}
      </div>

      {/* Pagination */}
      <BlogPagination
        posts={posts}
        currentPage={currentPage}
        postsPerPage={postsPerPage}
        onPageChange={handlePageChange}
      />

      {/* Results Info */}
      <div className="text-center text-sm text-muted-foreground mt-4">
        Showing {startIndex + 1}-{Math.min(endIndex, posts.length)} of {posts.length} posts
      </div>
    </div>
  );
}

// Hook for managing pagination state
export function usePagination<T>(items: T[], itemsPerPage: number = 12) {
  const [currentPage, setCurrentPage] = React.useState(1);
  
  // Reset to page 1 when items change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, items.length),
    totalItems: items.length,
  };
}
