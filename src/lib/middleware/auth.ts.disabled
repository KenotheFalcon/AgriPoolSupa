import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/service';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email?: string;
    role: string;
  };
}

export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options?: { requiredPermissions?: string[] }
) {
  return async function (req: NextRequest) {
    try {
      const token = req.headers.get('authorization')?.split(' ')[1];
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const decoded = await verifyToken(token);
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = decoded;

      return handler(authenticatedReq);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
    }
  };
}

export async function withRole(roles: string[]) {
  return async (
    req: NextRequest,
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
  ) => {
    try {
      const token = req.headers.get('authorization')?.split(' ')[1];
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const decoded = await verifyToken(token);
      if (!roles.includes(decoded.role)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }

      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = decoded;

      return handler(authenticatedReq);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
    }
  };
}

const SESSION_COOKIE_NAME = 'session';
const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function setSessionCookie(idToken: string) {
  const auth = getAuth();
  const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 days
  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

  cookies().set(SESSION_COOKIE_NAME, sessionCookie, SESSION_COOKIE_OPTIONS);
}

export async function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE_NAME);
}

export async function verifySessionCookie(sessionCookie: string) {
  const auth = getAuth();
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  return verifySessionCookie(sessionCookie);
}
