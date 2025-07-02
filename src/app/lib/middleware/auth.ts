import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../auth/service';
import { cookies } from 'next/headers';

/**
 * Authentication middleware configuration
 */
interface AuthConfig {
  requireAuth: boolean;
  requiredPermissions?: string[];
  redirectTo?: string;
}

/**
 * Default authentication configuration
 */
const defaultConfig: AuthConfig = {
  requireAuth: true,
  redirectTo: '/auth',
};

/**
 * Authentication middleware
 */
export async function withAuth(handler: Function, config: Partial<AuthConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config };

  return async function authMiddleware(req: NextRequest) {
    // Get session token from cookie
    const token = req.cookies.get('session')?.value;

    // If auth is required and no token is present, redirect to login
    if (finalConfig.requireAuth && !token) {
      return NextResponse.redirect(new URL(finalConfig.redirectTo!, req.url));
    }

    // If no auth is required and no token is present, proceed without auth
    if (!token) {
      return handler(req);
    }

    // Validate session
    const session = await authService.validateSession(token);
    if (!session) {
      // Clear invalid session cookie
      const response = NextResponse.redirect(new URL(finalConfig.redirectTo!, req.url));
      response.cookies.delete('session');
      return response;
    }

    // Check permissions if required
    if (finalConfig.requiredPermissions?.length) {
      const hasPermission = await Promise.all(
        finalConfig.requiredPermissions.map((permission) =>
          authService.hasPermission(session.user.id, permission)
        )
      );

      if (hasPermission.some((has) => !has)) {
        return new NextResponse(JSON.stringify({ error: 'Insufficient permissions' }), {
          status: 403,
        });
      }
    }

    // Add user and session to request
    const requestWithAuth = {
      ...req,
      user: session.user,
      session: session.session,
    };

    return handler(requestWithAuth);
  };
}

/**
 * Set session cookie
 */
export function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Clear session cookie
 */
export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete('session');
}

/**
 * Get current user from request
 */
export async function getCurrentUser(req: NextRequest) {
  const token = req.cookies.get('session')?.value;
  if (!token) return null;

  const session = await authService.validateSession(token);
  return session?.user || null;
}

/**
 * Check if user has required permissions
 */
export async function checkPermissions(userId: string, permissions: string[]): Promise<boolean> {
  const hasPermission = await Promise.all(
    permissions.map((permission) => authService.hasPermission(userId, permission))
  );
  return hasPermission.every((has) => has);
}
