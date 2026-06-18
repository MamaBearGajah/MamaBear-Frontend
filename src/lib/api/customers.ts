import type { AxiosRequestConfig } from "axios";
import { apiClient } from "./client";

export const adminCustomerApi = {
  getAll: (config?: AxiosRequestConfig) =>
    apiClient.get("/admin/customers", config),
};
