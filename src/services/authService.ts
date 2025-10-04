import { apiClient } from "@/lib/api-client";
import { ApiResponse, AuthResponse, LoginFormData, RegisterFormData, Admin } from "@/types";

export const authService = {
  /**
   * Admin login
   */
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/admin/login",
      credentials
    );
    
    // Store user only; cookies hold tokens
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_user", JSON.stringify(response.data.admin));
    }
    
    return response.data;
  },

  /**
   * Admin register
   */
  async register(data: RegisterFormData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/admin/register",
      data
    );
    
    // Store user only; cookies hold tokens
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_user", JSON.stringify(response.data.admin));
    }
    
    return response.data;
  },

  /**
   * Admin logout
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/admin/logout");
    } finally {
      apiClient.clearToken();
    }
  },

  /**
   * Get admin profile
   */
  async getProfile(): Promise<Admin> {
    const response = await apiClient.get<ApiResponse<{ admin: Admin }>>(
      "/admin/profile"
    );
    return response.data.admin;
  },

  /**
   * Refresh token
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/admin/refresh-token"
    );
    
    return response.data;
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): Admin | null {
    if (typeof window === "undefined") return null;
    
    const userStr = localStorage.getItem("admin_user");
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  },
};

