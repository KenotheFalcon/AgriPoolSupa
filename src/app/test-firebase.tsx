'use client';

import { auth, app } from '@/lib/firebase';
import { useEffect, useState } from 'react';

export default function TestFirebase() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking...');
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        // Log environment variables (without sensitive data)
        console.log('Firebase Config:', {
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });

        // Check if Firebase is initialized
        if (!app) {
          throw new Error('Firebase app not initialized');
        }

        console.log('Firebase App:', app);
        console.log('Firebase Auth:', auth);

        // Try to get the current user to test auth
        const currentUser = auth.currentUser;
        console.log('Current User:', currentUser);

        setConnectionStatus('Connected to Firebase!');
        setErrorDetails('');
      } catch (error: any) {
        console.error('Firebase connection error:', error);
        setConnectionStatus('Error connecting to Firebase');
        setErrorDetails(error.message || 'Unknown error occurred');
      }
    };

    checkFirebaseConnection();
  }, []);

  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <h1 className='text-xl font-bold mb-2'>Firebase Connection Test</h1>
      <p className='text-gray-700'>
        Status: <span className='font-semibold'>{connectionStatus}</span>
      </p>
      {errorDetails && <p className='text-red-500 mt-2'>Error: {errorDetails}</p>}
      <p className='text-sm text-gray-500 mt-2'>Check browser console for more details</p>
    </div>
  );
}
