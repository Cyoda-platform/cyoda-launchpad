import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error info
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Add external error logging service integration
      console.error('Production error logged:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>
                An unexpected error occurred while rendering this component. 
                This might be a temporary issue.
              </AlertDescription>
            </Alert>

            <div className="bg-card/20 backdrop-blur border border-border/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                What you can do:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Try refreshing the page or clicking "Try Again"</li>
                <li>• Check your internet connection</li>
                <li>• Return to the home page and try again</li>
                <li>• If the problem persists, please contact support</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={this.handleRetry}
                className="bg-gradient-primary text-white glow-primary hover:bg-gradient-primary/90"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={this.handleGoHome}
                className="border-border/50 hover:bg-card/20"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 bg-card/10 backdrop-blur border border-border/30 rounded-lg p-4">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground mb-2">
                  Development Error Details (click to expand)
                </summary>
                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="font-semibold text-destructive mb-1">Error:</h4>
                    <pre className="bg-destructive/10 p-2 rounded text-destructive overflow-x-auto">
                      {this.state.error.message}
                    </pre>
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <h4 className="font-semibold text-destructive mb-1">Stack Trace:</h4>
                      <pre className="bg-destructive/10 p-2 rounded text-destructive overflow-x-auto whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <h4 className="font-semibold text-destructive mb-1">Component Stack:</h4>
                      <pre className="bg-destructive/10 p-2 rounded text-destructive overflow-x-auto whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
