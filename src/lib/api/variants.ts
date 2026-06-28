import { apiClient } from "./client";
import type { ApiResponse, ProductVariantList } from "../../types";
import { AxiosRequestConfig } from "axios";

export const variantApi = {
  getAll: (config?: AxiosRequestConfig) =>
    apiClient.get<ApiResponse<ProductVariantList[]>>(
      "/products/variants/all",
      config
    ),
  getByProductAndVariantId: (
    productId: string,
    variantId: string,
    config?: AxiosRequestConfig
  ) => apiClient.get(`/products/${productId}/variants/${variantId}`, config),
  getAllProductNameAndId: () => apiClient.get("/products/name-id"),
  getById: (id: string, config?: AxiosRequestConfig) =>
    apiClient.get(`/variants/${id}`, config),
  getCategory: (config?: AxiosRequestConfig) =>
    apiClient.get("/categories", config),
  create: (data: any, productId: string, config?: AxiosRequestConfig) =>
    apiClient.post(`/products/${productId}/variants`, data, config),
  update: (
    productId: string,
    variantId: string,
    data: any,
    config?: AxiosRequestConfig
  ) =>
    apiClient.patch(
      `/products/${productId}/variants/${variantId}`,
      data,
      config
    ),
  delete: (productId: string, variantId: string, config?: AxiosRequestConfig) =>
    apiClient.delete(`/products/${productId}/variants/${variantId}`, config),
};
