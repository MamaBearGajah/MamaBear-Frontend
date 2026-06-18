import type { AxiosRequestConfig } from "axios";
import { apiClient } from "./client";

export interface UpdateOrderStatusPayload {
  status: string;
  trackingNumber?: string;
  note?: string;
}

export const adminOrdersApi = {
  getAll: (config?: AxiosRequestConfig) =>
    apiClient.get("/orders/admin", config),

  getAllCustomer: (config?: AxiosRequestConfig) =>
    apiClient.get("/orders", config),

  getById: (id: string, config?: AxiosRequestConfig) =>
    apiClient.get(`/orders/${id}`, config),

  updateStatus: (
    id: string,
    payload: UpdateOrderStatusPayload,
    config?: AxiosRequestConfig
  ) => apiClient.patch(`/orders/${id}/status`, payload, config),

  // ← TAMBAH: update tracking number
  updateTracking: (
    id: string,
    payload: { trackingNumber: string; note?: string },
    config?: AxiosRequestConfig
  ) => apiClient.patch(`/admin/orders/${id}/tracking`, payload, config),

  // ← TAMBAH: export orders CSV
  exportCsv: (config?: AxiosRequestConfig) =>
    apiClient.get("/admin/orders/export", {
      ...config,
      responseType: "blob",
    }),
};

export const adminCustomersApi = {
  getAll: (params: { page?: number; limit?: number; search?: string }) =>
    apiClient.get("/admin/customers", { params }),

  getById: (id: string) =>
    apiClient.get(`/admin/customers/${id}`),
};
