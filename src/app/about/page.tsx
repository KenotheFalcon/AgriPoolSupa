'use client';

import { motion } from 'framer-motion';
import { Users, Leaf, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const values = [
  {
    title: 'Community First',
    description:
      'We believe in the power of community-driven agriculture and supporting local farmers.',
    icon: Users,
  },
  {
    title: 'Sustainable Farming',
    description: 'Promoting eco-friendly farming practices and sustainable agricultural methods.',
    icon: Leaf,
  },
  {
    title: 'Fair Trade',
    description: 'Ensuring fair prices for farmers while providing quality produce to consumers.',
    icon: Heart,
  },
  {
    title: 'Trust & Security',
    description:
      'Building a secure platform where farmers and buyers can transact with confidence.',
    icon: Shield,
  },
];

export default function AboutPage() {
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='relative overflow-hidden bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background'>
        <div className='absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]' />
        <div className='container relative mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='mx-auto max-w-3xl text-center'
          >
            <h1 className='text-4xl font-bold tracking-tight text-foreground sm:text-5xl'>
              About AgriPool
            </h1>
            <p className='mt-6 text-lg text-muted-foreground'>
              We&apos;re revolutionizing the way Nigerians access fresh produce by connecting local
              farmers directly with consumers through community-driven purchase groups.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className='bg-white dark:bg-background py-16 sm:py-24'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className='text-3xl font-bold tracking-tight text-foreground'>Our Mission</h2>
              <p className='mt-6 text-lg text-muted-foreground'>
                At AgriPool, we&apos;re on a mission to transform Nigeria&apos;s agricultural
                landscape by creating a sustainable ecosystem that benefits both farmers and
                consumers. We believe in the power of community-driven agriculture and the
                importance of supporting local farmers while providing access to fresh, quality
                produce.
              </p>
              <div className='mt-8'>
                <Button asChild>
                  <Link href='/contact'>Get in Touch</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className='relative aspect-video overflow-hidden rounded-xl shadow-xl'
            >
              <img
                src='https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg'
                alt='Nigerian farmers working in the field'
                className='h-full w-full object-cover'
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className='bg-green-50 dark:bg-green-950/50 py-16 sm:py-24'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='mx-auto max-w-2xl text-center'
          >
            <h2 className='text-3xl font-bold tracking-tight text-foreground'>Our Values</h2>
            <p className='mt-4 text-lg text-muted-foreground'>
              These core values guide everything we do at AgriPool
            </p>
          </motion.div>

          <div className='mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='relative overflow-hidden rounded-lg bg-white p-6 shadow-sm dark:bg-background'
              >
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900'>
                  <value.icon className='h-6 w-6 text-green-600 dark:text-green-400' />
                </div>
                <h3 className='mt-4 text-lg font-semibold text-foreground'>{value.title}</h3>
                <p className='mt-2 text-muted-foreground'>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className='bg-white dark:bg-background py-16 sm:py-24'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='mx-auto max-w-2xl text-center'
          >
            <h2 className='text-3xl font-bold tracking-tight text-foreground'>Join Our Team</h2>
            <p className='mt-4 text-lg text-muted-foreground'>
              We&apos;re always looking for passionate individuals to join our mission
            </p>
          </motion.div>

          <div className='mt-10 text-center'>
            <Button asChild variant='outline' size='lg'>
              <Link href='/careers'>View Open Positions</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
