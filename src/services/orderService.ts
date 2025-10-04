import { apiClient } from "@/lib/api-client";
import { 
  Order, 
  OrderItem,
  OrderFormData,
  OrderStatus,
  PaginationInfo
} from "@/types";

class OrderService {
  // Public API methods (no auth required)
  
  // Create a new order (checkout)
  async createOrder(payload: OrderFormData): Promise<Order> {
    const response = await apiClient.post<{ order: Order }>("/orders/create", payload);
    return response.order;
  }

  // Get order by order number (public tracking)
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await apiClient.get<{ order: Order }>(`/orders/track/${orderNumber}`);
    return response.order;
  }

  // Admin API methods (auth required)
  
  // Get all orders for admin with pagination and optional status filter
  async getAllOrdersAdmin(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ orders: Order[]; pagination: PaginationInfo }> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const query = searchParams.toString();
    const response = await apiClient.adminGet<{ orders: Order[]; pagination: PaginationInfo }>(
      `/orders/admin${query ? `?${query}` : ""}`
    );
    return response;
  }

  // Get order by ID for admin
  async getOrderByIdAdmin(id: number): Promise<Order> {
    const response = await apiClient.adminGet<{ order: Order }>(`/orders/admin/${id}`);
    return response.order;
  }

  // Update order status (Admin only)
  async updateOrderStatus(id: number, payload: { status: OrderStatus }): Promise<{ id: number; orderNumber: string; status: string }> {
    const response = await apiClient.adminPut<{ id: number; orderNumber: string; status: string }>(`/orders/admin/${id}/status`, payload);
    return response;
  }
}

export const orderService = new OrderService();
