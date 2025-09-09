'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Calendar } from 'lucide-react';

const mockGroups = [
  {
    id: '1',
    name: 'Lagos Tomato Harvest',
    location: 'Ikorodu, Lagos',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
    product: 'Fresh Tomatoes',
    unitSize: '25kg basket',
    pricePerUnit: 12500,
    totalUnits: 50,
    remainingUnits: 15,
    closingDate: '2024-06-30',
    distance: 2.7,
  },
  {
    id: '2',
    name: 'Abeokuta Yam Connection',
    location: 'Abeokuta, Ogun',
    image: 'https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg',
    product: 'Yam Tubers',
    unitSize: '10 tubers',
    pricePerUnit: 28000,
    totalUnits: 40,
    remainingUnits: 5,
    closingDate: '2024-06-25',
    distance: 4.1,
  },
  {
    id: '3',
    name: 'Ibadan Rice Collective',
    location: 'Ibadan, Oyo',
    image: 'https://images.pexels.com/photos/1127000/pexels-photo-1127000.jpeg',
    product: 'Local Rice',
    unitSize: '50kg bag',
    pricePerUnit: 35000,
    totalUnits: 100,
    remainingUnits: 40,
    closingDate: '2024-07-15',
    distance: 3.8,
  },
  {
    id: '4',
    name: 'Akure Pepper Group',
    location: 'Akure, Ondo',
    image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg',
    product: 'Scotch Bonnet Peppers',
    unitSize: '10kg bag',
    pricePerUnit: 15000,
    totalUnits: 30,
    remainingUnits: 10,
    closingDate: '2024-07-05',
    distance: 1.5,
  },
];

export default function FeaturedGroups() {
  const [location] = useState('Lagos');

  return (
    <section className='bg-muted/30 py-16'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
            Featured Groups Near You
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-muted-foreground'>
            Join these active purchase groups to get fresh produce delivered directly from farms to
            your location.
          </p>
        </div>

        <div className='mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {mockGroups.map((group) => (
            <Card key={group.id} className='overflow-hidden transition-all hover:shadow-md'>
              <div className='aspect-video relative overflow-hidden'>
                <img src={group.image} alt={group.name} className='h-full w-full object-cover' />
                <div className='absolute top-2 right-2'>
                  <Badge variant='secondary' className='bg-background/80 backdrop-blur-sm'>
                    <MapPin className='mr-1 h-3 w-3' /> {group.distance} km
                  </Badge>
                </div>
              </div>
              <CardHeader className='pb-2'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h3 className='font-bold'>{group.name}</h3>
                    <p className='text-sm text-muted-foreground'>{group.location}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='pb-4 pt-2'>
                <div className='space-y-3'>
                  <div>
                    <div className='flex items-center justify-between text-sm'>
                      <span>
                        {group.product} • {group.unitSize}
                      </span>
                      <span className='font-medium'>₦{group.pricePerUnit.toLocaleString()}</span>
                    </div>
                    <div className='mt-2 space-y-1'>
                      <div className='flex items-center justify-between text-xs'>
                        <span className='text-muted-foreground'>
                          <Users className='mr-1 inline h-3 w-3' />
                          {group.totalUnits - group.remainingUnits}/{group.totalUnits} units filled
                        </span>
                        <span className='font-medium text-amber-600'>
                          {group.remainingUnits} left
                        </span>
                      </div>
                      <Progress
                        value={((group.totalUnits - group.remainingUnits) / group.totalUnits) * 100}
                        className='h-2'
                      />
                    </div>
                  </div>
                  <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
                    <Calendar className='h-3 w-3' />
                    <span>Closes {new Date(group.closingDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className='w-full'>
                  <Link href={`/groups/${group.id}`}>Join Group</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <Button asChild variant='outline' size='lg'>
            <Link href='/groups'>View All Groups Near {location}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
