import type { AxiosRequestConfig } from "axios";
import { apiClient } from "./client";
import type { bundleHamperParams } from "@/types";

/**
 * bundleApi — API client untuk fitur Bundle / Hampers.
 *
 * Catatan penamaan:
 * - getAll()      → GET /bundles          (public, hanya bundle aktif)
 * - getAllAdmin()  → GET /bundles/admin/all (admin only, semua bundle termasuk nonaktif)
 *
 * Sebelumnya file ini menggunakan nama `adminBundleHamperApi` yang menyesatkan
 * karena getAll() sebenarnya memanggil public endpoint, bukan admin endpoint.
 * Nama diganti menjadi `bundleApi` agar lebih deskriptif dan tidak ambigu.
 *
 * Untuk backward compatibility, `adminBundleHamperApi` di-re-export sebagai alias.
 */
export const bundleApi = {
  /** GET /bundles — public list (hanya bundle aktif & dalam periode) */
  getAll: (config?: AxiosRequestConfig) =>
    apiClient.get("/bundles", config),

  /** GET /bundles/admin/all — admin list (semua bundle termasuk nonaktif) */
  getAllAdmin: (config?: AxiosRequestConfig) =>
    apiClient.get("/bundles/admin/all", config),

  /** GET /bundles/:slug — detail bundle by slug (public) */
  getBySlug: (slug: string, config?: AxiosRequestConfig) =>
    apiClient.get(`/bundles/${slug}`, config),

  /** POST /bundles — buat bundle baru (admin only) */
  create: (payload: bundleHamperParams, config?: AxiosRequestConfig) =>
    apiClient.post("/bundles", payload, config),

  /** PATCH /bundles/:id — update bundle (admin only) */
  update: (id: string, payload: Partial<bundleHamperParams>, config?: AxiosRequestConfig) =>
    apiClient.patch(`/bundles/${id}`, payload, config),

  /** DELETE /bundles/:id — hapus bundle (admin only) */
  remove: (id: string, config?: AxiosRequestConfig) =>
    apiClient.delete(`/bundles/${id}`, config),
};

/** @deprecated Gunakan `bundleApi` sebagai gantinya */
export const adminBundleHamperApi = bundleApi;