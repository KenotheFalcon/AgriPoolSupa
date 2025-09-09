// Temporary compatibility layer for Firebase Admin SDK migration
// TODO: Replace with proper Supabase admin utilities

console.warn('firebase-admin.ts is deprecated. Use Supabase admin utilities instead.');

export async function getAdminAuth() {
  throw new Error('getAdminAuth is not implemented. Use Supabase auth utilities.');
}

export async function getAdminFirestore() {
  throw new Error('getAdminFirestore is not implemented. Use Supabase database utilities.');
}

export async function getAdminStorage() {
  throw new Error('getAdminStorage is not implemented. Use Supabase storage utilities.');
}

export async function getAdminApp() {
  throw new Error('getAdminApp is not implemented. Use Supabase utilities.');
}

// Legacy exports for backward compatibility (deprecated)
export const auth = new Proxy({} as any, {
  get() {
    throw new Error('Use Supabase auth utilities instead of Firebase Admin Auth');
  },
});

export const db = new Proxy({} as any, {
  get() {
    throw new Error('Use Supabase database utilities instead of Firebase Admin Firestore');
  },
});

export const storage = new Proxy({} as any, {
  get() {
    throw new Error('Use Supabase storage utilities instead of Firebase Admin Storage');
  },
});

export const app = new Proxy({} as any, {
  get() {
    throw new Error('Use Supabase utilities instead of Firebase Admin App');
  },
});
