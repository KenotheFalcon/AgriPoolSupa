'use client';

import { motion } from 'framer-motion';
import { Users, Package, MapPin, Truck } from 'lucide-react';

const stats = [
  {
    name: 'Verified Farmers',
    value: '2,500+',
    icon: Users,
    description: 'Active farmers across Nigeria',
  },
  {
    name: 'Active Groups',
    value: '150+',
    icon: Package,
    description: 'Purchase groups in operation',
  },
  {
    name: 'States Covered',
    value: '27',
    icon: MapPin,
    description: 'Nationwide coverage',
  },
  {
    name: 'Delivery Success',
    value: '98%',
    icon: Truck,
    description: 'On-time delivery rate',
  },
];

export default function StatsSection() {
  return (
    <div className='bg-white dark:bg-background py-16 sm:py-24'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className='relative overflow-hidden rounded-lg bg-gradient-to-br from-green-50 to-white p-6 shadow-sm dark:from-green-950/50 dark:to-background'
            >
              <div className='flex items-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900'>
                  <stat.icon className='h-6 w-6 text-green-600 dark:text-green-400' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-muted-foreground'>{stat.name}</p>
                  <p className='text-2xl font-semibold text-foreground'>{stat.value}</p>
                </div>
              </div>
              <p className='mt-2 text-sm text-muted-foreground'>{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
