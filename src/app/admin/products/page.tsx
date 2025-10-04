"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  Eye,
  EyeOff,
  ArrowLeft,
  MoreVertical,
  Archive
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProductCard } from "@/components/admin/ProductCard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { productService } from "@/services/productService";
import { Product, PaginationInfo } from "@/types";

function AdminProductsContent() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState("");
  const [stockUpdateModal, setStockUpdateModal] = useState<{
    product: Product | null;
    newStock: string;
  }>({ product: null, newStock: "" });

  const fetchProducts = async (page = 1, search = "") => {
    try {
      console.log('🔍 Frontend: fetchProducts called with:', { page, search });
      setLoading(true);
      setError("");
      
      const response = await productService.getAllProductsAdmin({
        page,
        limit: 20,
        search: search.trim() || undefined,
      });
      
      console.log('✅ Frontend: fetchProducts response:', {
        productsCount: response.products.length,
        pagination: response.pagination
      });
      
      setProducts(response.products);
      setCurrentPage(response.pagination.currentPage);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
    } catch (err) {
      console.error('❌ Frontend: fetchProducts error:', err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, searchQuery);
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1, searchQuery);
  };

  const handleToggleActive = async (productId: number, currentStatus: boolean) => {
    try {
      await productService.updateProduct(productId, {
        isActive: !currentStatus
      });
      
      // Refresh the products list
      fetchProducts(currentPage, searchQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }
    
    try {
      await productService.deleteProduct(productId);
      
      // Refresh the products list
      fetchProducts(currentPage, searchQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const handleStockUpdate = async () => {
    if (!stockUpdateModal.product || !stockUpdateModal.newStock) return;
    
    try {
      await productService.updateProductStock(stockUpdateModal.product.id, {
        stock_quantity: parseInt(stockUpdateModal.newStock)
      });
      
      // Close modal and refresh
      setStockUpdateModal({ product: null, newStock: "" });
      fetchProducts(currentPage, searchQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update stock");
    }
  };

  const openStockModal = (product: Product) => {
    setStockUpdateModal({
      product,
      newStock: product.stock_quantity.toString()
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: "Out of Stock", color: "text-red-600 bg-red-50" };
    if (quantity < 10) return { text: "Low Stock", color: "text-orange-600 bg-orange-50" };
    return { text: "In Stock", color: "text-green-600 bg-green-50" };
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
                <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
                <p className="text-sm text-gray-600">
                  {totalItems} total products
                </p>
              </div>
            </div>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search products by name, SKU, or description..."
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
                    fetchProducts(1, "");
                  }}
                >
                  Clear
                </Button>
              )}
            </form>
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

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
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
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery ? "Try adjusting your search terms." : "Get started by creating a new product."}
                </p>
                {!searchQuery && (
                  <div className="mt-6">
                    <Link href="/admin/products/new">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={(product) => router.push(`/admin/products/${product.id}/edit`)}
                    onDelete={(product) => handleDeleteProduct(product.id)}
                     onToggleActive={(product) => handleToggleActive(product.id, product.is_active)}
                    onUpdateStock={(product) => openStockModal(product)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalItems)} of {totalItems} products
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

        {/* Stock Update Modal */}
        {stockUpdateModal.product && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Update Stock</h3>
              <p className="text-sm text-gray-600 mb-4">
                Update stock quantity for "{stockUpdateModal.product.name}"
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  New Stock Quantity
                </label>
                <Input
                  type="number"
                  min="0"
                  value={stockUpdateModal.newStock}
                  onChange={(e) => setStockUpdateModal(prev => ({
                    ...prev,
                    newStock: e.target.value
                  }))}
                  placeholder="Enter new stock quantity"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setStockUpdateModal({ product: null, newStock: "" })}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStockUpdate}
                  disabled={!stockUpdateModal.newStock || parseInt(stockUpdateModal.newStock) < 0}
                >
                  Update Stock
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <ProtectedRoute>
      <AdminProductsContent />
    </ProtectedRoute>
  );
}
