'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, X, ShoppingBasket, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className='w-full border-b border-border bg-background' role='navigation' aria-label='Main navigation'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center'>
            <Link href='/' className='flex items-center space-x-2' aria-label='AgriPool NG Home'>
              <ShoppingBasket className='h-6 w-6 text-green-600' aria-hidden='true' />
              <span className='text-xl font-bold'>AgriPool NG</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex md:items-center md:space-x-6' role='menubar'>
            <Link
              href='/groups'
              className='text-sm font-medium text-muted-foreground hover:text-foreground focus:text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded px-2 py-1'
              role='menuitem'
            >
              Find Groups
            </Link>
            <Link
              href='/farmers'
              className='text-sm font-medium text-muted-foreground hover:text-foreground focus:text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded px-2 py-1'
              role='menuitem'
            >
              Farmers
            </Link>
            <Link
              href='/about'
              className='text-sm font-medium text-muted-foreground hover:text-foreground focus:text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded px-2 py-1'
              role='menuitem'
            >
              About Us
            </Link>
            <Link
              href='/faq'
              className='text-sm font-medium text-muted-foreground hover:text-foreground focus:text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded px-2 py-1'
              role='menuitem'
            >
              FAQ
            </Link>
          </div>

          <div className='flex items-center space-x-4'>
            <ThemeToggle />

            <div className='hidden md:flex md:items-center md:space-x-2'>
              <Button variant='outline' asChild>
                <Link href='/auth/signin'>Sign In</Link>
              </Button>
              <Button asChild>
                <Link href='/auth/signup'>Sign Up</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className='md:hidden rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              aria-expanded={isMenuOpen}
              aria-controls='mobile-menu'
              aria-label={isMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            >
              {isMenuOpen ? <X className='h-6 w-6' aria-hidden='true' /> : <Menu className='h-6 w-6' aria-hidden='true' />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className='md:hidden border-t border-border' id='mobile-menu' role='menu' aria-labelledby='mobile-menu-button'>
          <div className='space-y-1 px-4 py-3'>
            <Link
              href='/groups'
              className='block py-3 px-2 text-base font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              onClick={toggleMenu}
              role='menuitem'
            >
              Find Groups
            </Link>
            <Link
              href='/farmers'
              className='block py-3 px-2 text-base font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              onClick={toggleMenu}
              role='menuitem'
            >
              Farmers
            </Link>
            <Link
              href='/about'
              className='block py-3 px-2 text-base font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              onClick={toggleMenu}
              role='menuitem'
            >
              About Us
            </Link>
            <Link
              href='/faq'
              className='block py-3 px-2 text-base font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              onClick={toggleMenu}
              role='menuitem'
            >
              FAQ
            </Link>
            <div className='border-t border-border pt-3 mt-3'>
              <Link
                href='/auth/signin'
                className='block py-3 px-2 text-base font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                onClick={toggleMenu}
                role='menuitem'
              >
                Sign In
              </Link>
              <Link
                href='/auth/signup'
                className='block py-3 px-2 text-base font-medium bg-green-600 text-white hover:bg-green-700 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                onClick={toggleMenu}
                role='menuitem'
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
