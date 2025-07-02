import { NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/with-auth';
import { getAdminFirestore, getAdminAuth } from '@/lib/firebase-admin';

async function getUser(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const db = await getAdminFirestore();
    const userRef = db.collection('users').doc(id);
    const doc = await userRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = doc.data();
    return NextResponse.json({
      id: doc.id,
      ...user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

async function updateUser(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { firstName, lastName, role, status } = await req.json();

  try {
    const db = await getAdminFirestore();
    const userRef = db.collection('users').doc(id);

    const updateData: { [key: string]: any } = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    updateData.updatedAt = new Date().toISOString();

    await userRef.update(updateData);

    const updatedDoc = await userRef.get();
    if (!updatedDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

async function deleteUser(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const db = await getAdminFirestore();
    const auth = await getAdminAuth();

    // Delete user from Firestore
    await db.collection('users').doc(id).delete();

    // Delete user from Firebase Auth
    await auth.deleteUser(id);

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

export const GET = withAuth(getUser);
export const PATCH = withAuth(updateUser);
export const DELETE = withAuth(deleteUser);
