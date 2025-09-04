import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  FileText, 
  Search, 
  Wifi,
  Clock,
  BookOpen
} from 'lucide-react';

interface ErrorFallbackProps {
  title: string;
  description: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

// Generic error fallback component
export const ErrorFallback = ({ 
  title, 
  description, 
  onRetry, 
  showHomeButton = true,
  icon,
  children 
}: ErrorFallbackProps) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="text-center max-w-2xl mx-auto py-12">
      <div className="w-24 h-24 rounded-2xl bg-destructive/20 flex items-center justify-center mx-auto mb-6">
        {icon || <AlertTriangle className="h-8 w-8 text-destructive" />}
      </div>
      
      <h2 className="text-3xl font-bold text-foreground mb-4">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      {children}
      
      <div className="flex gap-4 justify-center mt-6">
        {onRetry && (
          <Button
            onClick={onRetry}
            className="bg-gradient-primary text-white glow-primary hover:bg-gradient-primary/90"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        {showHomeButton && (
          <Button
            variant="outline"
            onClick={handleGoHome}
            className="border-border/50 hover:bg-card/20"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        )}
      </div>
    </div>
  );
};

// Blog posts loading error
export const BlogPostsErrorFallback = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <ErrorFallback
      title="Unable to Load Blog Posts"
      description="We're experiencing some technical difficulties loading the blog content. This might be a temporary issue."
      onRetry={onRetry}
      icon={<FileText className="h-8 w-8 text-destructive" />}
    >
      <div className="bg-card/20 backdrop-blur border border-border/50 rounded-lg p-4 mb-6">
        <p className="text-sm text-muted-foreground">
          <strong>What you can try:</strong>
        </p>
        <ul className="text-sm text-muted-foreground mt-2 space-y-1 text-left">
          <li>• Check your internet connection</li>
          <li>• Refresh the page or click "Try Again"</li>
          <li>• Wait a few moments and try again</li>
          <li>• Contact support if the issue persists</li>
        </ul>
      </div>
    </ErrorFallback>
  );
};

// Individual blog post not found
export const BlogPostNotFoundFallback = () => {
  return (
    <ErrorFallback
      title="Blog Post Not Found"
      description="The blog post you're looking for doesn't exist or may have been moved."
      icon={<BookOpen className="h-8 w-8 text-muted-foreground" />}
    >
      <div className="bg-card/20 backdrop-blur border border-border/50 rounded-lg p-4 mb-6">
        <p className="text-sm text-muted-foreground">
          <strong>This could happen if:</strong>
        </p>
        <ul className="text-sm text-muted-foreground mt-2 space-y-1 text-left">
          <li>• The URL was typed incorrectly</li>
          <li>• The blog post was removed or unpublished</li>
          <li>• You followed an outdated link</li>
        </ul>
      </div>
    </ErrorFallback>
  );
};

// Network error fallback
export const NetworkErrorFallback = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <ErrorFallback
      title="Connection Problem"
      description="We couldn't connect to our servers. Please check your internet connection and try again."
      onRetry={onRetry}
      icon={<Wifi className="h-8 w-8 text-destructive" />}
    >
      <Alert className="mb-6 text-left">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Network Issue Detected</AlertTitle>
        <AlertDescription>
          This error typically occurs when there's a problem with your internet connection 
          or our servers are temporarily unavailable.
        </AlertDescription>
      </Alert>
    </ErrorFallback>
  );
};

// Search no results fallback
export const SearchNoResultsFallback = ({ 
  searchQuery, 
  onClearSearch 
}: { 
  searchQuery: string;
  onClearSearch?: () => void;
}) => {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 rounded-2xl bg-muted/20 flex items-center justify-center mx-auto mb-6">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <h3 className="text-2xl font-bold text-foreground mb-4">
        No Results Found
      </h3>
      <p className="text-muted-foreground mb-6">
        We couldn't find any blog posts matching "{searchQuery}".
      </p>
      
      <div className="bg-card/20 backdrop-blur border border-border/50 rounded-lg p-4 mb-6 max-w-md mx-auto">
        <p className="text-sm text-muted-foreground mb-2">
          <strong>Try:</strong>
        </p>
        <ul className="text-sm text-muted-foreground space-y-1 text-left">
          <li>• Using different keywords</li>
          <li>• Checking your spelling</li>
          <li>• Using more general terms</li>
          <li>• Browsing all posts instead</li>
        </ul>
      </div>
      
      {onClearSearch && (
        <Button
          onClick={onClearSearch}
          variant="outline"
          className="border-border/50 hover:bg-card/20"
        >
          <Search className="h-4 w-4 mr-2" />
          Browse All Posts
        </Button>
      )}
    </div>
  );
};

// Empty blog state (no posts available)
export const EmptyBlogFallback = () => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 rounded-2xl bg-muted/20 flex items-center justify-center mx-auto mb-6">
        <BookOpen className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <h3 className="text-2xl font-bold text-foreground mb-4">
        No Blog Posts Yet
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        We're working on creating great content for you. 
        Check back soon for our latest blog posts and insights.
      </p>
      
      <div className="bg-card/20 backdrop-blur border border-border/50 rounded-lg p-4 max-w-md mx-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>New content coming soon!</span>
        </div>
      </div>
    </div>
  );
};

// Corrupted markdown fallback
export const CorruptedMarkdownFallback = ({ 
  postTitle, 
  onRetry 
}: { 
  postTitle?: string;
  onRetry?: () => void;
}) => {
  return (
    <ErrorFallback
      title="Content Loading Error"
      description={`There was a problem loading the content for ${postTitle ? `"${postTitle}"` : 'this blog post'}. The file may be corrupted or temporarily unavailable.`}
      onRetry={onRetry}
      icon={<FileText className="h-8 w-8 text-destructive" />}
    >
      <Alert variant="destructive" className="mb-6 text-left">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Content Processing Error</AlertTitle>
        <AlertDescription>
          The markdown content for this post couldn't be processed correctly. 
          This is usually a temporary issue.
        </AlertDescription>
      </Alert>
    </ErrorFallback>
  );
};

// Timeout error fallback
export const TimeoutErrorFallback = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <ErrorFallback
      title="Request Timed Out"
      description="The request took too long to complete. This might be due to a slow connection or server issues."
      onRetry={onRetry}
      icon={<Clock className="h-8 w-8 text-destructive" />}
    >
      <Alert className="mb-6 text-left">
        <Clock className="h-4 w-4" />
        <AlertTitle>Slow Connection Detected</AlertTitle>
        <AlertDescription>
          The request timed out. Please check your internet connection and try again.
        </AlertDescription>
      </Alert>
    </ErrorFallback>
  );
};
