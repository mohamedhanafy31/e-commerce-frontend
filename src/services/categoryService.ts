import { apiClient } from "@/lib/api-client";
import { ApiResponse, Category, CategoryFormData } from "@/types";

export const categoryService = {
  /**
   * Get all categories (public)
   */
  async getAll(): Promise<Category[]> {
    const response = await apiClient.get<ApiResponse<{ categories: Category[] }>>(
      "/categories"
    );
    return response.data.categories;
  },

  /**
   * Get category by ID
   */
  async getById(id: number): Promise<Category> {
    const response = await apiClient.get<ApiResponse<{ category: Category }>>(
      `/categories/${id}`
    );
    return response.data.category;
  },

  /**
   * Create category (admin)
   */
  async create(data: CategoryFormData): Promise<Category> {
    const response = await apiClient.post<ApiResponse<{ category: Category }>>(
      "/categories/admin",
      data
    );
    return response.data.category;
  },

  /**
   * Update category (admin)
   */
  async update(id: number, data: Partial<CategoryFormData>): Promise<Category> {
    const response = await apiClient.put<ApiResponse<{ category: Category }>>(
      `/categories/admin/${id}`,
      data
    );
    return response.data.category;
  },

  /**
   * Delete category (admin)
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/categories/admin/${id}`);
  },
};

