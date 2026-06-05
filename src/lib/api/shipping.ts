import { apiClient } from "./client";
import type { ApiResponse, ProductVariantList } from "../../types";
import { AxiosRequestConfig } from "axios";

export const shippingApi = {
  getProvinces: () => apiClient.get("/shipping/provinces"),
  getCities: (provinceId: string) =>
    apiClient.get(`/shipping/cities?provinceId=${provinceId}`),
};
