'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ServerUser } from '@/lib/auth/server';
import { updateUserLocation } from './actions';

export function LocationSharer({ user }: { user: ServerUser }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleShareLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      toast({
        title: 'Error',
        description: 'Geolocation is not supported by your browser.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const result = await updateUserLocation({ latitude, longitude });

        if (result.message) {
          toast({ title: 'Success', description: result.message });
        } else if (result.error) {
          toast({ title: 'Error', description: result.error, variant: 'destructive' });
        }
        setLoading(false);
      },
      (error) => {
        toast({
          title: 'Error',
          description:
            'Could not get your location. Please ensure you have enabled location permissions for this site.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    );
  };

  // This component will be simple for now, a button to trigger the location sharing.
  // In a real app, this could be a more prominent banner or integrated into the user's profile settings.
  return (
    <div className='p-4 bg-muted rounded-lg flex items-center justify-between'>
      <p className='text-sm text-muted-foreground'>
        Share your location to find the closest group buys.
      </p>
      <Button onClick={handleShareLocation} disabled={loading}>
        {loading ? 'Sharing...' : 'Share Location'}
      </Button>
    </div>
  );
}
