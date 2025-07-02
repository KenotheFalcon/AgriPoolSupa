'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Farmer {
  image: {
    path: string;
    alt: string;
  };
  name: string;
  location: string;
  crops: string[];
  rating: number;
}

interface FarmersSectionProps {
  title: string;
  description: string;
  farmers: Farmer[];
  ctaText: string;
  ctaLink: string;
}

export default function FarmersSection({
  title,
  description,
  farmers,
  ctaText,
  ctaLink,
}: FarmersSectionProps) {
  return (
    <section className='py-16 md:py-24'>
      <div className='container mx-auto px-4'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>{title}</h2>
          <p className='text-lg text-gray-600'>{description}</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          {farmers.map((farmer, index) => (
            <Card key={index} className='overflow-hidden'>
              <div className='aspect-[4/3] relative'>
                <OptimizedImage
                  src={farmer.image.path}
                  alt={farmer.image.alt}
                  fill
                  className='object-cover'
                />
              </div>
              <CardContent className='pt-6'>
                <h3 className='text-xl font-semibold mb-2'>{farmer.name}</h3>
                <p className='text-gray-500 mb-4'>{farmer.location}</p>
                <div className='flex flex-wrap gap-2 mb-4'>
                  {farmer.crops.map((crop, i) => (
                    <span
                      key={i}
                      className='px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm'
                    >
                      {crop}
                    </span>
                  ))}
                </div>
                <div className='flex items-center'>
                  <span className='text-yellow-400'>★</span>
                  <span className='ml-1 text-gray-600'>{farmer.rating.toFixed(1)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='text-center'>
          <Button asChild size='lg'>
            <Link href={ctaLink}>{ctaText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
