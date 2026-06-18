import { apiClient } from "./client";
import type { AddCartItemPayload } from "./cart";

export const guestCartApi = {
  /** Buat atau temukan cart berdasarkan sessionId */
  create: (sessionId: string) =>
    apiClient.post("/guest-cart", { sessionId }),

  /** Ambil cart + items berdasarkan sessionId */
  get: (sessionId: string) =>
    apiClient.get("/guest-cart", { params: { sessionId } }),

  /**
   * Tambah item ke guest cart.
   * sessionId dikirim di body bersama payload produk.
   */
  addItem: (sessionId: string, d: AddCartItemPayload) =>
    apiClient.post("/guest-cart/items", { ...d, sessionId }),

  /**
   * Update quantity item di guest cart.
   * sessionId dikirim sebagai query param, itemId di path.
   */
  updateItem: (sessionId: string, itemId: string, qty: number) =>
    apiClient.patch(`/guest-cart/items/${itemId}`, { quantity: qty }, {
      params: { sessionId },
    }),

  /**
   * Hapus satu item dari guest cart.
   * sessionId dikirim sebagai query param, itemId di path.
   */
  removeItem: (sessionId: string, itemId: string) =>
    apiClient.delete(`/guest-cart/items/${itemId}`, {
      params: { sessionId },
    }),

  /** Kosongkan semua item (guest cart tetap ada) */
  clear: (sessionId: string) =>
    apiClient.delete("/guest-cart/clear", { params: { sessionId } }),

  /** Hapus seluruh guest cart dari DB */
  delete: (sessionId: string) =>
    apiClient.delete("/guest-cart", { params: { sessionId } }),
};