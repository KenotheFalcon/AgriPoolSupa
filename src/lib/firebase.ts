// Re-export Supabase auth utilities for backward compatibility
export {
  signIn,
  signInWithGoogle,
  signUp,
  logOut,
  resetPassword,
  getCurrentUser,
  updateUserRole,
  createUserProfile,
  type UserData,
} from './supabase/auth';

export { supabase as auth } from './supabase/client';
export { supabase as db } from './supabase/client';

// Legacy exports for compatibility (will be removed in future)
export const app = null;

console.warn('firebase.ts is deprecated. Please use ./supabase/auth.ts directly.');
