import {apiClient} from '@/lib/api/client';
import {ApiResponse, Product, Review} from '@/types';

interface helpfulReview{
  reviewId: string,
  productId: string
}

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
  page: number,
  limit: number
): Promise<
{
  data: Review[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}> {
  const { data } = await apiClient.get(
    `/products/${id}/reviews`,
    { params: { page, limit } }
  );

  return data.data;
}


// export async function helpfulReview(
//   reviewId: string,
//   productId: string,
// ): Promise<
// {
//   data: helpfulReview[];

// }> {
//   const { data } = await apiClient.post(
//     `/products/${productId}/reviews/${reviewId}/helpful`,
//   );

//   return data.data;
// }
