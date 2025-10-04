"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Star,
  ArrowRight,
  Plus,
  Settings,
  BarChart3,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/stores/authStore";
import { analyticsService } from "@/services/analyticsService";
import { DashboardStats, LowStockProduct, Review, TopProduct } from "@/types";

function AdminDashboardContent() {
  const { admin, logout } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, lowStockData, reviewsData, topProductsData] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getLowStockProducts(10),
        analyticsService.getRecentReviews(5),
        analyticsService.getTopProducts(5),
      ]);
      
      setStats(statsData);
      setLowStock(lowStockData);
      setRecentReviews(reviewsData);
      setTopProducts(topProductsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
          </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <Button onClick={fetchDashboardData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {admin?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Orders
                </Button>
              </Link>
              <Button variant="secondary" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Key Metrics - Consistent Alignment */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Total Revenue */}
                <Card className="bg-white border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">Total Revenue</p>
                        {stats.revenueGrowth >= 0 ? (
                          <div className="flex items-center justify-end text-emerald-600 text-sm">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            +{stats.revenueGrowth}%
                          </div>
                        ) : (
                          <div className="flex items-center justify-end text-red-500 text-sm">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            {stats.revenueGrowth}%
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {formatCurrency(stats.totalRevenue)}
                </div>
                      <p className="text-sm text-gray-500">from last month</p>
              </div>
            </CardContent>
          </Card>

                {/* Total Orders */}
                <Card className="bg-white border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <ShoppingCart className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">Total Orders</p>
                        {stats.ordersGrowth >= 0 ? (
                          <div className="flex items-center justify-end text-emerald-600 text-sm">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            +{stats.ordersGrowth}%
                          </div>
                        ) : (
                          <div className="flex items-center justify-end text-red-500 text-sm">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            {stats.ordersGrowth}%
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {stats.totalOrders.toLocaleString()}
                </div>
                      <p className="text-sm text-gray-500">from last month</p>
              </div>
            </CardContent>
          </Card>

                {/* Total Products */}
                <Card className="bg-white border-l-4 border-l-slate-500 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-slate-100 rounded-lg">
                        <Package className="h-6 w-6 text-slate-600" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">Total Products</p>
                        <Link href="/admin/products" className="text-slate-600 text-sm hover:underline">
                          Manage
                        </Link>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {stats.totalProducts.toLocaleString()}
                </div>
                      <p className="text-sm text-gray-500">Active products</p>
              </div>
            </CardContent>
          </Card>

                {/* Total Customers */}
                <Card className="bg-white border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-amber-100 rounded-lg">
                        <Users className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">Total Customers</p>
                        <span className="text-amber-600 text-sm">Unique</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {stats.totalCustomers.toLocaleString()}
                </div>
                      <p className="text-sm text-gray-500">Unique customers</p>
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Quick Actions - Proper Alignment */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/products">
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border hover:border-slate-300 bg-white">
                <CardContent className="pt-6 pb-5 px-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Package className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">Products</h3>
                        <p className="text-sm text-gray-600">Manage inventory & catalog</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
          </Link>
          
            <Link href="/admin/categories">
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border hover:border-emerald-300 bg-white">
                <CardContent className="pt-6 pb-5 px-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Settings className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">Categories</h3>
                        <p className="text-sm text-gray-600">Organize product categories</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
          </Link>
          
            <Link href="/admin/tags">
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border hover:border-amber-300 bg-white">
                <CardContent className="pt-6 pb-5 px-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">Tags</h3>
                        <p className="text-sm text-gray-600">Manage product tags</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Analytics Section - Equal Width Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Stock Alerts */}
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center text-black font-bold">
                <AlertTriangle className="h-5 w-5 mr-3 text-amber-600" />
                Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-5 px-5">
              {lowStock.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">All Good!</h3>
                  <p className="text-gray-500 text-sm mb-2">All products have adequate stock</p>
                  <div className="text-xs text-gray-400">
                    Monitor inventory levels here
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {lowStock.map((product) => (
                    <div key={product.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-xs truncate">{product.name}</p>
                          <p className="text-xs text-gray-600">SKU: {product.sku}</p>
                    </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-200 text-amber-800">
                            {product.stockQuantity} left
                      </span>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </CardContent>
          </Card>

          {/* Revenue Summary */}
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center text-black font-bold">
                <DollarSign className="h-5 w-5 mr-3 text-emerald-600" />
                Today's Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-5 px-5">
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-600 mb-2">
                  {stats ? formatCurrency(stats.totalRevenue) : "$0.00"}
                </div>
                <p className="text-gray-500 text-sm mb-2">Total revenue to date</p>
                <div className="text-xs text-gray-400">
                  {stats && stats.revenueGrowth >= 0 ? (
                    <span className="text-emerald-600">↗ Up {stats.revenueGrowth}%</span>
                  ) : stats ? (
                    <span className="text-red-500">↘ Down {stats.revenueGrowth}%</span>
                  ) : (
                    <span className="text-gray-500">No data</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Selling Products */}
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center text-black font-bold">
                <BarChart3 className="h-5 w-5 mr-3 text-slate-600" />
                Top Selling Products
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
            </CardHeader>
            <CardContent className="p-3">
              {topProducts.length === 0 ? (
                <div className="text-center py-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Package className="h-5 w-5 text-slate-500" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No sales data yet</h3>
                  <p className="text-gray-500 text-xs mb-1">Products will appear here once orders are placed</p>
                  <div className="text-xs text-gray-400">
                    Track your best-performing products
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {topProducts.slice(0, 2).map((product, index) => (
                    <div key={product.productId} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-slate-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-xs truncate">{product.productName}</h4>
                          <p className="text-xs text-gray-600">{product.totalSold} sold</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="text-xs font-bold text-emerald-600">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Reviews - High Contrast & Compact Layout */}
        <Card className="mt-6">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center text-black font-bold">
              <Star className="h-5 w-5 mr-3 text-amber-500" />
              Recent Reviews
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Latest customer feedback</p>
          </CardHeader>
          <CardContent className="pt-6 pb-6 px-6">
            {recentReviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500 mb-4">Customer reviews will appear here once products are reviewed</p>
                <div className="text-sm text-gray-400">
                  Reviews help build trust and improve product visibility
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentReviews.map((review) => (
                  <div key={review.id} className="pt-6 pb-5 px-5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-base mb-1">{review.product?.name}</h4>
                        <p className="text-sm text-gray-700 font-medium">{review.reviewerName || "Anonymous"}</p>
                      </div>
                      <div className="flex items-center space-x-1 ml-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.reviewText && (
                      <div className="mt-3">
                        <p className="text-gray-900 leading-relaxed text-sm font-medium">{review.reviewText}</p>
                      </div>
                    )}
                  </div>
                ))}
        </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
