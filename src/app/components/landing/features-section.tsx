'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Feature {
  image: {
    path: string;
    alt: string;
    placeholderSrc?: string;
  };
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  title: string;
  description: string;
  features: Feature[];
}

export default function FeaturesSection({ title, description, features }: FeaturesSectionProps) {
  return (
    <section className='py-16 md:py-24 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>{title}</h2>
          <p className='text-lg text-gray-600'>{description}</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <Card key={index} className='overflow-hidden'>
              <div className='aspect-square relative'>
                <OptimizedImage
                  src={feature.image.path}
                  alt={feature.image.alt}
                  fill
                  className='object-cover'
                />
              </div>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
