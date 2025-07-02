'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { createGroupBuy, joinGroupBuy } from '../dashboard/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ServerUser } from '@/lib/auth/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatBox } from '@/app/chat/chat-box';
import DynamicDisplayMap from '@/app/components/maps/dynamic-display-map';

const initialState = { message: '', error: {} };

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' disabled={pending} className='w-full'>
      {pending ? 'Processing...' : text}
    </Button>
  );
}

export function GroupBuyModal({
  isOpen,
  onClose,
  listing,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  listing: any;
  user: ServerUser;
}) {
  const [createState, createFormAction] = useFormState(createGroupBuy, initialState);
  const [joinState, joinFormAction] = useFormState(joinGroupBuy, initialState);
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const activeGroup = listing.activeGroup;

  const handleState = (state: typeof createState | typeof joinState) => {
    if (state.paymentLink) {
      toast({ title: 'Success', description: state.message });
      window.location.href = state.paymentLink;
    } else if (state.message?.includes('successfully')) {
      toast({ title: 'Success', description: state.message });
      if (!activeGroup) {
        // if we just created a group, don't close modal
        return;
      }
      onClose();
    } else if (state.message) {
      toast({ title: 'Error', description: state.message, variant: 'destructive' });
    }
  };

  useEffect(() => {
    handleState(createState);
  }, [createState]);
  useEffect(() => {
    handleState(joinState);
  }, [joinState]);

  const hasJoined = activeGroup?.participants?.[user.uid];
  const canChat = hasJoined || user.role === 'farmer' || user.role === 'support';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{listing.produceName}</DialogTitle>
          <DialogDescription>
            Group buy for produce from {listing.pickupLocation}. Delivery by{' '}
            {new Date(listing.deliveryDate.seconds * 1000).toLocaleDateString()}.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue='details'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='details'>Details</TabsTrigger>
            <TabsTrigger value='chat' disabled={!activeGroup}>
              Group Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value='details'>
            <div className='py-4 space-y-4'>
              {listing.location && (
                <div>
                  <Label>Pickup Location</Label>
                  <DynamicDisplayMap
                    position={[listing.location.latitude, listing.location.longitude]}
                    address={listing.pickupLocation}
                  />
                </div>
              )}
              <h4 className='font-semibold text-lg'>
                Price: ₦{listing.pricePerUnit.toLocaleString()} / {listing.unitDescription}
              </h4>

              {activeGroup && (
                <div className='mb-4'>
                  <Label>Group Progress</Label>
                  <Progress
                    value={(activeGroup.quantityFunded / activeGroup.totalQuantity) * 100}
                    className='w-full mb-1'
                  />
                  <p className='text-sm text-muted-foreground'>
                    {activeGroup.quantityFunded} of {activeGroup.totalQuantity} units funded.
                  </p>
                </div>
              )}

              {hasJoined && (
                <div className='p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-800'>
                  You have already joined this group buy with {activeGroup.participants[user.uid]}{' '}
                  unit(s).
                </div>
              )}

              {!hasJoined && (
                <form
                  action={activeGroup ? joinFormAction : createFormAction}
                  className='space-y-4 mt-4'
                >
                  <input type='hidden' name='listingId' value={listing.id} />
                  {activeGroup && <input type='hidden' name='groupId' value={activeGroup.id} />}

                  <div>
                    <Label htmlFor='quantity'>Quantity</Label>
                    <Input
                      id='quantity'
                      name='quantity'
                      type='number'
                      min='1'
                      max={listing.quantityAvailable}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className='mt-1'
                    />
                  </div>

                  <div className='font-bold text-xl text-center'>
                    Total: ₦{(quantity * listing.pricePerUnit).toLocaleString()}
                  </div>

                  <SubmitButton text={activeGroup ? 'Join Group Buy' : 'Create Group Buy'} />
                </form>
              )}
            </div>
          </TabsContent>

          <TabsContent value='chat'>
            {activeGroup && canChat ? (
              <ChatBox groupId={activeGroup.id} user={user} />
            ) : (
              <div className='text-center p-8 text-muted-foreground'>
                You must join the group buy to access the chat.
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
