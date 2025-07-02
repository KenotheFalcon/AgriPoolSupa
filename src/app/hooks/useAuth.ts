'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'user';
  emailVerified: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const response = await fetch(`/api/users/${firebaseUser.uid}`);
          if (response.ok) {
            const userData = await response.json();
            setState({
              user: {
                id: firebaseUser.uid,
                email: firebaseUser.email!,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role,
                emailVerified: firebaseUser.emailVerified,
              },
              loading: false,
              error: null,
            });
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          setState({
            user: null,
            loading: false,
            error: 'Failed to fetch user data',
          });
        }
      } else {
        setState({ user: null, loading: false, error: null });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Create session
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          userAgent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      router.push('/dashboard');
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Login failed',
      }));
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Create user profile
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user profile');
      }

      // Show success message
      toast.success(
        data.message ||
          'Account created successfully. Please check your email to verify your account.'
      );

      // Redirect to sign in page
      router.push('/auth/signin');
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Signup failed',
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await signOut(auth);
      router.push('/auth/signin');
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Logout failed',
      }));
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to send password reset email',
      }));
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Call the API to reset password
      const response = await fetch('/api/auth/password-reset', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setState((prev) => ({ ...prev, loading: false, error: null }));
      return true;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to reset password',
      }));
      throw error;
    }
  };

  return {
    ...state,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
  };
}
