import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/theme-provider';
import Navbar from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { AuthProvider } from '@/hooks/auth-provider';
import { NotificationOptIn } from '@/app/notifications/opt-in';
import { ErrorBoundary } from '@/components/error-boundary';
import { PerformanceMonitor } from '@/components/performance-monitor';
import { cn } from '@/lib/utils';
import { ServiceWorkerRegistrar } from '@/components/providers/service-worker-registrar';

export const metadata: Metadata = {
  title: 'AgriPool NG - Connect with Local Farmers',
  description: 'Buy fresh agricultural produce directly from verified local farmers in Nigeria. Supporting community-driven agriculture and sustainable farming practices.',
  keywords: ['agriculture', 'farming', 'Nigeria', 'fresh produce', 'local farmers', 'community', 'sustainable'],
  authors: [{ name: 'AgriPool NG Team' }],
  creator: 'AgriPool NG',
  publisher: 'AgriPool NG',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://agripool.ng'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AgriPool NG - Connect with Local Farmers',
    description: 'Buy fresh agricultural produce directly from verified local farmers in Nigeria',
    url: 'https://agripool.ng',
    siteName: 'AgriPool NG',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgriPool NG - Connect with Local Farmers',
    description: 'Buy fresh agricultural produce directly from verified local farmers in Nigeria',
    creator: '@agripoolng',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#22c55e' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='AgriPool NG' />
        <link rel='icon' href='/icons/icon-192x192.png' />
        <link rel='apple-touch-icon' href='/icons/icon-192x192.png' />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased', poppins.variable)}>
        <AuthProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <PerformanceMonitor />
            <ServiceWorkerRegistrar />
            <div className='relative flex min-h-screen flex-col'>
              <a 
                href='#main-content' 
                className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-green-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              >
                Skip to main content
              </a>
              <Navbar />
              <ErrorBoundary>
                <main id='main-content' className='flex-1' tabIndex={-1}>
                  {children}
                </main>
              </ErrorBoundary>
              <div className='fixed bottom-4 right-4 z-50' role='complementary' aria-label='Notifications'>
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
