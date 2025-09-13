'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, CheckCircle, Truck } from 'lucide-react';
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
    <section 
      className='relative py-16 sm:py-20 md:py-24 lg:py-28'
      role='region'
      aria-labelledby='cta-title'
    >
      {/* Background Image with Overlay */}
      <div className='absolute inset-0'>
        <OptimizedImage 
          src={image.path || '/assets/cta-agriculture.jpg'} 
          alt={image.alt} 
          fill 
          className='object-cover' 
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30' />
      </div>

      {/* Content Container - Mobile First */}
      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto text-center text-white'>
          {/* Main Title */}
          <h2 
            id='cta-title'
            className='text-2xl font-bold mb-4
                       sm:text-3xl sm:mb-6
                       md:text-4xl md:mb-8
                       lg:text-5xl
                       leading-tight tracking-tight'
          >
            {title}
          </h2>
          
          {/* Description */}
          <p className='text-base text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto
                       sm:text-lg sm:mb-10
                       md:text-xl md:mb-12
                       lg:text-xl'>
            {description}
          </p>

          {/* Statistics/Features Grid */}
          <div className='grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3 sm:gap-6 sm:mb-10 md:mb-12'>
            <div className='flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-lg'>
              <Users className='w-8 h-8 sm:w-10 sm:h-10 text-secondary mb-2' aria-hidden='true' />
              <span className='text-lg sm:text-xl font-bold'>5,000+</span>
              <span className='text-sm sm:text-base text-white/80'>Active Users</span>
            </div>
            <div className='flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-lg'>
              <CheckCircle className='w-8 h-8 sm:w-10 sm:h-10 text-secondary mb-2' aria-hidden='true' />
              <span className='text-lg sm:text-xl font-bold'>500+</span>
              <span className='text-sm sm:text-base text-white/80'>Verified Farmers</span>
            </div>
            <div className='flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-lg'>
              <Truck className='w-8 h-8 sm:w-10 sm:h-10 text-secondary mb-2' aria-hidden='true' />
              <span className='text-lg sm:text-xl font-bold'>1,000+</span>
              <span className='text-sm sm:text-base text-white/80'>Successful Deliveries</span>
            </div>
          </div>

          {/* CTA Buttons - Mobile First */}
          <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center'>
            <Button 
              asChild 
              size='lg' 
              className='group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-base font-semibold rounded-lg
                         transition-all duration-200
                         focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black/20'
            >
              <Link href={ctaLink} aria-label={`${ctaText} - Join AgriPool today`}>
                {ctaText}
                <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant='outline' 
              size='lg'
              className='border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 text-base font-semibold rounded-lg
                         transition-all duration-200'
            >
              <Link href='/about' aria-label='Learn more about AgriPool'>
                Learn More
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className='mt-8 sm:mt-10 md:mt-12'>
            <p className='text-sm text-white/70 mb-4 sm:text-base'>
              Trusted by farmers and consumers across Nigeria
            </p>
            <div className='flex flex-wrap justify-center gap-4 sm:gap-6'>
              <div className='flex items-center gap-2 text-white/80'>
                <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5 text-secondary' aria-hidden='true' />
                <span className='text-xs sm:text-sm'>100% Verified</span>
              </div>
              <div className='flex items-center gap-2 text-white/80'>
                <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5 text-secondary' aria-hidden='true' />
                <span className='text-xs sm:text-sm'>Secure Payments</span>
              </div>
              <div className='flex items-center gap-2 text-white/80'>
                <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5 text-secondary' aria-hidden='true' />
                <span className='text-xs sm:text-sm'>Fresh Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
