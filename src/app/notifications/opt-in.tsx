'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getFCMToken, onMessageListener } from '@/lib/firebase-messaging';
import { saveFCMToken } from './actions';
import { Bell } from 'lucide-react';

export function NotificationOptIn() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  useEffect(() => {
    // Only access browser APIs on the client side
    if (typeof window !== 'undefined') {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      onMessageListener().then((payload: any) => {
        toast({
          title: payload.notification.title,
          description: payload.notification.body,
        });
      });
    }
  }, [toast]);

  const handleSubscribe = async () => {
    if (typeof window === 'undefined') return;
    
    if (Notification.permission === 'granted') {
      toast({ description: 'You are already subscribed to notifications.' });
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === 'granted') {
      const token = await getFCMToken();
      if (token) {
        const formData = new FormData();
        formData.append('token', token);
        const result = await saveFCMToken(formData);
        if (result.message) {
          toast({ title: 'Success', description: result.message });
        } else if (result.error) {
          toast({ title: 'Error', description: result.error, variant: 'destructive' });
        }
      }
    } else {
      toast({ title: 'Info', description: 'Notification permission denied.' });
    }
  };

  if (notificationPermission === 'granted') {
    return <p className='text-sm text-muted-foreground'>Notifications are enabled.</p>;
  }

  return (
    <Button onClick={handleSubscribe} variant='outline' size='sm'>
      <Bell className='mr-2 h-4 w-4' />
      Enable Notifications
    </Button>
  );
}
