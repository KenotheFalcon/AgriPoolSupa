'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function HeroSectionSkeleton() {
  return (
    <div className='relative min-h-[80vh] flex items-center'>
      <Skeleton className='absolute inset-0' />
      <div className='container relative mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='max-w-3xl'>
          <Skeleton className='h-12 w-3/4 mb-4' />
          <Skeleton className='h-6 w-1/2 mb-8' />
          <Skeleton className='h-12 w-32' />
        </div>
      </div>
    </div>
  );
}

export function FeaturesSectionSkeleton() {
  return (
    <section className='py-16 md:py-24 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <Skeleton className='h-10 w-1/2 mx-auto mb-4' />
          <Skeleton className='h-6 w-3/4 mx-auto' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {[1, 2, 3].map((index) => (
            <Card key={index}>
              <Skeleton className='aspect-square w-full' />
              <CardHeader>
                <Skeleton className='h-6 w-3/4' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-4 w-full mb-2' />
                <Skeleton className='h-4 w-2/3' />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSectionSkeleton() {
  return (
    <section className='py-16 md:py-24'>
      <div className='container mx-auto px-4'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <Skeleton className='h-10 w-1/2 mx-auto mb-4' />
          <Skeleton className='h-6 w-3/4 mx-auto' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {[1, 2, 3].map((index) => (
            <Card key={index}>
              <CardContent className='pt-6'>
                <div className='flex items-center gap-4 mb-4'>
                  <Skeleton className='w-12 h-12 rounded-full' />
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-3 w-16' />
                  </div>
                </div>
                <Skeleton className='h-4 w-full mb-2' />
                <Skeleton className='h-4 w-2/3' />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LoadingSections() {
  return (
    <div className='animate-pulse'>
      <div className='h-96 bg-gray-200 rounded-lg mb-8'></div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
        <div className='h-64 bg-gray-200 rounded-lg'></div>
        <div className='h-64 bg-gray-200 rounded-lg'></div>
        <div className='h-64 bg-gray-200 rounded-lg'></div>
      </div>
      <div className='h-48 bg-gray-200 rounded-lg'></div>
    </div>
  );
}
