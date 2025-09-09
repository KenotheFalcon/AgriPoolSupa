'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ServerUser } from '@/lib/auth/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'farmer' | 'support';
  text: string | null;
  audioUrl: string | null;
  timestamp: Timestamp;
}

export function ChatBox({ groupId, user }: { groupId: string; user: ServerUser }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'groupBuys', groupId, 'messages'), {
        senderId: user.uid,
        senderName: user.displayName || user.email,
        senderRole: user.role,
        text: newMessage,
        audioUrl: null,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
                <p className='text-xs opacity-70 mt-1'>
                  {msg.timestamp?.toDate().toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className='p-4 border-t'>
        <form onSubmit={handleSubmit} className='flex gap-2 items-center'>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder='Type a message...'
            className='flex-grow'
            autoComplete='off'
            disabled={isLoading}
          />
          <Button type='submit' disabled={isLoading || !newMessage.trim()}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </div>
    </div>
  );
}
