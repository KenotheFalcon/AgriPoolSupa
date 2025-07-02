'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <div className='relative overflow-hidden bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800'>
      {/* Background pattern */}
      <div className='absolute inset-0 bg-grid-white/[0.05]' />

      <div className='container relative mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className='mx-auto max-w-2xl text-center'
        >
          <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
            Ready to transform your farming experience?
          </h2>
          <p className='mx-auto mt-6 max-w-xl text-lg text-green-100'>
            Join thousands of farmers and buyers who are already benefiting from our platform. Start
            your journey today and be part of the agricultural revolution.
          </p>
          <div className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button
              asChild
              size='lg'
              className='bg-white text-green-600 hover:bg-green-50 dark:bg-white dark:text-green-600 dark:hover:bg-green-50'
            >
              <Link href='/signup'>
                Get Started
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button
              asChild
              size='lg'
              variant='outline'
              className='border-white text-white hover:bg-green-700 hover:text-white dark:border-white dark:text-white dark:hover:bg-green-700'
            >
              <Link href='/about'>Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
