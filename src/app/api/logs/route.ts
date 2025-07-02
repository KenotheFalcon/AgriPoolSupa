import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { LogEntry } from '@/lib/logger';

const logEntrySchema = z.object({
  level: z.enum(['debug', 'info', 'warn', 'error']),
  message: z.string(),
  timestamp: z.string(),
  data: z.any().optional(),
  error: z.any().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = logEntrySchema.parse(body);

    // Here you would typically send the log to your error tracking service
    // For example, Sentry, LogRocket, etc.
    console.error('Error log received:', validatedData);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to process log:', error);
    return NextResponse.json({ error: 'Failed to process log' }, { status: 500 });
  }
}
