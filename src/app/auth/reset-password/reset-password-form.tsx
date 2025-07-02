'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams } from 'next/navigation';

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const { resetPassword, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      return;
    }
    try {
      await resetPassword(token, data.password);
    } catch (error) {
      // Error is handled by the useAuth hook
    }
  };

  if (!token) {
    return (
      <div className='w-full max-w-md'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-foreground'>Invalid Reset Link</h1>
          <p className='mt-2 text-muted-foreground'>
            This password reset link is invalid or has expired.
          </p>
          <Button asChild className='mt-6'>
            <Link href='/auth/forgot-password'>Request New Link</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-md'>
      {/* Logo/Brand */}
      <div className='text-center mb-8'>
        <Link href='/' className='text-2xl font-bold text-green-600 dark:text-green-400'>
          AgriPool
        </Link>
      </div>

      {/* Auth Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-white dark:bg-background rounded-lg shadow-lg p-8'
      >
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-bold text-foreground'>Reset Password</h1>
          <p className='mt-2 text-muted-foreground'>Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='password'>New Password</Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-3 h-5 w-5 text-muted-foreground' />
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter new password'
                className='pl-10'
                {...register('password')}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-3 text-muted-foreground hover:text-foreground'
              >
                {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
              </button>
              {errors.password && (
                <p className='mt-1 text-sm text-red-500'>{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-3 h-5 w-5 text-muted-foreground' />
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirm new password'
                className='pl-10'
                {...register('confirmPassword')}
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-3 top-3 text-muted-foreground hover:text-foreground'
              >
                {showConfirmPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
              </button>
              {errors.confirmPassword && (
                <p className='mt-1 text-sm text-red-500'>{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>

          <div className='text-center'>
            <Link
              href='/auth'
              className='text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
            >
              Back to Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
