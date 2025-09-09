'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/logger';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Use proper logging instead of console.error
    logger.error('ErrorBoundary caught an error', error, { errorInfo });
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Enhanced error UI with accessibility features
      return (
        <div 
          className='min-h-[400px] flex items-center justify-center p-4'
          role='alert'
          aria-labelledby='error-title'
          aria-describedby='error-description'
        >
          <Card className='w-full max-w-md'>
            <CardHeader className='text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20'>
                <AlertTriangle className='h-6 w-6 text-red-600 dark:text-red-400' aria-hidden='true' />
              </div>
              <CardTitle id='error-title' className='text-xl font-semibold text-foreground'>
                Something went wrong
              </CardTitle>
              <CardDescription id='error-description' className='mt-2'>
                An unexpected error occurred. This has been automatically reported to our team.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className='text-sm'>
                  <summary className='cursor-pointer font-medium text-muted-foreground hover:text-foreground'>
                    Error Details
                  </summary>
                  <pre className='mt-2 overflow-auto rounded bg-muted p-2 text-xs'>
                    {this.state.error.message}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <div className='flex flex-col gap-2 sm:flex-row'>
                <Button onClick={this.handleRetry} className='flex-1'>
                  <RefreshCw className='mr-2 h-4 w-4' aria-hidden='true' />
                  Try Again
                </Button>
                <Button variant='outline' onClick={this.handleReload} className='flex-1'>
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    logger.error('Unhandled error', error, { errorInfo });
  };
}
