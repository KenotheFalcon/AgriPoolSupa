import { storageService } from './storage';

export interface LandingImage {
  id: string;
  path: string;
  alt: string;
  section: LandingImageSection;
  order?: number;
}

export type LandingImageSection =
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'about'
  | 'farmers'
  | 'cta';

export interface ImageOptimizationSettings {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

const LANDING_IMAGE_PATHS: Record<LandingImageSection, string> = {
  hero: 'landing/hero',
  features: 'landing/features',
  testimonials: 'landing/testimonials',
  about: 'landing/about',
  farmers: 'landing/farmers',
  cta: 'landing/cta',
};

const DEFAULT_OPTIMIZATION_SETTINGS: Record<LandingImageSection, ImageOptimizationSettings> = {
  hero: { quality: 90, width: 1920, height: 1080, format: 'webp' },
  features: { quality: 85, width: 800, height: 600, format: 'webp' },
  testimonials: { quality: 85, width: 400, height: 400, format: 'webp' },
  about: { quality: 85, width: 1200, height: 800, format: 'webp' },
  farmers: { quality: 85, width: 800, height: 600, format: 'webp' },
  cta: { quality: 90, width: 1920, height: 600, format: 'webp' },
};

class LandingImageService {
  private static instance: LandingImageService;

  private constructor() {}

  public static getInstance(): LandingImageService {
    if (!LandingImageService.instance) {
      LandingImageService.instance = new LandingImageService();
    }
    return LandingImageService.instance;
  }

  async uploadLandingImage(
    file: File,
    section: LandingImageSection,
    alt: string,
    order?: number,
    optimizationSettings?: ImageOptimizationSettings
  ): Promise<LandingImage> {
    const timestamp = Date.now();
    const path = `${LANDING_IMAGE_PATHS[section]}/${timestamp}-${file.name}`;
    const settings = {
      ...DEFAULT_OPTIMIZATION_SETTINGS[section],
      ...optimizationSettings,
    };

    try {
      const url = await storageService.uploadImage(file, path);
      return {
        id: timestamp.toString(),
        path,
        alt,
        section,
        order,
      };
    } catch (error: any) {
      console.error('Error uploading landing image:', error);
      throw new Error(error.message);
    }
  }

  async getLandingImageUrl(path: string): Promise<string> {
    return storageService.getImageUrl(path);
  }

  getDefaultImages(): Record<LandingImageSection, string[]> {
    return {
      hero: ['/images/landing/hero-default.jpg'],
      features: [
        '/images/landing/features-default-1.jpg',
        '/images/landing/features-default-2.jpg',
        '/images/landing/features-default-3.jpg',
      ],
      testimonials: [
        '/images/landing/testimonials-default-1.jpg',
        '/images/landing/testimonials-default-2.jpg',
        '/images/landing/testimonials-default-3.jpg',
      ],
      about: ['/images/landing/about-default.jpg'],
      farmers: ['/images/landing/farmers-default-1.jpg', '/images/landing/farmers-default-2.jpg'],
      cta: ['/images/landing/cta-default.jpg'],
    };
  }

  getOptimizationSettings(section: LandingImageSection): ImageOptimizationSettings {
    return DEFAULT_OPTIMIZATION_SETTINGS[section];
  }
}

export const landingImageService = LandingImageService.getInstance();
