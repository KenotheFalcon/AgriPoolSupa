import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/theme-provider';
import Navbar from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { AuthProvider } from '@/hooks/auth-provider';
import { NotificationOptIn } from '@/app/notifications/opt-in';
import { cn } from '@/lib/utils';
import { ServiceWorkerRegistrar } from '@/components/providers/service-worker-registrar';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'AgriPool NG - Connect with Local Farmers',
  description: 'Buy fresh agricultural produce directly from verified local farmers in Nigeria',
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#28a745',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='icon' href='/icons/icon-192x192.png' />
        <link rel='preload' href='/icons/icon-192x192.png' as='image' />
        <link rel='dns-prefetch' href='https://firebasestorage.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <AuthProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <ServiceWorkerRegistrar />
            <div className='relative flex min-h-screen flex-col'>
              <Suspense fallback={<div className="h-16 bg-background" />}>
                <Navbar />
              </Suspense>
              <main className='flex-1'>
                <Suspense fallback={<div className="min-h-[50vh] bg-muted animate-pulse" />}>
                  {children}
                </Suspense>
              </main>
              <Suspense fallback={null}>
                <div className='fixed bottom-4 right-4 z-50'>
                  <NotificationOptIn />
                </div>
              </Suspense>
              <Suspense fallback={<div className="h-32 bg-muted" />}>
                <Footer />
              </Suspense>
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
