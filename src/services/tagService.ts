import { apiClient } from "@/lib/api-client";
import { ApiResponse, Tag, TagFormData } from "@/types";

export const tagService = {
  /**
   * Get all tags (public)
   */
  async getAll(): Promise<Tag[]> {
    const response = await apiClient.get<ApiResponse<{ tags: Tag[] }>>(
      "/tags"
    );
    return response.data.tags;
  },

  /**
   * Get tag by ID
   */
  async getById(id: number): Promise<Tag> {
    const response = await apiClient.get<ApiResponse<{ tag: Tag }>>(
      `/tags/${id}`
    );
    return response.data.tag;
  },

  /**
   * Create tag (admin)
   */
  async create(data: TagFormData): Promise<Tag> {
    const response = await apiClient.post<ApiResponse<{ tag: Tag }>>(
      "/tags/admin",
      data
    );
    return response.data.tag;
  },

  /**
   * Update tag (admin)
   */
  async update(id: number, data: Partial<TagFormData>): Promise<Tag> {
    const response = await apiClient.put<ApiResponse<{ tag: Tag }>>(
      `/tags/admin/${id}`,
      data
    );
    return response.data.tag;
  },

  /**
   * Delete tag (admin)
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/tags/admin/${id}`);
  },
};

