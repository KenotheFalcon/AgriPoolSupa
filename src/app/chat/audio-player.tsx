'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

export function AudioPlayer({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className='flex items-center gap-2'>
      <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} preload='none' />
      <Button onClick={togglePlay} size='sm' variant='outline' className='rounded-full h-10 w-10'>
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </Button>
      <div className='text-sm text-muted-foreground'>Voice Message</div>
    </div>
  );
}
