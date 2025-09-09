import { cookies } from 'next/headers';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';

export interface ServerUser {
  uid: string;
  email: string | null;
  role: 'buyer' | 'farmer' | 'support';
  emailVerified: boolean;
  displayName: string | null;
}

/**
 * Get the current user from the server-side session
 * This can be used in server components and API routes
 */
export async function getServerUser(): Promise<ServerUser | null> {
  try {
    const sessionCookie = cookies().get('session')?.value;

    if (!sessionCookie) {
      return null;
    }

    const adminAuth = await getAdminAuth();
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      role: decodedToken.role as 'buyer' | 'farmer' | 'support',
      emailVerified: decodedToken.email_verified || false,
      displayName: decodedToken.name || null,
    };
  } catch (error) {
    console.error('Error getting server user:', error);
    return null;
  }
}

/**
 * Require authentication - redirects to signin if not authenticated
 * Use this in server components that require authentication
 */
export async function requireAuth(): Promise<ServerUser> {
  const user = await getServerUser();

  if (!user) {
    redirect('/auth/signin');
  }

  return user;
}

/**
 * Require specific role - redirects to signin if user doesn't have the required role
 */
export async function requireRole(requiredRole: 'buyer' | 'farmer' | 'support'): Promise<ServerUser> {
  const user = await requireAuth();

  if (user.role !== requiredRole) {
    redirect('/auth/signin');
  }

  return user;
}

/**
 * Get user data from Firestore (server-side)
 */
export async function getServerUserData(uid: string) {
  try {
    const db = await getAdminFirestore();
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return null;
    }

    return userDoc.data();
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}
