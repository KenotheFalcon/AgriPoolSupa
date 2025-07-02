'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useAuth } from '@/hooks/useAuth';
import { UploadCloud, Loader, CheckCircle, AlertCircle, X } from 'lucide-react';

interface UploadProgress {
  file: File;
  state: 'compressing' | 'uploading' | 'success' | 'error';
  preview: string;
  url?: string; // Will hold the final Firebase Storage URL
  storagePath?: string;
}

interface ImageUploaderProps {
  onUploadsUpdate: (urls: string[]) => void;
  maxFiles?: number;
}

export function ImageUploader({ onUploadsUpdate, maxFiles = 5 }: ImageUploaderProps) {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  useEffect(() => {
    // Whenever the uploads state changes, inform the parent of the current successful URLs
    const successfulUrls = uploads.filter((u) => u.state === 'success' && u.url).map((u) => u.url!);
    onUploadsUpdate(successfulUrls);
  }, [uploads, onUploadsUpdate]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!user) return;

      const filesToUpload = acceptedFiles.slice(0, maxFiles - uploads.length);

      const newUploads: UploadProgress[] = filesToUpload.map((file) => ({
        file,
        state: 'compressing',
        preview: URL.createObjectURL(file),
      }));

      setUploads((prev) => [...prev, ...newUploads]);

      for (const upload of newUploads) {
        try {
          const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
          const compressedFile = await imageCompression(upload.file, options);

          setUploads((prev) =>
            prev.map((u) => (u.preview === upload.preview ? { ...u, state: 'uploading' } : u))
          );

          const storage = getStorage();
          const storagePath = `produce-images/${user.uid}/${Date.now()}-${compressedFile.name}`;
          const storageRef = ref(storage, storagePath);

          await uploadBytes(storageRef, compressedFile);
          const downloadURL = await getDownloadURL(storageRef);

          setUploads((prev) =>
            prev.map((u) =>
              u.preview === upload.preview
                ? { ...u, state: 'success', url: downloadURL, storagePath }
                : u
            )
          );
        } catch (error) {
          console.error('Upload failed for', upload.file.name, error);
          setUploads((prev) =>
            prev.map((u) => (u.preview === upload.preview ? { ...u, state: 'error' } : u))
          );
        }
      }
    },
    [user, maxFiles, uploads.length]
  );

  const removeImage = async (previewToRemove: string) => {
    const uploadToRemove = uploads.find((u) => u.preview === previewToRemove);
    if (!uploadToRemove) return;

    // If the image was successfully uploaded, delete it from Firebase Storage
    if (uploadToRemove.state === 'success' && uploadToRemove.storagePath) {
      const storage = getStorage();
      const imageRef = ref(storage, uploadToRemove.storagePath);
      try {
        await deleteObject(imageRef);
      } catch (error) {
        console.error('Failed to delete image from storage:', error);
      }
    }

    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(previewToRemove);
    setUploads((prev) => prev.filter((u) => u.preview !== previewToRemove));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
    maxFiles: maxFiles,
    disabled: uploads.length >= maxFiles,
  });

  return (
    <div className='space-y-4'>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-primary'}
          ${uploads.length >= maxFiles ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        <div className='flex flex-col items-center justify-center'>
          <UploadCloud className='h-10 w-10 text-muted-foreground' />
          <p className='mt-2 text-sm text-muted-foreground'>
            Drag & drop up to {maxFiles} images, or click to select
          </p>
          <p className='text-xs text-muted-foreground'>
            {uploads.length} / {maxFiles} images selected
          </p>
        </div>
      </div>

      {uploads.length > 0 && (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
          {uploads.map((upload) => (
            <div
              key={upload.preview}
              className='relative aspect-square border rounded-lg overflow-hidden'
            >
              <img
                src={upload.preview}
                alt={`preview ${upload.file.name}`}
                className='w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-black/40 flex items-center justify-center text-white p-2'>
                {upload.state === 'compressing' && <Loader className='animate-spin' />}
                {upload.state === 'uploading' && <p className='text-xs'>Uploading...</p>}
                {upload.state === 'success' && <CheckCircle />}
                {upload.state === 'error' && <AlertCircle />}
              </div>
              <button
                type='button'
                onClick={() => removeImage(upload.preview)}
                className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 h-6 w-6 flex items-center justify-center hover:bg-red-600 transition-colors'
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
