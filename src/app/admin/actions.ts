'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
import { requireRole } from '@/lib/auth/server';

const SetRoleSchema = z.object({
  targetUserId: z.string(),
  newRole: z.enum(['buyer', 'farmer', 'support']),
});

const SuspendListingSchema = z.object({
  listingId: z.string(),
});

const ChecklistSchema = z.object({
  items: z.array(z.string().min(5, 'Checklist item must be at least 5 characters.')),
});

const FarmerVerificationSchema = z.object({
  farmerId: z.string(),
  itemId: z.string(),
  isCompleted: z.boolean(),
});

const BadgeStatusSchema = z.object({
  farmerId: z.string(),
  isVerified: z.boolean(),
});

// Action to allow an admin to change a user's role
export async function setUserRole(formData: FormData) {
  try {
    await requireRole('support'); // Only support staff can run this

    const validatedFields = SetRoleSchema.safeParse({
      targetUserId: formData.get('targetUserId'),
      newRole: formData.get('newRole'),
    });

    if (!validatedFields.success) throw new Error('Invalid input.');

    const { targetUserId, newRole } = validatedFields.data;
    const adminAuth = await getAdminAuth();

    // Set the custom claim in Firebase Authentication
    await adminAuth.setCustomUserClaims(targetUserId, { role: newRole });

    // Update the role in the Firestore user document as well
    const db = await getAdminFirestore();
    await db.collection('users').doc(targetUserId).update({ role: newRole });

    revalidatePath('/admin/users');
    return { message: `User role updated to ${newRole}.` };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}

// Action to allow an admin to suspend a listing
export async function suspendListing(formData: FormData) {
  try {
    await requireRole('support'); // Only support staff can run this

    const validatedFields = SuspendListingSchema.safeParse({
      listingId: formData.get('listingId'),
    });

    if (!validatedFields.success) throw new Error('Invalid input.');

    const { listingId } = validatedFields.data;
    const db = await getAdminFirestore();

    await db.collection('produceListings').doc(listingId).update({
      status: 'suspended',
    });

    // In a real app, you might also notify the farmer.
    // const notificationRef = db.collection('notifications').doc();
    // await notificationRef.set(...)

    revalidatePath('/admin/listings');
    return { message: 'Listing has been suspended.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}

// Action for admins to define the master checklist
export async function updateChecklist(formData: FormData) {
  try {
    await requireRole('support');
    const items = formData.getAll('items') as string[];
    const validatedFields = ChecklistSchema.safeParse({ items });

    if (!validatedFields.success) throw new Error('Invalid input.');

    const db = await getAdminFirestore();
    await db.collection('agripoolConfig').doc('verificationChecklist').set({ items });

    revalidatePath('/admin/verification');
    return { message: 'Verification checklist updated.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}

// Action for admins to update a single checklist item for a farmer
export async function updateFarmerVerificationStatus(formData: FormData) {
  try {
    await requireRole('support');
    const isCompleted = formData.get('isCompleted') === 'true';
    const validatedFields = FarmerVerificationSchema.safeParse({
      farmerId: formData.get('farmerId'),
      itemId: formData.get('itemId'),
      isCompleted,
    });

    if (!validatedFields.success) throw new Error('Invalid input.');

    const { farmerId, itemId } = validatedFields.data;
    const db = await getAdminFirestore();
    const progressRef = db
      .collection('users')
      .doc(farmerId)
      .collection('verificationProgress')
      .doc(itemId);

    if (isCompleted) {
      await progressRef.set({ status: 'completed', completedAt: new Date() });
    } else {
      await progressRef.delete();
    }

    revalidatePath(`/admin/users`); // Or a specific user admin page
    return { message: "Farmer's verification status updated." };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}

// Action for admins to grant or revoke the final badge
export async function toggleVerifiedBadge(formData: FormData) {
  try {
    await requireRole('support');
    const isVerified = formData.get('isVerified') === 'true';
    const validatedFields = BadgeStatusSchema.safeParse({
      farmerId: formData.get('farmerId'),
      isVerified,
    });

    if (!validatedFields.success) throw new Error('Invalid input.');

    const { farmerId } = validatedFields.data;
    const db = await getAdminFirestore();
    await db.collection('users').doc(farmerId).update({ isVerified });

    revalidatePath(`/admin/users`);
    return { message: `Farmer badge status set to ${isVerified}.` };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}
