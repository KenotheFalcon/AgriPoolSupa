import { requireAuth } from '@/lib/auth/server';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, Calendar } from 'lucide-react';
import { PickupConfirmation } from './pickup-confirmation';
import { Timestamp } from 'firebase-admin/firestore';
import DynamicDisplayMap from '@/app/components/maps/dynamic-display-map';
import { ReviewForm } from '@/app/reviews/review-form';

interface Order {
  id: string;
  userId: string;
  groupId: string;
  listingId: string;
  quantity: number;
  totalPrice: number;
  status: string;
}

interface GroupBuy {
  id: string;
  status: string;
}

interface Listing {
  id: string;
  farmerId: string;
  produceName: string;
  unitDescription: string;
  pickupLocation: string;
  deliveryDate: Timestamp;
}

async function getOrderDetails(
  orderId: string,
  userId: string
): Promise<{ order: Order; group: GroupBuy; listing: Listing } | null> {
  const db = await getAdminFirestore();
  const orderRef = db.collection('orders').doc(orderId);
  const orderDoc = await orderRef.get();

  if (!orderDoc.exists || orderDoc.data()?.userId !== userId) {
    return null;
  }

  const orderData = { id: orderDoc.id, ...orderDoc.data() } as Order;

  const groupRef = db.collection('groupBuys').doc(orderData.groupId);
  const groupDoc = await groupRef.get();
  if (!groupDoc.exists) return null;

  const groupData = { id: groupDoc.id, ...groupDoc.data() } as GroupBuy;

  const listingRef = db.collection('produceListings').doc(orderData.listingId);
  const listingDoc = await listingRef.get();
  if (!listingDoc.exists) return null;

  const listingData = { id: listingDoc.id, ...listingDoc.data() } as Listing;

  const reviewRef = db
    .collection('users')
    .doc(listingData.farmerId)
    .collection('reviews')
    .doc(orderId);
  const reviewDoc = await reviewRef.get();

  return {
    order: orderData,
    group: groupData,
    listing: listingData,
    hasReviewed: reviewDoc.exists,
  };
}

export default async function PickupPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await requireAuth();
  const orderId = searchParams.orderId as string;

  if (!orderId) {
    redirect('/dashboard');
  }

  const details = await getOrderDetails(orderId, user.uid);

  if (!details) {
    return (
      <div className='container mx-auto py-8'>
        <Alert variant='destructive'>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Order not found or you do not have permission to view it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { order, group, listing, hasReviewed } = details;

  const isCompleted = order.status === 'completed';
  const canConfirm = group.status === 'pending_delivery' && !isCompleted;
  const canReview = isCompleted && !hasReviewed;

  return (
    <div className='container mx-auto py-8 max-w-4xl'>
      <Card>
        <CardHeader>
          <CardTitle className='text-3xl'>Pickup Instructions</CardTitle>
          <CardDescription>
            For your order of {order.quantity} unit(s) of {listing.produceName}.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <h3 className='font-semibold text-lg'>Location & Date</h3>
              <div className='flex items-start gap-3'>
                <MapPin className='h-5 w-5 mt-1 text-muted-foreground' />
                <div>
                  <p className='font-medium'>{listing.pickupLocation}</p>
                  <p className='text-sm text-muted-foreground'>
                    Please arrive at the designated pickup point.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <Calendar className='h-5 w-5 mt-1 text-muted-foreground' />
                <div>
                  <p className='font-medium'>
                    {new Date(listing.deliveryDate.seconds * 1000).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    This is the delivery date set by the farmer.
                  </p>
                </div>
              </div>
            </div>
            <div className='space-y-4'>
              <h3 className='font-semibold text-lg'>Your Order</h3>
              <div className='flex items-center justify-between p-3 bg-muted rounded-md'>
                <span>Quantity</span>
                <span className='font-bold'>
                  {order.quantity} {listing.unitDescription}
                </span>
              </div>
              <div className='flex items-center justify-between p-3 bg-muted rounded-md'>
                <span>Total Price</span>
                <span className='font-bold'>₦{order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Alert>
            <AlertTitle>Important Instructions</AlertTitle>
            <AlertDescription>
              <ul className='list-disc pl-5 mt-2 space-y-1'>
                <li>Bring a copy of your order confirmation (digital or printed).</li>
                <li>Inspect your produce upon pickup to ensure quality.</li>
                <li>
                  Once you have received your items, please press the confirmation button below.
                </li>
                <li>
                  Funds will only be released to the farmer after all members of the group have
                  confirmed receipt.
                </li>
                <li>After confirming, you will be able to leave a review for the farmer.</li>
              </ul>
            </AlertDescription>
          </Alert>

          {isCompleted ? (
            <div className='p-4 text-center bg-green-100 text-green-800 rounded-lg'>
              <h3 className='font-bold'>You have confirmed receipt for this order. Thank you!</h3>
            </div>
          ) : canConfirm ? (
            <PickupConfirmation orderId={order.id} groupId={group.id} />
          ) : (
            <div className='p-4 text-center bg-yellow-100 text-yellow-800 rounded-lg'>
              <h3 className='font-bold'>Waiting for farmer to dispatch.</h3>
              <p>You can confirm receipt once the group status is &quot;Pending Delivery&quot;.</p>
            </div>
          )}

          {canReview && (
            <ReviewForm orderId={order.id} farmerId={listing.farmerId} groupId={group.id} />
          )}
          {isCompleted && hasReviewed && (
            <div className='p-4 mt-4 text-center bg-blue-100 text-blue-800 rounded-lg'>
              <h3 className='font-bold'>You have already left a review for this order.</h3>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
