'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Landing() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-center'
      >
        <h1 className='text-4xl sm:text-6xl font-bold text-foreground mb-6'>
          Welcome to <span className='text-green-600 dark:text-green-400'>AgriPool</span>
        </h1>
        <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
          Your all-in-one platform for agricultural management and collaboration. Connect with
          farmers, manage resources, and grow your business.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button asChild size='lg'>
            <Link href='/auth'>Get Started</Link>
          </Button>
          <Button variant='outline' size='lg' asChild>
            <Link href='/about'>Learn More</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
