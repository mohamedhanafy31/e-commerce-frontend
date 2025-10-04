"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  MapPin,
  CreditCard,
  User
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { orderService } from "@/services/orderService";
import { Order, OrderStatus } from "@/types";

function OrderDetailContent() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await orderService.getOrderByIdAdmin(parseInt(orderId));
        setOrder(orderData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "PROCESSING":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "SHIPPED":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "DELIVERED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600 bg-yellow-50";
      case "PROCESSING":
        return "text-blue-600 bg-blue-50";
      case "SHIPPED":
        return "text-purple-600 bg-purple-50";
      case "DELIVERED":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "The order you're looking for doesn't exist."}</p>
          <Link href="/admin/orders" className="text-blue-600 hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                <p className="text-sm text-gray-600">
                  Created on {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(order.status)}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        {item.product?.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.productName}</h3>
                        <p className="text-sm text-gray-600">SKU: {item.productId}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(item.productPrice)}</p>
                        <p className="text-sm text-gray-600">Subtotal: {formatCurrency(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(order.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping ({order.shippingMethod}):</span>
                    <span className="font-medium">{formatCurrency(order.shippingCost || 0)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-lg font-semibold">{formatCurrency(order.total || 0)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Information */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Method:</p>
                  <p className="font-medium">{order.shippingMethod}</p>
                  <p className="text-sm text-gray-600 mt-3">Address:</p>
                  <p className="text-sm">{order.shippingAddress}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order Created</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  {order.status === "PROCESSING" && (
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Processing</p>
                        <p className="text-xs text-gray-500">Order is being prepared</p>
                      </div>
                    </div>
                  )}
                  
                  {order.status === "SHIPPED" && (
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Truck className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Shipped</p>
                        <p className="text-xs text-gray-500">Order is on its way</p>
                      </div>
                    </div>
                  )}
                  
                  {order.status === "DELIVERED" && (
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Delivered</p>
                        <p className="text-xs text-gray-500">Order has been delivered</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => window.print()}
                  >
                    Print Order
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      const url = `/orders/track/${order.orderNumber}`;
                      window.open(url, '_blank');
                    }}
                  >
                    View Public Tracking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <ProtectedRoute>
      <OrderDetailContent />
    </ProtectedRoute>
  );
}
