'use client';

import { useTransition } from 'react';
import { setUserRole } from '../actions';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

export function RoleManager({
  targetUserId,
  currentRole,
}: {
  targetUserId: string;
  currentRole: string;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleRoleChange = (newRole: 'buyer' | 'farmer' | 'support') => {
    if (newRole === currentRole) return;

    const formData = new FormData();
    formData.append('targetUserId', targetUserId);
    formData.append('newRole', newRole);

    startTransition(async () => {
      const result = await setUserRole(formData);
      if (result.message) {
        toast({ title: 'Success', description: result.message });
      } else if (result.error) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
      }
    });
  };

  const roles: ('buyer' | 'farmer' | 'support')[] = ['buyer', 'farmer', 'support'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleRoleChange(role)}
            disabled={isPending || currentRole === role}
            className='capitalize'
          >
            {role} {currentRole === role && '(current)'}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
