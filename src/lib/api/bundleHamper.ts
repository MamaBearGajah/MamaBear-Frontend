import type { AxiosRequestConfig } from "axios";
import { apiClient } from "./client";
import type { bundleHamperParams } from "@/types";

export const adminBundleHamperApi = {
  /** GET /bundle-hampers — public list */
  getAll: (config?: AxiosRequestConfig) =>
    apiClient.get("/bundles", config),

  /** GET /bundles/admin — admin list (all banners including inactive) */
  getAllAdmin: (config?: AxiosRequestConfig) =>
    apiClient.get("/bundles/admin/all", config),

  /** GET /bundles/:slug */
  getBySlug: (slug: string, config?: AxiosRequestConfig) =>
    apiClient.get(`/bundles/${slug}`, config),

  /** POST /bundles */
  create: (payload: bundleHamperParams, config?: AxiosRequestConfig) =>
    apiClient.post("/bundles", payload, config),

  /** PATCH /bundles/:id */
  update: (id: string, payload: Partial<bundleHamperParams>, config?: AxiosRequestConfig) =>
    apiClient.patch(`/bundles/${id}`, payload, config),

  /** DELETE /bundles/:id */
  remove: (id: string, config?: AxiosRequestConfig) =>
    apiClient.delete(`/bundles/${id}`, config),
};
