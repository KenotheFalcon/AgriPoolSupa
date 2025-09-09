import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAdminAuth } from './src/lib/firebase-admin';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
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

  if (!sessionCookie) {
    // For API routes, return a 401 Unauthorized response
    if (pathname.startsWith('/api/')) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // For other routes, redirect to the sign-in page
    const url = request.nextUrl.clone();
    url.pathname = '/auth/signin';
    return NextResponse.redirect(url);
  }

  try {
    const adminAuth = await getAdminAuth();
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userRole = decodedToken.role;

    if (pathname.startsWith('/admin')) {
      if (userRole !== 'support') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } else if (pathname.startsWith('/dashboard')) {
      if (userRole !== 'buyer') {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
    } else if (pathname.startsWith('/farmers')) {
      if (userRole !== 'farmer') {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
    }

    // For API routes, you can add role checks here too if needed

    return NextResponse.next({
      request: {
        headers,
      },
    });
  } catch (error) {
    console.error('Middleware error:', error);
    // If cookie verification fails, redirect to sign-in
    const url = request.nextUrl.clone();
    url.pathname = '/auth/signin';
    return NextResponse.redirect(url);
  }
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
