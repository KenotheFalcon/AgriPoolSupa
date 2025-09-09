'use client';

import { useState, useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { sendMessage } from './actions';
import { ServerUser } from '@/lib/auth/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AudioRecorder } from './audio-recorder';
import { AudioPlayer } from './audio-player';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'farmer' | 'support';
  text: string | null;
  audioUrl: string | null;
  timestamp: Timestamp;
}

const initialState = { success: false, error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Sending...' : 'Send'}
    </Button>
  );
}

export function ChatBox({ groupId, user }: { groupId: string; user: ServerUser }) {
  const [messages, setMessages] = useState<Message[]>([]);
  // TODO: Fix useFormState integration according to latest React patterns
  // const [formState, formAction] = useFormState(sendMessage, initialState);
  const [formState] = useState(initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Implement proper form submission
    const formData = new FormData(event.currentTarget);
    try {
      await sendMessage(formData);
      event.currentTarget.reset();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'groupBuys', groupId, 'messages'), orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [groupId]);

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
    }
  }, [formState]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'farmer':
        return 'secondary';
      case 'support':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className='flex flex-col h-[500px] border rounded-lg'>
      <ScrollArea className='flex-grow p-4' ref={scrollAreaRef}>
        <div className='space-y-4'>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.senderId === user.uid ? 'justify-end' : ''}`}
            >
              {msg.senderId !== user.uid && (
                <Badge variant={getRoleVariant(msg.senderRole)} className='self-start capitalize'>
                  {msg.senderRole}
                </Badge>
              )}
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.senderId === user.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                {msg.text && <p className='text-sm'>{msg.text}</p>}
                {msg.audioUrl && <AudioPlayer src={msg.audioUrl} />}
                <p className='text-xs opacity-70 mt-1'>
                  {msg.timestamp?.toDate().toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className='p-4 border-t'>
        <form ref={formRef} onSubmit={handleSubmit} className='flex gap-2 items-center'>
          <input type='hidden' name='groupId' value={groupId} />
          <Input
            name='message'
            placeholder='Type a message...'
            className='flex-grow'
            autoComplete='off'
          />
          <AudioRecorder
            onRecordingComplete={(blob) => {
              const formData = new FormData(formRef.current!);
              formData.append('audio', blob, 'voice-message.webm');
              handleSubmit({ preventDefault: () => {}, currentTarget: formRef.current! } as any);
            }}
          />
          <SubmitButton />
        </form>
        {formState.error && <p className='text-sm text-red-500 mt-2'>{formState.error}</p>}
      </div>
    </div>
  );
}
