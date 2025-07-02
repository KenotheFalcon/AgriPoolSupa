import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authService } from './lib/auth/service';

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/auth',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/verify-email',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/verify-email',
];

// Paths that require email verification
const verifiedEmailPaths = [
  '/dashboard',
  '/profile',
  '/settings',
  '/api/dashboard',
  '/api/profile',
  '/api/settings',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get session token from cookies
  const sessionToken = request.cookies.get('session')?.value;

  // If no session token, redirect to login
  if (!sessionToken) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Validate session
  const session = await authService.validateSession(sessionToken);
  if (!session) {
    // Clear invalid session cookie
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('session');
    return response;
  }

  // Check if path requires email verification
  if (verifiedEmailPaths.some((path) => pathname.startsWith(path))) {
    if (!session.user.emailVerified) {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }
  }

  // Add user info to request headers for API routes
  if (pathname.startsWith('/api/')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', session.user.id);
    requestHeaders.set('x-user-role', session.user.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication endpoints)
     * 2. /_next/* (Next.js internals)
     * 3. /static/* (static files)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!api/auth|_next|static|favicon.ico|sitemap.xml).*)',
  ],
};
