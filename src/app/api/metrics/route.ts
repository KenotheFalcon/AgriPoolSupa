import { NextResponse } from 'next/server';
import { performanceMonitor } from '@/lib/performance';
import { monitoringService } from '@/lib/monitoring';

export async function POST(request: Request) {
  try {
    const { name, time } = await request.json();
    performanceMonitor.trackSectionLoad(name, time);
    return NextResponse.json({ message: 'Metrics recorded' }, { status: 200 });
  } catch (error) {
    console.error('Failed to record metrics:', error);

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    monitoringService.addAlert({
      type: 'metrics-recording-failed',
      message: 'Failed to record performance metrics',
      metadata: { error: errorMessage },
    });

    return NextResponse.json(
      { message: 'Failed to record metrics', error: errorMessage },
      { status: 500 }
    );
  }
}
