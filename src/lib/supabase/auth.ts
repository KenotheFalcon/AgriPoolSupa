import { supabase } from './client';
import type { UserRole } from './types';

// Auth utilities for client-side operations
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signUp = async (email: string, password: string, displayName?: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify`,
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const logOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updatePassword = async (password: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const resendConfirmation = async (email: string) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Server-side auth utilities
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return { user: null, error: error.message };
    }

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// User type for consistency
export interface UserData {
  id: string;
  email: string | undefined;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  role?: UserRole;
  createdAt?: string;
  lastSignIn?: string;
}
