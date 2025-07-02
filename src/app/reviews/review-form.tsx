'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { submitReview } from './actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const initialState = { message: null, error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' disabled={pending} className='w-full'>
      {pending ? 'Submitting...' : 'Submit Review'}
    </Button>
  );
}

function StarRating({ rating, setRating }: { rating: number; setRating: (r: number) => void }) {
  return (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          onClick={() => setRating(star)}
          className={`h-8 w-8 cursor-pointer transition-colors ${
            rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

export function ReviewForm({
  orderId,
  farmerId,
  groupId,
}: {
  orderId: string;
  farmerId: string;
  groupId: string;
}) {
  const [state, formAction] = useFormState(submitReview, initialState as any);
  const { toast } = useToast();
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (state.message) {
      toast({ title: 'Success', description: state.message });
    }
    if (state.error) {
      toast({ title: 'Error', description: state.error, variant: 'destructive' });
    }
  }, [state, toast]);

  const handleFormAction = (formData: FormData) => {
    if (rating === 0) {
      toast({
        title: 'Error',
        description: 'Please select a star rating.',
        variant: 'destructive',
      });
      return;
    }
    formData.append('rating', rating.toString());
    formAction(formData);
  };

  return (
    <div className='p-4 border-t'>
      <h3 className='font-bold text-lg mb-4'>Leave a Review</h3>
      <form action={handleFormAction} className='space-y-4'>
        <input type='hidden' name='orderId' value={orderId} />
        <input type='hidden' name='farmerId' value={farmerId} />
        <input type='hidden' name='groupId' value={groupId} />

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Your Rating</label>
          <StarRating rating={rating} setRating={setRating} />
        </div>

        <div>
          <label htmlFor='reviewText' className='block text-sm font-medium text-gray-700 mb-1'>
            Your Review
          </label>
          <Textarea
            id='reviewText'
            name='reviewText'
            placeholder='Tell us about your experience...'
            required
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
