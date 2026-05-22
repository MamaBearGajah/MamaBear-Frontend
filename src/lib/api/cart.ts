import apiClient from "./client";

export const cartApi = {
  get: () => apiClient.get('/cart'),
  addItem: (d: AddCartItemPayload) => apiClient.post('/cart/items', d),
  updateItem: (itemId: string, quantity: number) => apiClient.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) => apiClient.delete(`/cart/items/${itemId}`),
  clear: () => apiClient.delete('/cart'),
  mergeGuest: (guestCartId: string) => apiClient.post('/cart/merge-guest', { guestCartId }),
};
