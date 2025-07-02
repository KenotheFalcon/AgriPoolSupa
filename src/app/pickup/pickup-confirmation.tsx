'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { confirmReceipt } from '@/app/payments/actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const initialState = { message: null, error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' disabled={pending} className='w-full text-lg py-6'>
      {pending ? 'Confirming...' : 'I Have Received My Produce'}
    </Button>
  );
}

export function PickupConfirmation({ orderId, groupId }: { orderId: string; groupId: string }) {
  const [state, formAction] = useFormState(confirmReceipt, initialState as any);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({ title: 'Success', description: state.message });
    }
    if (state.error) {
      toast({ title: 'Error', description: state.error, variant: 'destructive' });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
      <input type='hidden' name='orderId' value={orderId} />
      <input type='hidden' name='groupId' value={groupId} />
      <SubmitButton />
    </form>
  );
}
