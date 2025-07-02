import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';

export default function FirebaseTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        // Try to get the current user to verify Firebase is initialized
        await auth.currentUser;
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setError(err.message);
      }
    };

    checkFirebase();
  }, []);

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-4'>Firebase Connection Test</h2>
      {status === 'loading' && <p className='text-blue-500'>Testing Firebase connection...</p>}
      {status === 'success' && (
        <p className='text-green-500'>✅ Firebase is properly configured!</p>
      )}
      {status === 'error' && (
        <div className='text-red-500'>
          <p>❌ Firebase configuration error:</p>
          <p className='mt-2'>{error}</p>
        </div>
      )}
    </div>
  );
}
