'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, DollarSign, Users, Clock } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { PerformanceMetrics } from '@/components/dashboard/performance-metrics';
import { UserStats } from '@/components/dashboard/user-stats';

// Memoized data to prevent unnecessary re-renders
const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
];

const recentActivity = [
  {
    id: 1,
    type: 'order',
    description: 'New order #1234 received',
    time: '2 minutes ago',
    icon: Package,
  },
  {
    id: 2,
    type: 'payment',
    description: 'Payment received for order #1233',
    time: '1 hour ago',
    icon: DollarSign,
  },
  {
    id: 3,
    type: 'user',
    description: 'New user registration',
    time: '2 hours ago',
    icon: Users,
  },
];

const StatCard = memo(
  ({
    title,
    value,
    change,
    icon: Icon,
  }: {
    title: string;
    value: string | number;
    change: string;
    icon: any;
  }) => (
    <Card className='h-full'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-xl sm:text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>
          <span className='text-green-600 dark:text-green-400'>{change}</span> from last month
        </p>
      </CardContent>
    </Card>
  )
);

StatCard.displayName = 'StatCard';

const ActivityItem = memo(
  ({ description, time, icon: Icon }: { description: string; time: string; icon: any }) => (
    <div className='flex items-center'>
      <div className='mr-3 sm:mr-4 rounded-full bg-green-100 p-2 dark:bg-green-900'>
        <Icon className='h-4 w-4 text-green-600 dark:text-green-400' />
      </div>
      <div className='space-y-1'>
        <p className='text-sm font-medium leading-none'>{description}</p>
        <div className='flex items-center text-xs text-muted-foreground'>
          <Clock className='mr-1 h-3 w-3' />
          {time}
        </div>
      </div>
    </div>
  )
);

ActivityItem.displayName = 'ActivityItem';

const OverviewChart = memo(() => (
  <div className='h-[300px] sm:h-[350px]'>
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Bar dataKey='value' fill='#22c55e' />
      </BarChart>
    </ResponsiveContainer>
  </div>
));

OverviewChart.displayName = 'OverviewChart';

export function DashboardClient({ data: dashboardData }: { data: any }) {
  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-8'>Dashboard</h1>

      <div className='grid gap-6 md:grid-cols-2'>
        <Suspense
          fallback={
            <Card className='p-6'>
              <Skeleton className='h-[300px] w-full' />
            </Card>
          }
        >
          <PerformanceMetrics data={dashboardData.performance} />
        </Suspense>

        <Suspense
          fallback={
            <Card className='p-6'>
              <Skeleton className='h-[300px] w-full' />
            </Card>
          }
        >
          <UserStats data={dashboardData.users} />
        </Suspense>
      </div>
    </div>
  );
}
