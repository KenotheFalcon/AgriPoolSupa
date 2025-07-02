'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ServerUser } from '@/lib/auth/server';

interface FarmerOverviewProps {
  user: ServerUser;
  stats: {
    totalListings: number;
    completedOrders: number;
    totalSales: number;
  };
}

export function FarmerOverview({ user, stats }: FarmerOverviewProps) {
  const { logout } = useAuth();

  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      <Card>
        <CardHeader>
          <CardTitle>Farmer Profile</CardTitle>
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
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Your farm performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <span>Total Sales</span>
              <span className='font-bold'>₦{stats.totalSales.toLocaleString()}</span>
            </div>
            <div className='flex justify-between'>
              <span>Active Listings</span>
              <span className='font-bold'>{stats.totalListings}</span>
            </div>
            <div className='flex justify-between'>
              <span>Completed Orders</span>
              <span className='font-bold'>{stats.completedOrders}</span>
            </div>
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
