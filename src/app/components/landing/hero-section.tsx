'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  image: {
    path: string;
    alt: string;
    placeholderSrc?: string;
  };
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

export default function HeroSection({
  image,
  title,
  description,
  ctaText,
  ctaLink,
}: HeroSectionProps) {
  return (
    <section className='relative min-h-[80vh] flex items-center'>
      <div className='absolute inset-0'>
        <OptimizedImage src={image.path} alt={image.alt} fill className='object-cover' priority />
        <div className='absolute inset-0 bg-black/50' />
      </div>

      <div className='relative container mx-auto px-4 py-16 md:py-24'>
        <div className='max-w-3xl'>
          <h1 className='text-4xl md:text-6xl font-bold text-white mb-6'>{title}</h1>
          <p className='text-xl text-white/90 mb-8'>{description}</p>
          <Button asChild size='lg' className='group'>
            <Link href={ctaLink}>
              {ctaText}
              <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
