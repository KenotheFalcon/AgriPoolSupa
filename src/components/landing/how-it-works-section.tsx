import { Upload, Users, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const steps = [
  {
    icon: Upload,
    title: 'Post',
    description:
      'Farmers post their available produce with prices, quantities, and pickup locations.',
    details:
      'Easy-to-use interface for farmers to list their harvest, set competitive prices, and specify delivery options.',
  },
  {
    icon: Users,
    title: 'Pool',
    description: 'Consumers browse and join purchase groups to meet minimum order requirements.',
    details:
      'Smart grouping system that connects buyers with similar preferences and locations for better deals.',
  },
  {
    icon: Package,
    title: 'Pickup',
    description: 'Fresh produce is delivered to designated pickup points or directly to consumers.',
    details:
      'Flexible delivery options including community pickup points, home delivery, and scheduled collections.',
  },
];

export function HowItWorksSection() {
  return (
    <section 
      className='py-12 sm:py-16 md:py-20 lg:py-24 bg-background'
      role='region'
      aria-labelledby='how-it-works-title'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header - Mobile First */}
        <div className='text-center mb-12 lg:mb-16'>
          <h2 
            id='how-it-works-title'
            className='text-2xl font-bold text-foreground mb-4
                       sm:text-3xl sm:mb-6
                       md:text-4xl
                       lg:text-4xl
                       leading-tight tracking-tight'
          >
            How AgriPool Works
          </h2>
          <p className='text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto
                       sm:text-lg
                       md:text-xl'>
            Our simple 3-step process makes buying and selling fresh produce effortless
          </p>
        </div>

        {/* Steps Grid - Mobile First Responsive */}
        <div className='grid gap-8 
                       sm:gap-12
                       lg:grid-cols-3 lg:gap-8'>
          {steps.map((step, index) => (
            <div key={step.title} className='relative group'>
              {/* Step Number Badge */}
              <div className='absolute -top-3 -left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-base
                             sm:h-12 sm:w-12 sm:text-lg'>
                {index + 1}
              </div>

              {/* Step Card */}
              <div className='relative rounded-lg bg-card border border-border p-6 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1
                             sm:p-8
                             sm:rounded-xl'>
                {/* Step Icon */}
                <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground
                               sm:h-16 sm:w-16 
                               group-hover:scale-110 transition-transform duration-300'>
                  <step.icon className='h-7 w-7 sm:h-8 sm:w-8' aria-hidden='true' />
                </div>

                {/* Step Title */}
                <h3 className='mb-4 text-xl font-bold text-foreground
                              sm:text-2xl
                              group-hover:text-primary transition-colors duration-300'>
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className='mb-4 text-sm text-muted-foreground leading-relaxed
                              sm:text-base'>
                  {step.description}
                </p>

                {/* Step Details */}
                <p className='text-xs text-muted-foreground/80 leading-relaxed
                              sm:text-sm'>
                  {step.details}
                </p>
              </div>

              {/* Connector Arrow - Desktop Only */}
              {index < steps.length - 1 && (
                <div className='absolute top-1/2 -right-4 z-0 hidden lg:flex items-center justify-center'>
                  <ArrowRight className='h-8 w-8 text-primary/40' aria-hidden='true' />
                </div>
              )}
              
              {/* Connector for Mobile - Vertical */}
              {index < steps.length - 1 && (
                <div className='flex justify-center my-8 lg:hidden'>
                  <div className='h-8 w-0.5 bg-gradient-to-b from-primary to-accent'></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className='mt-16 lg:mt-20'>
          <div className='rounded-xl bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground
                         sm:p-8 sm:rounded-2xl'>
            <div className='text-center'>
              <h3 className='text-xl font-bold mb-4 sm:text-2xl'>
                Ready to Get Started?
              </h3>
              <p className='text-primary-foreground/90 mb-6 text-sm leading-relaxed max-w-2xl mx-auto
                           sm:text-base'>
                Join thousands of farmers and consumers who are already benefiting from our platform
              </p>
              
              {/* CTA Buttons - Mobile First */}
              <div className='flex flex-col space-y-3 
                             sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center'>
                <Button 
                  asChild 
                  variant='secondary'
                  size='lg'
                  className='bg-white text-primary hover:bg-white/90 font-semibold px-6 py-3
                            sm:px-8 sm:py-4'
                >
                  <Link href='/auth/signup?role=buyer'>
                    Start Buying
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant='outline'
                  size='lg'
                  className='border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold px-6 py-3
                            sm:px-8 sm:py-4'
                >
                  <Link href='/auth/signup?role=farmer'>
                    Start Selling
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
