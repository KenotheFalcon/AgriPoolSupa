import { NextResponse } from 'next/server';
import { signInWithGoogle } from '@/lib/firebase';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function POST() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firestore is not initialized on the server.' },
        { status: 500 }
      );
    }

    const { user, error } = await signInWithGoogle();

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ error: 'No user data received' }, { status: 400 });
    }

    // Check if user profile exists
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user profile
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString(),
        lastSignIn: new Date().toISOString(),
        role: 'user',
        status: 'active',
      });
    } else {
      // Update last sign in
      await setDoc(
        userRef,
        {
          lastSignIn: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    return NextResponse.json({
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to sign in with Google' },
      { status: 500 }
    );
  }
}
