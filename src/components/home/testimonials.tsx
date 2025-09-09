'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: '1',
    name: 'Oluwaseun A.',
    role: 'Restaurant Owner',
    content:
      'AgriPool has transformed how I source ingredients for my restaurant. The produce is consistently fresh, and being able to join with other businesses for bulk purchases has reduced our costs significantly.',
    rating: 5,
    image: 'https://images.pexels.com/photos/3760958/pexels-photo-3760958.jpeg',
  },
  {
    id: '2',
    name: 'Chioma N.',
    role: 'Homemaker',
    content:
      "As someone who cooks for a large family, I've always struggled with getting consistent quality produce. With AgriPool, I can buy in bulk directly from verified farmers, and the quality is outstanding!",
    rating: 5,
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
  },
  {
    id: '3',
    name: 'Adekunle T.',
    role: 'Tomato Farmer',
    content:
      'Before AgriPool, I was at the mercy of middlemen who would offer unfair prices for my tomatoes. Now I can reach customers directly, set fair prices, and receive secure payments through the platform.',
    rating: 5,
    image: 'https://images.pexels.com/photos/2406949/pexels-photo-2406949.jpeg',
  },
  {
    id: '4',
    name: 'Blessing E.',
    role: 'Market Seller',
    content:
      'I source all my produce through AgriPool now. The transparent pricing and quality assurance have helped me build trust with my own customers. My business has grown 30% since I started using the platform!',
    rating: 4,
    image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg',
  },
  {
    id: '5',
    name: 'Ibrahim M.',
    role: 'Logistics Partner',
    content:
      'As a haulage partner on AgriPool, I have a steady stream of delivery jobs. The platform makes it easy to coordinate pickups and deliveries, and the payment system is reliable and transparent.',
    rating: 5,
    image: 'https://images.pexels.com/photos/3785074/pexels-photo-3785074.jpeg',
  },
];

export default function Testimonials() {

  return (
    <section className='bg-muted/30 py-16'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
            What Our Users Say
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-muted-foreground'>
            Hear from farmers, buyers, and logistics partners who are using AgriPool NG.
          </p>
        </div>

        <div className='mt-12 lg:mt-20'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {testimonials.slice(0, 3).map((testimonial) => (
              <Card key={testimonial.id} className='h-full'>
                <CardContent className='flex h-full flex-col justify-between p-6'>
                  <div>
                    <div className='flex gap-1 pb-4'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-muted text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <p className='text-foreground'>{testimonial.content}</p>
                  </div>
                  <div className='mt-6 flex items-center pt-4'>
                    <div className='h-10 w-10 overflow-hidden rounded-full'>
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className='ml-3'>
                      <div className='text-sm font-medium'>{testimonial.name}</div>
                      <div className='text-xs text-muted-foreground'>{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
