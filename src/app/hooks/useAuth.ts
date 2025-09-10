'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { UserRole } from '@/lib/supabase/types';

interface User {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
  emailVerified: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  session: Session | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    session: null,
  });
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        setState((prev) => ({ ...prev, loading: false, error: error.message }));
        return;
      }

      if (session?.user) {
        await loadUserProfile(session.user, session);
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user, session);
      } else if (event === 'SIGNED_OUT') {
        setState({ user: null, loading: false, error: null, session: null });
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setState((prev) => ({ ...prev, session }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser, session: Session) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        setState((prev) => ({ ...prev, loading: false, error: 'Failed to load profile' }));
        return;
      }

      setState({
        user: {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          displayName: profile?.display_name,
          role: profile?.role || 'user',
          emailVerified: supabaseUser.email_confirmed_at ? true : false,
        },
        loading: false,
        error: null,
        session,
      });
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load user profile',
      }));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Profile will be loaded by the auth state change listener
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

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      toast.success(
        'Account created successfully! Please check your email to verify your account.'
      );

      router.push('/auth/login');
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

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      router.push('/auth/login');
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

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }

      setState((prev) => ({ ...prev, loading: false }));
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

  const resetPassword = async (newPassword: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
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

  const signInWithGoogle = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Google sign-in failed',
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
    signInWithGoogle,
  };
}
