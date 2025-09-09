import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const headers = new Headers(request.headers);
  headers.set('x-pathname', pathname);

  // Define public paths that don't require authentication
  const publicPaths = ['/', '/about', '/contact', '/auth/forgot-password', '/auth/reset-password'];

  // Authentication routes
  const authRoutes = ['/auth/signin', '/auth/signup'];

  // API routes that don't require authentication
  const publicApiRoutes = ['/api/auth/signin', '/api/auth/signup'];

  // If the path is a public path, an auth route, or a public API route, let the request through.
  if (
    publicPaths.includes(pathname) ||
    authRoutes.includes(pathname) ||
    publicApiRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png')
  ) {
    return NextResponse.next({
      request: {
        headers,
      },
    });
  }

  // For now, allow all requests to pass through until proper Supabase auth is configured
  // TODO: Implement proper Supabase authentication middleware
  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
