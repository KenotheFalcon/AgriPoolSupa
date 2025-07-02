import { NextResponse } from 'next/server';
import { z } from 'zod';
import { resetPassword } from '@/lib/firebase';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);

    const { error } = await resetPassword(validatedData.email);

    if (error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Password reset email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
