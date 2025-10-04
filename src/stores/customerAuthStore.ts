"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/lib/api-client";
import type { Customer } from "@/types";

interface CustomerAuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface CustomerAuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

type CustomerAuthStore = CustomerAuthState & CustomerAuthActions;

export const useCustomerAuthStore = create<CustomerAuthStore>()(
  persist(
    (set) => ({
      customer: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiClient.post<{ data: { customer: Customer } }>("/auth/login", { email, password });
          set({ customer: res.data.customer, isAuthenticated: true, isLoading: false });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Login failed";
          set({ customer: null, isAuthenticated: false, isLoading: false, error: msg });
          throw e;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiClient.post<{ data: { customer: Customer } }>("/auth/register", { name, email, password });
          set({ customer: res.data.customer, isAuthenticated: true, isLoading: false });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Registration failed";
          set({ customer: null, isAuthenticated: false, isLoading: false, error: msg });
          throw e;
        }
      },

      logout: async () => {
        try {
          await apiClient.post("/auth/logout");
        } finally {
          set({ customer: null, isAuthenticated: false, error: null });
        }
      },

      refreshSession: async () => {
        try {
          const res = await apiClient.get<{ data: { id: number } }>("/auth/profile");
          if (res?.data?.id) {
            set({ isAuthenticated: true });
          }
        } catch {
          set({ isAuthenticated: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "customer-auth-storage",
      partialize: (s) => ({ customer: s.customer, isAuthenticated: s.isAuthenticated }),
    }
  )
);


