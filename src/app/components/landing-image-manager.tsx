'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LandingImageUpload } from '@/app/components/ui/landing-image-upload';
import { LandingImageSection } from '@/app/services/landing-images';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LandingImageManagerProps {
  onImageUpdate: (
    section: LandingImageSection,
    images: { path: string; alt: string; order?: number }[]
  ) => void;
  currentImages: Partial<
    Record<LandingImageSection, { path: string; alt: string; order?: number }[]>
  >;
}

export function LandingImageManager({ onImageUpdate, currentImages }: LandingImageManagerProps) {
  const sections: {
    id: LandingImageSection;
    title: string;
    description: string;
    multiple: boolean;
    aspectRatio: 'video' | 'square' | 'auto';
  }[] = [
    {
      id: 'hero',
      title: 'Hero Section',
      description: 'Main banner image for the landing page',
      multiple: false,
      aspectRatio: 'video',
    },
    {
      id: 'features',
      title: 'Features Section',
      description: 'Images showcasing key features',
      multiple: true,
      aspectRatio: 'square',
    },
    {
      id: 'testimonials',
      title: 'Testimonials Section',
      description: 'Images for customer testimonials',
      multiple: true,
      aspectRatio: 'square',
    },
    {
      id: 'about',
      title: 'About Section',
      description: 'Images for the about section',
      multiple: false,
      aspectRatio: 'auto',
    },
    {
      id: 'farmers',
      title: 'Farmers Section',
      description: 'Images showcasing farmers and their work',
      multiple: true,
      aspectRatio: 'square',
    },
    {
      id: 'cta',
      title: 'Call to Action',
      description: 'Images for the call-to-action section',
      multiple: false,
      aspectRatio: 'video',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Landing Page Images</CardTitle>
        <CardDescription>Manage images for different sections of the landing page</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='hero' className='w-full'>
          <TabsList className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
            {sections.map((section) => (
              <TabsTrigger key={section.id} value={section.id}>
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <div className='space-y-4'>
                <div>
                  <h3 className='text-lg font-medium'>{section.title}</h3>
                  <p className='text-sm text-muted-foreground'>{section.description}</p>
                </div>
                <LandingImageUpload
                  section={section.id}
                  currentImages={currentImages[section.id]}
                  onUploadComplete={(images: { path: string; alt: string; order?: number }[]) =>
                    onImageUpdate(section.id, images)
                  }
                  aspectRatio={section.aspectRatio}
                  maxWidth={section.id === 'hero' ? 'max-w-4xl' : 'max-w-md'}
                  multiple={section.multiple}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
