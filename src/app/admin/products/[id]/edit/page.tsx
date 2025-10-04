"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProductForm } from "@/components/admin/ProductForm";
import { productService } from "@/services/productService";
import { Product } from "@/types";

function EditProductContent() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await productService.getProductByIdAdmin(parseInt(productId));
        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "The product you're looking for doesn't exist."}</p>
          <a href="/admin/products" className="text-blue-600 hover:underline">
            Back to Products
          </a>
        </div>
      </div>
    );
  }

  return <ProductForm product={product} isEdit={true} />;
}

export default function EditProductPage() {
  return (
    <ProtectedRoute>
      <EditProductContent />
    </ProtectedRoute>
  );
}
