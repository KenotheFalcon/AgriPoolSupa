import { NextResponse } from 'next/server';
import { performanceMonitor } from '@/lib/performance';

export async function GET() {
  try {
    // Get metrics for different sections
    const pageLoadMetrics = performanceMonitor.getMetrics('page-load') || {
      avg: 0,
      min: 0,
      max: 0,
      count: 0,
    };

    const apiMetrics = performanceMonitor.getMetrics('api-calls') || {
      avg: 0,
      min: 0,
      max: 0,
      count: 0,
    };

    const renderMetrics = performanceMonitor.getMetrics('render') || {
      avg: 0,
      min: 0,
      max: 0,
      count: 0,
    };

    // Return formatted metrics
    return NextResponse.json({
      fcp: pageLoadMetrics.avg,
      lcp: Math.max(pageLoadMetrics.max, renderMetrics.max),
      fid: apiMetrics.avg,
      cls: 0.1, // This would be calculated from actual layout shifts
      ttfb: apiMetrics.min,
      sectionLoadTimes: {
        'Page Load': pageLoadMetrics.avg,
        'API Calls': apiMetrics.avg,
        'Render Time': renderMetrics.avg,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
