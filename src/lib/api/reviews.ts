import {apiClient} from '@/lib/api/client';
import {Review} from '@/types';

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
