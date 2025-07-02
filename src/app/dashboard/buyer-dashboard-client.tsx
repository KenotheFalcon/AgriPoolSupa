'use client';

import { useState } from 'react';
import { ServerUser } from '@/lib/auth/server';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { GroupBuyModal } from './group-buy-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MyOrders } from './my-orders';
import { Star } from 'lucide-react';

function FarmerRating({ rating, reviewCount }: { rating?: number; reviewCount?: number }) {
  if (!rating || !reviewCount) return null;

  return (
    <div className='flex items-center gap-1 text-sm text-muted-foreground'>
      <Star className='h-4 w-4 text-yellow-400 fill-yellow-400' />
      <span>{rating.toFixed(1)}</span>
      <span>({reviewCount} reviews)</span>
    </div>
  );
}

export function BuyerDashboardClient({
  user,
  listingsWithGroups,
  ordersWithDetails,
}: {
  user: ServerUser;
  listingsWithGroups: any[];
  ordersWithDetails: any[];
}) {
  const [selectedListing, setSelectedListing] = useState<any>(null);

  return (
    <Tabs defaultValue='browse'>
      <TabsList>
        <TabsTrigger value='browse'>Browse Produce</TabsTrigger>
        <TabsTrigger value='orders'>My Orders</TabsTrigger>
      </TabsList>

      <TabsContent value='browse'>
        <div className='mt-6'>
          {listingsWithGroups.length === 0 ? (
            <p>No available produce listings at the moment. Check back soon!</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {listingsWithGroups.map((listing) => (
                <Card key={listing.id} className='flex flex-col'>
                  <CardHeader>
                    <div className='flex justify-between items-start'>
                      <div>
                        <CardTitle>{listing.produceName}</CardTitle>
                        <CardDescription>Sold by {listing.farmerName}</CardDescription>
                      </div>
                      <FarmerRating
                        rating={listing.farmerAverageRating}
                        reviewCount={listing.farmerReviewCount}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className='flex-grow'>
                    <div className='flex justify-between items-center mb-4'>
                      <span className='text-2xl font-bold text-green-600'>
                        ₦{listing.pricePerUnit.toLocaleString()}
                      </span>
                      <span className='text-sm text-muted-foreground'>
                        per {listing.unitDescription}
                      </span>
                    </div>

                    <div className='space-y-2'>
                      <p>
                        <strong>Delivery by:</strong>{' '}
                        {new Date(listing.deliveryDate.seconds * 1000).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Units left:</strong> {listing.quantityAvailable}
                      </p>
                    </div>

                    {listing.activeGroup ? (
                      <div className='mt-4'>
                        <p className='text-sm font-semibold mb-1'>Active Group Buy:</p>
                        <Progress
                          value={
                            (listing.activeGroup.quantityFunded /
                              listing.activeGroup.totalQuantity) *
                            100
                          }
                          className='w-full'
                        />
                        <p className='text-xs text-muted-foreground mt-1'>
                          {listing.activeGroup.quantityFunded} of{' '}
                          {listing.activeGroup.totalQuantity} units funded
                        </p>
                      </div>
                    ) : (
                      <div className='mt-4'>
                        <Badge variant='outline'>No active group buys</Badge>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className='w-full' onClick={() => setSelectedListing(listing)}>
                      View Details & Join
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value='orders'>
        <MyOrders ordersWithDetails={ordersWithDetails} />
      </TabsContent>

      {selectedListing && (
        <GroupBuyModal
          listing={selectedListing}
          isOpen={!!selectedListing}
          onClose={() => setSelectedListing(null)}
          user={user}
        />
      )}
    </Tabs>
  );
}
