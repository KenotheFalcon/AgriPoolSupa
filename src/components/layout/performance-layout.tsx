'use client';

import { memo, useEffect, useState } from 'react';
import { usePerformance } from '@/hooks/use-performance';
import { cn } from '@/lib/utils';

interface PerformanceLayoutProps {
  children: React.ReactNode;
  className?: string;
  enableMonitoring?: boolean;
}

// Memoized layout component to prevent unnecessary re-renders
export const PerformanceLayout = memo(function PerformanceLayout({
  children,
  className,
  enableMonitoring = process.env.NODE_ENV === 'production',
}: PerformanceLayoutProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const { metrics } = usePerformance({
    enableLogging: process.env.NODE_ENV === 'development',
    onMetric: enableMonitoring
      ? (metric) => {
          // Send metrics to analytics service
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: metric.name,
              value: metric.value,
              custom_map: { rating: metric.rating },
            });
          }
        }
      : undefined,
  });

  // Intersection Observer for lazy loading content
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('[data-performance-layout]');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-performance-layout
      className={cn('min-h-screen', className)}
      style={{
        // Critical CSS for above-the-fold content
        display: 'block',
        position: 'relative',
      }}
    >
      {/* Preload critical resources */}
      <link rel="preload" as="style" href="/fonts.css" />
      <link rel="preload" as="image" href="/icons/icon-192x192.png" />
      
      {/* Render children immediately for above-the-fold content */}
      <div className={cn('transition-opacity duration-300', isVisible ? 'opacity-100' : 'opacity-90')}>
        {children}
      </div>

      {/* Performance monitoring in development */}
      {process.env.NODE_ENV === 'development' && metrics.lcp && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
          <div>LCP: {metrics.lcp?.toFixed(0)}ms</div>
          <div>FCP: {metrics.fcp?.toFixed(0)}ms</div>
          <div>CLS: {metrics.cls?.toFixed(3)}</div>
        </div>
      )}
    </div>
  );
});

// Higher-order component for performance monitoring
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  const WrappedComponent = memo((props: P) => {
    const startTime = performance.now();
    
    useEffect(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 100) {
        console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
      }
    });

    return <Component {...props} />;
  });

  WrappedComponent.displayName = `withPerformanceMonitoring(${componentName})`;
  return WrappedComponent;
}

// Hook for preloading resources
export function usePreloadResources(resources: Array<{ href: string; as: string; type?: string }>) {
  useEffect(() => {
    resources.forEach(({ href, as, type }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      document.head.appendChild(link);
    });
  }, [resources]);
}

// Component for critical CSS inlining
export function CriticalCSS({ css }: { css: string }) {
  return (
    <style
      dangerouslySetInnerHTML={{ __html: css }}
      data-critical-css
    />
  );
}

// Optimized loading wrapper
export function OptimizedLoader({
  children,
  priority = false,
  threshold = 0.1,
}: {
  children: React.ReactNode;
  priority?: boolean;
  threshold?: number;
}) {
  const [shouldLoad, setShouldLoad] = useState(priority);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    const element = document.querySelector('[data-optimized-loader]');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [priority, threshold]);

  if (!shouldLoad) {
    return (
      <div data-optimized-loader className="h-32 bg-muted animate-pulse rounded" />
    );
  }

  return <>{children}</>;
}