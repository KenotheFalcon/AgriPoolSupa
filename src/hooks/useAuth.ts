'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp, logOut, resetPassword } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export interface User {
  uid: string;
  email: string | null;
  role: 'buyer' | 'farmer' | 'support';
  emailVerified: boolean;
  displayName: string | null;
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
  const { toast } = useToast();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setState({
            user: userData.user,
            loading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          user: null,
          loading: false,
          error: 'Failed to check authentication status',
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const { user, error } = await signIn(email, password);

        if (error || !user) {
          throw new Error(error || 'Login failed');
        }

        const idToken = await user.getIdToken();

        // Create server session
        const sessionResponse = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });

        if (!sessionResponse.ok) {
          throw new Error('Failed to create session');
        }

        // Get user role for redirection
        const idTokenResult = await user.getIdTokenResult();
        const userRole = idTokenResult.claims.role;

        setState({
          user: {
            uid: user.uid,
            email: user.email,
            role: userRole as 'buyer' | 'farmer' | 'support',
            emailVerified: user.emailVerified,
            displayName: user.displayName,
          },
          loading: false,
          error: null,
        });

        toast({
          title: 'Success',
          description: 'Signed in successfully',
        });

        // Redirect based on role
        if (userRole === 'support') {
          router.push('/admin');
        } else if (userRole === 'farmer') {
          router.push('/farmers');
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
        throw error;
      }
    },
    [router, toast]
  );

  const register = useCallback(
    async (email: string, password: string, name: string, role: 'buyer' | 'farmer') => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const { user, error } = await signUp(email, password);

        if (error || !user) {
          throw new Error(error || 'Registration failed');
        }

        // Create user profile with role
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, role }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Registration failed');
        }

        toast({
          title: 'Success',
          description:
            'Account created successfully. Please check your email to verify your account.',
        });

        router.push('/auth/signin');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
        throw error;
      }
    },
    [router, toast]
  );

  const logout = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      await logOut();

      // Clear server session
      await fetch('/api/auth/logout', { method: 'POST' });

      setState({
        user: null,
        loading: false,
        error: null,
      });

      toast({
        title: 'Success',
        description: 'Signed out successfully',
      });

      router.push('/auth/signin');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [router, toast]);

  const forgotPassword = useCallback(
    async (email: string) => {
      try {
        const { error } = await resetPassword(email);

        if (error) {
          throw new Error(error);
        }

        toast({
          title: 'Success',
          description: 'Password reset email sent. Please check your inbox.',
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
        throw error;
      }
    },
    [toast]
  );

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    forgotPassword,
  };
}
