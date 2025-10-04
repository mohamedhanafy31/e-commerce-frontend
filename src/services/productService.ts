import { apiClient } from "@/lib/api-client";
import { 
  Product, 
  Category,
  Tag,
  ApiResponse,
  PaginationInfo
} from "@/types";

class ProductService {
  // Public API methods (no auth required)
  
  // Get all products with pagination and filters
  async getProducts(params?: {
    page?: number;
    limit?: number;
    categoryId?: number;
    tagId?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "name" | "price" | "createdAt";
    sortOrder?: "asc" | "desc";
  }): Promise<{ products: Product[]; pagination: PaginationInfo }> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const query = searchParams.toString();
    const response = await apiClient.get<{ data: { products: Product[]; pagination: PaginationInfo } }>(
      `/products${query ? `?${query}` : ""}`
    );
    return response.data;
  }

  // Get single product by ID
  async getProduct(id: number): Promise<Product> {
    const response = await apiClient.get<{ data: Product }>(`/products/${id}`);
    return response.data;
  }

  // Search products
  async searchProducts(query: string, page = 1, limit = 20): Promise<{ products: Product[]; pagination: PaginationInfo }> {
    return this.getProducts({
      search: query,
      page,
      limit
    });
  }

  // Get products by category
  async getProductsByCategory(categoryId: number, page = 1, limit = 20): Promise<{ products: Product[]; pagination: PaginationInfo }> {
    return this.getProducts({
      categoryId,
      page,
      limit
    });
  }

  // Get products by tag
  async getProductsByTag(tagId: number, page = 1, limit = 20): Promise<{ products: Product[]; pagination: PaginationInfo }> {
    return this.getProducts({
      tagId,
      page,
      limit
    });
  }

  // Admin API methods (auth required)
  
  // Get all products for admin with pagination and filters
  async getAllProductsAdmin(params?: {
    page?: number;
    limit?: number;
    categoryId?: number;
    tagId?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "name" | "price" | "createdAt";
    sortOrder?: "asc" | "desc";
    isActive?: boolean;
  }): Promise<{ products: Product[]; pagination: PaginationInfo }> {
    console.log('🔍 Frontend: getAllProductsAdmin called with params:', params);
    
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const query = searchParams.toString();
    console.log('🔍 Frontend: API query string:', query);
    
    try {
      const response = await apiClient.adminGet<{ data: { products: Product[]; pagination: PaginationInfo } }>(
        `/products/admin${query ? `?${query}` : ""}`
      );
      
      console.log('✅ Frontend: API response received:', {
        productsCount: response.data.products.length,
        pagination: response.data.pagination
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Frontend: API error in getAllProductsAdmin:', error);
      throw error;
    }
  }

  // Get single product by ID for admin
  async getProductByIdAdmin(id: number): Promise<Product> {
    const response = await apiClient.adminGet<{ data: Product }>(`/products/admin/${id}`);
    return response.data;
  }

  // Create new product
  async createProduct(payload: any): Promise<Product> {
    const response = await apiClient.adminPost<{ data: Product }>("/products/admin", payload);
    return response.data;
  }

  // Update product
  async updateProduct(id: number, payload: any): Promise<Product> {
    const response = await apiClient.adminPut<{ data: Product }>(`/products/admin/${id}`, payload);
    return response.data;
  }

  // Update product stock
  async updateProductStock(id: number, payload: any): Promise<Product> {
    const response = await apiClient.adminPut<{ data: Product }>(`/products/admin/${id}/stock`, payload);
    return response.data;
  }

  // Delete product
  async deleteProduct(id: number): Promise<void> {
    await apiClient.adminDelete<void>(`/products/admin/${id}`);
  }

  // Get all categories (for admin forms)
  async getAllCategories(): Promise<{ categories: Category[] }> {
    const response = await apiClient.get<{ data: { categories: Category[] } }>("/categories");
    return { categories: response.data.categories };
  }

  // Get all tags (for admin forms)
  async getAllTags(): Promise<{ tags: Tag[] }> {
    const response = await apiClient.get<{ data: { tags: Tag[] } }>("/tags");
    return { tags: response.data.tags };
  }
}

export const productService = new ProductService();
