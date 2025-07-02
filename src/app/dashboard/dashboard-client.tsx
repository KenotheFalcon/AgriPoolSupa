'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ServerUser } from '@/lib/auth/server';

interface DashboardClientProps {
  user: ServerUser;
}

export function DashboardClient({ user }: DashboardClientProps) {
  const { logout } = useAuth();

  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <Button variant='outline' className='w-full'>
              Browse Products
            </Button>
            <Button variant='outline' className='w-full'>
              View Orders
            </Button>
            <Button variant='outline' className='w-full'>
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant='destructive' className='w-full' onClick={logout}>
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
