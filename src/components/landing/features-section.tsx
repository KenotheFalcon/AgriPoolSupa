'use client';

import { Truck, Shield, TrendingUp, Users, DollarSign, Leaf, Clock, MapPin } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Direct Delivery',
    description:
      'Fresh produce delivered directly from farm to your doorstep or convenient pickup points.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description:
      'Safe and transparent payment system with escrow protection for both buyers and sellers.',
  },
  {
    icon: TrendingUp,
    title: 'Better Prices',
    description:
      'Eliminate middlemen and get better prices for farmers while saving money for consumers.',
  },
  {
    icon: Users,
    title: 'Community Groups',
    description:
      'Join local purchase groups to meet minimum orders and build community connections.',
  },
  {
    icon: DollarSign,
    title: 'Fair Pricing',
    description:
      'Transparent pricing with no hidden fees. Farmers get fair compensation for their work.',
  },
  {
    icon: Leaf,
    title: 'Sustainable',
    description:
      'Support local agriculture and reduce food miles for a more sustainable food system.',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description:
      'Choose delivery times that work for you with flexible pickup and delivery options.',
  },
  {
    icon: MapPin,
    title: 'Local Focus',
    description: 'Connect with farmers in your area for the freshest local produce available.',
  },
];

export function FeaturesSection() {
  return (
    <section className='py-24 bg-gray-50 dark:bg-gray-800'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
            Why Choose AgriPool?
          </h2>
          <p className='mt-4 text-lg text-gray-600 dark:text-gray-300'>
            Discover the benefits that make us the preferred choice for farmers and consumers
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {features.map((feature) => (
            <div
              key={feature.title}
              className='group relative rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-gray-900 dark:shadow-gray-900/50'
            >
              {/* Icon */}
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors dark:bg-green-900/50 dark:text-green-400'>
                <feature.icon className='h-6 w-6' />
              </div>

              {/* Content */}
              <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
                {feature.title}
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-300'>{feature.description}</p>

              {/* Hover Effect */}
              <div className='absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-200 transition-colors' />
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className='mt-20 rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 p-8 text-white'>
          <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
            <div className='text-center'>
              <div className='text-3xl font-bold'>500+</div>
              <div className='text-sm text-green-100'>Active Farmers</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold'>2,000+</div>
              <div className='text-sm text-green-100'>Happy Customers</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold'>50+</div>
              <div className='text-sm text-green-100'>Cities Served</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold'>95%</div>
              <div className='text-sm text-green-100'>Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
