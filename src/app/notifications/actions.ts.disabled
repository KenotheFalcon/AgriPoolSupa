'use server';

import { z } from 'zod';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { requireAuth } from '@/lib/auth/server';
import { FieldValue } from 'firebase-admin/firestore';

const SaveTokenSchema = z.object({
  token: z.string(),
});

export async function saveFCMToken(formData: FormData) {
  try {
    const user = await requireAuth();

    const validatedFields = SaveTokenSchema.safeParse({
      token: formData.get('token'),
    });

    if (!validatedFields.success) throw new Error('Invalid input.');

    const { token } = validatedFields.data;
    const db = await getAdminFirestore();

    const tokenRef = db.collection('users').doc(user.uid).collection('fcmTokens').doc(token);

    await tokenRef.set({
      createdAt: FieldValue.serverTimestamp(),
      userAgent: 'unknown', // In a real app, you might pass the user agent
    });

    return { message: 'Notifications enabled successfully.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}
