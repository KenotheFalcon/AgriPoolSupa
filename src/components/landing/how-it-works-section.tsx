import { Upload, Users, Package } from 'lucide-react';

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
    <section className='py-24 bg-white dark:bg-gray-900'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
            How AgriPool Works
          </h2>
          <p className='mt-4 text-lg text-gray-600 dark:text-gray-300'>
            Our simple 3-step process makes buying and selling fresh produce effortless
          </p>
        </div>

        {/* Steps */}
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-3'>
          {steps.map((step, index) => (
            <div key={step.title} className='relative'>
              {/* Step Number */}
              <div className='absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white font-bold text-lg'>
                {index + 1}
              </div>

              {/* Step Content */}
              <div className='relative rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 p-8 dark:from-green-950/50 dark:to-blue-950/50 border border-green-100 dark:border-green-800'>
                <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-green-600 text-white'>
                  <step.icon className='h-8 w-8' />
                </div>

                <h3 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  {step.title}
                </h3>

                <p className='mb-4 text-gray-600 dark:text-gray-300'>{step.description}</p>

                <p className='text-sm text-gray-500 dark:text-gray-400'>{step.details}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className='absolute top-1/2 -right-6 hidden h-0.5 w-12 bg-gradient-to-r from-green-600 to-blue-600 lg:block' />
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className='mt-16 text-center'>
          <div className='rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 p-8 text-white'>
            <h3 className='text-2xl font-bold mb-4'>Ready to Get Started?</h3>
            <p className='text-green-100 mb-6'>
              Join thousands of farmers and consumers who are already benefiting from our platform
            </p>
            <div className='flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center'>
              <a
                href='/auth/signup?role=buyer'
                className='inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-green-700 font-semibold hover:bg-green-50 transition-colors'
              >
                Start Buying
              </a>
              <a
                href='/auth/signup?role=farmer'
                className='inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 text-white font-semibold hover:bg-white hover:text-green-700 transition-colors'
              >
                Start Selling
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
