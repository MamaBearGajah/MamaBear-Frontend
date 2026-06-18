import { apiClient } from "./client";
import type { AddCartItemPayload } from "./cart";

type AddGuestCartItemPayload = AddCartItemPayload & { sessionId: string };

export const guestCartApi = {
  create: (sessionId: string) => apiClient.post("/guest-cart", { sessionId }),
  get: (id: string) => apiClient.get(`/guest-cart/${id}`),
  addItem: (d: AddGuestCartItemPayload) =>
    apiClient.post(`/guest-cart/items`, d),
  updateItem: (id: string, itemId: string, qty: number) =>
    apiClient.put(`/guest-cart/${id}/items/${itemId}`, { quantity: qty }),
  removeItem: (sessionId: string, itemId: string) =>
    apiClient.delete(`/guest-cart/items/${itemId}?sessionId=${sessionId}`),
  delete: (sessionId: string) => apiClient.delete(`/guest-cart/${sessionId}`),
};
