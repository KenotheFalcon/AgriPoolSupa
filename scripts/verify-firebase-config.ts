import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const requiredEnvVars = {
  // Client-side Firebase config
  NEXT_PUBLIC_FIREBASE_API_KEY: 'Firebase API Key',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'Firebase Auth Domain',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'Firebase Project ID',
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'Firebase Storage Bucket',
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: 'Firebase Messaging Sender ID',
  NEXT_PUBLIC_FIREBASE_APP_ID: 'Firebase App ID',

  // Admin SDK config
  FIREBASE_ADMIN_PROJECT_ID: 'Firebase Admin Project ID',
  FIREBASE_ADMIN_CLIENT_EMAIL: 'Firebase Admin Client Email',
  FIREBASE_ADMIN_PRIVATE_KEY: 'Firebase Admin Private Key',
};

function verifyConfig() {
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key]) => !process.env[key])
    .map(([key, description]) => `${description} (${key})`);

  if (missingVars.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missingVars.forEach((variable) => console.error(`   - ${variable}`));
    console.error('\nPlease add these variables to your .env.local file.');
    process.exit(1);
  }

  // Verify Firebase Admin Private Key format
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (privateKey && !privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    console.error('\n❌ Invalid Firebase Admin Private Key format.');
    console.error('The private key should be in PEM format and include the header and footer.');
    process.exit(1);
  }

  console.log('\n✅ All required Firebase configuration variables are set correctly.');
  console.log('✅ Firebase Admin Private Key format is valid.');
}

verifyConfig();
