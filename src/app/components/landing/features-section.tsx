'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Truck, Users, Leaf, DollarSign, Shield } from 'lucide-react';

interface Feature {
  image: {
    path: string;
    alt: string;
    placeholderSrc?: string;
  };
  title: string;
  description: string;
  icon?: string;
}

interface FeaturesSectionProps {
  title: string;
  description: string;
  features: Feature[];
}

// Icon mapping for features
const iconMap = {
  'Fresh Quality': Leaf,
  'Fair Prices': DollarSign, 
  'Strong Community': Users,
  'Fast Delivery': Truck,
  'Quality Assured': CheckCircle,
  'Secure Payments': Shield,
};

export default function FeaturesSection({ title, description, features }: FeaturesSectionProps) {
  return (
    <section 
      id='features'
      className='py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-neutralLight to-white'
      role='region'
      aria-labelledby='features-title'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header - Mobile First */}
        <div className='text-center max-w-3xl mx-auto mb-12 lg:mb-16'>
          <h2 
            id='features-title'
            className='text-2xl font-bold text-foreground mb-4
                       sm:text-3xl sm:mb-6
                       md:text-4xl
                       lg:text-4xl
                       leading-tight tracking-tight'
          >
            {title}
          </h2>
          <p className='text-base text-muted-foreground leading-relaxed
                       sm:text-lg
                       md:text-xl
                       lg:text-xl'>
            {description}
          </p>
        </div>

        {/* Features Grid - Mobile First Responsive */}
        <div className='grid gap-6 
                       sm:gap-8 sm:grid-cols-2
                       lg:gap-8 lg:grid-cols-3'>
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.title as keyof typeof iconMap] || CheckCircle;
            
            return (
              <Card 
                key={index} 
                className='group overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
              >
                {/* Feature Icon/Image */}
                <div className='aspect-video relative bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-6'>
                  {feature.image.path && feature.image.path !== '/images/fresh-produce-green.svg' ? (
                    <OptimizedImage
                      src={feature.image.path}
                      alt={feature.image.alt}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  ) : (
                    <IconComponent 
                      className='w-16 h-16 sm:w-20 sm:h-20 text-primary group-hover:text-accent transition-colors duration-300' 
                      aria-hidden='true'
                    />
                  )}
                </div>
                
                {/* Feature Content */}
                <CardHeader className='pb-2'>
                  <CardTitle className='text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300'>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-0 pb-6'>
                  <CardDescription className='text-sm sm:text-base text-muted-foreground leading-relaxed'>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className='text-center mt-12 lg:mt-16'>
          <p className='text-sm sm:text-base text-muted-foreground mb-4'>
            Join thousands of satisfied customers connecting with local farmers
          </p>
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center'>
            <div className='flex items-center gap-1 text-primary'>
              <CheckCircle className='w-5 h-5' aria-hidden='true' />
              <span className='text-sm sm:text-base font-medium'>Verified Farmers</span>
            </div>
            <div className='flex items-center gap-1 text-primary'>
              <CheckCircle className='w-5 h-5' aria-hidden='true' />
              <span className='text-sm sm:text-base font-medium'>Fresh Produce</span>
            </div>
            <div className='flex items-center gap-1 text-primary'>
              <CheckCircle className='w-5 h-5' aria-hidden='true' />
              <span className='text-sm sm:text-base font-medium'>Fair Pricing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
