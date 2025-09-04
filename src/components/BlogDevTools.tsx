import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RefreshCw, Trash2, Database, Clock, AlertCircle } from 'lucide-react';
import { useBlogCacheManager, useBlogAutoRefresh } from '@/hooks/use-blog';
import { getBlogCacheStatus } from '@/lib/blog-loader';

/**
 * Development tools component for blog system management
 * Only renders in development mode
 */
export function BlogDevTools() {
  const isDevelopment = import.meta.env.DEV;
  
  if (!isDevelopment) {
    return null;
  }

  return <BlogDevToolsContent />;
}

function BlogDevToolsContent() {
  const {
    invalidateAll,
    invalidatePosts,
    invalidatePreviews,
    clearAllCache,
    refreshAll,
  } = useBlogCacheManager();

  const {
    isEnabled: autoRefreshEnabled,
    lastRefresh,
    enable: enableAutoRefresh,
    disable: disableAutoRefresh,
    toggle: toggleAutoRefresh,
    manualRefresh,
  } = useBlogAutoRefresh();

  const [cacheStatus, setCacheStatus] = React.useState(getBlogCacheStatus());
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Update cache status periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCacheStatus(getBlogCacheStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await refreshAll();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await manualRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  const formatAge = (ageMs: number) => {
    if (ageMs === 0) return 'No cache';
    const seconds = Math.floor(ageMs / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s ago`;
    }
    return `${seconds}s ago`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4 bg-card/20 backdrop-blur border border-border/50 glow-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Database className="h-5 w-5 text-accent" />
          Blog Development Tools
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Development utilities for managing blog data and caching
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cache Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Cache Status</h4>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={cacheStatus.cached ? "default" : "secondary"}
              className={cacheStatus.cached ? "bg-gradient-primary text-white" : "bg-card/20 backdrop-blur border border-border/50"}
            >
              {cacheStatus.cached ? "Cached" : "No Cache"}
            </Badge>
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
              {cacheStatus.fileCount} files
            </Badge>
            <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
              Age: {formatAge(cacheStatus.age)}
            </Badge>
          </div>
        </div>

        {/* Auto Refresh */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-refresh">Auto Refresh</Label>
              <p className="text-sm text-muted-foreground">
                Automatically refresh blog data every 30 seconds
              </p>
            </div>
            <Switch
              id="auto-refresh"
              checked={autoRefreshEnabled}
              onCheckedChange={toggleAutoRefresh}
            />
          </div>
          {lastRefresh && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last refresh: {formatTime(lastRefresh)}
            </div>
          )}
        </div>

        {/* Manual Actions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Manual Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-card/20 backdrop-blur border-primary/30 hover:bg-primary/10 hover:border-primary glow-hover"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={invalidateAll}
              className="flex items-center gap-2 bg-card/20 backdrop-blur border-destructive/30 hover:bg-destructive/10 hover:border-destructive glow-hover"
            >
              <AlertCircle className="h-4 w-4" />
              Invalidate Cache
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={invalidatePosts}
              className="bg-card/20 backdrop-blur border-primary/30 hover:bg-primary/10 hover:border-primary glow-hover"
            >
              Invalidate Posts
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={invalidatePreviews}
              className="bg-card/20 backdrop-blur border-primary/30 hover:bg-primary/10 hover:border-primary glow-hover"
            >
              Invalidate Previews
            </Button>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={clearAllCache}
            className="w-full flex items-center gap-2 bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground glow-hover"
          >
            <Trash2 className="h-4 w-4" />
            Clear All Cache
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Add new .md files to src/docs/blogs/ directory</p>
          <p>• Use "Refresh All" after adding/modifying blog files</p>
          <p>• Auto-refresh helps during active development</p>
          <p>• This component only appears in development mode</p>
        </div>
      </CardContent>
    </Card>
  );
}
