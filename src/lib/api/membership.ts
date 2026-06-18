import type { ApiResponse } from "@/types";
import { apiClient } from "./client";
import { normalizeApiResponse } from "./normalize-api-response";

export type MembershipTier = "bronze" | "silver" | "gold" | "platinum";

export interface MembershipApiData {
  userId: string;
  tier: MembershipTier;
  points: number;
  totalSpent: number;
  lastDailyLoginAt: string | null;
}

export interface NextTierInfo {
  nextTier: MembershipTier | null;
  remainingSpend: number;
  message: string;
}

export interface MembershipResponse {
  membership: MembershipApiData;
  nextTierInfo: NextTierInfo;
}

export interface MembershipApiData {
  userId: string;
  tier: MembershipTier;
  points: number;
  totalSpent: number;
  pointsExpiredAt: string | null;
  lastDailyLoginAt: string | null;
}

// GET /membership/me — perhatikan: rute aslinya "/me", bukan root "/membership"
// seperti yang tertulis di Postman collection.
export async function getMembership(): Promise<ApiResponse<MembershipResponse>> {
  const { data } = await apiClient.get<ApiResponse<MembershipResponse>>(
    "/membership/me",
  );
  return normalizeApiResponse<MembershipResponse>(data);
}