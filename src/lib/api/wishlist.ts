import { apiClient } from "./client";

export interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  discountPrice?: number | null;
  status: string;
  images: { imageUrl: string; altText?: string }[];
}

export interface WishlistItem {
  id: string;
  productId: string;
  addedAt: string;
  product: WishlistProduct;
}

export interface WishlistResponse {
  count: number;
  items: WishlistItem[];
}

export const wishlistApi = {
  /** GET /wishlist — list semua produk di wishlist */
  getAll: () => apiClient.get<{ data: WishlistResponse }>("/wishlist"),

  /** POST /wishlist — tambah produk ke wishlist */
  add: (productId: string) =>
    apiClient.post<{ data: WishlistItem }>("/wishlist", { productId }),

  /** DELETE /wishlist/:productId — hapus dari wishlist */
  remove: (productId: string) =>
    apiClient.delete<{ message: string }>(`/wishlist/${productId}`),

  /** GET /wishlist/check/:productId — cek apakah produk ada di wishlist */
  check: (productId: string) =>
    apiClient.get<{ data: { inWishlist: boolean } }>(
      `/wishlist/check/${productId}`
    ),
};