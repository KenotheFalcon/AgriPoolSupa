'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, X, ShoppingBasket } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav 
      className='w-full border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50' 
      role='navigation' 
      aria-label='Main navigation'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link 
              href='/' 
              className='flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-1' 
              aria-label='AgriPool NG Home'
            >
              <ShoppingBasket className='h-8 w-8 text-primary' aria-hidden='true' />
              <span className='text-xl font-bold text-foreground'>AgriPool NG</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex md:items-center md:space-x-8' role='menubar'>
            <Link
              href='/groups'
              className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-3 py-2'
              role='menuitem'
            >
              Find Groups
            </Link>
            <Link
              href='/farmers'
              className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-3 py-2'
              role='menuitem'
            >
              Farmers
            </Link>
            <Link
              href='/about'
              className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-3 py-2'
              role='menuitem'
            >
              About Us
            </Link>
            <Link
              href='/faq'
              className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-3 py-2'
              role='menuitem'
            >
              FAQ
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className='flex items-center space-x-4'>
            <ThemeToggle />

            <div className='hidden md:flex md:items-center md:space-x-3'>
              <Button 
                variant='outline' 
                asChild
                className='border-border hover:border-primary hover:text-primary transition-colors duration-200'
              >
                <Link href='/auth/signin'>Sign In</Link>
              </Button>
              <Button 
                asChild
                className='bg-primary hover:bg-primary/90 text-primary-foreground font-medium'
              >
                <Link href='/auth/signup'>Sign Up</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className='md:hidden rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              aria-expanded={isMenuOpen}
              aria-controls='mobile-menu'
              aria-label={isMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            >
              {isMenuOpen ? (
                <X className='h-6 w-6' aria-hidden='true' />
              ) : (
                <Menu className='h-6 w-6' aria-hidden='true' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div 
          className='md:hidden border-t border-border bg-background/95 backdrop-blur-md' 
          id='mobile-menu' 
          role='menu' 
          aria-labelledby='mobile-menu-button'
        >
          <div className='px-4 py-3 space-y-1'>
            <Link
              href='/groups'
              className='block py-3 px-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              onClick={toggleMenu}
              role='menuitem'
            >
              Find Groups
            </Link>
            <Link
              href='/farmers'
              className='block py-3 px-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              onClick={toggleMenu}
              role='menuitem'
            >
              Farmers
            </Link>
            <Link
              href='/about'
              className='block py-3 px-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              onClick={toggleMenu}
              role='menuitem'
            >
              About Us
            </Link>
            <Link
              href='/faq'
              className='block py-3 px-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              onClick={toggleMenu}
              role='menuitem'
            >
              FAQ
            </Link>
            
            {/* Mobile Auth Actions */}
            <div className='border-t border-border pt-3 mt-3 space-y-2'>
              <Link
                href='/auth/signin'
                className='block py-3 px-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                onClick={toggleMenu}
                role='menuitem'
              >
                Sign In
              </Link>
              <Link
                href='/auth/signup'
                className='block py-3 px-3 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-primary'
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
