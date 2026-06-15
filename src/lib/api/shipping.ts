import { apiClient } from "./client";
import type { ApiResponse, ProductVariantList } from "../../types";
import { AxiosRequestConfig } from "axios";

interface CalculateShippingPayload {
  originCityId: string;
  destinationCityId: string;
  weight: number;
  courier: string;
}

interface AddNewAddressPayload {
  label: string;
  receiverName: string;
  phone: string;
  address: string;
  cityId: string;
  provinceId: string;
  postalCode: string;
}

export const shippingApi = {
  getProvinces: () => apiClient.get("/shipping/provinces"),
  getCities: (provinceId: string) =>
    apiClient.get(`/shipping/cities?provinceId=${provinceId}`),
  getUserAddress: () => apiClient.get("/users/me/addresses"),
  addNewAddress: (payload: AddNewAddressPayload) =>
    apiClient.post("/users/me/addresses", payload),
  calculateShipping: (payload: CalculateShippingPayload) =>
    apiClient.post("/shipping/cost", payload),
};
