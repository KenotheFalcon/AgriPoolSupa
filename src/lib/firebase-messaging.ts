import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from './firebase'; // Your existing firebase app initialization

export const getFCMToken = async () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const messaging = getMessaging(app);

      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      const queryParams = new URLSearchParams(firebaseConfig).toString();

      const serviceWorkerRegistration = await navigator.serviceWorker.register(
        `/firebase-messaging-sw.js?${queryParams}`
      );

      // IMPORTANT: You need a firebase-messaging-sw.js file in your public directory
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration,
      });

      if (currentToken) {
        return currentToken;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
  return null;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      const messaging = getMessaging(app);
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    }
  });
