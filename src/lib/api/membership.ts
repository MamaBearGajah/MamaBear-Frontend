import { apiClient } from "./client";
import { normalizeApiResponse } from "./normalize-api-response";

export interface MembershipData {
  userId: string;
  points: number;
  totalEarned: number;
  totalRedeemed: number;
  lastDailyLoginAt?: string;
  tier?: string;
}

export interface PointHistoryItem {
  id: string;
  type: "earn" | "redeem";
  points: number;
  description: string;
  createdAt: string;
}

export interface Reward {
  id: string;
  name: string;
  pointCost: number;
  description?: string;
}

export const membershipApi = {
  /** GET /membership/me */
  getMyMembership: async (): Promise<MembershipData> => {
    const res = await apiClient.get("/membership/me");
    const norm = normalizeApiResponse<MembershipData>(res.data);
    return norm.data;
  },

  /** GET /membership/points/history */
  getPointsHistory: async (page = 1, limit = 20): Promise<PointHistoryItem[]> => {
    const res = await apiClient.get("/membership/points/history", {
      params: { page, limit },
    });
    const norm = normalizeApiResponse<PointHistoryItem[]>(res.data);
    return Array.isArray(norm.data) ? norm.data : [];
  },

  /** POST /membership/daily-login */
  dailyLogin: async (): Promise<{ points: number; message: string }> => {
    const res = await apiClient.post("/membership/daily-login");
    const norm = normalizeApiResponse<{ points: number; message: string }>(res.data);
    return norm.data;
  },

  /** POST /membership/points/redeem */
  redeemPoints: async (rewardId: string): Promise<{ remainingPoints: number }> => {
    const res = await apiClient.post("/membership/points/redeem", { rewardId });
    const norm = normalizeApiResponse<{ remainingPoints: number }>(res.data);
    return norm.data;
  },

  /** GET /membership/rewards */
  getRewards: async (): Promise<Reward[]> => {
    const res = await apiClient.get("/membership/rewards");
    const norm = normalizeApiResponse<Reward[]>(res.data);
    return Array.isArray(norm.data) ? norm.data : [];
  },

  /** POST /membership/rewards (admin) */
  createReward: (payload: { name: string; pointCost: number; description?: string }) =>
    apiClient.post("/membership/rewards", payload),

  /** PATCH /membership/rewards/:id (admin) */
  updateReward: (id: string, payload: { name?: string; pointCost?: number; description?: string }) =>
    apiClient.patch(`/membership/rewards/${id}`, payload),

  /** DELETE /membership/rewards/:id (admin) */
  deleteReward: (id: string) =>
    apiClient.delete(`/membership/rewards/${id}`),
};
