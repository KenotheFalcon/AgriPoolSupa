import 'server-only';

// Type-only imports to avoid bundling issues
import type { App } from 'firebase-admin/app';
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';
import type { Storage } from 'firebase-admin/storage';

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminFirestore: Firestore | null = null;
let adminStorage: Storage | null = null;

// Lazy initialization function
async function initializeFirebaseAdmin() {
  if (adminApp) {
    return {
      app: adminApp,
      auth: adminAuth!,
      db: adminFirestore!,
      storage: adminStorage!,
    };
  }

  // Dynamic imports to ensure they only run on server
  const { initializeApp, getApps, cert } = await import('firebase-admin/app');
  const { getAuth } = await import('firebase-admin/auth');
  const { getFirestore } = await import('firebase-admin/firestore');
  const { getStorage } = await import('firebase-admin/storage');

  // Validate required environment variables
  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_STORAGE_BUCKET',
  ];

  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required Firebase Admin environment variables: ${missingEnvVars.join(', ')}`
    );
  }

  // Initialize Firebase Admin
  adminApp =
    getApps().length === 0
      ? initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID!,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
            privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
          }),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        })
      : getApps()[0];

  // Initialize services
  adminAuth = getAuth(adminApp);
  adminFirestore = getFirestore(adminApp);
  adminStorage = getStorage(adminApp);

  return {
    app: adminApp,
    auth: adminAuth,
    db: adminFirestore,
    storage: adminStorage,
  };
}

// Export getter functions instead of direct exports
export async function getAdminApp(): Promise<App> {
  const { app } = await initializeFirebaseAdmin();
  return app;
}

export async function getAdminAuth(): Promise<Auth> {
  const { auth } = await initializeFirebaseAdmin();
  return auth;
}

export async function getAdminFirestore(): Promise<Firestore> {
  const { db } = await initializeFirebaseAdmin();
  return db;
}

export async function getAdminStorage(): Promise<Storage> {
  const { storage } = await initializeFirebaseAdmin();
  return storage;
}

// Legacy exports for backward compatibility (deprecated)
export const auth = new Proxy({} as Auth, {
  get() {
    throw new Error('Use getAdminAuth() instead of direct auth export');
  },
});

export const db = new Proxy({} as Firestore, {
  get() {
    throw new Error('Use getAdminFirestore() instead of direct db export');
  },
});

export const storage = new Proxy({} as Storage, {
  get() {
    throw new Error('Use getAdminStorage() instead of direct storage export');
  },
});

export const app = new Proxy({} as App, {
  get() {
    throw new Error('Use getAdminApp() instead of direct app export');
  },
});
