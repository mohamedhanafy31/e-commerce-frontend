"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ImageService } from "@/services/imageService";
import { Star, ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Product, Review } from "@/types";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, formatDate } from "@/lib/utils";

import { apiClient } from "@/lib/api-client";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRes = await apiClient.get<{ data: Product }>(`/products/${productId}`);
        setProduct(productRes.data);
        // Fetch reviews list
        const reviewsRes = await apiClient.get<{ data: { reviews: Review[] } }>(`/reviews?productId=${productId}`);
        setReviews(reviewsRes.data.reviews || []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product.id, quantity);
      // Show success message or toast
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 0)) {
      setQuantity(newQuantity);
    }
  };

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-warm-sand/30 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-warm-sand/30 rounded"></div>
              <div className="h-4 bg-warm-sand/30 rounded w-3/4"></div>
              <div className="h-6 bg-warm-sand/30 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-deep-maroon">المنتج غير موجود</h1>
        <p className="text-deep-maroon/70">المنتج الذي تبحث عنه غير موجود.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gradient-to-br from-warm-sand/30 to-ivory border-2 border-warm-sand">
            <Image
              src={ImageService.resolveProductImageUrl(product.image_url, 'large')}
              alt={product.name}
              fill
              className="object-contain bg-white"
              priority
            />
          </div>
          
          {/* TODO: Add image gallery when multiple images are supported */}
          {/* <div className="grid grid-cols-4 gap-2">
            {product.images?.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square relative overflow-hidden rounded-md border-2 ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div> */}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-deep-maroon">{product.name}</h1>
            
            {/* Rating */}
            {product.average_rating && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {renderStars(product.average_rating)}
                </div>
                <span className="text-sm text-deep-maroon/70">
                  ({product.average_rating.toFixed(1)}) • {reviews.length} تقييمات
                </span>
              </div>
            )}

            {/* Price */}
            <div className="text-3xl font-bold text-emerald-green mb-4">
              {formatPrice(product.price)}
            </div>

            {/* Categories and Tags */}
            <div className="space-y-2 mb-4">
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category) => (
                  <span
                    key={category.id}
                    className="inline-block px-3 py-1 text-sm bg-warm-sand text-deep-maroon rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block px-2 py-1 text-xs bg-warm-sand/50 text-deep-maroon/80 rounded-md"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock_quantity > 0 ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                  <span className="text-sm text-emerald-green font-medium">
                    {product.stock_quantity > 10 
                      ? "متوفر" 
                      : `متبقي ${product.stock_quantity} فقط في المخزون`
                    }
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-deep-maroon rounded-full"></div>
                  <span className="text-sm text-deep-maroon font-medium">نفد المخزون</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2 text-deep-maroon">الوصف</h3>
            <p className="text-deep-maroon/70 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity and Add to Cart */}
          {product.stock_quantity > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-deep-maroon">الكمية:</span>
                <div className="flex items-center border border-warm-sand rounded-md bg-ivory">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="text-deep-maroon hover:bg-warm-sand/30"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center text-deep-maroon font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock_quantity}
                    className="text-deep-maroon hover:bg-warm-sand/30"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-emerald-green hover:bg-green-800 text-white"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  أضف للسلة
                </Button>
                <Button variant="outline" size="lg" className="border-gold text-gold hover:bg-gold hover:text-deep-maroon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-gold text-gold hover:bg-gold hover:text-deep-maroon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <Card className="border-warm-sand bg-ivory">
        <CardHeader className="border-b border-warm-sand/50">
          <CardTitle className="text-deep-maroon">تقييمات العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-warm-sand/30 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                      <span className="font-medium text-deep-maroon">{review.reviewerName}</span>
                    </div>
                    <span className="text-sm text-deep-maroon/70">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  {review.reviewText && (
                    <p className="text-deep-maroon/70">{review.reviewText}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-deep-maroon/70">لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!</p>
          )}

          {/* TODO: Add review form when backend is ready */}
          {/* <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold mb-4">Write a Review</h4>
            <ReviewForm productId={product.id} onSubmit={handleReviewSubmit} />
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
