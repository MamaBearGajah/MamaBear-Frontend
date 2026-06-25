import type { AxiosRequestConfig } from "axios";
import { apiClient } from "./client";

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  socialInstagram: string | null;
  socialTiktok: string | null;
  socialFacebook: string | null;
  socialWhatsapp: string | null;
  shippingOriginCityId: string | null;
  taxRate: number;
  currency: string;
  maintenanceMode: boolean;
  updatedAt: string;
}

export const siteSettingsApi = {
  get: (config?: AxiosRequestConfig) =>
    apiClient.get<SiteSettings>("/admin/settings", config),

  update: (data: Partial<Omit<SiteSettings, "id" | "updatedAt">>, config?: AxiosRequestConfig) =>
    apiClient.patch("/admin/settings", data, config),
};