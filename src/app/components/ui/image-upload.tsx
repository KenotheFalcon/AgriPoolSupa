'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { storageService } from '@/app/services/storage';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface ImageUploadProps {
  onUpload: (file: File) => Promise<void>;
  maxSize?: number;
  accept?: Record<string, string[]>;
  className?: string;
}

export function ImageUpload({
  onUpload,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
  },
  className = '',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      try {
        setUploading(true);
        await onUpload(file);
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error('Failed to upload image');
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      } ${className}`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className='relative'>
          <img src={preview} alt='Preview' className='max-h-48 mx-auto rounded-lg' />
          <Button
            variant='destructive'
            size='sm'
            className='absolute top-2 right-2'
            onClick={(e) => {
              e.stopPropagation();
              setPreview(null);
            }}
          >
            Remove
          </Button>
        </div>
      ) : (
        <div className='py-8'>
          {isDragActive ? (
            <p className='text-primary'>Drop the image here...</p>
          ) : (
            <div className='space-y-2'>
              <p className='text-muted-foreground'>
                Drag and drop an image here, or click to select
              </p>
              <p className='text-sm text-muted-foreground'>Max size: {maxSize / 1024 / 1024}MB</p>
            </div>
          )}
        </div>
      )}
      {uploading && (
        <div className='absolute inset-0 bg-background/80 flex items-center justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </div>
      )}
    </div>
  );
}
