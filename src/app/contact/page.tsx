'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

const contactInfo = [
  {
    title: 'Email',
    description: 'support@agripool.ng',
    icon: Mail,
  },
  {
    title: 'Phone',
    description: '+234 800 123 4567',
    icon: Phone,
  },
  {
    title: 'Address',
    description: '123 Agric Street, Lagos, Nigeria',
    icon: MapPin,
  },
  {
    title: 'Hours',
    description: 'Mon - Fri: 9:00 AM - 6:00 PM',
    icon: Clock,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

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
              Get in Touch
            </h1>
            <p className='mt-6 text-lg text-muted-foreground'>
              Have questions about AgriPool? We're here to help. Send us a message and we'll respond
              as soon as possible.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className='bg-white dark:bg-background py-16 sm:py-24'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8'>
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className='rounded-lg bg-green-50 p-8 dark:bg-green-950/50'
            >
              <h2 className='text-2xl font-bold tracking-tight text-foreground'>
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
                <div>
                  <label htmlFor='name' className='block text-sm font-medium text-foreground'>
                    Name
                  </label>
                  <Input
                    id='name'
                    type='text'
                    required
                    className='mt-1'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor='email' className='block text-sm font-medium text-foreground'>
                    Email
                  </label>
                  <Input
                    id='email'
                    type='email'
                    required
                    className='mt-1'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor='subject' className='block text-sm font-medium text-foreground'>
                    Subject
                  </label>
                  <Input
                    id='subject'
                    type='text'
                    required
                    className='mt-1'
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor='message' className='block text-sm font-medium text-foreground'>
                    Message
                  </label>
                  <Textarea
                    id='message'
                    required
                    className='mt-1'
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <Button type='submit' className='w-full'>
                  Send Message
                </Button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className='space-y-8'
            >
              <div>
                <h2 className='text-2xl font-bold tracking-tight text-foreground'>
                  Contact Information
                </h2>
                <p className='mt-4 text-muted-foreground'>
                  Choose the most convenient way to reach us
                </p>
              </div>

              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                {contactInfo.map((info) => (
                  <div
                    key={info.title}
                    className='rounded-lg bg-white p-6 shadow-sm dark:bg-background'
                  >
                    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900'>
                      <info.icon className='h-6 w-6 text-green-600 dark:text-green-400' />
                    </div>
                    <h3 className='mt-4 text-lg font-semibold text-foreground'>{info.title}</h3>
                    <p className='mt-2 text-muted-foreground'>{info.description}</p>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className='aspect-video overflow-hidden rounded-lg'>
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.651516!2d3.336732!3d6.548055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1647881234567!5m2!1sen!2sus'
                  width='100%'
                  height='100%'
                  style={{ border: 0 }}
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
