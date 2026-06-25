import { apiClient } from "./client";
import { normalizeApiResponse } from "./normalize-api-response";

export type DiscountType = "percentage" | "fixed";

export interface Voucher {
  id: string;
  code: string;
  // description?: string;
  type: DiscountType;
  value: number;
  source: string;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface applyVoucherPayload {
  code: string;
  totalAmount: number;
}

export interface VoucherValidateResult {
  success: boolean;
  data:{
    id: string;
    code: string;
    type: "percentage" | "fixed";
    value: number;
    source: string;
    minPurchase?: number;
    maxDiscount?: number;
    usageLimit?: number;
    usedCount: number;
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
  }
  discountAmount: number;
  finalShippingCost: number;

    // id: string;
    // code: string;
    // type: "percentage" | "fixed";
    // value: number;
    // source: string;
    // minPurchase?: number;
    // maxDiscount?: number;
    // usageLimit?: number;
    // usedCount: number;
    // isActive: boolean;
    // startDate?: string;
    // endDate?: string;
    // createdAt: string;
    // updatedAt: string;
  // valid: boolean;
  // code: string;
  // totalAmount: number;
  // shippingCost: number;
  // type: DiscountType;
  // value: number;
  // discountAmount: number;
  // message?: string;
  // type: DiscountType;
  // value: number;
  // discountAmount: number;
  // message?: string;
}

export interface CreateVoucherPayload {
  code: string;
  // description?: string;
  source: string;
  type: DiscountType;
  value: number;
  // discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  ownerId?: string;
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
    totalAmount: number,
    shippingCost: number
  ): Promise<VoucherValidateResult> => {
    const res = await apiClient.post("/vouchers/validate", { code, totalAmount, shippingCost });
    const norm = normalizeApiResponse<VoucherValidateResult>(res);
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
    apiClient.post("/vouchers", payload),

  /** Apply  */
  apply: (payload: applyVoucherPayload) =>
    apiClient.post("/vouchers/apply", payload),

  /** PATCH /voucher/:id — update voucher (admin) */
  update: (
    id: string,
    payload: Partial<CreateVoucherPayload & { usedCount?: number; usageCount?: number }>
  ) =>
    apiClient.patch(`/vouchers/${id}`, payload),

  /** DELETE /voucher/:id — hapus voucher (admin) */
  remove: (id: string) =>
    apiClient.delete(`/vouchers/${id}`),
};
