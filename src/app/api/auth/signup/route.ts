import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

// Use Node.js runtime for Firebase Admin SDK
export const runtime = 'nodejs';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['buyer', 'farmer']),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    // Get Firebase Admin services
    const adminAuth = await getAdminAuth();
    const db = await getAdminFirestore();

    // Create user in Firebase Admin
    const userRecord = await adminAuth.createUser({
      email: validatedData.email,
      password: validatedData.password,
      displayName: validatedData.name,
    });

    // Set custom claim for the user's role
    await adminAuth.setCustomUserClaims(userRecord.uid, {
      role: validatedData.role,
    });

    // Create user profile in Firestore
    const [firstName, ...lastNameParts] = validatedData.name.split(' ');
    const lastName = lastNameParts.join(' ');

    await db.collection('users').doc(userRecord.uid).set({
      email: userRecord.email,
      firstName,
      lastName,
      role: validatedData.role,
      status: 'active',
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Send email verification
    await adminAuth.generateEmailVerificationLink(validatedData.email);

    // Create session cookie using Firebase Admin
    const customToken = await adminAuth.createCustomToken(userRecord.uid);
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(customToken, {
      expiresIn,
    });

    // Set session cookie
    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({
      user: {
        id: userRecord.uid,
        email: userRecord.email,
        firstName,
        lastName,
        role: validatedData.role,
        emailVerified: userRecord.emailVerified,
      },
      message: 'Please check your email to verify your account.',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
    }

    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 400 });
  }
}
