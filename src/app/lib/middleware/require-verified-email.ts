import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../auth/service';

export async function withVerifiedEmail(
  handler: (req: NextRequest) => Promise<NextResponse>,
  req: NextRequest
): Promise<NextResponse> {
  const session = await authService.validateSession(req.cookies.get('session')?.value || '');

  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  if (!session.user.emailVerified) {
    return NextResponse.json(
      {
        error: 'Email verification required',
        message: 'Please verify your email address to access this resource',
      },
      { status: 403 }
    );
  }

  return handler(req);
}
