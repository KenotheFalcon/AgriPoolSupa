import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4'>
      <WifiOff className='h-24 w-24 text-gray-400 mb-6' />
      <h1 className='text-4xl font-bold text-gray-800 mb-2'>You're Offline</h1>
      <p className='text-lg text-gray-600'>
        It looks like you've lost your connection. Please check your network and try again.
      </p>
      <p className='mt-4 text-sm text-gray-500'>
        Some functionality may be limited until you reconnect.
      </p>
    </div>
  );
}
