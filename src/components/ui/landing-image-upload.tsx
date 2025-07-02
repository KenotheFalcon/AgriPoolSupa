'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface LandingImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  aspectRatio?: number;
  maxSize?: number;
  className?: string;
}

export function LandingImageUpload({
  value,
  onChange,
  onRemove,
  aspectRatio = 16 / 9,
  maxSize = 5 * 1024 * 1024, // 5MB
  className = '',
}: LandingImageUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > maxSize) {
        setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    },
    [onChange, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    maxSize,
  });

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
        }`}
        style={{ aspectRatio }}
      >
        <input {...getInputProps()} />
        {value ? (
          <>
            <OptimizedImage
              src={value}
              alt='Uploaded image'
              fill
              className='object-cover rounded-lg'
            />
            <Button
              type='button'
              variant='destructive'
              size='icon'
              className='absolute top-2 right-2'
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <X className='h-4 w-4' />
            </Button>
          </>
        ) : (
          <div className='absolute inset-0 flex flex-col items-center justify-center text-center p-4'>
            <Upload className='h-8 w-8 text-gray-400 mb-2' />
            <p className='text-sm text-gray-600'>
              {isDragActive ? 'Drop the image here' : 'Drag and drop an image, or click to select'}
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              PNG, JPG, JPEG, WEBP up to {maxSize / 1024 / 1024}MB
            </p>
          </div>
        )}
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
