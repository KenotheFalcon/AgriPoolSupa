import { requireRole } from '@/lib/auth/server';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { headers } from 'next/headers';

export default async function FarmerDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('farmer');
  const pathname = headers().get('x-pathname') || '/farmers';

  let currentTab = 'overview';
  if (pathname.includes('/listings')) currentTab = 'listings';
  if (pathname.includes('/post')) currentTab = 'post';
  if (pathname.includes('/verification')) currentTab = 'verification';

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Farmer Dashboard</h1>
        <p className='text-muted-foreground'>Welcome back, {user.displayName || user.email}!</p>
      </div>

      <Tabs defaultValue={currentTab} className='space-y-4'>
        <TabsList>
          <Link href='/farmers'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
          </Link>
          <Link href='/farmers/listings'>
            <TabsTrigger value='listings'>My Listings</TabsTrigger>
          </Link>
          <Link href='/farmers/post'>
            <TabsTrigger value='post'>Post Produce</TabsTrigger>
          </Link>
          <Link href='/farmers/verification'>
            <TabsTrigger value='verification'>Verification</TabsTrigger>
          </Link>
        </TabsList>
        {children}
      </Tabs>
    </div>
  );
}
