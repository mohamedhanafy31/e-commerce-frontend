"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useCartStore } from "@/stores/cartStore";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

// Mock product data - Replace with API calls when backend is ready
const mockProducts: Record<number, Product> = {
  1: {
    id: 1,
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation.",
    price: 199.99,
    sku: "WH-001",
    stock_quantity: 15,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    is_active: true,
    categories: [{ id: 1, name: "Electronics" }],
    tags: [{ id: 1, name: "wireless" }],
    average_rating: 4.5,
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  },
  2: {
    id: 2,
    name: "Smart Fitness Watch",
    description: "Track your fitness goals with this advanced smartwatch.",
    price: 299.99,
    sku: "SW-002",
    stock_quantity: 8,
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    is_active: true,
    categories: [{ id: 2, name: "Wearables" }],
    tags: [{ id: 2, name: "fitness" }],
    average_rating: 4.2,
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  },
  3: {
    id: 3,
    name: "Ergonomic Office Chair",
    description: "Comfortable ergonomic office chair for long work sessions.",
    price: 449.99,
    sku: "OC-003",
    stock_quantity: 3,
    image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    is_active: true,
    categories: [{ id: 3, name: "Furniture" }],
    tags: [{ id: 3, name: "office" }],
    average_rating: 4.8,
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  }
};

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } = useCartStore();
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(true);

  // TODO: Replace with actual API calls when backend is ready
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get unique product IDs from cart items
        const productIds = [...new Set(items.map(item => item.productId))];
        
        // In a real app, you would fetch these products from the API
        // const productPromises = productIds.map(id => productService.getProduct(id));
        // const productResults = await Promise.all(productPromises);
        // const productsMap = productResults.reduce((acc, product) => {
        //   acc[product.id] = product;
        //   return acc;
        // }, {} as Record<number, Product>);
        
        // Mock data for now
        const productsMap = productIds.reduce((acc, id) => {
          if (mockProducts[id]) {
            acc[id] = mockProducts[id];
          }
          return acc;
        }, {} as Record<number, Product>);
        
        setProducts(productsMap);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setLoading(false);
      }
    };

    if (items.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [items]);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    const product = products[productId];
    if (product && newQuantity <= product.stock_quantity && newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: number) => {
    removeItem(productId);
  };

  const calculateSubtotal = () => {
    const priceMap = new Map(Object.values(products).map(p => [p.id, p.price]));
    return getTotalPrice(priceMap);
  };

  const calculateShipping = () => {
    // TODO: Implement shipping calculation based on backend logic
    const subtotal = calculateSubtotal();
    if (subtotal >= 100) return 0; // Free shipping over $100
    return 9.99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-warm-sand/50 rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex space-x-4 p-4 border border-warm-sand rounded-lg bg-ivory/50">
                <div className="w-20 h-20 bg-warm-sand/50 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-warm-sand/50 rounded w-3/4"></div>
                  <div className="h-4 bg-warm-sand/50 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 mx-auto text-deep-maroon/50 mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-deep-maroon">السلة فارغة</h1>
          <p className="text-deep-maroon/70 mb-6">
            لم تقم بإضافة أي منتجات إلى السلة بعد.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-emerald-green hover:bg-green-800 text-white">
              متابعة التسوق
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-deep-maroon">عربة التسوق</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="border-deep-maroon text-deep-maroon hover:bg-deep-maroon hover:text-white"
            >
              مسح السلة
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item) => {
              const product = products[item.productId];
              if (!product) return null;

              return (
                <Card key={item.productId} className="border-warm-sand bg-ivory">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 relative overflow-hidden rounded-md bg-warm-sand/30 flex-shrink-0">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-warm-sand/50">
                            <span className="text-deep-maroon/50 text-xs">لا توجد صورة</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-medium text-deep-maroon hover:text-emerald-green transition-colors"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-deep-maroon/70 mt-1 line-clamp-2">
                          {product.description}
                        </p>
                        
                        {/* Stock warning */}
                        {product.stock_quantity <= 5 && (
                          <p className="text-sm text-gold mt-1 font-medium">
                            متبقي {product.stock_quantity} فقط في المخزون
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="border-warm-sand text-deep-maroon hover:bg-warm-sand/30"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center text-deep-maroon font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= product.stock_quantity}
                          className="border-warm-sand text-deep-maroon hover:bg-warm-sand/30"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Price and Remove */}
                      <div className="text-right">
                        <div className="font-semibold text-emerald-green">
                          {formatPrice(product.price * item.quantity)}
                        </div>
                        <div className="text-sm text-deep-maroon/70">
                          {formatPrice(product.price)} للقطعة
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-deep-maroon hover:bg-deep-maroon/10 mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 border-warm-sand bg-ivory">
            <CardHeader className="border-b border-warm-sand">
              <CardTitle className="text-deep-maroon">ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-deep-maroon">المنتجات ({getTotalItems()})</span>
                <span className="text-emerald-green font-medium">{formatPrice(calculateSubtotal())}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-deep-maroon">الشحن</span>
                <span className="text-emerald-green font-medium">
                  {calculateShipping() === 0 ? (
                    <span className="text-gold font-bold">مجاني</span>
                  ) : (
                    formatPrice(calculateShipping())
                  )}
                </span>
              </div>

              {calculateShipping() === 0 && calculateSubtotal() >= 100 && (
                <div className="text-sm text-gold font-medium bg-warm-sand/30 p-2 rounded-md text-center">
                  🎉 مؤهل للشغط المجاني!
                </div>
              )}

              {calculateSubtotal() < 100 && calculateSubtotal() > 0 && (
                <div className="text-sm text-deep-maroon/70 bg-warm-sand/20 p-2 rounded-md text-center">
                  أضف {formatPrice(100 - calculateSubtotal())} أكثر للحصول على شحن مجاني
                </div>
              )}

              <div className="border-t border-warm-sand pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-deep-maroon">المجموع الكلي</span>
                  <span className="text-deep-maroon font-bold">{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              <Link href="/checkout" className="w-full">
                <Button size="lg" className="w-full bg-emerald-green hover:bg-green-800 text-white">
                  المتابعة للدفع
                </Button>
              </Link>

              <Link href="/products" className="w-full">
                <Button variant="outline" size="lg" className="w-full border-emerald-green text-emerald-green hover:bg-emerald-green hover:text-white">
                  متابعة التسوق
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
