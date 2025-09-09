import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { ProfileForm } from '@/components/profile/profile-form';
import { Skeleton } from '@/components/ui/skeleton';

async function getProfile() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/profile`, {
    headers: {
      Cookie: `session=${cookies().get('session')?.value}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return response.json();
}

export default async function ProfilePage() {
  const profile = await getProfile();

  async function handleSubmit(data: any) {
    'use server';
    // TODO: Implement the actual update logic
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Profile Settings</h1>
        <Suspense
          fallback={
            <div className='space-y-4'>
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
            </div>
          }
        >
          <ProfileForm initialData={profile} onSubmit={handleSubmit} />
        </Suspense>
      </div>
    </div>
  );
}
