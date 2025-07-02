'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CTASectionProps {
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

export default function CTASection({
  image,
  title,
  description,
  ctaText,
  ctaLink,
}: CTASectionProps) {
  return (
    <section className='relative py-16 md:py-24'>
      <div className='absolute inset-0'>
        <OptimizedImage src={image.path} alt={image.alt} fill className='object-cover' />
        <div className='absolute inset-0 bg-black/60' />
      </div>

      <div className='relative container mx-auto px-4'>
        <div className='max-w-3xl mx-auto text-center text-white'>
          <h2 className='text-3xl md:text-4xl font-bold mb-6'>{title}</h2>
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
