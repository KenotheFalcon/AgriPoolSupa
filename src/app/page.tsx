import { Suspense, lazy } from 'react';
import { OptimizedLoader } from '@/components/layout/performance-layout';

// Lazy load non-critical components
const HeroSection = lazy(() => import('@/app/components/landing/hero-section'));
const HowItWorksSection = lazy(() => import('@/components/landing/how-it-works-section').then(mod => ({ default: mod.HowItWorksSection })));
const FeaturesSection = lazy(() => import('@/app/components/landing/features-section'));
const CTASection = lazy(() => import('@/app/components/landing/cta-section'));

// Loading skeletons
const HeroSkeleton = () => <div className="h-96 bg-gradient-to-br from-green-50 to-blue-50 animate-pulse" />;
const SectionSkeleton = () => <div className="h-64 bg-muted animate-pulse rounded-lg mx-4 my-8" />;

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-green-950 dark:via-background dark:to-blue-950'>
      {/* Critical above-the-fold content */}
      <OptimizedLoader priority>
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSection 
            image={{ path: '/images/hero-bg.jpg', alt: 'Fresh produce' }}
            title="Connect with Local Farmers"
            description="Buy fresh, quality produce directly from verified local farmers in your area"
            ctaText="Get Started"
            ctaLink="/auth/signup"
          />
        </Suspense>
      </OptimizedLoader>

      {/* Below-the-fold content - lazy loaded */}
      <Suspense fallback={<SectionSkeleton />}>
        <HowItWorksSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <FeaturesSection 
          title="Why Choose AgriPool"
          description="Direct from farm to table"
          features={[
            {
              image: { path: '/images/fresh-produce.jpg', alt: 'Fresh produce' },
              title: 'Fresh Quality',
              description: 'Get the freshest produce directly from local farmers'
            },
            {
              image: { path: '/images/fair-prices.jpg', alt: 'Fair prices' },
              title: 'Fair Prices',
              description: 'Support farmers and save money with our direct trade model'
            },
            {
              image: { path: '/images/community.jpg', alt: 'Community' },
              title: 'Strong Community',
              description: 'Build connections with farmers and neighbors in your area'
            }
          ]}
        />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <CTASection 
          image={{ path: '/images/cta-bg.jpg', alt: 'Join us' }}
          title="Ready to Get Started?"
          description="Join thousands of people connecting with local farmers"
          ctaText="Sign Up Today"
          ctaLink="/auth/signup"
        />
      </Suspense>
    </div>
  );
}
