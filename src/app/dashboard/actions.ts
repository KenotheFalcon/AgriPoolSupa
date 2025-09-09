'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { requireRole } from '@/lib/auth/server';
import { FieldValue, GeoPoint } from 'firebase-admin/firestore';
import { createFlutterwaveClient } from '@/lib/flutterwave-client';

const CreateGroupBuySchema = z.object({
  listingId: z.string(),
  quantity: z.coerce.number().int().min(1, 'You must buy at least 1 unit.'),
});

const JoinGroupBuySchema = z.object({
  groupId: z.string(),
  listingId: z.string(),
  quantity: z.coerce.number().int().min(1, 'You must buy at least 1 unit.'),
});

async function handlePaymentAndOrder(
  transaction: FirebaseFirestore.Transaction,
  user: any,
  listingData: any,
  groupData: any,
  quantity: number,
  groupId: string
) {
  const db = getAdminFirestore();
  const orderRef = db.collection('orders').doc();
  const flutterwave = createFlutterwaveClient(process.env.FLUTTERWAVE_SECRET_KEY!);

  const paymentData = {
    amount: quantity * listingData.pricePerUnit,
    currency: 'NGN',
    customer: {
      email: user.email,
      name: user.name || 'AgriPool User',
    },
    redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify`,
    meta: {
      groupId,
      buyerId: user.uid,
      unitsPurchased: quantity,
      listingId: listingData.id,
      orderId: orderRef.id,
    },
  };

  const paymentResponse = await flutterwave.initiatePayment(paymentData);

  if (paymentResponse.status !== 'success' || !paymentResponse.data.link) {
    throw new Error(`Payment initiation failed: ${paymentResponse.message}`);
  }

  transaction.set(orderRef, {
    userId: user.uid,
    farmerId: listingData.farmerId,
    groupId,
    listingId: listingData.id,
    quantity,
    totalPrice: quantity * listingData.pricePerUnit,
    status: 'pending_payment',
    createdAt: FieldValue.serverTimestamp(),
    paymentLink: paymentResponse.data.link,
    tx_ref: paymentResponse.tx_ref,
  });

  return paymentResponse.data.link;
}

export async function createGroupBuy(formData: FormData) {
  try {
    const user = await requireRole('buyer');
    const db = await getAdminFirestore();

    const validatedFields = CreateGroupBuySchema.safeParse({
      listingId: formData.get('listingId'),
      quantity: formData.get('quantity'),
    });

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.flatten().fieldErrors,
        message: 'Validation failed.',
      };
    }

    const { listingId, quantity } = validatedFields.data;

    const { groupId, paymentLink } = await db.runTransaction(async (transaction) => {
      const listingRef = db.collection('produceListings').doc(listingId);
      const listingDoc = await transaction.get(listingRef);

      if (!listingDoc.exists) throw new Error('Produce listing not found.');

      const listingData = { id: listingDoc.id, ...listingDoc.data()! };
      if (listingData.status !== 'available')
        throw new Error('This listing is no longer available.');
      if (quantity > listingData.quantityAvailable)
        throw new Error(`Only ${listingData.quantityAvailable} units are available.`);

      const newGroupRef = db.collection('groupBuys').doc();
      const newGroupData = {
        listingId,
        produceName: listingData.produceName,
        farmerId: listingData.farmerId,
        status: 'funding',
        totalQuantity: listingData.totalQuantity,
        quantityFunded: quantity,
        createdAt: FieldValue.serverTimestamp(),
        participants: { [user.uid]: quantity },
        pickupLocation: listingData.pickupLocation,
        pricePerUnit: listingData.pricePerUnit,
      };
      transaction.set(newGroupRef, newGroupData);

      const link = await handlePaymentAndOrder(
        transaction,
        user,
        listingData,
        newGroupData,
        quantity,
        newGroupRef.id
      );

      transaction.update(listingRef, {
        quantityAvailable: FieldValue.increment(-quantity),
      });

      if (quantity >= listingData.totalQuantity) {
        transaction.update(newGroupRef, { status: 'pending_delivery' });
        transaction.update(listingRef, { status: 'pending_delivery' });
        const notificationRef = db.collection('notifications').doc();
        transaction.set(notificationRef, {
          userId: listingData.farmerId,
          message: `Your group buy for "${listingData.produceName}" is fully funded! Please deliver to ${listingData.pickupLocation}.`,
          isRead: false,
          createdAt: FieldValue.serverTimestamp(),
          link: `/farmers?listingId=${listingId}`,
        });
      }

      return { groupId: newGroupRef.id, paymentLink: link };
    });

    revalidatePath('/dashboard');
    return {
      message: 'Group buy created successfully! Redirecting to payment...',
      paymentLink,
      groupId,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { message };
  }
}

export async function joinGroupBuy(formData: FormData) {
  try {
    const user = await requireRole('buyer');
    const db = await getAdminFirestore();

    const validatedFields = JoinGroupBuySchema.safeParse({
      groupId: formData.get('groupId'),
      listingId: formData.get('listingId'),
      quantity: formData.get('quantity'),
    });

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.flatten().fieldErrors,
        message: 'Validation failed.',
      };
    }

    const { groupId, listingId, quantity } = validatedFields.data;

    const paymentLink = await db.runTransaction(async (transaction) => {
      const groupRef = db.collection('groupBuys').doc(groupId);
      const listingRef = db.collection('produceListings').doc(listingId);

      const [groupDoc, listingDoc] = await transaction.getAll(groupRef, listingRef);

      if (!groupDoc.exists) throw new Error('Group buy not found.');
      if (!listingDoc.exists) throw new Error('Produce listing not found.');

      const groupData = groupDoc.data()!;
      const listingData = { id: listingDoc.id, ...listingDoc.data()! };

      if (groupData.status !== 'funding') throw new Error('This group buy is no longer active.');
      if (listingData.quantityAvailable < quantity)
        throw new Error(`Only ${listingData.quantityAvailable} units are available.`);

      const link = await handlePaymentAndOrder(
        transaction,
        user,
        listingData,
        groupData,
        quantity,
        groupId
      );

      const newQuantityFunded = groupData.quantityFunded + quantity;

      transaction.update(groupRef, {
        quantityFunded: newQuantityFunded,
        [`participants.${user.uid}`]: FieldValue.increment(quantity),
      });

      transaction.update(listingRef, {
        quantityAvailable: FieldValue.increment(-quantity),
      });

      if (newQuantityFunded >= groupData.totalQuantity) {
        transaction.update(groupRef, { status: 'pending_delivery' });
        transaction.update(listingRef, { status: 'pending_delivery' });
        const notificationRef = db.collection('notifications').doc();
        transaction.set(notificationRef, {
          userId: listingData.farmerId,
          message: `Your group buy for "${listingData.produceName}" is fully funded! Please deliver to ${listingData.pickupLocation}.`,
          isRead: false,
          createdAt: FieldValue.serverTimestamp(),
          link: `/farmers?listingId=${listingId}`,
        });
      }
      return link;
    });

    revalidatePath('/dashboard');
    return { message: 'Successfully joined the group buy! Redirecting to payment...', paymentLink };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { message };
  }
}

export async function updateUserLocation(location: { latitude: number; longitude: number }) {
  try {
    const user = await requireRole('buyer');
    const db = await getAdminFirestore();

    await db
      .collection('users')
      .doc(user.uid)
      .update({
        location: new GeoPoint(location.latitude, location.longitude),
      });

    revalidatePath('/dashboard');
    return { message: 'Location updated successfully!' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}
