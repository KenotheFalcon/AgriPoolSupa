'use client';

import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

export function CTASection() {
  return (
    <section className='py-24 bg-gradient-to-br from-green-600 via-green-700 to-blue-600 text-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          {/* Main CTA */}
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6'>
            Ready to Transform Your Food Experience?
          </h2>
          <p className='text-xl text-green-100 mb-8 max-w-3xl mx-auto'>
            Join thousands of farmers and consumers who are already enjoying fresh, local produce
            while building stronger communities and supporting sustainable agriculture.
          </p>

          {/* Action Buttons */}
          <div className='flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0 justify-center mb-12'>
            <Link
              href='/auth/signup?role=buyer'
              className='inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-green-700 font-semibold hover:bg-green-50 transition-colors shadow-lg'
            >
              Start Buying Fresh Produce
              <ArrowRight className='ml-2 h-5 w-5' />
            </Link>
            <Link
              href='/auth/signup?role=farmer'
              className='inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 text-white font-semibold hover:bg-white hover:text-green-700 transition-colors'
            >
              Start Selling Your Harvest
              <ArrowRight className='ml-2 h-5 w-5' />
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-2xl mx-auto'>
            <div className='flex items-center justify-center space-x-2'>
              <Star className='h-5 w-5 text-yellow-300 fill-current' />
              <span className='text-sm text-green-100'>4.9/5 Rating</span>
            </div>
            <div className='flex items-center justify-center space-x-2'>
              <div className='h-2 w-2 rounded-full bg-green-300' />
              <span className='text-sm text-green-100'>Verified Farmers</span>
            </div>
            <div className='flex items-center justify-center space-x-2'>
              <div className='h-2 w-2 rounded-full bg-green-300' />
              <span className='text-sm text-green-100'>Secure Payments</span>
            </div>
          </div>

          {/* Social Proof */}
          <div className='mt-12 pt-8 border-t border-green-500/30'>
            <p className='text-sm text-green-200 mb-4'>
              Trusted by farmers and consumers across Nigeria
            </p>
            <div className='flex justify-center space-x-8 opacity-75'>
              <div className='text-center'>
                <div className='text-2xl font-bold'>500+</div>
                <div className='text-xs text-green-200'>Active Farmers</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold'>2,000+</div>
                <div className='text-xs text-green-200'>Happy Customers</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold'>50+</div>
                <div className='text-xs text-green-200'>Cities Served</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
