'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  landingImageService,
  LandingImageSection,
  ImageOptimizationSettings,
} from '@/app/services/landing-images';
import { ImagePlus, X, Settings2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LandingImageUploadProps {
  onUploadComplete: (images: { path: string; alt: string; order?: number }[]) => void;
  section: LandingImageSection;
  currentImages?: { path: string; alt: string; order?: number }[];
  className?: string;
  aspectRatio?: 'video' | 'square' | 'auto';
  maxWidth?: string;
  multiple?: boolean;
}

export function LandingImageUpload({
  onUploadComplete,
  section,
  currentImages = [],
  className = '',
  aspectRatio = 'video',
  maxWidth = 'max-w-2xl',
  multiple = false,
}: LandingImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState<{ url: string; alt: string; order?: number }[]>(
    currentImages.map((img) => ({ url: img.path, alt: img.alt, order: img.order }))
  );
  const [optimizationSettings, setOptimizationSettings] = useState<ImageOptimizationSettings>(
    landingImageService.getOptimizationSettings(section)
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (!multiple && files.length > 1) {
      toast.error('Please upload only one image for this section');
      return;
    }

    try {
      setIsUploading(true);
      const newPreviews = [...previews];
      const newImages = [];

      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error('Please upload an image file');
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB');
          continue;
        }

        const previewUrl = URL.createObjectURL(file);
        const order = newPreviews.length;
        newPreviews.push({ url: previewUrl, alt: '', order });

        const image = await landingImageService.uploadLandingImage(
          file,
          section,
          '',
          order,
          optimizationSettings
        );
        newImages.push({ path: image.path, alt: image.alt, order: image.order });
      }

      setPreviews(newPreviews);
      onUploadComplete([...currentImages, ...newImages]);
      toast.success('Images uploaded successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onUploadComplete(newPreviews.map((p) => ({ path: p.url, alt: p.alt, order: p.order })));
  };

  const handleAltChange = (index: number, alt: string) => {
    const newPreviews = [...previews];
    newPreviews[index].alt = alt;
    setPreviews(newPreviews);
    onUploadComplete(newPreviews.map((p) => ({ path: p.url, alt: p.alt, order: p.order })));
  };

  const handleOrderChange = (index: number, newOrder: number) => {
    const newPreviews = [...previews];
    const oldOrder = newPreviews[index].order || index;
    newPreviews[index].order = newOrder;

    // Update other images' orders
    newPreviews.forEach((preview, i) => {
      if (i !== index && preview.order === newOrder) {
        preview.order = oldOrder;
      }
    });

    setPreviews(newPreviews);
    onUploadComplete(newPreviews.map((p) => ({ path: p.url, alt: p.alt, order: p.order })));
  };

  const aspectRatioClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    auto: 'aspect-auto',
  }[aspectRatio];

  return (
    <div className={cn('relative', maxWidth, className)}>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept='image/*'
        multiple={multiple}
        className='hidden'
      />

      <div className='space-y-4'>
        {previews.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {previews.map((preview, index) => (
              <div
                key={index}
                className={cn(
                  'relative w-full overflow-hidden rounded-lg border',
                  aspectRatioClass
                )}
              >
                <Image
                  src={preview.url}
                  alt={preview.alt}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
                <div className='absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity'>
                  <div className='absolute bottom-4 left-4 right-4 space-y-2'>
                    <input
                      type='text'
                      value={preview.alt}
                      onChange={(e) => handleAltChange(index, e.target.value)}
                      placeholder='Enter image description'
                      className='w-full bg-white/90 dark:bg-black/90 text-sm px-3 py-2 rounded-md'
                    />
                    {multiple && (
                      <input
                        type='number'
                        value={preview.order}
                        onChange={(e) => handleOrderChange(index, parseInt(e.target.value))}
                        placeholder='Order'
                        className='w-full bg-white/90 dark:bg-black/90 text-sm px-3 py-2 rounded-md'
                      />
                    )}
                  </div>
                </div>
                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  className='absolute top-2 right-2'
                  onClick={() => handleRemove(index)}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className='flex items-center gap-4'>
          <Button
            type='button'
            variant='outline'
            className={cn('flex-1', aspectRatioClass)}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <ImagePlus className='h-8 w-8 text-muted-foreground' />
            <span className='ml-2'>
              Upload {section} Image{multiple ? 's' : ''}
            </span>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline' size='icon'>
                <Settings2 className='h-4 w-4' />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Image Optimization Settings</DialogTitle>
              </DialogHeader>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label>Quality</Label>
                  <Input
                    type='number'
                    min='1'
                    max='100'
                    value={optimizationSettings.quality}
                    onChange={(e) =>
                      setOptimizationSettings((prev) => ({
                        ...prev,
                        quality: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Width</Label>
                  <Input
                    type='number'
                    value={optimizationSettings.width}
                    onChange={(e) =>
                      setOptimizationSettings((prev) => ({
                        ...prev,
                        width: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Height</Label>
                  <Input
                    type='number'
                    value={optimizationSettings.height}
                    onChange={(e) =>
                      setOptimizationSettings((prev) => ({
                        ...prev,
                        height: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Format</Label>
                  <Select
                    value={optimizationSettings.format}
                    onValueChange={(value: 'jpeg' | 'png' | 'webp') =>
                      setOptimizationSettings((prev) => ({
                        ...prev,
                        format: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select format' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='jpeg'>JPEG</SelectItem>
                      <SelectItem value='png'>PNG</SelectItem>
                      <SelectItem value='webp'>WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
