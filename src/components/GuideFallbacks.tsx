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

// Guide loading error
export const GuideErrorFallback = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <ErrorFallback
      title="Unable to Load Guides"
      description="We're experiencing some technical difficulties loading the guide content. This might be a temporary issue."
      onRetry={onRetry}
      icon={<BookOpen className="h-8 w-8 text-destructive" />}
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

// Individual guide not found
export const GuideNotFoundFallback = () => {
  return (
    <ErrorFallback
      title="Guide Not Found"
      description="The guide you're looking for doesn't exist or may have been moved. Please check the URL or browse our available guides."
      icon={<FileText className="h-8 w-8 text-destructive" />}
    >
      <div className="bg-card/20 backdrop-blur border border-border/50 rounded-lg p-4 mb-6">
        <p className="text-sm text-muted-foreground">
          <strong>Possible reasons:</strong>
        </p>
        <ul className="text-sm text-muted-foreground mt-2 space-y-1 text-left">
          <li>• The guide URL is incorrect</li>
          <li>• The guide has been moved or deleted</li>
          <li>• The guide is not yet published</li>
          <li>• There's a temporary server issue</li>
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
      description="Unable to connect to our servers. Please check your internet connection and try again."
      onRetry={onRetry}
      icon={<Wifi className="h-8 w-8 text-destructive" />}
    >
      <Alert className="mb-6 bg-card/20 backdrop-blur border-border/50">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Network Issue Detected</AlertTitle>
        <AlertDescription>
          This appears to be a connectivity issue. Please ensure you have a stable internet connection.
        </AlertDescription>
      </Alert>
    </ErrorFallback>
  );
};

// Corrupted markdown fallback
export const CorruptedMarkdownFallback = ({ 
  guideTitle, 
  onRetry 
}: { 
  guideTitle?: string; 
  onRetry?: () => void; 
}) => {
  return (
    <ErrorFallback
      title="Content Loading Error"
      description={`There was an issue loading the content for ${guideTitle ? `"${guideTitle}"` : 'this guide'}. The guide file may be corrupted or improperly formatted.`}
      onRetry={onRetry}
      icon={<FileText className="h-8 w-8 text-destructive" />}
    >
      <Alert className="mb-6 bg-card/20 backdrop-blur border-border/50">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Content Format Issue</AlertTitle>
        <AlertDescription>
          The guide content appears to be corrupted or contains formatting errors. 
          Our team has been notified and will fix this soon.
        </AlertDescription>
      </Alert>
    </ErrorFallback>
  );
};

// Search no results fallback
export const GuideSearchNoResultsFallback = ({ 
  searchQuery, 
  onClearSearch 
}: { 
  searchQuery: string; 
  onClearSearch: () => void; 
}) => {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 rounded-2xl bg-muted/20 flex items-center justify-center mx-auto mb-6">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4">
          No Guides Found
        </h3>
        <p className="text-muted-foreground mb-6">
          No guides match your search for "<strong>{searchQuery}</strong>". 
          Try different keywords or browse all guides.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={onClearSearch}
            className="bg-gradient-primary text-white glow-primary"
          >
            Clear Search
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/guides'}
            className="border-border/50 hover:bg-card/20"
          >
            Browse All Guides
          </Button>
        </div>
      </div>
    </div>
  );
};

// Empty guides fallback (when no guides exist at all)
export const EmptyGuidesFallback = () => {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 rounded-2xl bg-muted/20 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4">
          No Guides Available
        </h3>
        <p className="text-muted-foreground mb-6">
          We're working on creating helpful guides for you. Check back soon for new content!
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
          className="border-border/50 hover:bg-card/20"
        >
          <Home className="h-4 w-4 mr-2" />
          Go Home
        </Button>
      </div>
    </div>
  );
};

// Loading timeout fallback
export const GuideLoadingTimeoutFallback = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <ErrorFallback
      title="Loading Taking Too Long"
      description="The guides are taking longer than expected to load. This might be due to a slow connection or server issues."
      onRetry={onRetry}
      icon={<Clock className="h-8 w-8 text-destructive" />}
    >
      <div className="bg-card/20 backdrop-blur border border-border/50 rounded-lg p-4 mb-6">
        <p className="text-sm text-muted-foreground">
          <strong>What you can try:</strong>
        </p>
        <ul className="text-sm text-muted-foreground mt-2 space-y-1 text-left">
          <li>• Wait a bit longer for the content to load</li>
          <li>• Check your internet connection speed</li>
          <li>• Try refreshing the page</li>
          <li>• Contact support if this persists</li>
        </ul>
      </div>
    </ErrorFallback>
  );
};
