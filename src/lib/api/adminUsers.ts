import type { AxiosRequestConfig } from "axios";
import { apiClient } from "./client";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "super_admin";
  isVerified: boolean;
  bannedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminUserPayload {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "super_admin";
}

export const adminUsersApi = {
  getAll: (config?: AxiosRequestConfig) =>
    apiClient.get<{ data: AdminUser[]; total: number }>("/admin/users", config),

  create: (payload: CreateAdminUserPayload, config?: AxiosRequestConfig) =>
    apiClient.post("/admin/users", payload, config),

  updateRole: (
    id: string,
    role: "admin" | "super_admin",
    config?: AxiosRequestConfig
  ) => apiClient.patch(`/admin/users/${id}/role`, { role }, config),

  deactivate: (id: string, config?: AxiosRequestConfig) =>
    apiClient.patch(`/admin/users/${id}/deactivate`, {}, config),

  reactivate: (id: string, config?: AxiosRequestConfig) =>
    apiClient.patch(`/admin/users/${id}/reactivate`, {}, config),
};