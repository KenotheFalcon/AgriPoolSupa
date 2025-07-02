import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      <div>
        <Skeleton className='h-8 w-[200px]' />
        <Skeleton className='mt-2 h-4 w-[300px]' />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-[150px]' />
          <Skeleton className='mt-2 h-4 w-[200px]' />
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[250px]' />
            <Skeleton className='h-4 w-[200px]' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
