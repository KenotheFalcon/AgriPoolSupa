'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { requireRole } from '@/lib/auth/server';
import { FieldValue } from 'firebase-admin/firestore';

const SubmitReviewSchema = z.object({
  orderId: z.string(),
  farmerId: z.string(),
  groupId: z.string(),
  rating: z.coerce.number().min(1).max(5),
  reviewText: z.string().min(10, 'Review must be at least 10 characters.').max(1000),
});

export async function submitReview(formData: FormData) {
  try {
    const user = await requireRole('buyer');

    const validatedFields = SubmitReviewSchema.safeParse({
      orderId: formData.get('orderId'),
      farmerId: formData.get('farmerId'),
      groupId: formData.get('groupId'),
      rating: formData.get('rating'),
      reviewText: formData.get('reviewText'),
    });

    if (!validatedFields.success) throw new Error('Invalid input.');

    const { orderId, farmerId, groupId, rating, reviewText } = validatedFields.data;
    const db = await getAdminFirestore();

    await db.runTransaction(async (transaction) => {
      const orderRef = db.collection('orders').doc(orderId);
      const farmerRef = db.collection('users').doc(farmerId);
      const reviewRef = farmerRef.collection('reviews').doc(orderId); // Use orderId to prevent duplicate reviews

      const [orderDoc, reviewDoc] = await transaction.getAll(orderRef, reviewRef);

      if (!orderDoc.exists || orderDoc.data()?.userId !== user.uid) {
        throw new Error('Order not found or you are not authorized to review it.');
      }
      if (orderDoc.data()?.status !== 'completed') {
        throw new Error('You can only review completed orders.');
      }
      if (reviewDoc.exists) {
        throw new Error('You have already submitted a review for this order.');
      }

      // Create the new review
      transaction.set(reviewRef, {
        buyerId: user.uid,
        buyerName: user.displayName || 'Anonymous',
        rating,
        reviewText,
        groupId,
        createdAt: FieldValue.serverTimestamp(),
      });

      // Atomically update the farmer's average rating
      const farmerDoc = await transaction.get(farmerRef);
      const farmerData = farmerDoc.data() || {};
      const currentRating = farmerData.averageRating || 0;
      const reviewCount = farmerData.reviewCount || 0;

      const newReviewCount = reviewCount + 1;
      const newAverageRating = (currentRating * reviewCount + rating) / newReviewCount;

      transaction.update(farmerRef, {
        averageRating: newAverageRating,
        reviewCount: newReviewCount,
      });
    });

    revalidatePath(`/pickup?orderId=${orderId}`);
    return { message: 'Your review has been submitted successfully.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}
