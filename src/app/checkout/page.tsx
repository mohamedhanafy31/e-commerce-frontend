"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CustomerProtectedRoute } from "@/components/auth/CustomerProtectedRoute";
import { Check, CreditCard, Truck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useCartStore } from "@/stores/cartStore";
import { Product } from "@/types";
import { apiClient } from "@/lib/api-client";
import { orderService } from "@/services/orderService";
import { formatPrice } from "@/lib/utils";

// Removed mock products. We'll fetch live products by IDs from the backend.

const shippingMethods = [
  { id: "standard", name: "Standard Shipping", price: 9.99, days: "5-7 business days" },
  { id: "express", name: "Express Shipping", price: 19.99, days: "2-3 business days" },
  { id: "overnight", name: "Overnight Shipping", price: 39.99, days: "1 business day" }
];

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, getTotalItems, getTotalPrice } = useCartStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US"
  });
  
  const [selectedShipping, setSelectedShipping] = useState("standard");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productIds = [...new Set(items.map(item => item.productId))];
        // Fetch each product; backend does not provide batch endpoint yet
        const results = await Promise.all(
          productIds.map(async (id) => {
            try {
              const res = await apiClient.get<{ data: { product: Product } }>(`/products/${id}`);
              return res.data.product;
            } catch {
              return null;
            }
          })
        );
        const map: Record<number, Product> = {};
        results.filter(Boolean).forEach((p) => { map[(p as Product).id] = p as Product; });
        setProducts(map);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setLoading(false);
      }
    };

    if (items.length > 0) {
      fetchProducts();
    } else {
      // Redirect to cart if no items
      router.push('/cart');
    }
  }, [items, router]);

  const calculateSubtotal = () => {
    const priceMap = new Map(Object.values(products).map(p => [p.id, p.price]));
    return getTotalPrice(priceMap);
  };

  const getShippingCost = () => {
    const subtotal = calculateSubtotal();
    if (subtotal >= 100 && selectedShipping === "standard") return 0;
    return shippingMethods.find(method => method.id === selectedShipping)?.price || 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + getShippingCost();
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`,
        shippingMethod: selectedShipping,
        shippingCost: getShippingCost(),
      } as const;

      const order = await orderService.createOrder(payload as any);
      clearCart();
      router.push(`/orders/confirmation?order=${order.orderNumber}`);
    } catch (error) {
      console.error('Failed to create order:', error);
      // Show error message
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "Shipping", icon: MapPin },
    { number: 2, title: "Review & Payment", icon: CreditCard }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-warm-sand/50 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-warm-sand/30 rounded"></div>
            </div>
            <div className="h-96 bg-warm-sand/30 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CustomerProtectedRoute>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-deep-maroon">إتمام الطلب</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  isCompleted 
                    ? 'bg-emerald-green border-emerald-green text-white' 
                    : isActive 
                    ? 'border-emerald-green text-emerald-green bg-ivory' 
                    : 'border-warm-sand text-warm-sand/70'
                }`}>
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={`ml-2 font-medium text-sm ${
                  isActive ? 'text-emerald-green' : isCompleted ? 'text-emerald-green' : 'text-deep-maroon/70'
                }`}>
                  {step.number === 1 ? 'التوصيل' : 'المراجعة والدفع'}
                </span>
                {step.number < steps.length && (
                  <div className={`w-16 h-0.5 mx-4 transition-colors ${
                    isCompleted ? 'bg-emerald-green' : 'bg-warm-sand'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <Card className="border-warm-sand bg-ivory">
              <CardHeader className="border-b border-warm-sand/50">
                <CardTitle className="flex items-center text-deep-maroon">
                  <MapPin className="h-5 w-5 mr-2 text-emerald-green" />
                  معلومات التوصيل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-deep-maroon">الاسم الأول *</label>
                      <Input
                        required
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        className="border-gold focus:border-emerald-green focus:ring-emerald-green"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-deep-maroon">الاسم الأخير *</label>
                      <Input
                        required
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        className="border-gold focus:border-emerald-green focus:ring-emerald-green"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-deep-maroon">البريد الإلكتروني *</label>
                    <Input
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="border-gold focus:border-emerald-green focus:ring-emerald-green"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-deep-maroon">رقم الهاتف</label>
                    <Input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="border-gold focus:border-emerald-green focus:ring-emerald-green"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-deep-maroon">العنوان *</label>
                    <Input
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="border-gold focus:border-emerald-green focus:ring-emerald-green"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-deep-maroon">المدينة *</label>
                      <Input
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                        className="border-gold focus:border-emerald-green focus:ring-emerald-green"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-deep-maroon">الولاية *</label>
                      <Input
                        required
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                        className="border-gold focus:border-emerald-green focus:ring-emerald-green"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-deep-maroon">الرمز البريدي *</label>
                      <Input
                        required
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                        className="border-gold focus:border-emerald-green focus:ring-emerald-green"
                      />
                    </div>
                  </div>

                  {/* Shipping Methods */}
                  <div className="mt-6">
                    <h3 className="font-medium mb-4 text-deep-maroon">طريقة التوصيل</h3>
                    <div className="space-y-3">
                      {shippingMethods.map((method) => (
                        <label key={method.id} className="flex items-center p-3 border border-warm-sand rounded-lg cursor-pointer hover:bg-warm-sand/30 transition-colors">
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={selectedShipping === method.id}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                            className="mr-3 text-emerald-green focus:ring-emerald-green"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-deep-maroon">{method.name}</span>
                              <span className="font-semibold text-emerald-green">
                                {method.id === "standard" && calculateSubtotal() >= 100 
                                  ? "مجاني" 
                                  : formatPrice(method.price)
                                }
                              </span>
                            </div>
                            <div className="text-sm text-deep-maroon/70">{method.days}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-emerald-green hover:bg-green-800 text-white font-semibold" size="lg">
                    المتابعة للمراجعة
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Order Review */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => {
                      const product = products[item.productId];
                      if (!product) return null;

                      return (
                        <div key={item.productId} className="flex justify-between items-center py-2 border-b">
                          <div>
                            <span className="font-medium">{product.name}</span>
                            <span className="text-muted-foreground ml-2">× {item.quantity}</span>
                          </div>
                          <span className="font-semibold">
                            {formatPrice(product.price * item.quantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Shipping Address
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentStep(1)}
                    >
                      Edit
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p>{shippingInfo.email}</p>
                    {shippingInfo.phone && <p>{shippingInfo.phone}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleOrderSubmit} className="space-y-4">
                    {/* Note: This is a mock payment form - real implementation would use Stripe/PayPal */}
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> This is a demo checkout. No real payment will be processed.
                        In a production environment, this would integrate with a payment processor like Stripe.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Card Number</label>
                      <Input placeholder="1234 5678 9012 3456" disabled />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Expiry Date</label>
                        <Input placeholder="MM/YY" disabled />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">CVV</label>
                        <Input placeholder="123" disabled />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={submitting}
                    >
                      {submitting ? "Processing..." : `Place Order - ${formatPrice(calculateTotal())}`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 border-warm-sand bg-ivory">
            <CardHeader className="border-b border-warm-sand/50">
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
                  {getShippingCost() === 0 ? (
                    <span className="text-gold font-bold">مجاني</span>
                  ) : (
                    formatPrice(getShippingCost())
                  )}
                </span>
              </div>

              <div className="border-t border-warm-sand pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-deep-maroon">المجموع الكلي</span>
                  <span className="text-deep-maroon font-bold">{formatPrice(calculateTotal())}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </CustomerProtectedRoute>
  );
}
