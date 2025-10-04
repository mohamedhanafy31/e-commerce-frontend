"use client";

import { useState } from 'react';
import { Product } from '@/types';
import { ImageService } from '@/services/imageService';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Package, 
  DollarSign, 
  Hash,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleActive: (product: Product) => void;
  onUpdateStock: (product: Product) => void;
}

export function ProductCard({ 
  product, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  onUpdateStock 
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getImageUrl = () => {
    if (imageError || !product.image_url) {
      return '/images/placeholder-product.jpg';
    }

    if (product.image_url.includes('cloudinary.com')) {
      try {
        const parts = product.image_url.split('/');
        const uploadIdx = parts.findIndex(p => p === 'upload');
        if (uploadIdx !== -1) {
          const afterUpload = parts.slice(uploadIdx + 1);
          const startsWithVersion = afterUpload[0]?.startsWith('v') && /^v\d+$/.test(afterUpload[0]);
          const publicIdParts = afterUpload.slice(startsWithVersion ? 1 : 0);
          if (publicIdParts.length > 0) {
            const publicId = publicIdParts.join('/');
            return ImageService.getProductImageUrl(publicId, 'medium');
          }
        }
      } catch {
        // fall through to return original url
      }
    }

    return product.image_url;
  };

  const getStockStatus = () => {
    if (product.stock_quantity === 0) {
      return { text: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-50' };
    } else if (product.stock_quantity < 10) {
      return { text: 'Low Stock', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    } else {
      return { text: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-50' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
          <img
            src={getImageUrl()}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            onError={() => setImageError(true)}
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.bgColor} ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
          </div>

          {/* Active/Inactive Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              product.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {product.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Action Buttons Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onEdit(product)}
                className="bg-white/90 hover:bg-white"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(product)}
                className="bg-white/90 hover:bg-white"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Product Name */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>

          {/* Price and SKU */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-lg font-bold text-green-600">
              <DollarSign className="w-4 h-4" />
              <span>{formatPrice(product.price)}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Hash className="w-3 h-3" />
              <span>{product.sku}</span>
            </div>
          </div>

          {/* Stock Quantity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              <span>{product.stock_quantity} units</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateStock(product)}
              className="text-xs"
            >
              Update Stock
            </Button>
          </div>

          {/* Categories and Tags */}
          <div className="space-y-2">
            {product.categories && product.categories.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Categories:</p>
                <div className="flex flex-wrap gap-1">
                  {product.categories.slice(0, 2).map((category) => (
                    <span
                      key={category.id}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {category.name}
                    </span>
                  ))}
                  {product.categories.length > 2 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      +{product.categories.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Tags:</p>
                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                  {product.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      +{product.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Created Date */}
          <div className="flex items-center space-x-1 text-xs text-gray-500 pt-2 border-t">
            <Calendar className="w-3 h-3" />
            <span>Created {formatDate(product.created_at)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleActive(product)}
              className="flex-1"
            >
              {product.is_active ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" />
                  Deactivate
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  Activate
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(product)}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
