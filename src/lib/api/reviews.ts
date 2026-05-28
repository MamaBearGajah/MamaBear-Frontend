import {apiClient} from '@/lib/api/client';
import {ApiResponse, Product, Review} from '@/types';
import {

  isMockProductsEnabled,
} from "./mock-data";
import { getMockAllReviews } from "@/lib/MockProducts";

export const reviewsApi = {
  getList: (productId: string) =>
    apiClient.get<Review[]>(
      `/products/${productId}/reviews`
    ),
  // create: (productId: string, d: CreateReviewPayload) =>     apiClient.post(`/products/${productId}/reviews`, d),
  // update: (productId: string, reviewId: string, d: UpdateReviewPayload) =>     apiClient.put(`/products/${productId}/reviews/${reviewId}`, d),
  // delete: (productId: string, reviewId: string) =>     apiClient.delete(`/products/${productId}/reviews/${reviewId}`),
  voteHelpful: (productId: string, reviewId: string, isHelpful: boolean) =>     apiClient.post(`/products/${productId}/reviews/${reviewId}/helpful`, { isHelpful }),
};

export async function getAllReviews(
  id: string,
  // accessToken?: string,
): Promise<Review[]> {
  if (isMockProductsEnabled()) {
    const reviews = getMockAllReviews();
    if (!reviews) {
      const err = new Error("Reviews not found") as Error & { code?: string };
      err.code = "NOT_FOUND";
      throw err;
    }
    return reviews;
  }
  const { data } = await apiClient.get<ApiResponse<Review[]>>(
    `/products/${id}/reviews`,
    {    
      // headers: authHeaders(accessToken), 
         
    },
  );
  return data.data.data;
}
