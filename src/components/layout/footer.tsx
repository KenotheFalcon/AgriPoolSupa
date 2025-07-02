import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Farmers', href: '/farmers' },
    { name: 'Contact', href: '/contact' },
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
    <footer className='bg-gray-900 text-white'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
          {/* Brand Section */}
          <div className='lg:col-span-2'>
            <div className='flex items-center space-x-2 mb-4'>
              <div className='text-2xl'>🌾</div>
              <span className='text-xl font-bold'>AgriPool</span>
            </div>
            <p className='text-gray-300 mb-6 max-w-md'>
              Connecting farmers with consumers to create a sustainable, local food ecosystem. Fresh
              produce, fair prices, and stronger communities.
            </p>

            {/* Contact Info */}
            <div className='space-y-3'>
              <div className='flex items-center space-x-3 text-gray-300'>
                <Mail className='h-5 w-5' />
                <span>hello@agripool.ng</span>
              </div>
              <div className='flex items-center space-x-3 text-gray-300'>
                <Phone className='h-5 w-5' />
                <span>+234 800 AGRI POOL</span>
              </div>
              <div className='flex items-center space-x-3 text-gray-300'>
                <MapPin className='h-5 w-5' />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-3'>
              {navigation.main.slice(0, 4).map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className='text-gray-300 hover:text-white transition-colors'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Legal</h3>
            <ul className='space-y-3'>
              {navigation.main.slice(4).map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className='text-gray-300 hover:text-white transition-colors'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='mt-12 pt-8 border-t border-gray-800'>
          <div className='flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0'>
            {/* Copyright */}
            <p className='text-gray-300 text-sm'>
              © {new Date().getFullYear()} AgriPool. All rights reserved.
            </p>

            {/* Social Links */}
            <div className='flex space-x-6'>
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className='text-gray-400 hover:text-white transition-colors'
                  aria-label={item.name}
                >
                  <item.icon className='h-6 w-6' />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className='mt-8 text-center'>
            <p className='text-gray-300 text-sm mb-4'>Stay updated with the latest from AgriPool</p>
            <div className='flex max-w-md mx-auto'>
              <input
                type='email'
                placeholder='Enter your email'
                className='flex-1 px-4 py-2 rounded-l-lg border-0 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none'
              />
              <button className='px-6 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors'>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
