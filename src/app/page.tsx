import { Suspense } from 'react';
import HeroSection from '@/app/components/landing/hero-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import FeaturesSection from '@/app/components/landing/features-section';
import CTASection from '@/app/components/landing/cta-section';
import { Footer } from '@/components/layout/footer';
import { 
  HeroSectionSkeleton, 
  FeaturesSectionSkeleton, 
  CTASectionSkeleton 
} from '@/app/components/landing/loading-sections';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-green-950 dark:via-background dark:to-blue-950'>
      {/* Hero Section */}
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection 
          image={{ path: '/images/hero-bg.jpg', alt: 'Fresh produce' }}
          title="Connect with Local Farmers"
          description="Buy fresh, quality produce directly from verified local farmers in your area"
          ctaText="Get Started"
          ctaLink="/auth/signup"
        />
      </Suspense>

      {/* How It Works Section */}
      <Suspense fallback={<div>Loading...</div>}>
        <HowItWorksSection />
      </Suspense>

      {/* Features Section */}
      <Suspense fallback={<FeaturesSectionSkeleton />}>
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

      {/* CTA Section */}
      <Suspense fallback={<CTASectionSkeleton />}>
        <CTASection 
          image={{ path: '/images/cta-bg.jpg', alt: 'Join us' }}
          title="Ready to Get Started?"
          description="Join thousands of people connecting with local farmers"
          ctaText="Sign Up Today"
          ctaLink="/auth/signup"
        />
      </Suspense>

      {/* Footer */}
      <Footer />
    </div>
  );
}
