import { apiClient } from '@/lib/api-client';

export interface ImageUploadResponse {
  id: string;
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  folder: string;
  created_at: string;
}

export interface OptimizedImageResponse {
  public_id: string;
  url: string;
  size: string;
}

export class ImageService {
  /**
   * Upload a single image
   */
  static async uploadImage(file: File, folder?: string): Promise<ImageUploadResponse> {
    console.log('📤 Frontend: Uploading image:', {
      name: file.name,
      size: file.size,
      type: file.type,
      folder
    });

    const formData = new FormData();
    formData.append('image', file);
    if (folder) {
      formData.append('folder', folder);
    }

    try {
      const response = await apiClient.adminPost<{ data: ImageUploadResponse }>(
        '/images/upload',
        formData
      );

      console.log('✅ Frontend: Image uploaded successfully:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('❌ Frontend: Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Upload multiple images
   */
  static async uploadMultipleImages(files: File[], folder?: string): Promise<ImageUploadResponse[]> {
    console.log('📤 Frontend: Uploading multiple images:', files.length);

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('images', file);
    });
    if (folder) {
      formData.append('folder', folder);
    }

    try {
      const response = await apiClient.adminPost<{ data: ImageUploadResponse[] }>(
        '/images/upload-multiple',
        formData
      );

      console.log('✅ Frontend: Multiple images uploaded successfully:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Frontend: Error uploading multiple images:', error);
      throw error;
    }
  }

  /**
   * Delete an image
   */
  static async deleteImage(publicId: string): Promise<boolean> {
    console.log('🗑️ Frontend: Deleting image:', publicId);

    try {
      const response = await apiClient.adminDelete<{ data: { deleted: boolean; public_id: string } }>(
        `/images/${publicId}`
      );

      console.log('✅ Frontend: Image deleted successfully:', publicId);
      return response.data.deleted;
    } catch (error) {
      console.error('❌ Frontend: Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Get optimized image URL
   */
  static async getOptimizedImageUrl(publicId: string, size: 'thumbnail' | 'medium' | 'large' = 'medium'): Promise<string> {
    console.log('🔄 Frontend: Getting optimized image URL:', { publicId, size });

    try {
      const response = await apiClient.adminGet<{ data: OptimizedImageResponse }>(
        `/images/${publicId}/optimized?size=${size}`
      );

      console.log('✅ Frontend: Optimized image URL generated:', response.data.url);
      return response.data.url;
    } catch (error) {
      console.error('❌ Frontend: Error getting optimized image URL:', error);
      throw error;
    }
  }

  /**
   * Generate Cloudinary URL for display
   */
  static getCloudinaryUrl(publicId: string, options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}): string {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dj3ewvbqm';
    const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
    
    const transformations = [];
    
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);
    
    const transformString = transformations.length > 0 ? `${transformations.join(',')}/` : '';
    
    return `${baseUrl}/${transformString}${publicId}`;
  }

  /**
   * Get product image URL with default optimizations
   */
  static getProductImageUrl(publicId: string, size: 'thumbnail' | 'medium' | 'large' = 'medium'): string {
    const sizeConfig = {
      // Use c_fit to avoid cropping so the full image is visible inside the box
      thumbnail: { width: 200, height: 200, crop: 'fit' },
      medium: { width: 400, height: 400, crop: 'fit' },
      large: { width: 800, height: 800, crop: 'fit' },
    };

    return this.getCloudinaryUrl(publicId, {
      ...sizeConfig[size],
      quality: 'auto',
      format: 'auto',
    });
  }

  /**
   * Resolve a product image URL for display with fallback handling and Cloudinary optimization.
   * Accepts a raw URL (possibly a Cloudinary secure_url) and returns a safe display URL.
   */
  static resolveProductImageUrl(rawUrl?: string, size: 'thumbnail' | 'medium' | 'large' = 'medium'): string {
    const placeholder = '/images/placeholder-product.jpg';
    if (!rawUrl) return placeholder;

    if (rawUrl.includes('cloudinary.com')) {
      try {
        const parts = rawUrl.split('/');
        const uploadIdx = parts.findIndex(p => p === 'upload');
        if (uploadIdx !== -1) {
          const afterUpload = parts.slice(uploadIdx + 1);
          const startsWithVersion = afterUpload[0]?.startsWith('v') && /^v\d+$/.test(afterUpload[0]);
          const publicIdParts = afterUpload.slice(startsWithVersion ? 1 : 0);
          if (publicIdParts.length > 0) {
            const publicId = publicIdParts.join('/');
            return this.getProductImageUrl(publicId, size);
          }
        }
      } catch {
        // fall back below
      }
    }

    return rawUrl || placeholder;
  }
}
