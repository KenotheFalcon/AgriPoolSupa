// Re-export Supabase auth utilities for backward compatibility
export {
  signIn,
  signInWithGoogle,
  signUp,
  logOut,
  resetPassword,
  getCurrentUser,
  type UserData,
} from './supabase/auth';

export { supabase as auth } from './supabase/client';
export { supabase as db } from './supabase/client';

// Legacy exports for compatibility (will be removed in future)
export const app = null;

// Placeholder for missing functions - TODO: Implement with server actions
export const updateUserRole = async (userId: string, role: string) => {
  console.warn('updateUserRole should be implemented as a server action with Supabase admin');
  return { profile: null, error: 'Not implemented' };
};

export const createUserProfile = async (user: any) => {
  console.warn('createUserProfile should be implemented as a server action with Supabase admin');
  return { profile: null, error: 'Not implemented' };
};

console.warn('firebase.ts is deprecated. Please use ./supabase/auth.ts directly.');
