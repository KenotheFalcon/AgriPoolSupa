'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

interface PerformanceMetrics {
  navigationStart: number;
  domContentLoaded: number;
  loadComplete: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run performance monitoring in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    const reportPerformance = () => {
      // Basic navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (!navigation) return;

      const metrics: PerformanceMetrics = {
        navigationStart: navigation.navigationStart || 0,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        loadComplete: navigation.loadEventEnd - navigation.navigationStart,
      };

      // Web Vitals metrics if available
      if ('PerformanceObserver' in window) {
        // First Contentful Paint
        try {
          const paintEntries = performance.getEntriesByType('paint');
          const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
          if (fcp) {
            metrics.firstContentfulPaint = fcp.startTime;
          }
        } catch (error) {
          logger.warn('Failed to get paint metrics', error);
        }

        // Largest Contentful Paint
        try {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              metrics.largestContentfulPaint = lastEntry.startTime;
              logger.info('Performance metrics collected', undefined, { metrics });
            }
          }).observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (error) {
          logger.warn('Failed to observe LCP', error);
        }

        // Cumulative Layout Shift
        try {
          let clsValue = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
            metrics.cumulativeLayoutShift = clsValue;
          }).observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          logger.warn('Failed to observe CLS', error);
        }
      }

      // Report basic metrics immediately
      logger.info('Performance metrics collected', undefined, { metrics });

      // Send to analytics service if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'page_load_metrics', {
          custom_map: {
            metric1: 'dom_content_loaded',
            metric2: 'load_complete',
          },
          metric1: metrics.domContentLoaded,
          metric2: metrics.loadComplete,
        });
      }
    };

    // Report after page load
    if (document.readyState === 'complete') {
      reportPerformance();
    } else {
      window.addEventListener('load', reportPerformance);
      return () => window.removeEventListener('load', reportPerformance);
    }
  }, []);

  // This component doesn't render anything
  return null;
}

// Hook for component-level performance monitoring
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 100) { // Only log if render time > 100ms
        logger.warn(`Component ${componentName} took ${renderTime.toFixed(2)}ms to render`);
      }
    };
  }, [componentName]);
}