'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AboutSectionProps {
  image: {
    path: string;
    alt: string;
  };
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

export default function AboutSection({
  image,
  title,
  description,
  ctaText,
  ctaLink,
}: AboutSectionProps) {
  return (
    <section className='py-16 md:py-24'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div className='relative aspect-[4/3] rounded-lg overflow-hidden'>
            <OptimizedImage src={image.path} alt={image.alt} fill className='object-cover' />
          </div>

          <div className='space-y-6'>
            <h2 className='text-3xl md:text-4xl font-bold'>{title}</h2>
            <div className='prose prose-lg'>
              {description.split('\n').map((paragraph, index) => (
                <p key={index} className='text-gray-600'>
                  {paragraph}
                </p>
              ))}
            </div>
            <Button asChild size='lg' className='group'>
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
