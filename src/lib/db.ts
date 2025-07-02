import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { UserProfile, UpdateProfileData } from './types';

const COLLECTION_NAME = 'users';

export async function createUserProfile(uid: string, email: string): Promise<UserProfile> {
  const userRef = doc(db, COLLECTION_NAME, uid);
  const userData: UserProfile = {
    uid,
    email,
    displayName: null,
    photoURL: null,
    preferences: {
      theme: 'system',
      notifications: true,
      language: 'en',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return userData;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, COLLECTION_NAME, uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return userSnap.data() as UserProfile;
}

export async function updateUserProfile(uid: string, data: UpdateProfileData): Promise<void> {
  const userRef = doc(db, COLLECTION_NAME, uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUserProfile(uid: string): Promise<void> {
  const userRef = doc(db, COLLECTION_NAME, uid);
  await setDoc(userRef, { deleted: true, updatedAt: serverTimestamp() });
}
