import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { emailService } from '../email/service';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'user';
  emailVerified: boolean;
  status: 'active' | 'inactive' | 'suspended';
}

interface Session {
  token: string;
  userId: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

class AuthService {
  private static instance: AuthService;
  private readonly SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private mapUserFromDb(user: any): User {
    return {
      id: user.uid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role || 'user',
      emailVerified: user.emailVerified,
      status: user.status || 'active',
    };
  }

  public async register(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<User> {
    try {
      const auth = getAuth();
      const db = getFirestore();

      // Create user in Firebase Auth
      const user = await auth.createUser({
        email,
        password,
        displayName: firstName ? `${firstName} ${lastName || ''}`.trim() : undefined,
      });

      // Create user document in Firestore
      await db.collection('users').doc(user.uid).set({
        email,
        firstName,
        lastName,
        role: 'user',
        status: 'active',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Send verification email
      await auth.generateEmailVerificationLink(email);

      return this.mapUserFromDb({
        uid: user.uid,
        email: user.email,
        firstName,
        lastName,
        role: 'user',
        emailVerified: false,
        status: 'active',
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  public async login(
    email: string,
    password: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{ user: User; session: Session }> {
    try {
      const auth = getAuth();
      const db = getFirestore();

      // Get user by email
      const user = await auth.getUserByEmail(email);

      // Get user data from Firestore
      const userDoc = await db.collection('users').doc(user.uid).get();
      const userData = userDoc.data();

      if (!userData || userData.status !== 'active') {
        throw new Error('Invalid credentials');
      }

      // Create custom token for session
      const customToken = await auth.createCustomToken(user.uid);

      // Create session
      const sessionToken = uuidv4();
      const expiresAt = new Date(Date.now() + this.SESSION_EXPIRY);

      await db.collection('sessions').doc(sessionToken).set({
        userId: user.uid,
        customToken,
        expiresAt,
        userAgent,
        ipAddress,
        createdAt: new Date(),
      });

      return {
        user: this.mapUserFromDb({ ...user, ...userData }),
        session: {
          token: sessionToken,
          userId: user.uid,
          expiresAt,
          userAgent,
          ipAddress,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  }

  public async validateSession(token: string): Promise<{ user: User; session: Session } | null> {
    try {
      const db = getFirestore();
      const sessionDoc = await db.collection('sessions').doc(token).get();

      if (!sessionDoc.exists) {
        return null;
      }

      const sessionData = sessionDoc.data();
      if (!sessionData || sessionData.expiresAt.toDate() < new Date()) {
        await sessionDoc.ref.delete();
        return null;
      }

      const userDoc = await db.collection('users').doc(sessionData.userId).get();
      if (!userDoc.exists) {
        await sessionDoc.ref.delete();
        return null;
      }

      const userData = userDoc.data();
      if (!userData || userData.status !== 'active') {
        await sessionDoc.ref.delete();
        return null;
      }

      return {
        user: this.mapUserFromDb({ uid: sessionData.userId, ...userData }),
        session: {
          token,
          userId: sessionData.userId,
          expiresAt: sessionData.expiresAt.toDate(),
          userAgent: sessionData.userAgent,
          ipAddress: sessionData.ipAddress,
        },
      };
    } catch (error) {
      console.error('Session validation error:', error);
      return null;
    }
  }

  public async logout(token: string): Promise<void> {
    try {
      const db = getFirestore();
      await db.collection('sessions').doc(token).delete();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  public async verifyEmail(token: string): Promise<boolean> {
    try {
      const auth = getAuth();
      const db = getFirestore();

      // Verify the email verification token
      const decodedToken = await auth.verifyIdToken(token);
      const uid = decodedToken.uid;

      // Update user's email verification status
      await db.collection('users').doc(uid).update({
        emailVerified: true,
        updatedAt: new Date(),
      });

      return true;
    } catch (error) {
      console.error('Email verification error:', error);
      return false;
    }
  }

  public async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const auth = getAuth();
      await auth.generatePasswordResetLink(email);
      return true;
    } catch (error) {
      console.error('Password reset request error:', error);
      return false;
    }
  }

  public async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      const auth = getAuth();
      const decodedToken = await auth.verifyIdToken(token);
      await auth.updateUser(decodedToken.uid, { password: newPassword });
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  }

  public async hasPermission(userId: string, permission: string): Promise<boolean> {
    try {
      const db = getFirestore();
      const userDoc = await db.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        return false;
      }

      const userData = userDoc.data();
      if (!userData || userData.role !== 'admin') {
        return false;
      }

      // For now, we'll just check if the user is an admin.
      // You can expand this later to support more granular permissions.
      return true;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }
}

export const authService = AuthService.getInstance();
