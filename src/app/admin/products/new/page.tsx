"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <ProtectedRoute>
      <ProductForm />
    </ProtectedRoute>
  );
}
