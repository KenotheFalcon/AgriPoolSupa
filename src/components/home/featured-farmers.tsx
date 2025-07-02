import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Check, MapPin } from 'lucide-react';

const farmers = [
  {
    id: '1',
    name: 'Adebayo Farms',
    image: 'https://images.pexels.com/photos/2382997/pexels-photo-2382997.jpeg',
    location: 'Ikorodu, Lagos',
    specialty: 'Tomatoes, Peppers, Vegetables',
    rating: 4.8,
    verified: true,
    products: 12,
    trustScore: 9.2,
  },
  {
    id: '2',
    name: 'Oluwaseun Agricultural Co.',
    image: 'https://images.pexels.com/photos/2382994/pexels-photo-2382994.jpeg',
    location: 'Abeokuta, Ogun',
    specialty: 'Yams, Cassava',
    rating: 4.7,
    verified: true,
    products: 8,
    trustScore: 8.9,
  },
  {
    id: '3',
    name: 'Sunshine Harvest Ltd',
    image:
      'https://images.pexels.com/photos/16035690/pexels-photo-16035690/free-photo-of-a-farmer-standing-in-a-field.jpeg',
    location: 'Ibadan, Oyo',
    specialty: 'Rice, Beans, Grains',
    rating: 4.9,
    verified: true,
    products: 15,
    trustScore: 9.5,
  },
  {
    id: '4',
    name: 'Green Acres Nigeria',
    image: 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg',
    location: 'Akure, Ondo',
    specialty: 'Peppers, Spices, Herbs',
    rating: 4.6,
    verified: true,
    products: 9,
    trustScore: 8.7,
  },
];

export default function FeaturedFarmers() {
  return (
    <section className='bg-background py-16'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
            Meet Our Verified Farmers
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-muted-foreground'>
            All farmers on our platform are verified with NIN/BVN and maintain high quality
            standards.
          </p>
        </div>

        <div className='mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {farmers.map((farmer) => (
            <Card key={farmer.id} className='overflow-hidden transition-all hover:shadow-md'>
              <div className='aspect-square relative overflow-hidden'>
                <img src={farmer.image} alt={farmer.name} className='h-full w-full object-cover' />
                <div className='absolute top-2 right-2'>
                  {farmer.verified && (
                    <Badge className='bg-green-600 text-white'>
                      <Check className='mr-1 h-3 w-3' /> Verified
                    </Badge>
                  )}
                </div>
              </div>
              <CardHeader className='pb-2'>
                <div>
                  <h3 className='font-bold'>{farmer.name}</h3>
                  <div className='flex items-center space-x-1 text-sm text-muted-foreground'>
                    <MapPin className='h-3 w-3' />
                    <span>{farmer.location}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-3 pb-4 pt-2'>
                <div>
                  <div className='text-sm font-medium'>Specializes in:</div>
                  <div className='text-sm text-muted-foreground'>{farmer.specialty}</div>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <Star className='mr-1 h-4 w-4 fill-amber-400 text-amber-400' />
                    <span className='font-medium'>{farmer.rating}</span>
                    <span className='ml-1 text-xs text-muted-foreground'>rating</span>
                  </div>
                  <div>
                    <span className='font-medium'>{farmer.products}</span>
                    <span className='ml-1 text-xs text-muted-foreground'>products</span>
                  </div>
                  <div>
                    <span className='font-medium'>{farmer.trustScore}</span>
                    <span className='ml-1 text-xs text-muted-foreground'>trust score</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant='outline' className='w-full'>
                  <Link href={`/farmers/${farmer.id}`}>View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <Button asChild variant='outline' size='lg'>
            <Link href='/farmers'>View All Farmers</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
