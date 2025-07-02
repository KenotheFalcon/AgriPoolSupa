'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChatBox } from '@/app/chat/chat-box';
import { ServerUser } from '@/lib/auth/server';

export function AdminChatModal({ groupId, user }: { groupId: string; user: ServerUser }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant='outline' size='sm' onClick={() => setIsOpen(true)}>
        View Chat
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Group Chat (Admin View)</DialogTitle>
          </DialogHeader>
          <ChatBox groupId={groupId} user={user} />
        </DialogContent>
      </Dialog>
    </>
  );
}
