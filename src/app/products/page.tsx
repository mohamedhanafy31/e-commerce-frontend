"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Product, Category, Tag, PaginatedResponse } from "@/types";
import { Search, Filter, ChevronDown } from "lucide-react";
import { apiClient } from "@/lib/api-client";

// No mock data. UI will show errors if backend requests fail.

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "price" | "created_at">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get<{ data: { categories: Category[] } }>("/categories");
        setCategories(response.data.categories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "20",
        });
        
        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }
        
        if (selectedCategory) {
          params.append("categoryId", selectedCategory.toString());
        }
        
        if (priceRange.min) {
          params.append("minPrice", priceRange.min);
        }
        
        if (priceRange.max) {
          params.append("maxPrice", priceRange.max);
        }
        
        const response = await apiClient.get<PaginatedResponse<Product>>(
          `/products?${params.toString()}`
        );
        
        setProducts(response.data.products);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products");
        setProducts([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, sortBy, sortOrder, priceRange, currentPage]);

  // Handle search with debouncing
  const [searchInput, setSearchInput] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceRange({ min: "", max: "" });
    setSortBy("name");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType: string, value: any) => {
    setCurrentPage(1); // Reset to first page when filters change
    
    switch (filterType) {
      case 'category':
        setSelectedCategory(value ? parseInt(value) : null);
        break;
      case 'priceMin':
        setPriceRange(prev => ({ ...prev, min: value }));
        break;
      case 'priceMax':
        setPriceRange(prev => ({ ...prev, max: value }));
        break;
      case 'sortBy':
        setSortBy(value);
        break;
      case 'sortOrder':
        setSortOrder(value);
        break;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>
        <p className="text-muted-foreground">
          Discover our wide selection of quality products
          {totalItems > 0 && ` (${totalItems} products)`}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-card border rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="created_at">Date Added</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium mb-2">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                {totalItems} products found
              </span>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
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
                    const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (page > totalPages) return null;
                    
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
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">No products found</p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
}
