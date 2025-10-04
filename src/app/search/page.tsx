"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Product } from "@/types";
import { productService } from "@/services/productService";
import { Search, Filter, X } from "lucide-react";

// Removed mock products; search now uses backend API

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const { products } = await productService.searchProducts(query, 1, 24);
      setResults(products);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Search Products</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>

        {/* Search Results Info */}
        {hasSearched && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-muted-foreground">
              {loading ? (
                "Searching..."
              ) : (
                <>
                  {results.length > 0 ? (
                    <>
                      Found <span className="font-semibold">{results.length}</span> result
                      {results.length !== 1 ? "s" : ""} for{" "}
                      <span className="font-semibold">"{initialQuery || searchQuery}"</span>
                    </>
                  ) : (
                    <>
                      No results found for{" "}
                      <span className="font-semibold">"{initialQuery || searchQuery}"</span>
                    </>
                  )}
                </>
              )}
            </p>
            
            {results.length > 0 && (
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter Results
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Search Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : hasSearched ? (
        results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or browse our categories instead.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={clearSearch}>Try Another Search</Button>
                <Button variant="outline" asChild>
                  <a href="/products">Browse All Products</a>
                </Button>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Search our products</h3>
          <p className="text-muted-foreground mb-6">
            Enter a search term above to find products you're looking for.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("headphones");
                performSearch("headphones");
              }}
            >
              headphones
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("watch");
                performSearch("watch");
              }}
            >
              watch
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("wireless");
                performSearch("wireless");
              }}
            >
              wireless
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("gaming");
                performSearch("gaming");
              }}
            >
              gaming
            </Button>
          </div>
        </div>
      )}

      {/* Search Tips */}
      {!hasSearched && (
        <div className="mt-12 bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold mb-3">Search Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use specific product names for better results</li>
            <li>• Try searching by category (e.g., "electronics", "furniture")</li>
            <li>• Search by features (e.g., "wireless", "bluetooth", "gaming")</li>
            <li>• Use simple terms and avoid special characters</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
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
      <SearchContent />
    </Suspense>
  );
}
