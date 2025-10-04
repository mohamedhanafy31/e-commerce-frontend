"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  ArrowLeft,
  Filter,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { orderService } from "@/services/orderService";
import { Order, OrderStatus, PaginationInfo } from "@/types";

function AdminOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState("");
  const [statusUpdateModal, setStatusUpdateModal] = useState<{
    order: Order | null;
    newStatus: OrderStatus;
  }>({ order: null, newStatus: "PENDING" });

  const fetchOrders = async (page = 1, status = "") => {
    try {
      setLoading(true);
      setError("");
      
      const response = await orderService.getAllOrdersAdmin({
        page,
        limit: 20,
        status: status || undefined,
      });
      
      setOrders(response.orders);
      setCurrentPage(response.pagination.currentPage);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, statusFilter);
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders(1, statusFilter);
  };

  const handleStatusFilter = (status: OrderStatus | "") => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchOrders(1, status);
  };

  const handleStatusUpdate = async () => {
    if (!statusUpdateModal.order) return;
    
    try {
      await orderService.updateOrderStatus(statusUpdateModal.order.id, {
        status: statusUpdateModal.newStatus
      });
      
      // Close modal and refresh
      setStatusUpdateModal({ order: null, newStatus: "PENDING" });
      fetchOrders(currentPage, statusFilter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order status");
    }
  };

  const openStatusModal = (order: Order) => {
    setStatusUpdateModal({
      order,
      newStatus: order.status
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "PROCESSING":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "SHIPPED":
        return <Truck className="h-4 w-4 text-purple-500" />;
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                <p className="text-sm text-gray-600">
                  {totalItems} total orders
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search orders by order number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  Search
                </Button>
                {searchQuery && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                      fetchOrders(1, statusFilter);
                    }}
                  >
                    Clear
                  </Button>
                )}
              </form>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value as OrderStatus | "")}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery || statusFilter ? "Try adjusting your search terms or filters." : "No orders have been placed yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getStatusIcon(order.status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">#{order.orderNumber}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Total: {formatCurrency(order.total || 0)} • Items: {order.items.length} • Created: {formatDate(order.createdAt)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Shipping: {order.shippingMethod} • Address: {order.shippingAddress}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openStatusModal(order)}
                        title="Update status"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalItems)} of {totalItems} orders
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Update Modal */}
        {statusUpdateModal.order && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>
              <p className="text-sm text-gray-600 mb-4">
                Update status for order #{statusUpdateModal.order.orderNumber}
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  New Status
                </label>
                <select
                  value={statusUpdateModal.newStatus}
                  onChange={(e) => setStatusUpdateModal(prev => ({
                    ...prev,
                    newStatus: e.target.value as OrderStatus
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setStatusUpdateModal({ order: null, newStatus: "PENDING" })}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={statusUpdateModal.newStatus === statusUpdateModal.order.status}
                >
                  Update Status
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <ProtectedRoute>
      <AdminOrdersContent />
    </ProtectedRoute>
  );
}
