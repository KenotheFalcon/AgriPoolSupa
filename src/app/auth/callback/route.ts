import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(
        new URL('/auth/login?error=Authentication failed', requestUrl.origin)
      )
    }
  }

  // Redirect to dashboard or requested page
  const redirectTo = requestUrl.searchParams.get('redirect') || '/dashboard'
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}
