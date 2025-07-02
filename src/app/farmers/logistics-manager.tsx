'use client';

import { useTransition } from 'react';
import { updateLogisticsStatus } from './logistics-actions';
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
import { ChevronDown } from 'lucide-react';

const logisticsStatuses: ('packing' | 'in_transit' | 'at_pickup')[] = [
  'packing',
  'in_transit',
  'at_pickup',
];

export function LogisticsManager({
  groupId,
  currentStatus,
}: {
  groupId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleStatusChange = (newStatus: (typeof logisticsStatuses)[number]) => {
    if (newStatus === currentStatus) return;

    const formData = new FormData();
    formData.append('groupId', groupId);
    formData.append('newStatus', newStatus);

    startTransition(async () => {
      const result = await updateLogisticsStatus(formData);
      if (result.message) {
        toast({ title: 'Success', description: result.message });
      } else if (result.error) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='capitalize' disabled={isPending}>
          {currentStatus ? currentStatus.replace(/_/g, ' ') : 'Update Status'}
          <ChevronDown className='ml-2 h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Update Logistics</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {logisticsStatuses.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            disabled={isPending || currentStatus === status}
            className='capitalize'
          >
            {status.replace(/_/g, ' ')}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
