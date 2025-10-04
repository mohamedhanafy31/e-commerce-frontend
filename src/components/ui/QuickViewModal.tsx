"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Eye, Star, Package } from "lucide-react";
import { Button } from "./Button";
import { QuantitySelector } from "./QuantitySelector";
import { Product } from "@/types";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, truncateText } from "@/lib/utils";
import { ImageService } from "@/services/imageService";
import Image from "next/image";
import Link from "next/link";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  // Reset quantity when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product.id, quantity);
      onClose();
    }
  };

  const getImageUrl = () => {
    if (!product) return "";
    return ImageService.resolveProductImageUrl(product.image_url, 'medium');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-tolid-gold text-tolid-gold" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-tolid-gold/50 text-tolid-gold" />
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

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Modal Card */}
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-tolid-light-gold">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Eye className="h-6 w-6 text-tolid-gold" />
                  <h2 className="text-xl font-bold text-tolid-charcoal">معاينة سريعة</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-tolid-light-gold"
                >
                  <X className="h-5 w-5 text-tolid-charcoal" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Product Image */}
                  <div className="space-y-4">
                    <div className="aspect-square relative overflow-hidden rounded-xl bg-gradient-to-br from-tolid-light-gold to-white">
                      {getImageUrl() ? (
                        <Image
                          src={getImageUrl()!}
                          alt={product.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-16 w-16 text-tolid-charcoal/30" />
                        </div>
                      )}
                    </div>

                    {/* Categories */}
                    {product.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {product.categories.slice(0, 3).map((category) => (
                          <span
                            key={category.id}
                            className="inline-block px-3 py-1 text-sm bg-tolid-light-gold text-tolid-charcoal rounded-full font-medium"
                          >
                            {category.name}
                          </span>
                        ))}
                        {product.categories.length > 3 && (
                          <span className="inline-block px-3 py-1 text-sm bg-tolid-light-gold text-tolid-charcoal rounded-full font-medium">
                            +{product.categories.length - 3} أخرى
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="space-y-6">
                    {/* Product Name */}
                    <div>
                      <h1 className="text-2xl font-bold text-tolid-charcoal mb-2">
                        {product.name}
                      </h1>
                      {product.description && (
                        <p className="text-tolid-charcoal/70 leading-relaxed">
                          {truncateText(product.description, 200)}
                        </p>
                      )}
                    </div>

                    {/* Rating */}
                    {product.average_rating && (
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="flex items-center">
                          {renderStars(product.average_rating)}
                        </div>
                        <span className="text-sm text-tolid-charcoal/70">
                          ({product.average_rating.toFixed(1)})
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <span className="text-3xl font-bold text-tolid-red">
                          {formatPrice(product.price)}
                        </span>
                        {product.price < 50 && (
                          <span className="text-lg text-tolid-charcoal/60 line-through">
                            {formatPrice(product.price * 1.3)}
                          </span>
                        )}
                      </div>
                      {product.price < 50 && (
                        <div className="inline-flex items-center bg-tolid-red text-white px-3 py-1 rounded-full text-sm font-bold">
                          خصم
                        </div>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="space-y-2">
                      {product.stock_quantity === 0 ? (
                        <div className="flex items-center space-x-2 space-x-reverse text-tolid-red">
                          <Package className="h-5 w-5" />
                          <span className="font-medium">نفذ المخزون</span>
                        </div>
                      ) : product.stock_quantity <= 5 ? (
                        <div className="flex items-center space-x-2 space-x-reverse text-tolid-gold">
                          <Package className="h-5 w-5" />
                          <span className="font-medium">متبقي {product.stock_quantity} فقط</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 space-x-reverse text-tolid-fresh-green">
                          <Package className="h-5 w-5" />
                          <span className="font-medium">متوفر</span>
                        </div>
                      )}
                    </div>

                    {/* Quantity Selector */}
                    {product.stock_quantity > 0 && (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-tolid-charcoal">
                          الكمية
                        </label>
                        <QuantitySelector
                          value={quantity}
                          onChange={setQuantity}
                          max={product.stock_quantity}
                          className="w-fit"
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        onClick={handleAddToCart}
                        disabled={product.stock_quantity === 0}
                        className="flex-1 bg-tolid-red hover:bg-red-700 text-white font-semibold py-3 rounded-lg"
                      >
                        <ShoppingCart className="h-5 w-5 ml-2" />
                        {product.stock_quantity === 0 ? "نفذ المخزون" : "أضف للسلة"}
                      </Button>
                      <Link href={`/products/${product.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-2 border-tolid-gold text-tolid-gold hover:bg-tolid-gold hover:text-white font-semibold py-3 rounded-lg"
                          onClick={onClose}
                        >
                          عرض التفاصيل
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
