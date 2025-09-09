'use client';

import { useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

interface PerformanceOptions {
  enableLogging?: boolean;
  onMetric?: (metric: { name: string; value: number; rating: 'good' | 'needs-improvement' | 'poor' }) => void;
}

export function usePerformance({ enableLogging = false, onMetric }: PerformanceOptions = {}) {
  const metricsRef = useRef<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  const reportMetric = useCallback(
    (name: string, value: number) => {
      // Update metrics
      metricsRef.current = {
        ...metricsRef.current,
        [name.toLowerCase()]: value,
      };

      // Determine rating based on web vitals thresholds
      let rating: 'good' | 'needs-improvement' | 'poor' = 'good';
      
      switch (name) {
        case 'FCP':
          rating = value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
          break;
        case 'LCP':
          rating = value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
          break;
        case 'FID':
          rating = value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
          break;
        case 'CLS':
          rating = value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
          break;
        case 'TTFB':
          rating = value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
          break;
      }

      if (enableLogging) {
        console.log(`${name}: ${value}ms (${rating})`);
      }

      onMetric?.({ name, value, rating });
    },
    [enableLogging, onMetric]
  );

  const measurePageLoad = useCallback(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart;
      reportMetric('TTFB', ttfb);
    }
  }, [reportMetric]);

  const observeWebVitals = useCallback(() => {
    if (typeof window === 'undefined') return;

    // FCP and LCP
    if ('PerformanceObserver' in window) {
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            reportMetric('FCP', entry.startTime);
          }
        });
      });
      paintObserver.observe({ entryTypes: ['paint'] });

      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        reportMetric('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          reportMetric('FID', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            reportMetric('CLS', clsValue);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      return () => {
        paintObserver.disconnect();
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, [reportMetric]);

  const measureResourceLoading = useCallback(() => {
    if (typeof window === 'undefined' || !window.performance) return {};

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const resourceMetrics = resources.reduce(
      (acc, resource) => {
        const { name, duration, transferSize = 0 } = resource;
        
        if (name.includes('.js')) {
          acc.totalJSSize += transferSize;
          acc.totalJSTime += duration;
        } else if (name.includes('.css')) {
          acc.totalCSSSize += transferSize;
          acc.totalCSSTime += duration;
        } else if (name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
          acc.totalImageSize += transferSize;
          acc.totalImageTime += duration;
        }
        
        return acc;
      },
      {
        totalJSSize: 0,
        totalJSTime: 0,
        totalCSSSize: 0,
        totalCSSTime: 0,
        totalImageSize: 0,
        totalImageTime: 0,
      }
    );

    return resourceMetrics;
  }, []);

  const startTiming = useCallback((label: string) => {
    if (typeof window === 'undefined' || !window.performance) return;
    performance.mark(`${label}-start`);
  }, []);

  const endTiming = useCallback(
    (label: string) => {
      if (typeof window === 'undefined' || !window.performance) return;
      
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
      
      const measure = performance.getEntriesByName(label)[0];
      if (measure) {
        reportMetric(label, measure.duration);
      }
    },
    [reportMetric]
  );

  useEffect(() => {
    const cleanup = observeWebVitals();
    measurePageLoad();

    return cleanup;
  }, [observeWebVitals, measurePageLoad]);

  return {
    metrics: metricsRef.current,
    measureResourceLoading,
    startTiming,
    endTiming,
  };
}

// Custom hook for component-level performance tracking
export function useComponentPerformance(componentName: string) {
  const { startTiming, endTiming } = usePerformance();
  const renderStartRef = useRef<number>(0);

  useEffect(() => {
    renderStartRef.current = performance.now();
    startTiming(`${componentName}-render`);
    
    return () => {
      endTiming(`${componentName}-render`);
    };
  }, [componentName, startTiming, endTiming]);

  const trackAction = useCallback(
    (actionName: string, action: () => void | Promise<void>) => {
      const actionLabel = `${componentName}-${actionName}`;
      startTiming(actionLabel);
      
      const result = action();
      
      if (result instanceof Promise) {
        return result.finally(() => endTiming(actionLabel));
      } else {
        endTiming(actionLabel);
        return result;
      }
    },
    [componentName, startTiming, endTiming]
  );

  return { trackAction };
}