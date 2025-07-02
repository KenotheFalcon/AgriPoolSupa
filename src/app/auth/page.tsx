'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup, loading, forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: any) => {
    try {
      if (isLogin) {
        const { email, password } = data as LoginFormData;
        await login(email, password);
      } else {
        const { email, password, name } = data as SignupFormData;
        await signup(email, password, name);
      }
    } catch (error) {
      // Error is handled by the useAuth hook
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      const success = await forgotPassword(email);
      if (success) {
        toast.success('Password reset email sent. Please check your inbox.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send password reset email');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
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
          {/* Toggle Buttons */}
          <div className='flex space-x-4 mb-8'>
            <Button
              variant={isLogin ? 'default' : 'ghost'}
              className='flex-1'
              onClick={() => toggleMode()}
            >
              Login
            </Button>
            <Button
              variant={!isLogin ? 'default' : 'ghost'}
              className='flex-1'
              onClick={() => toggleMode()}
            >
              Sign Up
            </Button>
          </div>

          {/* Form */}
          <AnimatePresence mode='wait'>
            <motion.form
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit(onSubmit)}
              className='space-y-6'
            >
              {!isLogin && (
                <div className='space-y-2'>
                  <Label htmlFor='name'>Name</Label>
                  <div className='relative'>
                    <User className='absolute left-3 top-3 h-5 w-5 text-muted-foreground' />
                    <Input
                      id='name'
                      type='text'
                      placeholder='Enter your name'
                      className='pl-10'
                      {...register('name')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (
                      <p className='mt-1 text-sm text-red-500'>
                        {String(errors.name?.message || '')}
                      </p>
                    )}
                  </div>
                </div>
              )}

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <p className='mt-1 text-sm text-red-500'>
                      {String(errors.email?.message || '')}
                    </p>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-3 h-5 w-5 text-muted-foreground' />
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    className='pl-10'
                    {...register('password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-3 text-muted-foreground hover:text-foreground'
                  >
                    {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                  </button>
                  {errors.password && (
                    <p className='mt-1 text-sm text-red-500'>
                      {String(errors.password?.message || '')}
                    </p>
                  )}
                </div>
              </div>

              {isLogin && (
                <div className='flex items-center justify-end'>
                  <Link
                    href='/auth/forgot-password'
                    className='text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
              </Button>
            </motion.form>
          </AnimatePresence>

          {/* Social Login */}
          <div className='mt-8'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-200 dark:border-gray-700' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='bg-white dark:bg-background px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='mt-6 grid grid-cols-2 gap-3'>
              <Button variant='outline' className='w-full' disabled={loading}>
                Google
              </Button>
              <Button variant='outline' className='w-full' disabled={loading}>
                Facebook
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Terms and Privacy */}
        <p className='mt-8 text-center text-sm text-muted-foreground'>
          By continuing, you agree to our{' '}
          <Link
            href='/terms'
            className='text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href='/privacy'
            className='text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
