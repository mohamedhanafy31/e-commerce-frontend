"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCustomerAuthStore } from "@/stores/customerAuthStore";

interface Props { children: React.ReactNode; fallback?: React.ReactNode }

export function CustomerProtectedRoute({ children, fallback }: Props) {
  const { isAuthenticated, isLoading } = useCustomerAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/account/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  return <>{children}</>;
}


