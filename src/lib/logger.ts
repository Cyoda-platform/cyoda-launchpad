/**
 * Development logging utility for the blog system
 * Only logs in development mode to avoid cluttering production logs
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  action?: string;
  data?: any;
  error?: Error | string;
  timestamp?: string;
}

class BlogLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const prefix = `[BLOG-${level.toUpperCase()}]`;
    const componentInfo = context?.component ? `[${context.component}]` : '';
    const actionInfo = context?.action ? `[${context.action}]` : '';
    
    return `${prefix}${componentInfo}${actionInfo} ${message}`;
  }

  private logToConsole(level: LogLevel, message: string, context?: LogContext) {
    if (!this.isDevelopment) return;

    const formattedMessage = this.formatMessage(level, message, context);
    
    switch (level) {
      case 'debug':
        console.debug(formattedMessage, context?.data);
        break;
      case 'info':
        console.info(formattedMessage, context?.data);
        break;
      case 'warn':
        console.warn(formattedMessage, context?.data);
        break;
      case 'error':
        console.error(formattedMessage, context?.data, context?.error);
        break;
    }
  }

  debug(message: string, context?: LogContext) {
    this.logToConsole('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.logToConsole('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.logToConsole('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.logToConsole('error', message, context);
  }

  // Specialized logging methods for common blog operations
  blogPostLoad(slug: string, success: boolean, error?: Error) {
    if (success) {
      this.info(`Blog post loaded successfully`, {
        component: 'BlogPost',
        action: 'load',
        data: { slug }
      });
    } else {
      this.error(`Failed to load blog post`, {
        component: 'BlogPost',
        action: 'load',
        data: { slug },
        error
      });
    }
  }

  blogPostsLoad(count: number, error?: Error) {
    if (error) {
      this.error(`Failed to load blog posts`, {
        component: 'BlogListing',
        action: 'loadAll',
        error
      });
    } else {
      this.info(`Loaded ${count} blog posts`, {
        component: 'BlogListing',
        action: 'loadAll',
        data: { count }
      });
    }
  }

  searchPerformed(query: string, resultCount: number, duration?: number) {
    this.info(`Search completed`, {
      component: 'BlogSearch',
      action: 'search',
      data: { query, resultCount, duration }
    });
  }

  searchError(query: string, error: Error) {
    this.error(`Search failed`, {
      component: 'BlogSearch',
      action: 'search',
      data: { query },
      error
    });
  }

  markdownProcessing(filename: string, success: boolean, error?: Error) {
    if (success) {
      this.debug(`Markdown processed successfully`, {
        component: 'MarkdownProcessor',
        action: 'process',
        data: { filename }
      });
    } else {
      this.error(`Markdown processing failed`, {
        component: 'MarkdownProcessor',
        action: 'process',
        data: { filename },
        error
      });
    }
  }

  cacheOperation(operation: 'hit' | 'miss' | 'invalidate', key: string, data?: any) {
    this.debug(`Cache ${operation}`, {
      component: 'BlogCache',
      action: operation,
      data: { key, ...data }
    });
  }

  componentError(component: string, error: Error, context?: any) {
    this.error(`Component error occurred`, {
      component,
      action: 'render',
      data: context,
      error
    });
  }

  performanceMetric(operation: string, duration: number, context?: any) {
    this.debug(`Performance metric`, {
      component: 'Performance',
      action: operation,
      data: { duration, ...context }
    });
  }

  // Method to log user interactions for debugging
  userInteraction(action: string, component: string, data?: any) {
    this.debug(`User interaction`, {
      component,
      action,
      data
    });
  }
}

// Create singleton instance
export const blogLogger = new BlogLogger();

// Convenience functions for common logging patterns
export const logBlogPostLoad = (slug: string, success: boolean, error?: Error) => {
  blogLogger.blogPostLoad(slug, success, error);
};

export const logBlogPostsLoad = (count: number, error?: Error) => {
  blogLogger.blogPostsLoad(count, error);
};

export const logSearch = (query: string, resultCount: number, duration?: number) => {
  blogLogger.searchPerformed(query, resultCount, duration);
};

export const logSearchError = (query: string, error: Error) => {
  blogLogger.searchError(query, error);
};

export const logMarkdownProcessing = (filename: string, success: boolean, error?: Error) => {
  blogLogger.markdownProcessing(filename, success, error);
};

export const logCacheOperation = (operation: 'hit' | 'miss' | 'invalidate', key: string, data?: any) => {
  blogLogger.cacheOperation(operation, key, data);
};

export const logComponentError = (component: string, error: Error, context?: any) => {
  blogLogger.componentError(component, error, context);
};

export const logPerformance = (operation: string, duration: number, context?: any) => {
  blogLogger.performanceMetric(operation, duration, context);
};

export const logUserInteraction = (action: string, component: string, data?: any) => {
  blogLogger.userInteraction(action, component, data);
};

export default blogLogger;
