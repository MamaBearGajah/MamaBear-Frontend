import type { AxiosRequestConfig } from "axios";
import { apiClient } from "./client";

export interface UpdateOrderStatusPayload {
  status: string;
  trackingNumber?: string;
  note?: string;
}

// FIX: semua URL dikoreksi ke /admin/orders/* (sesuai backend AdminOrdersController)
// Sebelumnya getAll() memanggil /orders/admin (tidak ada di backend)
// dan updateStatus() memanggil /orders/:id/status (endpoint user, bukan admin)
export const adminOrdersApi = {
  getAll: (config?: AxiosRequestConfig) =>
    apiClient.get("/admin/orders", config),

  getAllCustomer: (config?: AxiosRequestConfig) =>
    apiClient.get("/orders", config),

  getById: (id: string, config?: AxiosRequestConfig) =>
    apiClient.get(`/admin/orders/${id}`, config),

  updateStatus: (
    id: string,
    payload: UpdateOrderStatusPayload,
    config?: AxiosRequestConfig
  ) => apiClient.patch(`/admin/orders/${id}/status`, payload, config),

  updateTracking: (
    id: string,
    payload: { trackingNumber: string; note?: string },
    config?: AxiosRequestConfig
  ) => apiClient.patch(`/admin/orders/${id}/tracking`, payload, config),

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