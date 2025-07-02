import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email?: string;
    role: string;
  };
}

export function withRole(roles: string[]) {
  return function <T = any>(
    handler: (req: AuthenticatedRequest, context: T) => Promise<NextResponse>
  ) {
    return async function (req: NextRequest, context: T) {
      const session = await getSession();

      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const userRole = session.role;
      if (!roles.includes(userRole)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Attach user to request
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = {
        id: session.id,
        email: session.email,
        role: session.role,
      };

      return handler(authenticatedReq, context);
    };
  };
}

export function withAuth<T = any>(
  handler: (req: AuthenticatedRequest, context: T) => Promise<NextResponse>
) {
  return async function (req: NextRequest, context: T) {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Attach user to request
    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.user = {
      id: session.id,
      email: session.email,
      role: session.role,
    };

    return handler(authenticatedReq, context);
  };
}

export function withVerifiedEmail() {
  return async function handler(req: NextRequest) {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // For now, we assume the session is verified. In a real-world scenario, you might check a flag or token.
    return NextResponse.next();
  };
}
