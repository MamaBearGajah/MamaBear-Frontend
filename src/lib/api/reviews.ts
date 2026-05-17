import apiClient from "./client";

export const reviewsApi = {
  getList: (productId: string, params?: ReviewParams) =>     apiClient.get(`/products/${productId}/reviews`, { params }),
  create: (productId: string, d: CreateReviewPayload) =>     apiClient.post(`/products/${productId}/reviews`, d),
  update: (productId: string, reviewId: string, d: UpdateReviewPayload) =>     apiClient.put(`/products/${productId}/reviews/${reviewId}`, d),
  delete: (productId: string, reviewId: string) =>     apiClient.delete(`/products/${productId}/reviews/${reviewId}`),
  voteHelpful: (productId: string, reviewId: string, isHelpful: boolean) =>     apiClient.post(`/products/${productId}/reviews/${reviewId}/helpful`, { isHelpful }),
};
