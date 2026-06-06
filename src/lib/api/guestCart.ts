import { apiClient } from "./client";
import type { AddCartItemPayload } from "./cart";
export const guestCartApi = {
  create: (sessionId: string) => apiClient.post("/guest-cart", { sessionId }),
  get: (id: string) => apiClient.get(`/guest-cart/${id}`),
  addItem: (id: string, d: AddCartItemPayload) =>
    apiClient.post(`/guest-cart/${id}/items`, d),
  updateItem: (id: string, itemId: string, qty: number) =>
    apiClient.put(`/guest-cart/${id}/items/${itemId}`, { quantity: qty }),
  removeItem: (id: string, itemId: string) =>
    apiClient.delete(`/guest-cart/${id}/items/${itemId}`),
  delete: (id: string) => apiClient.delete(`/guest-cart/${id}`),
};
