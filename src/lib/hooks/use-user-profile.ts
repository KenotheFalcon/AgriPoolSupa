import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile } from '@/lib/db';
import type { UserProfile, UpdateProfileData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function useUserProfile(uid: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userProfile', uid],
    queryFn: () => getUserProfile(uid),
    enabled: !!uid,
  });

  const updateProfile = useMutation({
    mutationFn: (data: UpdateProfileData) => updateUserProfile(uid, data),
    onSuccess: (_, variables) => {
      // Optimistically update the cache
      queryClient.setQueryData(['userProfile', uid], (old: UserProfile | undefined) => {
        if (!old) return old;
        return { ...old, ...variables };
      });

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
      console.error('Profile update error:', error);
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfile.mutate,
    isUpdating: updateProfile.isPending,
  };
}
