import { apiClient } from "@/lib/api-client";
import {
  ApiResponse,
  DashboardStats,
  SalesData,
  TopProduct,
  CategoryRevenue,
  LowStockProduct,
  Review,
  OrderStatus,
} from "@/types";

export const analyticsService = {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(
      "/analytics/dashboard"
    );
    return response.data;
  },

  /**
   * Get sales data
   */
  async getSalesData(days: number = 30): Promise<SalesData[]> {
    const response = await apiClient.get<ApiResponse<{ salesData: SalesData[] }>>(
      `/analytics/sales?days=${days}`
    );
    return response.data.salesData;
  },

  /**
   * Get top products
   */
  async getTopProducts(limit: number = 10): Promise<TopProduct[]> {
    const response = await apiClient.get<ApiResponse<{ topProducts: TopProduct[] }>>(
      `/analytics/top-products?limit=${limit}`
    );
    return response.data.topProducts;
  },

  /**
   * Get revenue by category
   */
  async getRevenueByCategory(): Promise<CategoryRevenue[]> {
    const response = await apiClient.get<ApiResponse<{ categoryRevenue: CategoryRevenue[] }>>(
      "/analytics/revenue-by-category"
    );
    return response.data.categoryRevenue;
  },

  /**
   * Get order status distribution
   */
  async getOrderStatusDistribution(): Promise<Record<OrderStatus, number>> {
    const response = await apiClient.get<ApiResponse<{ distribution: Record<OrderStatus, number> }>>(
      "/analytics/order-status"
    );
    return response.data.distribution;
  },

  /**
   * Get low stock products
   */
  async getLowStockProducts(threshold: number = 10): Promise<LowStockProduct[]> {
    const response = await apiClient.get<ApiResponse<{ products: LowStockProduct[] }>>(
      `/analytics/low-stock?threshold=${threshold}`
    );
    return response.data.products;
  },

  /**
   * Get recent reviews
   */
  async getRecentReviews(limit: number = 5): Promise<Review[]> {
    const response = await apiClient.get<ApiResponse<{ reviews: Review[] }>>(
      `/analytics/recent-reviews?limit=${limit}`
    );
    return response.data.reviews;
  },
};

