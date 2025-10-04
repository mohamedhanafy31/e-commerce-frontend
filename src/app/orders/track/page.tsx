"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Order } from "@/types";
import { orderService } from "@/services/orderService";
import { formatPrice, formatDate } from "@/lib/utils";

// Removed mock order; will load from backend

const trackingEvents = [
  {
    status: "PENDING",
    title: "Order Placed",
    description: "Your order has been received and is being processed.",
    timestamp: "2024-01-15T10:30:00Z",
    completed: true
  },
  {
    status: "PROCESSING",
    title: "Order Processing",
    description: "We're preparing your items for shipment.",
    timestamp: "2024-01-15T14:20:00Z",
    completed: true
  },
  {
    status: "SHIPPED",
    title: "Order Shipped",
    description: "Your order has been shipped and is on its way to you.",
    timestamp: "2024-01-16T09:15:00Z",
    completed: true
  },
  {
    status: "DELIVERED",
    title: "Delivered",
    description: "Your order has been delivered to your address.",
    timestamp: null,
    completed: false
  }
];

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("order") || "";
  
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async (orderNum: string) => {
    if (!orderNum.trim()) {
      setError("Please enter an order number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = await orderService.getOrderByNumber(orderNum);
      setOrder(orderData);
    } catch (err) {
      setError("Failed to fetch order. Please try again.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderNumber);
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (!completed) {
      return <Clock className="h-5 w-5 text-gray-400" />;
    }

    switch (status) {
      case "pending":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "processing":
        return <Package className="h-5 w-5 text-orange-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-orange-100 text-orange-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Track Your Order</h1>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Order Number</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter your order number (e.g., ORD-123456-ABC123)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full"
                />
                {error && (
                  <p className="text-sm text-red-600 mt-2">{error}</p>
                )}
              </div>
              <Button type="submit" disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Track Order"}
              </Button>
            </form>
            
            <p className="text-sm text-muted-foreground mt-2">
              You can find your order number in your confirmation email or receipt.
            </p>
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Order Details
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Order Number:</span>
                      <span className="ml-2 font-mono">{order.orderNumber}</span>
                    </div>
                    <div>
                      <span className="font-medium">Order Date:</span>
                      <span className="ml-2">{formatDate(order.createdAt)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Total:</span>
                      <span className="ml-2 font-semibold">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Shipping Method:</span>
                      <span className="ml-2 capitalize">{order.shippingMethod} Shipping</span>
                    </div>
                    <div>
                      <span className="font-medium">Shipping Address:</span>
                      <div className="ml-2 text-sm text-muted-foreground">
                        {order.shippingAddress}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <span className="font-medium">{item.productName}</span>
                        <span className="text-muted-foreground ml-2">× {item.quantity}</span>
                      </div>
                      <span className="font-semibold">{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{formatPrice(order.shippingCost || 0)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingEvents.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(event.status, event.completed)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${event.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {event.title}
                          </h3>
                          {event.timestamp && (
                            <span className="text-sm text-muted-foreground">
                              {formatDate(event.timestamp)}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${event.completed ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Estimated Delivery */}
                {order.status === "SHIPPED" && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Estimated Delivery</h4>
                    <p className="text-sm text-blue-700">
                      Your order is expected to arrive within 3-5 business days.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Need help with your order?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline">Contact Support</Button>
            <Button variant="outline">View FAQ</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
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
      <OrderTrackingContent />
    </Suspense>
  );
}
