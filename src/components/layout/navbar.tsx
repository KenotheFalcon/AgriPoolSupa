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
    <nav className='w-full border-b border-border bg-background'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center'>
            <Link href='/' className='flex items-center space-x-2'>
              <ShoppingBasket className='h-6 w-6 text-green-600' />
              <span className='text-xl font-bold'>AgriPool NG</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex md:items-center md:space-x-6'>
            <Link
              href='/groups'
              className='text-sm font-medium text-muted-foreground hover:text-foreground'
            >
              Find Groups
            </Link>
            <Link
              href='/farmers'
              className='text-sm font-medium text-muted-foreground hover:text-foreground'
            >
              Farmers
            </Link>
            <Link
              href='/about'
              className='text-sm font-medium text-muted-foreground hover:text-foreground'
            >
              About Us
            </Link>
            <Link
              href='/faq'
              className='text-sm font-medium text-muted-foreground hover:text-foreground'
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
              className='md:hidden rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500'
            >
              {isMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className='md:hidden border-t border-border'>
          <div className='space-y-1 px-4 py-3'>
            <Link
              href='/groups'
              className='block py-2 text-base font-medium text-foreground'
              onClick={toggleMenu}
            >
              Find Groups
            </Link>
            <Link
              href='/farmers'
              className='block py-2 text-base font-medium text-foreground'
              onClick={toggleMenu}
            >
              Farmers
            </Link>
            <Link
              href='/about'
              className='block py-2 text-base font-medium text-foreground'
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link
              href='/faq'
              className='block py-2 text-base font-medium text-foreground'
              onClick={toggleMenu}
            >
              FAQ
            </Link>
            <Link
              href='/auth/signin'
              className='block py-2 text-base font-medium text-foreground'
              onClick={toggleMenu}
            >
              Sign In
            </Link>
            <Link
              href='/auth/signup'
              className='block py-2 text-base font-medium text-foreground'
              onClick={toggleMenu}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
