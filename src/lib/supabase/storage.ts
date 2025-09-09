import { supabase } from './client';
import { supabaseAdmin } from './admin';

export interface UploadOptions {
  bucket: string;
  path: string;
  file: File;
  upsert?: boolean;
}

export const uploadFile = async ({ bucket, path, file, upsert = true }: UploadOptions) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert,
      });

    if (error) {
      console.error('Upload error:', error);
      return { data: null, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return { 
      data: { 
        path: data.path,
        fullPath: data.fullPath,
        url: urlData.publicUrl 
      }, 
      error: null 
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return { data: null, error: error.message };
  }
};

export const deleteFile = async (bucket: string, path: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error: any) {
    console.error('Delete error:', error);
    return { error: error.message };
  }
};

export const getFileUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

export const listFiles = async (bucket: string, folder?: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder);

    if (error) {
      console.error('List files error:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('List files error:', error);
    return { data: null, error: error.message };
  }
};

// Create storage buckets (for admin use)
export const createBucket = async (bucketName: string, options?: any) => {
  try {
    const { data, error } = await supabaseAdmin.storage
      .createBucket(bucketName, options);

    if (error) {
      console.error('Create bucket error:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Create bucket error:', error);
    return { data: null, error: error.message };
  }
};

// Bucket names as constants
export const STORAGE_BUCKETS = {
  LISTING_IMAGES: 'listing-images',
  REVIEW_IMAGES: 'review-images',
  PROFILE_IMAGES: 'profile-images',
  DOCUMENTS: 'documents',
} as const;