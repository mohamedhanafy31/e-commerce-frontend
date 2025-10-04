"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Truck, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Optionally fetch order details by number if needed later
  }, [orderNumber]);

  if (!orderNumber) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find the order you're looking for.
        </p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Order Number:</span>
              <span className="font-mono text-lg">{orderNumber}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Order Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Status:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Processing
              </span>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Confirmation Email</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll receive an order confirmation email shortly with all the details.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Order Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    We're preparing your items for shipment. This usually takes 1-2 business days.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Truck className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Shipping Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll receive tracking information once your order ships.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Signup */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Stay Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Get order updates and exclusive offers delivered to your inbox.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={`/orders/track?order=${orderNumber}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Track Your Order
            </Button>
          </Link>
          
          <Link href="/products" className="flex-1">
            <Button className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Need help with your order?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
