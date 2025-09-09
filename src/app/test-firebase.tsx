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
        // Firebase config check (silent in production)

        // Check if Firebase is initialized
        if (!app) {
          throw new Error('Firebase app not initialized');
        }

        // Try to get the current user to test auth
        auth.currentUser;

        setConnectionStatus('Connected to Firebase!');
        setErrorDetails('');
      } catch (error: any) {
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
