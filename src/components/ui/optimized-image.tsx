'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ComponentProps<typeof Image> {
  fallback?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallback = '/images/placeholder.jpg',
  onError,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
    onError?.(e);
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={cn('transition-opacity duration-300', className)}
      onError={handleError}
      {...props}
    />
  );
}
