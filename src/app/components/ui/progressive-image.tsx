'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  placeholderSrc?: string;
  sizes?: string;
}

export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fallbackSrc = '/images/placeholder.jpg',
  placeholderSrc,
  sizes = '100vw',
}: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || fallbackSrc);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  useEffect(() => {
    if (error) {
      setCurrentSrc(fallbackSrc);
    }
  }, [error, fallbackSrc]);

  const handleHighQualityLoad = () => {
    setIsHighQualityLoaded(true);
    setIsLoading(false);
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && !isHighQualityLoaded && <Skeleton className='absolute inset-0' />}

      {/* Low quality placeholder */}
      {placeholderSrc && !isHighQualityLoaded && (
        <Image
          src={placeholderSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'absolute inset-0 w-full h-full object-cover',
            'transition-opacity duration-300',
            isHighQualityLoaded ? 'opacity-0' : 'opacity-100'
          )}
          priority={priority}
          sizes={sizes}
        />
      )}

      {/* High quality image */}
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'transition-opacity duration-300',
          isHighQualityLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoadingComplete={handleHighQualityLoad}
        onError={() => setError(true)}
        priority={priority}
        sizes={sizes}
      />
    </div>
  );
}
