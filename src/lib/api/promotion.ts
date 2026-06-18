import { apiClient } from "./client";
import { normalizeApiResponse } from "./normalize-api-response";

export type PromotionStatus = "draft" | "active" | "ended";

export interface PromotionSection {
  id?: string;
  title: string;
  body: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface PromotionBenefit {
  id?: string;
  icon?: string;
  title: string;
  description?: string;
  sortOrder?: number;
}

export interface Promotion {
  id: string;
  title: string;
  slug: string;
  badgeText?: string;
  heroImageUrl?: string;
  heroBundleId?: string;
  status: PromotionStatus;
  startDate?: string;
  endDate?: string;
  sections: PromotionSection[];
  benefits: PromotionBenefit[];
  extraText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionPayload {
  title: string;
  slug: string;
  badgeText?: string;
  heroImageUrl?: string;
  heroBundleId?: string;
  status?: PromotionStatus;
  startDate?: string;
  endDate?: string;
  sections?: PromotionSection[];
  benefits?: PromotionBenefit[];
  extraText?: string;
}

export const promotionApi = {
  /** GET /promotions/active — promo aktif untuk homepage/landing */
  getActive: async (): Promise<Promotion | null> => {
    try {
      const res = await apiClient.get("/promotions/active");
      const norm = normalizeApiResponse<Promotion>(res.data);
      return norm.data ?? null;
    } catch {
      return null;
    }
  },

  /** GET /promotions/:slug — detail promo by slug (public) */
  getBySlug: async (slug: string): Promise<Promotion | null> => {
    try {
      const res = await apiClient.get(`/promotions/${slug}`);
      const norm = normalizeApiResponse<Promotion>(res.data);
      return norm.data ?? null;
    } catch {
      return null;
    }
  },

  /** GET /promotions — list semua promo (admin) */
  getAll: async (): Promise<Promotion[]> => {
    const res = await apiClient.get("/promotions");
    const norm = normalizeApiResponse<Promotion[]>(res.data);
    return Array.isArray(norm.data) ? norm.data : [];
  },

  /** GET /promotions/admin/:id — detail by ID (admin) */
  getById: async (id: string): Promise<Promotion> => {
    const res = await apiClient.get(`/promotions/admin/${id}`);
    const norm = normalizeApiResponse<Promotion>(res.data);
    return norm.data;
  },

  /** POST /promotions (admin) */
  create: (payload: CreatePromotionPayload) =>
    apiClient.post("/promotions", payload),

  /** PATCH /promotions/:id (admin) */
  update: (id: string, payload: Partial<CreatePromotionPayload>) =>
    apiClient.patch(`/promotions/${id}`, payload),

  /** DELETE /promotions/:id (admin) */
  remove: (id: string) =>
    apiClient.delete(`/promotions/${id}`),
};
