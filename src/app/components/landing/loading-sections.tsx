'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function HeroSectionSkeleton() {
  return (
    <section className='relative min-h-[80vh] flex items-center'>
      <div className='absolute inset-0'>
        <Skeleton className='w-full h-full' />
      </div>
      <div className='relative container mx-auto px-4 py-16 md:py-24'>
        <div className='max-w-3xl'>
          <Skeleton className='h-16 w-3/4 mb-6' />
          <Skeleton className='h-8 w-full mb-8' />
          <Skeleton className='h-12 w-48' />
        </div>
      </div>
    </section>
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
          {[1, 2, 3].map((i) => (
            <Card key={i} className='overflow-hidden'>
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
          {[1, 2, 3].map((i) => (
            <Card key={i} className='relative'>
              <CardContent className='pt-6'>
                <div className='flex items-center gap-4 mb-4'>
                  <Skeleton className='w-16 h-16 rounded-full' />
                  <div>
                    <Skeleton className='h-5 w-32 mb-2' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                </div>
                <Skeleton className='h-4 w-full mb-2' />
                <Skeleton className='h-4 w-5/6' />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutSectionSkeleton() {
  return (
    <section className='py-16 md:py-24'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <Skeleton className='aspect-[4/3] w-full rounded-lg' />
          <div className='space-y-6'>
            <Skeleton className='h-10 w-3/4' />
            <div className='space-y-4'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-2/3' />
            </div>
            <Skeleton className='h-12 w-48' />
          </div>
        </div>
      </div>
    </section>
  );
}

export function FarmersSectionSkeleton() {
  return (
    <section className='py-16 md:py-24 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <Skeleton className='h-10 w-1/2 mx-auto mb-4' />
          <Skeleton className='h-6 w-3/4 mx-auto' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          {[1, 2, 3].map((i) => (
            <Card key={i} className='overflow-hidden'>
              <Skeleton className='aspect-square w-full' />
              <CardContent className='p-6'>
                <Skeleton className='h-6 w-3/4 mb-2' />
                <Skeleton className='h-4 w-1/2 mb-4' />
                <Skeleton className='h-4 w-full mb-2' />
                <Skeleton className='h-4 w-5/6' />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className='text-center'>
          <Skeleton className='h-12 w-48 mx-auto' />
        </div>
      </div>
    </section>
  );
}

export function CTASectionSkeleton() {
  return (
    <section className='relative py-16 md:py-24'>
      <div className='absolute inset-0'>
        <Skeleton className='w-full h-full' />
      </div>
      <div className='relative container mx-auto px-4'>
        <div className='max-w-3xl mx-auto text-center'>
          <Skeleton className='h-10 w-3/4 mx-auto mb-6' />
          <Skeleton className='h-6 w-full mb-8' />
          <Skeleton className='h-12 w-48 mx-auto' />
        </div>
      </div>
    </section>
  );
}
