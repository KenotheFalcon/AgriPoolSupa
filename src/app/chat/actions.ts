'use server';

import { z } from 'zod';
import { getAdminFirestore, getAdminStorage } from '@/lib/firebase-admin';
import { requireAuth } from '@/lib/auth/server';
import { FieldValue } from 'firebase-admin/firestore';

const SendMessageSchema = z.object({
  groupId: z.string(),
  message: z.string().max(500).optional(),
  audio: z.instanceof(File).optional(),
});

export async function sendMessage(formData: FormData) {
  try {
    const user = await requireAuth();

    const validatedFields = SendMessageSchema.safeParse({
      groupId: formData.get('groupId'),
      message: formData.get('message'),
      audio: formData.get('audio'),
    });

    if (!validatedFields.success) {
      return {
        error: 'Validation failed.',
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { groupId, message, audio } = validatedFields.data;

    if (!message && !audio) {
      return { error: 'Message or audio is required.' };
    }

    const db = await getAdminFirestore();
    const groupRef = db.collection('groupBuys').doc(groupId);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists) throw new Error('Group buy not found.');

    const groupData = groupDoc.data()!;
    const isParticipant = groupData.participants?.[user.uid];
    const isFarmer = groupData.farmerId === user.uid;
    const isSupport = user.role === 'support';

    if (!isParticipant && !isFarmer && !isSupport) {
      throw new Error('You are not authorized to post in this chat.');
    }

    let audioUrl: string | null = null;
    if (audio) {
      const storage = getAdminStorage().bucket();
      const filePath = `voice-messages/${groupId}/${Date.now()}.webm`;
      const file = storage.file(filePath);

      const buffer = Buffer.from(await audio.arrayBuffer());
      await file.save(buffer, {
        metadata: { contentType: 'audio/webm' },
      });
      audioUrl = await file
        .getSignedUrl({ action: 'read', expires: '03-09-2491' })
        .then((urls) => urls[0]);
    }

    const chatRef = groupRef.collection('messages').doc();
    await chatRef.set({
      senderId: user.uid,
      senderName: user.displayName || user.email,
      senderRole: user.role,
      text: message || null,
      audioUrl: audioUrl || null,
      timestamp: FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}
