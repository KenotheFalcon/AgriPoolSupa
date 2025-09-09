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

export const metadata: Metadata = {
  title: 'AgriPool NG - Connect with Local Farmers',
  description: 'Buy fresh agricultural produce directly from verified local farmers in Nigeria',
  keywords: 'agriculture, farmers, fresh produce, Nigeria, marketplace, local farming',
  authors: [{ name: 'AgriPool NG' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'AgriPool NG - Connect with Local Farmers',
    description: 'Buy fresh agricultural produce directly from verified local farmers in Nigeria',
    type: 'website',
    locale: 'en_US',
    siteName: 'AgriPool NG',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgriPool NG - Connect with Local Farmers',
    description: 'Buy fresh agricultural produce directly from verified local farmers in Nigeria',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#28a745' />
        <link rel='icon' href='/icons/icon-192x192.png' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='AgriPool NG' />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'AgriPool NG',
              description: 'Buy fresh agricultural produce directly from verified local farmers in Nigeria',
              url: 'https://agripool.ng',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://agripool.ng/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
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
              <Navbar />
              <main className='flex-1' role='main'>{children}</main>
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
