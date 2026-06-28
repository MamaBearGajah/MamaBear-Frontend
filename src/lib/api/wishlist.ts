import type { AxiosRequestConfig } from "axios";
import { apiClient } from "./client";
import type { wishlistItem } from "@/types";

function unwrapData<T>(raw: unknown): T {
  if (
    raw &&
    typeof raw === "object" &&
    "data" in (raw as Record<string, unknown>)
  ) {
    return (raw as { data: T }).data;
  }

  return raw as T;
}

export function extractWishlistProductIds(raw: unknown): string[] {
  const payload = unwrapData<unknown>(raw);

  if (!Array.isArray(payload)) return [];

  return payload
    .map((row) => {
      if (typeof row === "string") return row;
      if (row && typeof row === "object") {
        const item = row as Record<string, unknown>;
        return String(item.productId ?? item.product_id ?? "");
      }
      return "";
    })
    .filter(Boolean);
}

export function extractWishlistCount(raw: unknown): number {
  const payload = unwrapData<unknown>(raw);

  if (typeof payload === "number") return payload;
  if (payload && typeof payload === "object") {
    const row = payload as Record<string, unknown>;
    const count = Number(row.count ?? row.total ?? row.wishlistCount ?? 0);
    return Number.isFinite(count) ? count : 0;
  }

  return 0;
}

export const wishlistApi = {
  /** GET /api/wishlist */
  getAll: (config?: AxiosRequestConfig) => apiClient.get("/wishlist", config),

  /** POST /api/wishlist */
  create: (payload: wishlistItem, config?: AxiosRequestConfig) =>
    apiClient.post("/wishlist", payload, config),

  /** DELETE /api/wishlist/{productId} */
  remove: (productId: string, config?: AxiosRequestConfig) =>
    apiClient.delete(`/wishlist/${productId}`, config),

  /** GET /api/wishlist/check/{productId} */
  check: (productId: string, config?: AxiosRequestConfig) =>
    apiClient.get(`/wishlist/check/${productId}`, config),
};

// Re-export type under PascalCase for consumers
export type WishlistItem = wishlistItem;
