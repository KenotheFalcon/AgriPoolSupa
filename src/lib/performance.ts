import { performance } from 'perf_hooks';

export interface PerformanceMetrics {
  cpu: number;
  memory: number;
  responseTime: number;
  uptime: number;
}

export async function getPerformanceMetrics(): Promise<PerformanceMetrics> {
  // This is a mock implementation. In a real application, you would
  // collect actual metrics from your system
  return {
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    responseTime: Math.random() * 1000,
    uptime: Math.random() * 1000000,
  };
}

export async function getSystemHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'critical';
  message: string;
}> {
  const metrics = await getPerformanceMetrics();

  if (metrics.cpu > 90 || metrics.memory > 90) {
    return {
      status: 'critical',
      message: 'System resources are critically high',
    };
  }

  if (metrics.cpu > 70 || metrics.memory > 70) {
    return {
      status: 'degraded',
      message: 'System resources are elevated',
    };
  }

  return {
    status: 'healthy',
    message: 'All systems operational',
  };
}

class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startMeasure(label: string) {
    performance.mark(`${label}-start`);
  }

  endMeasure(label: string) {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);

    const entries = performance.getEntriesByName(label);
    const duration = entries[entries.length - 1].duration;

    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)?.push(duration);

    performance.clearMarks(`${label}-start`);
    performance.clearMarks(`${label}-end`);
    performance.clearMeasures(label);
  }

  getMetrics(label: string) {
    const durations = this.metrics.get(label) || [];
    if (durations.length === 0) return null;

    return {
      avg: durations.reduce((a, b) => a + b, 0) / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      count: durations.length,
    };
  }

  clearMetrics(label?: string) {
    if (label) {
      this.metrics.delete(label);
    } else {
      this.metrics.clear();
    }
  }

  trackSectionLoad(sectionName: string, loadTime: number) {
    const label = `section-${sectionName}`;
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)?.push(loadTime);
  }
}

export const performanceMonitor = new PerformanceMonitor();
