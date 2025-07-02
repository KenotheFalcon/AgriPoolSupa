'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would navigate to the search results
    console.log('Searching near:', location);
  };

  return (
    <div className='relative overflow-hidden bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background'>
      {/* Background pattern */}
      <div className='absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]' />

      <div className='container relative mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='grid grid-cols-1 gap-12 md:grid-cols-2 lg:items-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className='text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl'>
              <span className='block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent dark:from-green-400 dark:to-green-300'>
                Fresh Produce
              </span>
              <span className='block mt-2'>Direct from Farms</span>
            </h1>
            <p className='mt-6 max-w-md text-lg text-muted-foreground'>
              Connect with local farmers, join purchase groups, and get fresh Nigerian produce
              delivered to your doorstep. Support local agriculture while enjoying the best quality
              produce.
            </p>

            <form onSubmit={handleSearch} className='mt-8 sm:flex'>
              <div className='relative w-full sm:max-w-md'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <MapPin className='h-5 w-5 text-muted-foreground' />
                </div>
                <Input
                  type='text'
                  placeholder='Enter your location'
                  className='w-full pl-10'
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className='mt-3 sm:mt-0 sm:ml-3'>
                <Button type='submit' className='w-full'>
                  <Search className='mr-2 h-4 w-4' />
                  Find Groups
                </Button>
              </div>
            </form>

            <div className='mt-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
              <Button asChild variant='outline' size='lg' className='group'>
                <Link href='/farmers/join'>
                  Sell as Farmer
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                </Link>
              </Button>
              <Button asChild variant='outline' size='lg' className='group'>
                <Link href='/logistics/join'>
                  Join as Haulage Partner
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='relative aspect-video overflow-hidden rounded-xl shadow-xl lg:aspect-square'
          >
            <img
              src='https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg'
              alt='Nigerian farmer harvesting crops'
              className='h-full w-full object-cover transition-transform duration-500 hover:scale-105'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
          </motion.div>
        </div>

        <div className='mt-16 flex flex-wrap justify-center gap-8'>
          <div className='flex flex-col items-center'>
            <span className='text-3xl font-bold text-green-600 dark:text-green-400'>2,500+</span>
            <span className='text-sm text-muted-foreground'>Verified Farmers</span>
          </div>
          <div className='flex flex-col items-center'>
            <span className='text-3xl font-bold text-green-600 dark:text-green-400'>150+</span>
            <span className='text-sm text-muted-foreground'>Active Groups</span>
          </div>
          <div className='flex flex-col items-center'>
            <span className='text-3xl font-bold text-green-600 dark:text-green-400'>27</span>
            <span className='text-sm text-muted-foreground'>States Covered</span>
          </div>
          <div className='flex flex-col items-center'>
            <span className='text-3xl font-bold text-green-600 dark:text-green-400'>98%</span>
            <span className='text-sm text-muted-foreground'>Delivery Success</span>
          </div>
        </div>
      </div>
    </div>
  );
}
