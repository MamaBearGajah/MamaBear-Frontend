/**
 * src/lib/api/profile.ts
 * Replace mock data dengan real API calls ke BE.
 * BE endpoints:
 *   GET  /users/me
 *   PATCH /users/me
 *   PATCH /users/me/change-password
 *   GET  /users/me/addresses
 *   POST /users/me/addresses
 *   PATCH /users/me/addresses/:id
 *   PATCH /users/me/addresses/:id/default
 *   DELETE /users/me/addresses/:id
 *   GET  /users/me/orders
 */

import { apiClient } from "./client";
import { normalizeApiResponse } from "./normalize-api-response";
import type { Address, AddressPayload, UpdateProfilePayload, UserProfile } from "@/types";

function unwrap<T>(raw: unknown): T {
  if (raw && typeof raw === "object" && "data" in raw)
    return (raw as { data: T }).data;
  return raw as T;
}

export const profileApi = {
  /** GET /users/me */
  getProfile: async (): Promise<{ data: UserProfile }> => {
    const res = await apiClient.get("/users/me");
    const data = unwrap<UserProfile>(res.data);
    return { data };
  },

  /** PATCH /users/me */
  updateProfile: async (payload: UpdateProfilePayload): Promise<{ data: UserProfile }> => {
    const res = await apiClient.patch("/users/me", payload);
    const data = unwrap<UserProfile>(res.data);
    return { data };
  },

  /** PATCH /users/me/change-password */
  changePassword: async (payload: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean }> => {
    await apiClient.patch("/users/me/change-password", payload);
    return { success: true };
  },

  /** GET /users/me/addresses */
  getAddresses: async (): Promise<Address[]> => {
    const res = await apiClient.get("/users/me/addresses");
    const norm = normalizeApiResponse<Address[]>(res.data);
    return Array.isArray(norm.data) ? norm.data : [];
  },

  /** POST /users/me/addresses */
  addAddress: async (payload: AddressPayload): Promise<{ data: UserProfile }> => {
    await apiClient.post("/users/me/addresses", payload);
    return profileApi.getProfile();
  },

  /** PATCH /users/me/addresses/:id */
  updateAddress: async (
    id: string,
    payload: AddressPayload
  ): Promise<{ data: UserProfile }> => {
    await apiClient.patch(`/users/me/addresses/${id}`, payload);
    return profileApi.getProfile();
  },

  /** PATCH /users/me/addresses/:id/default */
  setDefaultAddress: async (id: string): Promise<{ data: UserProfile }> => {
    await apiClient.patch(`/users/me/addresses/${id}/default`);
    return profileApi.getProfile();
  },

  /** DELETE /users/me/addresses/:id */
  deleteAddress: async (id: string): Promise<{ data: UserProfile }> => {
    await apiClient.delete(`/users/me/addresses/${id}`);
    return profileApi.getProfile();
  },

  /** GET /users/me/orders */
  getOrders: async (): Promise<{ data: any[] }> => {
    const res = await apiClient.get("/users/me/orders");
    const norm = normalizeApiResponse<any[]>(res.data);
    return { data: Array.isArray(norm.data) ? norm.data : [] };
  },
};
