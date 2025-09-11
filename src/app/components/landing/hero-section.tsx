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
    <section 
      className='relative min-h-[85vh] flex items-center bg-gradient-to-br from-primary/10 to-accent/10'
      role='banner'
      aria-labelledby='hero-title'
    >
      {/* Background Image with Overlay */}
      <div className='absolute inset-0'>
        <OptimizedImage 
          src={image.path || '/assets/hero-agriculture.jpg'} 
          alt={image.alt} 
          fill 
          className='object-cover' 
          priority 
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20' />
      </div>

      {/* Content Container - Mobile First */}
      <div className='relative w-full px-4 py-8 sm:px-6 md:px-8 lg:px-12'>
        <div className='max-w-7xl mx-auto'>
          <div className='max-w-2xl lg:max-w-3xl'>
            {/* Title - Mobile First Typography */}
            <h1 
              id='hero-title'
              className='text-3xl font-bold text-white mb-4 
                         sm:text-4xl sm:mb-6
                         md:text-5xl 
                         lg:text-6xl lg:mb-8
                         leading-tight tracking-tight'
            >
              {title}
            </h1>
            
            {/* Description - Responsive Typography */}
            <p className='text-base text-white/90 mb-6 leading-relaxed
                         sm:text-lg sm:mb-8
                         md:text-xl md:mb-10
                         lg:text-xl lg:leading-relaxed'>
              {description}
            </p>
            
            {/* CTA Button - Responsive Sizing */}
            <div className='flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4'>
              <Button 
                asChild 
                size='lg' 
                className='group bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3
                           sm:px-8 sm:py-4
                           font-medium text-base
                           rounded-lg
                           transition-all duration-200
                           focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black/20'
              >
                <Link href={ctaLink} aria-label={`${ctaText} - Get started with AgriPool`}>
                  {ctaText}
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                </Link>
              </Button>
              
              {/* Secondary CTA - Learn More */}
              <Button 
                asChild 
                variant='outline' 
                size='lg'
                className='border-white/30 text-white hover:bg-white/10 hover:border-white/50
                           px-6 py-3 sm:px-8 sm:py-4
                           font-medium text-base
                           rounded-lg
                           transition-all duration-200'
              >
                <Link href='#features' aria-label='Learn more about our features'>
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
