import { apiClient } from "./client";
import { normalizeApiResponse } from "./normalize-api-response";

export type DiscountType = "percentage" | "fixed" | "free_shipping";

export interface Voucher {
  id: string;
  code: string;
  type: DiscountType;
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
}

export interface ApplyVoucherPayload {
  code: string;
  totalAmount: number;
}

// Sesuai response backend: validate() & apply() return shape ini
export interface VoucherValidateResult {
  valid: boolean;
  voucher: Voucher;
  discountAmount: number;
  finalShippingCost: number;
  usedCount: number;
}

export interface CreateVoucherPayload {
  code: string;
  source?: string;
  type: DiscountType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  ownerId?: string;
}

export const voucherApi = {
  /** GET /vouchers/my — voucher milik user yang sedang login */
  getMyVouchers: async (): Promise<Voucher[]> => {
    const res = await apiClient.get("/vouchers/my");
    const norm = normalizeApiResponse<Voucher[]>(res.data);
    return Array.isArray(norm.data) ? norm.data : [];
  },

  /**
   * POST /vouchers/validate — cek apakah kode valid + hitung diskon
   * Tidak mengubah DB (tidak increment usedCount)
   */
  validate: async (
    code: string,
    totalAmount: number,
    shippingCost = 0
  ): Promise<VoucherValidateResult> => {
    const res = await apiClient.post("/vouchers/validate", { code, totalAmount, shippingCost });
    const norm = normalizeApiResponse<VoucherValidateResult>(res.data);
    return norm.data;
  },

  /**
   * POST /vouchers/apply — apply voucher ke cart (tidak mengubah DB)
   */
  apply: async (payload: ApplyVoucherPayload): Promise<VoucherValidateResult> => {
    const res = await apiClient.post("/vouchers/apply", payload);
    const norm = normalizeApiResponse<VoucherValidateResult>(res.data);
    return norm.data;
  },

  // ─── Admin endpoints ──────────────────────────────────────────────────────

  /** GET /vouchers — list semua voucher (admin) */
  adminGetAll: async (): Promise<Voucher[]> => {
    const res = await apiClient.get("/vouchers");
    const norm = normalizeApiResponse<Voucher[]>(res.data);
    return Array.isArray(norm.data) ? norm.data : [];
  },

  /** POST /vouchers — buat voucher baru (admin) */
  create: (payload: CreateVoucherPayload) =>
    apiClient.post("/vouchers", payload),

  /** PATCH /vouchers/:id — update voucher (admin) */
  update: (id: string, payload: Partial<CreateVoucherPayload>) =>
    apiClient.patch(`/vouchers/${id}`, payload),

  /** DELETE /vouchers/:id — nonaktifkan voucher (admin, soft deactivate) */
  remove: (id: string) =>
    apiClient.delete(`/vouchers/${id}`),
};