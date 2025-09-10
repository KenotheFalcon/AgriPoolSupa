import { NextResponse } from 'next/server';

// TODO: Implement Google OAuth with Supabase
export async function POST() {
  return NextResponse.json(
    { error: 'Google OAuth not implemented with Supabase yet' },
    { status: 501 }
  );
}
