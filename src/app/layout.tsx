import './globals.css';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/theme-provider';
import Navbar from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { AuthProvider } from '@/hooks/auth-provider';
import { NotificationOptIn } from '@/app/notifications/opt-in';
import { cn } from '@/lib/utils';
import { ServiceWorkerRegistrar } from '@/components/providers/service-worker-registrar';

export const metadata: Metadata = {
  title: 'AgriPool NG - Connect with Local Farmers',
  description: 'Buy fresh agricultural produce directly from verified local farmers in Nigeria',
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  fallback: ['system-ui', 'arial'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#28a745' />
        <link rel='icon' href='/icons/icon-192x192.png' />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <AuthProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <ServiceWorkerRegistrar />
            <div className='relative flex min-h-screen flex-col'>
              <Navbar />
              <div className='flex-1'>{children}</div>
              <div className='fixed bottom-4 right-4 z-50'>
                <NotificationOptIn />
              </div>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
