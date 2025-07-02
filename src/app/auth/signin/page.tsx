import { Suspense } from 'react';
import { SignInForm } from './signin-form';

export default function SignInPage() {
  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
