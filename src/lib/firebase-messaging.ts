// Temporary stub for Firebase messaging functionality
// TODO: Implement push notifications with Supabase Edge Functions

export const getFCMToken = async () => {
  console.warn(
    'Firebase messaging not implemented. Use Supabase Edge Functions for push notifications.'
  );
  return null;
};

export const requestNotificationPermission = async () => {
  console.warn(
    'Firebase messaging not implemented. Use Supabase Edge Functions for push notifications.'
  );
  return false;
};

export const onNotificationMessage = (callback: any) => {
  console.warn(
    'Firebase messaging not implemented. Use Supabase Edge Functions for push notifications.'
  );
  return () => {};
};

export const onMessageListener = () => {
  console.warn(
    'Firebase messaging not implemented. Use Supabase Edge Functions for push notifications.'
  );
  return Promise.resolve();
};
