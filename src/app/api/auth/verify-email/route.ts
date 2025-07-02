import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/service';
import { z } from 'zod';

// Validation schema
const verifyEmailSchema = z.object({
  token: z.string(),
});

/**
 * POST /api/auth/verify-email
 * Verify user's email address
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = verifyEmailSchema.parse(body);

    const success = await authService.verifyEmail(token);

    if (!success) {
      return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Email verified successfully.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }

    console.error('Email verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
