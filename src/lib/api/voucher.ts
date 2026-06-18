import { apiClient } from "./client";
import { normalizeApiResponse } from "./normalize-api-response";

export type DiscountType = "percentage" | "fixed";

export interface Voucher {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface VoucherValidateResult {
  valid: boolean;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  message?: string;
}

export interface CreateVoucherPayload {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export const voucherApi = {
  /** GET /voucher/my — voucher milik user yang sedang login */
  getMyVouchers: async (): Promise<Voucher[]> => {
    const res = await apiClient.get("/voucher/my");
    const norm = normalizeApiResponse<Voucher[]>(res.data);
    return Array.isArray(norm.data) ? norm.data : [];
  },

  /** POST /voucher/validate — cek apakah kode valid + hitung diskon */
  validate: async (
    code: string,
    subtotal: number
  ): Promise<VoucherValidateResult> => {
    const res = await apiClient.post("/voucher/validate", { code, subtotal });
    const norm = normalizeApiResponse<VoucherValidateResult>(res.data);
    return norm.data;
  },

  // ─── Admin endpoints ──────────────────────────────────────────────────────

  /** GET /voucher/admin — list semua voucher (admin) */
  adminGetAll: async (): Promise<Voucher[]> => {
    const res = await apiClient.get("/voucher/admin");
    const norm = normalizeApiResponse<Voucher[]>(res.data);
    return Array.isArray(norm.data) ? norm.data : [];
  },

  /** POST /voucher — buat voucher baru (admin) */
  create: (payload: CreateVoucherPayload) =>
    apiClient.post("/voucher", payload),

  /** PATCH /voucher/:id — update voucher (admin) */
  update: (id: string, payload: Partial<CreateVoucherPayload>) =>
    apiClient.patch(`/voucher/${id}`, payload),

  /** DELETE /voucher/:id — hapus voucher (admin) */
  remove: (id: string) =>
    apiClient.delete(`/voucher/${id}`),
};
