import { NextResponse } from 'next/server';
import { authService } from '@/lib/auth/service';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const mode = requestUrl.searchParams.get('mode');
  const oobCode = requestUrl.searchParams.get('oobCode');

  if (mode === 'verifyEmail' && oobCode) {
    try {
      const success = await authService.verifyEmail(oobCode);
      if (!success) {
        return NextResponse.redirect(new URL('/auth/signin?error=invalid-code', request.url));
      }
      return NextResponse.redirect(new URL('/auth/signin?verified=true', request.url));
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/signin?error=invalid-code', request.url));
    }
  }

  if (mode === 'resetPassword' && oobCode) {
    return NextResponse.redirect(new URL(`/auth/reset-password?oobCode=${oobCode}`, request.url));
  }

  return NextResponse.redirect(new URL('/auth/signin', request.url));
}
