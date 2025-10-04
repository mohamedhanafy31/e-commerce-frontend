"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { ImageService, ImageUploadResponse } from '@/services/imageService';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (image: ImageUploadResponse) => void;
  onImageRemoved?: (publicId: string) => void;
  existingImage?: string; // Cloudinary public_id
  folder?: string;
  className?: string;
}

export function ImageUpload({ 
  onImageUploaded, 
  onImageRemoved, 
  existingImage, 
  folder = 'ecommerce/products',
  className = '' 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<ImageUploadResponse | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      console.log('📤 Uploading image:', file.name);
      const result = await ImageService.uploadImage(file, folder);
      
      setUploadedImage(result);
      onImageUploaded(result);
      
      console.log('✅ Image uploaded successfully:', result.id);
    } catch (err) {
      console.error('❌ Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!uploadedImage) return;

    try {
      console.log('🗑️ Removing image:', uploadedImage.public_id);
      await ImageService.deleteImage(uploadedImage.public_id);
      
      setUploadedImage(null);
      onImageRemoved?.(uploadedImage.public_id);
      
      console.log('✅ Image removed successfully');
    } catch (err) {
      console.error('❌ Error removing image:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove image');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayImage = uploadedImage || existingImage;

  // Generate the image URL for display
  const getImageUrl = (): string => {
    if (uploadedImage) {
      // Use Cloudinary URL for uploaded image
      return ImageService.getProductImageUrl(uploadedImage.public_id, 'medium');
    } else if (existingImage) {
      // If existingImage is a public_id, generate Cloudinary URL
      if (existingImage && !existingImage.startsWith('http')) {
        return ImageService.getProductImageUrl(existingImage, 'medium');
      } else {
        // If it's already a full URL, use it directly
        return existingImage || '';
      }
    }
    return '';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 mb-4 text-gray-500 animate-spin" />
                <p className="mb-2 text-sm text-gray-500">Uploading image...</p>
              </>
            ) : displayImage ? (
              <>
                <ImageIcon className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">Image uploaded successfully</p>
                <p className="text-xs text-gray-500">Click to change image</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </>
            )}
          </div>
          <input
            id="image-upload"
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Image Preview */}
      {displayImage && (
        <div className="relative">
          <div className="relative w-full h-48 bg-white rounded-lg overflow-hidden">
            <img
              src={getImageUrl()}
              alt="Uploaded image"
              className="w-full h-full object-contain"
            />
            {uploadedImage && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p><strong>Public ID:</strong> {uploadedImage?.public_id || existingImage}</p>
            {uploadedImage && (
              <>
                <p><strong>Format:</strong> {uploadedImage.format}</p>
                <p><strong>Size:</strong> {uploadedImage.width} × {uploadedImage.height}</p>
                <p><strong>File Size:</strong> {(uploadedImage.bytes / 1024).toFixed(1)} KB</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Upload Button (alternative) */}
      {!displayImage && (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Choose Image
            </>
          )}
        </Button>
      )}
    </div>
  );
}
