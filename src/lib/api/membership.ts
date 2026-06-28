import { apiClient } from "./client";
import { normalizeApiResponse } from "./normalize-api-response";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MembershipData {
  userId: string;
  points: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  totalSpent: number;
  lastDailyLoginAt?: string | null;
  lastTierUpAt?: string | null;
  pointsExpiredAt?: string | null;
}

export interface PointHistoryItem {
  id: string;
  type: "purchase" | "daily_login" | "redeem" | "expired" | "refund" | "bonus";
  points: number;
  description?: string | null;
  referenceId?: string | null;
  createdAt: string;
}

export interface RedeemResult {
  voucher: {
    id: string;
    code: string;
    type: string;
    value: number;
    endDate: string;
  };
  pointsUsed: number;
  discountValue: number;
  message: string;
}

export interface DailyLoginResult {
  alreadyClaimed: boolean;
  message: string;
  pointsEarned: number;
  basePoints: number;
  bonusPoints: number;
  streakCount: number;
  isStreakBonus: boolean;
  currentPoints: number;
  nextCheckIn?: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const membershipApi = {
  /** GET /membership/me */
  getMyMembership: async () => {
    const res = await apiClient.get("/membership/me");
    return res.data?.data ?? res.data;
  },

  /** GET /membership/points/history */
  getPointsHistory: async (page = 1, limit = 20): Promise<{ data: PointHistoryItem[]; meta: any }> => {
    const res = await apiClient.get("/membership/points/history", {
      params: { page, limit },
    });
    const raw = res.data?.data ?? res.data;
    return {
      data: Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [],
      meta: raw?.meta ?? {},
    };
  },

  /** POST /membership/daily-login */
  dailyLogin: async (): Promise<DailyLoginResult> => {
    const res = await apiClient.post("/membership/daily-login");
    return res.data?.data ?? res.data;
  },

  /** POST /membership/points/redeem */
  redeemPoints: async (points: number): Promise<RedeemResult> => {
    const res = await apiClient.post("/membership/points/redeem", { points });
    return res.data?.data ?? res.data;
  },

  // ─── Admin ─────────────────────────────────────────────────────────────────

  /** GET /membership — [admin] list semua member */
  adminGetAll: async (params?: { page?: number; limit?: number; tier?: string; search?: string }) => {
    const res = await apiClient.get("/membership", { params });
    return res.data?.data ?? res.data;
  },

  /** GET /membership/stats — [admin] statistik */
  adminGetStats: async () => {
    const res = await apiClient.get("/membership/stats");
    return res.data?.data ?? res.data;
  },

  /** POST /membership/admin/adjust-points — [admin] sesuaikan poin manual */
  adminAdjustPoints: async (payload: {
    userId: string;
    points: number;
    description?: string;
  }) => {
    const res = await apiClient.post("/membership/admin/adjust-points", payload);
    return res.data?.data ?? res.data;
  },

  /** GET /membership/user/:userId — [admin] detail membership satu user */
  adminGetUser: async (userId: string) => {
    const res = await apiClient.get(`/membership/user/${userId}`);
    return res.data?.data ?? res.data;
  },
};