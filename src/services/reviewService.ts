import { apiClient } from "@/lib/api-client";
import { Review, PaginatedResponse } from "@/types";

export interface CreateReviewRequest {
  product_id: number;
  rating: number;
  review_text?: string;
  reviewer_name: string;
}

export const reviewService = {
  // Get reviews for a product
  async getProductReviews(
    productId: number,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Review>> {
    return apiClient.get<PaginatedResponse<Review>>(
      `/products/${productId}/reviews?page=${page}&limit=${limit}`
    );
  },

  // Create a new review
  async createReview(reviewData: CreateReviewRequest): Promise<Review> {
    return apiClient.post<Review>("/reviews", reviewData);
  },

  // Get single review by ID
  async getReview(id: number): Promise<Review> {
    return apiClient.get<Review>(`/reviews/${id}`);
  }
};
