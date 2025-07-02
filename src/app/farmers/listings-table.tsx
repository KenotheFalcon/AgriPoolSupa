'use client';

import { useTransition, useState } from 'react';
import { dispatchProduce } from './actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChatBox } from '@/app/chat/chat-box';
import { ServerUser } from '@/lib/auth/server';
import { LogisticsManager } from './logistics-manager';

function ChatModal({
  groupId,
  user,
  isOpen,
  onClose,
}: {
  groupId: string;
  user: ServerUser;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Group Chat</DialogTitle>
        </DialogHeader>
        <ChatBox groupId={groupId} user={user} />
      </DialogContent>
    </Dialog>
  );
}

function ActionsCell({ listing, user }: { listing: any; user: ServerUser }) {
  const [isPending, startTransition] = useTransition();
  const [isChatOpen, setChatOpen] = useState(false);
  const { toast } = useToast();

  const handleDispatch = () => {
    startTransition(async () => {
      const result = await dispatchProduce(listing.id);
      if (
        result?.message.includes('successfully') ||
        result?.message.includes('marked as dispatched')
      ) {
        toast({ title: 'Success', description: result.message });
      } else if (result?.message) {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  const isDispatched = listing.status !== 'fully_funded';
  const canDispatch = listing.status === 'fully_funded';
  const activeGroupId = listing.activeGroup?.id;

  if (isDispatched && activeGroupId) {
    return (
      <LogisticsManager
        groupId={activeGroupId}
        currentStatus={listing.activeGroup.logisticsStatus || 'pending'}
      />
    );
  }

  return (
    <div className='flex gap-2'>
      {activeGroupId && (
        <>
          <Button variant='outline' size='sm' onClick={() => setChatOpen(true)}>
            View Chat
          </Button>
          <ChatModal
            groupId={activeGroupId}
            user={user}
            isOpen={isChatOpen}
            onClose={() => setChatOpen(false)}
          />
        </>
      )}
      <Button onClick={handleDispatch} disabled={isPending || !canDispatch} size='sm'>
        {isPending ? 'Updating...' : 'Confirm & Start Packing'}
      </Button>
    </div>
  );
}

export function ListingsTable({ listings, user }: { listings: any[]; user: ServerUser }) {
  if (listings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Produce Listings</CardTitle>
          <CardDescription>You have not posted any produce listings yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Produce Listings</CardTitle>
        <CardDescription>Here is a list of your current and past produce listings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produce</TableHead>
              <TableHead>Price (₦)</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className='font-medium'>{listing.produceName}</TableCell>
                <TableCell>{listing.pricePerUnit.toLocaleString()}</TableCell>
                <TableCell>
                  {listing.totalQuantity} {listing.unitDescription}
                </TableCell>
                <TableCell>
                  {new Date(listing.deliveryDate.seconds * 1000).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      listing.status === 'fully_funded'
                        ? 'default'
                        : listing.status === 'dispatched'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {listing.status.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ActionsCell listing={listing} user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
