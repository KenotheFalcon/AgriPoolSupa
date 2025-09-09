import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { session } = await request.json();

    if (!session) {
      return NextResponse.json({ error: 'No session provided' }, { status: 400 });
    }

    // Get Firebase Admin Auth
    const adminAuth = await getAdminAuth();
    const decodedToken = await adminAuth.verifySessionCookie(session, true);

    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    return NextResponse.json({ uid: decodedToken.uid });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
