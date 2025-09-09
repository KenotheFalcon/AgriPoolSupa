import { NextRequest, NextResponse } from 'next/server';

// TODO: Implement payment verification with Paystack and Supabase
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Payment verification not implemented with Supabase yet' },
    { status: 501 }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Payment verification not implemented with Supabase yet' },
    { status: 501 }
  );
}