import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/lib/api-client";

export interface Admin {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface AuthState {
  admin: Admin | null;
  token: string | null; // deprecated
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      admin: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.post<{
            data: {
              admin: Admin;
              token: string;
              expiresAt: string;
            };
          }>("/admin/login", { email, password });

          const { admin } = response.data;
          
          set({
            admin,
            token: null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Login failed";
          set({
            admin: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.post<{
            data: {
              admin: Admin;
              token: string;
              expiresAt: string;
            };
          }>("/admin/register", { name, email, password });

          const { admin } = response.data;
          
          set({
            admin,
            token: null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Registration failed";
          set({
            admin: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        // Clear token from API client
        apiClient.clearToken();
        
        // Call logout endpoint (optional since JWT is stateless)
        apiClient.post("/admin/logout").catch(() => {
          // Ignore errors on logout endpoint
        });
        
        set({
          admin: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshToken: async () => {
        try {
          const response = await apiClient.adminPost<{
            data: {
              admin: Admin;
              token: string;
              expiresAt: string;
            };
          }>("/refresh-token");

          const { admin, token: newToken } = response.data;
          
          set({
            admin,
            token: null,
            isAuthenticated: true,
            error: null,
          });
        } catch (error) {
          // If refresh fails, logout
          get().logout();
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Restore token to API client on hydration
        if (state?.token) {
          apiClient.setToken(state.token);
        }
      },
    }
  )
);
