import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Truck, ShoppingBag } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Discover Local Groups',
      description: 'Search for agricultural product groups in your area within a 5km radius.',
      icon: <MapPin className='h-10 w-10 text-green-600 dark:text-green-400' />,
    },
    {
      title: 'Join Purchase Groups',
      description:
        'Reserve units in a group at fixed prices and track funding progress in real-time.',
      icon: <Users className='h-10 w-10 text-green-600 dark:text-green-400' />,
    },
    {
      title: 'Secure Payment & Escrow',
      description:
        'Make secure payments through Flutterwave escrow, protecting both buyers and farmers.',
      icon: <ShoppingBag className='h-10 w-10 text-green-600 dark:text-green-400' />,
    },
    {
      title: 'Delivery To Your Location',
      description:
        'Receive your fresh produce directly to your doorstep once the group is fully funded.',
      icon: <Truck className='h-10 w-10 text-green-600 dark:text-green-400' />,
    },
  ];

  return (
    <section className='bg-background py-16'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
            How AgriPool Works
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-muted-foreground'>
            Connect with local farmers and get fresh produce through a secure, transparent process.
          </p>
        </div>

        <div className='mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {steps.map((step, index) => (
            <Card key={index} className='border-2 border-border bg-background'>
              <CardHeader className='flex flex-col items-center text-center'>
                <div className='mb-2 rounded-full bg-green-50 p-3 dark:bg-green-900/20'>
                  {step.icon}
                </div>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent className='text-center'>
                <CardDescription className='text-sm text-muted-foreground'>
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='mt-16 flex justify-center'>
          <iframe
            width='560'
            height='315'
            src='https://www.youtube.com/embed/dQw4w9WgXcQ'
            title='How AgriPool Works'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            className='aspect-video w-full max-w-2xl rounded-xl shadow-lg'
          ></iframe>
        </div>
      </div>
    </section>
  );
}
