import { NextResponse } from 'next/server';
import { withVerifiedEmail, AuthenticatedRequest } from '../../lib/middleware/with-auth';
import { getAdminFirestore } from '@/lib/firebase-admin';

async function getProfile(req: AuthenticatedRequest) {
  const userId = req.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getAdminFirestore();
  const userRef = db.collection('users').doc(userId);
  const doc = await userRef.get();

  if (!doc.exists) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const user = doc.data();
  return NextResponse.json({
    id: doc.id,
    ...user,
  });
}

async function updateProfile(req: AuthenticatedRequest) {
  const userId = req.user?.id;
  const { firstName, lastName } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getAdminFirestore();
  const userRef = db.collection('users').doc(userId);

  await userRef.update({
    firstName,
    lastName,
    updatedAt: new Date().toISOString(),
  });

  const updatedDoc = await userRef.get();

  if (!updatedDoc.exists) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const user = updatedDoc.data();
  return NextResponse.json({
    id: updatedDoc.id,
    ...user,
  });
}

export const GET = withVerifiedEmail(getProfile);
export const PATCH = withVerifiedEmail(updateProfile);
