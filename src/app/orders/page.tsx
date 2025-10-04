"use client";

import { CustomerProtectedRoute } from "@/components/auth/CustomerProtectedRoute";

export default function OrdersPage() {
  return (
    <CustomerProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-muted-foreground mt-2">Order history will appear here.</p>
      </div>
    </CustomerProtectedRoute>
  );
}


