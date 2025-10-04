import { API_BASE_URL } from "@/constants/api";
import { ApiError, ApiResponse } from "@/types";

class ApiClient {
  private baseURL: string;
  private token: string | null = null; // kept for backward compatibility

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    // No longer read tokens from localStorage; rely on HttpOnly cookies
  }

  setToken(_token: string) { this.token = null; }

  clearToken() { this.token = null; if (typeof window !== "undefined") { localStorage.removeItem("admin_user"); } }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    _retry = true
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };
    // Only set JSON content-type when not sending FormData
    if (!isFormData) {
      headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
    }

    // Attach CSRF header from cookie for unsafe methods
    try {
      const method = (options.method || 'GET').toUpperCase();
      const unsafe = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';
      if (unsafe && typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
        const csrf = match ? decodeURIComponent(match[1]) : null;
        if (csrf) headers['x-csrf-token'] = csrf;
      }
    } catch {}

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401 && _retry) {
        // Attempt token refresh once
        try {
          const refreshResponse = await fetch(`${this.baseURL}/admin/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          if (refreshResponse.ok) {
            const refreshJson: { data: { token: string } } = await refreshResponse.json();
            if (refreshJson?.data?.token) { return this.request<T>(endpoint, options, false); }
          }
        } catch (_e) {
          // fall through to normal error handling
        }

        // Refresh failed
        if (typeof window !== "undefined") {
          const loginUrl = "/admin?reason=session_expired";
          // Redirect user to login to re-authenticate
          window.location.assign(loginUrl);
        }
        throw new Error("Invalid or expired token");
      }

      if (!response.ok) {
        // Try to parse error json; fall back to status text
        try {
          const errorData: ApiError = await response.json();
          const base = errorData?.error?.message || `HTTP ${response.status}`;
          const details = errorData?.error?.details?.map(d => `${d.field}: ${d.message}`).join("; ");
          const msg = details ? `${base} — ${details}` : base;
          throw new Error(msg);
        } catch {
          throw new Error(`HTTP ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }

  // Generic HTTP methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    return this.request<T>(endpoint, {
      method: "POST",
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
      // Let request() decide headers; don't force content-type here
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    return this.request<T>(endpoint, {
      method: "PUT",
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // Admin-specific methods (legacy support)
  async adminGet<T>(endpoint: string): Promise<T> {
    return this.get<T>(endpoint);
  }

  async adminPost<T>(endpoint: string, data?: any): Promise<T> {
    return this.post<T>(endpoint, data);
  }

  async adminPut<T>(endpoint: string, data?: any): Promise<T> {
    return this.put<T>(endpoint, data);
  }

  async adminDelete<T>(endpoint: string): Promise<T> {
    return this.delete<T>(endpoint);
  }
}

export const apiClient = new ApiClient();
