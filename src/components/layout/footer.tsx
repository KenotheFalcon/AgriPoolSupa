import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Farmers', href: '/farmers' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      icon: Facebook,
    },
    {
      name: 'Twitter',
      href: '#',
      icon: Twitter,
    },
    {
      name: 'Instagram',
      href: '#',
      icon: Instagram,
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: Linkedin,
    },
  ],
};

export function Footer() {
  return (
    <footer className='bg-gradient-to-b from-neutralDark to-black text-white' role='contentinfo'>
      <div className='max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {/* Brand Section */}
          <div className='lg:col-span-2'>
            <div className='flex items-center space-x-2 mb-6'>
              <div className='text-2xl' role='img' aria-label='Wheat emoji'>🌾</div>
              <span className='text-xl font-bold text-white'>AgriPool</span>
            </div>
            <p className='text-white/80 mb-6 max-w-md leading-relaxed'>
              Connecting farmers with consumers to create a sustainable, local food ecosystem. Fresh
              produce, fair prices, and stronger communities.
            </p>

            {/* Contact Info */}
            <div className='space-y-4'>
              <div className='flex items-center space-x-3 text-white/70 hover:text-white transition-colors duration-200'>
                <Mail className='h-5 w-5 text-secondary' aria-hidden='true' />
                <a 
                  href='mailto:hello@agripool.ng'
                  className='hover:underline focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-neutralDark rounded'
                >
                  hello@agripool.ng
                </a>
              </div>
              <div className='flex items-center space-x-3 text-white/70'>
                <Phone className='h-5 w-5 text-secondary' aria-hidden='true' />
                <span>+234 800 AGRI POOL</span>
              </div>
              <div className='flex items-center space-x-3 text-white/70'>
                <MapPin className='h-5 w-5 text-secondary' aria-hidden='true' />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-lg font-bold mb-6 text-white'>Quick Links</h3>
            <ul className='space-y-4'>
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className='text-white/70 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-neutralDark rounded text-sm'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className='text-lg font-bold mb-6 text-white'>Legal</h3>
            <ul className='space-y-4'>
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className='text-white/70 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-neutralDark rounded text-sm'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='mt-12 pt-8 border-t border-white/20'>
          <div className='flex flex-col items-center justify-between space-y-6 sm:flex-row sm:space-y-0'>
            {/* Copyright */}
            <p className='text-white/70 text-sm text-center sm:text-left'>
              © {new Date().getFullYear()} AgriPool. All rights reserved.
            </p>

            {/* Social Links */}
            <div className='flex space-x-4'>
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className='text-white/60 hover:text-secondary transition-colors duration-200 p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-neutralDark'
                  aria-label={item.name}
                >
                  <item.icon className='h-5 w-5' />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className='mt-8 text-center'>
            <p className='text-white/80 text-sm mb-4'>Stay updated with the latest from AgriPool</p>
            <div className='flex flex-col space-y-3 max-w-md mx-auto sm:flex-row sm:space-y-0 sm:space-x-2'>
              <Input
                type='email'
                placeholder='Enter your email'
                className='flex-1 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-secondary focus:ring-secondary'
                aria-label='Email address for newsletter'
              />
              <Button 
                className='bg-secondary hover:bg-secondary/90 text-neutralDark font-medium px-6 py-2 whitespace-nowrap'
                aria-label='Subscribe to newsletter'
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
