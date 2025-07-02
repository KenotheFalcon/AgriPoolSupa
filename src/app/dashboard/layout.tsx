'use client';

import { useRouter } from 'next/navigation';
import { logOut } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await logOut();
    if (!error) {
      router.push('/auth/signin');
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-14 items-center'>
          <div className='mr-4 flex'>
            <a className='mr-6 flex items-center space-x-2' href='/dashboard'>
              <span className='font-bold'>Dashboard</span>
            </a>
          </div>
          <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
            <nav className='flex items-center space-x-2'>
              <Button variant='ghost' onClick={handleSignOut}>
                Sign out
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className='container py-6'>{children}</main>
    </div>
  );
}
