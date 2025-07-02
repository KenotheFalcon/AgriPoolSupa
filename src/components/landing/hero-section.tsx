'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Users, ShoppingCart } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  description: string;
  image: {
    path: string;
    alt: string;
  };
  ctaText: string;
  ctaLink: string;
}

export default function HeroSection({
  title,
  description,
  image,
  ctaText,
  ctaLink,
}: HeroSectionProps) {
  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-grid-white/[0.1] bg-[size:60px_60px]' />

      <div className='relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8'>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8'>
          {/* Content */}
          <div className='flex flex-col justify-center'>
            <div className='mb-8'>
              <h1 className='text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl'>
                Connecting <span className='text-green-200'>Farmers</span> with{' '}
                <span className='text-green-200'>Consumers</span>
              </h1>
              <p className='mt-6 text-xl text-green-100 sm:text-2xl'>
                Join AgriPool to buy fresh produce directly from local farmers or sell your harvest
                to consumers. Build a sustainable food ecosystem together.
              </p>
            </div>

            {/* Stats */}
            <div className='mb-8 grid grid-cols-2 gap-6 sm:grid-cols-4'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-green-200'>500+</div>
                <div className='text-sm text-green-100'>Active Farmers</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-green-200'>2,000+</div>
                <div className='text-sm text-green-100'>Happy Customers</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-green-200'>50+</div>
                <div className='text-sm text-green-100'>Cities Served</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-green-200'>95%</div>
                <div className='text-sm text-green-100'>Satisfaction Rate</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
              <Button asChild size='lg' className='bg-white text-green-700 hover:bg-green-50'>
                <Link href='/auth/signup?role=buyer' className='flex items-center'>
                  <ShoppingCart className='mr-2 h-5 w-5' />
                  Join as Buyer
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
              <Button
                asChild
                size='lg'
                variant='outline'
                className='border-white text-white hover:bg-white hover:text-green-700'
              >
                <Link href='/auth/signup?role=farmer' className='flex items-center'>
                  <Users className='mr-2 h-5 w-5' />
                  Join as Farmer
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className='mt-8 flex items-center space-x-6 text-sm text-green-200'>
              <div className='flex items-center'>
                <div className='mr-2 h-2 w-2 rounded-full bg-green-300' />
                Secure Payments
              </div>
              <div className='flex items-center'>
                <div className='mr-2 h-2 w-2 rounded-full bg-green-300' />
                Verified Farmers
              </div>
              <div className='flex items-center'>
                <div className='mr-2 h-2 w-2 rounded-full bg-green-300' />
                Fresh Produce
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className='relative flex items-center justify-center'>
            <div className='relative aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm'>
              <div className='absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-500/20' />
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='text-center'>
                  <div className='mb-4 text-6xl'>🌾</div>
                  <div className='text-lg font-semibold'>Fresh from Farm to Table</div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-yellow-400/20 backdrop-blur-sm' />
            <div className='absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-orange-400/20 backdrop-blur-sm' />
          </div>
        </div>
      </div>
    </section>
  );
}
