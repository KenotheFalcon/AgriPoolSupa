import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { createFlutterwaveClient } from '@/lib/flutterwave-client';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tx_ref = searchParams.get('tx_ref');
  const transaction_id = searchParams.get('transaction_id');
  const status = searchParams.get('status');

  if (status === 'cancelled') {
    // Handle cancelled payment
    // Maybe redirect to a "payment cancelled" page
    return NextResponse.redirect(new URL('/dashboard?payment_status=cancelled', request.url));
  }

  if (!tx_ref || !transaction_id || status !== 'successful') {
    return NextResponse.json({ error: 'Invalid payment verification request' }, { status: 400 });
  }

  try {
    const flutterwave = createFlutterwaveClient(process.env.FLUTTERWAVE_SECRET_KEY!);
    const response = await flutterwave.verifyTransaction(transaction_id);

    if (
      response.status === 'success' &&
      response.data.status === 'successful' &&
      response.data.tx_ref === tx_ref
    ) {
      const db = await getAdminFirestore();
      const orderQuery = await db.collection('orders').where('tx_ref', '==', tx_ref).limit(1).get();

      if (orderQuery.empty) {
        throw new Error('Order not found for this transaction reference.');
      }

      const orderDoc = orderQuery.docs[0];
      const orderData = orderDoc.data();
      const { groupId, listingId, quantity } = orderData;

      await db.runTransaction(async (transaction) => {
        const groupRef = db.collection('groupBuys').doc(groupId);
        const listingRef = db.collection('produceListings').doc(listingId);

        transaction.update(orderDoc.ref, {
          status: 'paid',
          updatedAt: FieldValue.serverTimestamp(),
        });

        transaction.update(groupRef, {
          quantityFunded: FieldValue.increment(quantity),
          [`participants.${orderData.userId}`]: FieldValue.increment(quantity),
        });

        transaction.update(listingRef, {
          quantityAvailable: FieldValue.increment(-quantity),
        });

        const groupDoc = await transaction.get(groupRef);
        const groupData = groupDoc.data();

        if (groupData && groupData.quantityFunded >= groupData.totalQuantity) {
          transaction.update(groupRef, { status: 'pending_delivery' });
          transaction.update(listingRef, { status: 'pending_delivery' });
          const notificationRef = db.collection('notifications').doc();
          transaction.set(notificationRef, {
            userId: groupData.farmerId,
            message: `Your group buy for "${groupData.produceName}" is fully funded! Please deliver to ${groupData.pickupLocation}.`,
            isRead: false,
            createdAt: FieldValue.serverTimestamp(),
            link: `/farmers?listingId=${listingId}`,
          });
        }
      });

      return NextResponse.redirect(new URL('/dashboard?payment_status=success', request.url));
    } else {
      // Handle failed verification
      return NextResponse.redirect(new URL('/dashboard?payment_status=failed', request.url));
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
