import type { AxiosRequestConfig } from "axios";
import { apiClient } from "./client";
import type { homeBannerParams } from "@/types";

export const adminHomeBannerApi = {
  /** GET /banners — public list */
  getAll: (config?: AxiosRequestConfig) =>
    apiClient.get("/banners", config),

  /** GET /banners/admin — admin list (all banners including inactive) */
  getAllAdmin: (config?: AxiosRequestConfig) =>
    apiClient.get("/banners/admin", config),

  /** GET /banners/:id */
  getById: (id: string, config?: AxiosRequestConfig) =>
    apiClient.get(`/banners/${id}`, config),

  /** POST /banners */
  create: (payload: homeBannerParams, config?: AxiosRequestConfig) =>
    apiClient.post("/banners", payload, config),

  /** PATCH /banners/:id */
  update: (id: string, payload: Partial<homeBannerParams>, config?: AxiosRequestConfig) =>
    apiClient.patch(`/banners/${id}`, payload, config),

  /** DELETE /banners/:id */
  remove: (id: string, config?: AxiosRequestConfig) =>
    apiClient.delete(`/banners/${id}`, config),
};
