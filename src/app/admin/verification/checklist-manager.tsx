'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';
import { updateChecklist } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { X, Plus } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Saving...' : 'Save Checklist'}
    </Button>
  );
}

export function ChecklistManager({ initialItems }: { initialItems: string[] }) {
  const [state, formAction] = useFormState(updateChecklist, { message: null, error: null } as any);
  const [items, setItems] = useState<string[]>(initialItems);
  const [newItem, setNewItem] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) toast({ title: 'Success', description: state.message });
    if (state.error) toast({ title: 'Error', description: state.error, variant: 'destructive' });
  }, [state, toast]);

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <form action={formAction} className='space-y-4'>
      <div className='space-y-2'>
        {items.map((item, index) => (
          <div key={index} className='flex items-center gap-2'>
            <Input name='items' defaultValue={item} className='flex-grow' />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => handleRemoveItem(index)}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>
      <div className='flex items-center gap-2'>
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder='Add a new requirement'
          className='flex-grow'
        />
        <Button type='button' onClick={handleAddItem}>
          <Plus className='h-4 w-4 mr-2' /> Add
        </Button>
      </div>
      <SubmitButton />
    </form>
  );
}
