'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, Play, Pause } from 'lucide-react';

export function AudioRecorder({
  onRecordingComplete,
}: {
  onRecordingComplete: (blob: Blob) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        onRecordingComplete(audioBlob);
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      // Handle permissions error
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const AudioPreview = () => {
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
        <audio
          ref={audioRef}
          src={URL.createObjectURL(audioBlob!)}
          onEnded={() => setIsPlaying(false)}
        />
        <Button onClick={togglePlay} size='sm' variant='outline'>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </Button>
        <p className='text-sm text-muted-foreground'>Preview</p>
        <Button onClick={() => setAudioBlob(null)} size='sm' variant='destructive'>
          Clear
        </Button>
      </div>
    );
  };

  return (
    <div className='flex items-center gap-4'>
      {!isRecording && !audioBlob && (
        <Button onClick={startRecording} variant='outline' size='icon'>
          <Mic />
        </Button>
      )}
      {isRecording && (
        <Button onClick={stopRecording} variant='destructive' size='icon'>
          <StopCircle />
        </Button>
      )}
      {audioBlob && <AudioPreview />}
    </div>
  );
}
