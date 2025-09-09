'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { forgotPassword, loading } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by the useAuth hook
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background px-4'>
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
            <h1 className='text-2xl font-bold text-foreground'>Forgot Password</h1>
            <p className='mt-2 text-muted-foreground'>
              Enter your email address and we&apos;ll send you instructions to reset your password.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-3 h-5 w-5 text-muted-foreground' />
                  <Input
                    id='email'
                    type='email'
                    placeholder='Enter your email'
                    className='pl-10'
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className='mt-1 text-sm text-red-500'>{errors.email.message}</p>
                  )}
                </div>
              </div>

              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Instructions'}
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
          ) : (
            <div className='text-center space-y-6'>
              <div className='rounded-full bg-green-100 dark:bg-green-900 p-3 w-16 h-16 mx-auto flex items-center justify-center'>
                <Mail className='h-8 w-8 text-green-600 dark:text-green-400' />
              </div>
              <div>
                <h2 className='text-xl font-semibold text-foreground'>Check Your Email</h2>
                <p className='mt-2 text-muted-foreground'>
                  We&apos;ve sent password reset instructions to your email address.
                </p>
              </div>
              <Button asChild variant='outline' className='w-full'>
                <Link href='/auth'>Back to Login</Link>
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
