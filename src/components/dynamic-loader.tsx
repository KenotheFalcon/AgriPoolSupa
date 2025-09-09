'use client';

import dynamic from 'next/dynamic';
import { ComponentType, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface DynamicLoaderProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  loading?: ComponentType;
  fallback?: React.ReactNode;
  ssr?: boolean;
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className="h-4 w-full mb-2" />
      ))}
    </div>
  );
}

export function DynamicLoader({
  component,
  loading,
  fallback,
  ssr = false,
}: DynamicLoaderProps) {
  const DynamicComponent = dynamic(component, {
    loading: loading || (() => <LoadingSkeleton />),
    ssr,
  });

  return (
    <Suspense fallback={fallback || <LoadingSkeleton />}>
      <DynamicComponent />
    </Suspense>
  );
}

// Commonly used dynamic components for better code splitting
export const DynamicChart = dynamic(() => import('@/components/ui/chart'), {
  loading: () => <LoadingSkeleton className="h-64" lines={5} />,
  ssr: false,
});

export const DynamicMap = dynamic(
  () => import('@/components/maps/location-map').then((mod) => ({ default: mod.LocationMap })),
  {
    loading: () => <LoadingSkeleton className="h-96" lines={8} />,
    ssr: false,
  }
);

export const DynamicImageUpload = dynamic(
  () => import('@/components/ui/landing-image-upload'),
  {
    loading: () => <LoadingSkeleton className="h-32" lines={4} />,
    ssr: false,
  }
);

export const DynamicCalendar = dynamic(() => import('@/components/ui/calendar'), {
  loading: () => <LoadingSkeleton className="h-80" lines={10} />,
  ssr: false,
});

export const DynamicCarousel = dynamic(() => import('@/components/ui/carousel'), {
  loading: () => <LoadingSkeleton className="h-64" lines={6} />,
  ssr: false,
});