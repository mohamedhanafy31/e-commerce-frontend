"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { QuickViewModal } from "@/components/ui/QuickViewModal";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, truncateText } from "@/lib/utils";
import { ImageService } from "@/services/imageService";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    addItem(product.id, 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    setIsQuickViewOpen(true);
  };

  const getImageUrl = () => ImageService.resolveProductImageUrl(product.image_url, 'medium');

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 border-warm-sand hover:border-gold bg-ivory">
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gradient-to-br from-warm-sand to-ivory">
            {getImageUrl() ? (
              <Image
                src={getImageUrl()!}
                alt={product.name}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-110 bg-ivory"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <Image
                src="/images/placeholder-product.jpg"
                alt="No image"
                fill
                className="object-cover"
              />
            )}
            
            {/* Sale Badge */}
            {product.price < 50 && (
              <div className="absolute top-2 right-2 bg-deep-maroon text-gold px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                خصم
              </div>
            )}
            
            {/* Stock indicator */}
            {product.stock_quantity === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">نفذ المخزون</span>
              </div>
            )}
            
            {/* Quick Action Нотоны */}
            <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2 space-x-reverse">
              <Button
                onClick={handleQuickView}
                size="sm"
                className="bg-gold hover:bg-deep-maroon text-deep-maroon hover:text-white shadow-lg"
                title="معاينة سريعة"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                size="sm"
                className="bg-emerald-green hover:bg-green-800 text-white shadow-lg"
                title="أضف للسلة"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-emerald-green transition-colors text-deep-maroon">
              {truncateText(product.name, 50)}
            </h3>
            
            <p className="text-sm text-deep-maroon/70 line-clamp-2">
              {truncateText(product.description || "", 100)}
            </p>

            {/* Categories */}
            {product.categories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.categories.slice(0, 2).map((category) => (
                  <span
                    key={category.id}
                    className="inline-block px-2 py-1 text-xs bg-warm-sand text-deep-maroon rounded-md font-medium"
                  >
                    {category.name}
                  </span>
                ))}
                {product.categories.length > 2 && (
                  <span className="inline-block px-2 py-1 text-xs bg-warm-sand text-deep-maroon rounded-md font-medium">
                    +{product.categories.length - 2} أخرى
                  </span>
                )}
              </div>
            )}

            {/* Rating */}
            {product.average_rating && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {renderStars(product.average_rating)}
                </div>
                <span className="text-sm text-deep-maroon/70">
                  ({product.average_rating.toFixed(1)})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-emerald-green">
                  {formatPrice(product.price)}
                </span>
                {product.price < 50 && (
                  <span className="text-sm text-deep-maroon line-through">
                    {formatPrice(product.price * 1.3)}
                  </span>
                )}
              </div>
              
              {product.stock_quantity > 2 && product.stock_quantity <= 5 && (
                <span className="text-sm text-gold font-bold bg-warm-sand px-2 py-1 rounded-full">
                  متبقي {product.stock_quantity} فقط
                </span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="w-full bg-emerald-green hover:bg-green-800 text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:shadow-lg"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock_quantity === 0 ? "نفذ المخزون" : "أضف للسلة"}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={product}
      />
    </Link>
  );
}
