'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { requireRole } from '@/lib/auth/server';
import { FieldValue } from 'firebase-admin/firestore';

const ConfirmReceiptSchema = z.object({
  orderId: z.string(),
  groupId: z.string(),
});

export async function confirmReceipt(prevState: any, formData: FormData) {
  try {
    const user = await requireRole('buyer');
    const db = await getAdminFirestore();

    const validatedFields = ConfirmReceiptSchema.safeParse({
      orderId: formData.get('orderId'),
      groupId: formData.get('groupId'),
    });

    if (!validatedFields.success) {
      throw new Error('Invalid input.');
    }

    const { orderId, groupId } = validatedFields.data;

    await db.runTransaction(async (transaction) => {
      const orderRef = db.collection('orders').doc(orderId);
      const groupRef = db.collection('groupBuys').doc(groupId);

      const [orderDoc, groupDoc] = await transaction.getAll(orderRef, groupRef);

      if (!orderDoc.exists || orderDoc.data()?.userId !== user.uid) {
        throw new Error('Order not found or you are not authorized to modify it.');
      }
      if (!groupDoc.exists) {
        throw new Error('Group buy not found.');
      }

      // Mark the buyer's order as completed
      transaction.update(orderRef, {
        status: 'completed',
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Check if all orders for this group are now completed
      const groupData = groupDoc.data()!;
      const participantIds = Object.keys(groupData.participants);

      const ordersSnapshot = await transaction.get(
        db.collection('orders').where('groupId', '==', groupId)
      );

      const allConfirmed = ordersSnapshot.docs.every(
        (doc) => doc.data().status === 'completed' || doc.id === orderId
      );

      if (allConfirmed && ordersSnapshot.size === participantIds.length) {
        // All participants have confirmed. Release funds.
        transaction.update(groupRef, {
          status: 'completed',
          updatedAt: FieldValue.serverTimestamp(),
        });

        // Calculate payouts
        const totalAmount = groupData.totalQuantity * groupData.pricePerUnit;
        const agriPoolCommission = totalAmount * 0.1;
        const farmerPayout = totalAmount * 0.9;

        // Create transaction logs
        const farmerTransactionRef = db.collection('transactions').doc();
        transaction.set(farmerTransactionRef, {
          type: 'payout',
          userId: groupData.farmerId,
          amount: farmerPayout,
          currency: 'NGN',
          description: `Payout for group buy: ${groupData.produceName}`,
          groupId,
          createdAt: FieldValue.serverTimestamp(),
        });

        const commissionTransactionRef = db.collection('transactions').doc();
        transaction.set(commissionTransactionRef, {
          type: 'commission',
          userId: 'agripool', // Internal account
          amount: agriPoolCommission,
          currency: 'NGN',
          description: `Commission from group buy: ${groupData.produceName}`,
          groupId,
          createdAt: FieldValue.serverTimestamp(),
        });

        // Notify the farmer of the payout
        const notificationRef = db.collection('notifications').doc();
        transaction.set(notificationRef, {
          userId: groupData.farmerId,
          message: `Funds for "${groupData.produceName}" have been released to your account.`,
          isRead: false,
          createdAt: FieldValue.serverTimestamp(),
          link: `/farmers?tab=payouts`,
        });
      }
    });

    revalidatePath('/dashboard');
    return { message: 'Receipt confirmed successfully!' };
  } catch (error) {
    console.error('Error confirming receipt:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}
