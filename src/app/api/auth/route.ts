import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/service';
import { setSessionCookie, clearSessionCookie } from '@/lib/middleware/auth';
import { z } from 'zod';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

/**
 * POST /api/auth/login
 * Authenticate a user and create a session
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const { user, session } = await authService.login(
      email,
      password,
      req.headers.get('user-agent') || undefined,
      req.ip
    );

    // Set session cookie
    setSessionCookie(session.token);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }

    if (error instanceof Error && error.message === 'Invalid credentials') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/auth/register
 * Register a new user
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName } = registerSchema.parse(body);

    const user = await authService.register(email, password, firstName, lastName);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }

    if (error instanceof Error && error.message.includes('unique constraint')) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/logout
 * Logout the current user
 */
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value;
    if (token) {
      await authService.logout(token);
    }

    // Clear session cookie
    clearSessionCookie();

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
