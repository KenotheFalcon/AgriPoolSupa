'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getAdminFirestore, getAdminAuth } from '@/lib/firebase-admin';
import { requireRole } from '@/lib/auth/server';
import { geocodeAddress } from '@/lib/geo';
import { GeoPoint } from 'firebase-admin/firestore';

const ProduceListingSchema = z.object({
  produceName: z.string().min(3, 'Produce name must be at least 3 characters'),
  pricePerUnit: z.coerce.number().positive('Price must be a positive number'),
  unitDescription: z.string().min(2, 'Unit description is required (e.g., 50kg bag)'),
  totalQuantity: z.coerce.number().int().positive('Quantity must be a positive number'),
  deliveryDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  pickupLocation: z.string().min(5, 'Pickup location is required'),
  imageUrls: z.array(z.string().url()).optional(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

export async function createProduceListing(formData: FormData) {
  try {
    const user = await requireRole('farmer');

    const validatedFields = ProduceListingSchema.safeParse({
      produceName: formData.get('produceName'),
      pricePerUnit: formData.get('pricePerUnit'),
      unitDescription: formData.get('unitDescription'),
      totalQuantity: formData.get('totalQuantity'),
      deliveryDate: formData.get('deliveryDate'),
      pickupLocation: formData.get('pickupLocation'),
      imageUrls: formData.getAll('imageUrls'),
      latitude: formData.get('latitude'),
      longitude: formData.get('longitude'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Validation failed. Please check the form.',
      };
    }

    const {
      produceName,
      pricePerUnit,
      unitDescription,
      totalQuantity,
      deliveryDate,
      pickupLocation,
      imageUrls,
      latitude,
      longitude,
    } = validatedFields.data;

    const db = await getAdminFirestore();

    await db.collection('produceListings').add({
      farmerId: user.uid,
      farmerName: user.displayName || user.email,
      produceName,
      pricePerUnit,
      unitDescription,
      totalQuantity,
      quantityAvailable: totalQuantity,
      deliveryDate: new Date(deliveryDate),
      pickupLocation,
      location: new GeoPoint(latitude, longitude),
      imageUrls: imageUrls || [],
      status: 'available',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath('/farmers');
    return { message: 'Produce listing created successfully.' };
  } catch (error) {
    console.error('Error creating produce listing:', error);
    return { message: 'An unexpected error occurred.' };
  }
}

export async function dispatchProduce(listingId: string) {
  try {
    const user = await requireRole('farmer');
    const db = await getAdminFirestore();

    const listingRef = db.collection('produceListings').doc(listingId);
    const listingDoc = await listingRef.get();

    if (!listingDoc.exists || listingDoc.data()?.farmerId !== user.uid) {
      throw new Error("Listing not found or you don't have permission to modify it.");
    }

    await listingRef.update({
      status: 'pending_delivery',
      updatedAt: new Date(),
    });

    const groupQuery = await db
      .collection('groupBuys')
      .where('listingId', '==', listingId)
      .where('status', '==', 'fully_funded')
      .get();
    if (!groupQuery.empty) {
      const groupRef = groupQuery.docs[0].ref;
      await groupRef.update({
        status: 'pending_delivery',
        logisticsStatus: 'packing',
      });
    }

    revalidatePath('/farmers');
    return { message: 'Delivery process initiated.' };
  } catch (error) {
    console.error('Error dispatching produce:', error);
    return { message: 'Failed to initiate delivery.' };
  }
}
