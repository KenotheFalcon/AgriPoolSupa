'use client';

import { OptimizedImage } from '@/components/ui/optimized-image';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  image: {
    path: string;
    alt: string;
  };
  name: string;
  role: string;
  content: string;
}

interface TestimonialsSectionProps {
  title: string;
  description: string;
  testimonials: Testimonial[];
}

export default function TestimonialsSection({
  title,
  description,
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <section className='py-16 md:py-24 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>{title}</h2>
          <p className='text-lg text-gray-600'>{description}</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {testimonials.map((testimonial, index) => (
            <Card key={index} className='relative'>
              <CardContent className='pt-6'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='relative w-12 h-12 rounded-full overflow-hidden'>
                    <OptimizedImage
                      src={testimonial.image.path}
                      alt={testimonial.image.alt}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <h3 className='font-semibold'>{testimonial.name}</h3>
                    <p className='text-sm text-gray-500'>{testimonial.role}</p>
                  </div>
                </div>
                <p className='text-gray-600'>{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
