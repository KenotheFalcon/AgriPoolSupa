'use client';

import { monitoringService } from './monitoring';

export interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  url: string;
  userAgent: string;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};

  constructor() {
    if (typeof window !== 'undefined') {
      this.observeLCP();
      this.observeCLS();
      this.observePaint();
      this.observeFID();
    }
  }

  private observePaint() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntriesByName('first-contentful-paint')) {
        this.metrics.fcp = entry.startTime;
        observer.disconnect();
      }
    });
    observer.observe({ type: 'paint', buffered: true });
  }

  private observeLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      }
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  }

  private observeFID() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const perfEntry = entry as PerformanceEventTiming;
        this.metrics.fid = perfEntry.processingStart - perfEntry.startTime;
        observer.disconnect();
      }
    });
    observer.observe({ type: 'first-input', buffered: true });
  }

  private observeCLS() {
    let cumulativeCls = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as LayoutShift;
        if (!shift.hadRecentInput) {
          cumulativeCls += shift.value;
        }
      }
      this.metrics.cls = cumulativeCls;
    });
    observer.observe({ type: 'layout-shift', buffered: true });
  }

  public sendMetricsToAnalytics() {
    if (typeof window === 'undefined') {
      return;
    }

    const navigationEntry = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (navigationEntry) {
      this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    }

    const allMetrics: PerformanceMetrics = {
      fcp: this.metrics.fcp || 0,
      lcp: this.metrics.lcp || 0,
      fid: this.metrics.fid || 0,
      cls: this.metrics.cls || 0,
      ttfb: this.metrics.ttfb || 0,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    fetch('/api/metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(allMetrics),
      keepalive: true,
    }).catch((error) => {
      console.error('Error sending performance metrics:', error);
      monitoringService.addAlert({
        type: 'performance-metrics-failure',
        message: 'Failed to send performance metrics to analytics',
        metadata: { error: error.message },
        status: 'active',
      });
    });
  }
}

export const performanceMonitor = new PerformanceMonitor();
