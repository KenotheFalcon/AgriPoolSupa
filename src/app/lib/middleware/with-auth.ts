import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../auth/service';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    role: string;
    emailVerified: boolean;
  };
}

export type AuthenticatedHandler = (req: AuthenticatedRequest) => Promise<NextResponse>;

export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest) => {
    const sessionToken = req.cookies.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const session = await authService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    // Add user info to request
    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.user = {
      id: session.user.id,
      role: session.user.role,
      emailVerified: session.user.emailVerified,
    };

    return handler(authenticatedReq);
  };
}

export function withVerifiedEmail(handler: AuthenticatedHandler) {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (!req.user?.emailVerified) {
      return NextResponse.json(
        {
          error: 'Email verification required',
          message: 'Please verify your email address to access this resource',
        },
        { status: 403 }
      );
    }

    return handler(req);
  });
}

export function withRole(roles: string[]) {
  return (handler: AuthenticatedHandler) => {
    return withAuth(async (req: AuthenticatedRequest) => {
      if (!req.user?.role || !roles.includes(req.user.role)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }

      return handler(req);
    });
  };
}
