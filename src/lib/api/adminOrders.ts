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

  getById: (id: string, config?: AxiosRequestConfig) =>
    apiClient.get(`/orders/${id}`, config),

  updateStatus: (
    id: string,
    payload: UpdateOrderStatusPayload,
    config?: AxiosRequestConfig
  ) => apiClient.patch(`/orders/${id}/status`, payload, config),
};
