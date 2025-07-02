'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { requireRole } from '@/lib/auth/server';

const UpdateLogisticsSchema = z.object({
  groupId: z.string(),
  newStatus: z.enum(['packing', 'in_transit', 'at_pickup']),
});

export async function updateLogisticsStatus(formData: FormData) {
  try {
    const user = await requireRole('farmer');

    const validatedFields = UpdateLogisticsSchema.safeParse({
      groupId: formData.get('groupId'),
      newStatus: formData.get('newStatus'),
    });

    if (!validatedFields.success) throw new Error('Invalid input.');

    const { groupId, newStatus } = validatedFields.data;
    const db = await getAdminFirestore();

    const groupRef = db.collection('groupBuys').doc(groupId);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists || groupDoc.data()?.farmerId !== user.uid) {
      throw new Error('Group buy not found or you are not authorized to modify it.');
    }

    await groupRef.update({
      logisticsStatus: newStatus,
    });

    // Notify all participants about the status change
    const participants = Object.keys(groupDoc.data()?.participants || {});
    const notificationPromises = participants.map((userId) => {
      const notificationRef = db.collection('notifications').doc();
      return notificationRef.set({
        userId,
        message: `Update on your group buy for "${
          groupDoc.data()?.produceName
        }": Status is now ${newStatus.replace('_', ' ')}.`,
        isRead: false,
        createdAt: new Date(),
        link: `/dashboard?tab=orders`,
      });
    });

    await Promise.all(notificationPromises);

    revalidatePath('/farmers/listings');
    revalidatePath('/dashboard');
    return { message: `Logistics status updated to ${newStatus}.` };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}
