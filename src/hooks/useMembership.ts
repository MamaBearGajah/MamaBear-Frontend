// Single Responsibility: semua state + side-effect membership di satu hook
// Dependency Inversion : komponen tidak tahu dari mana data berasal (API/mock)

"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { getCurrentTier, getNextTier, getTierProgress, Tier } from "@/config/Tiers";

export interface PointTransaction {
  id: string;
  points: number;
  type: "purchase" | "daily_login" | "redeem" | "expired" | "refund" | "bonus";
  referenceId?: string | null;
  description?: string | null;
  createdAt: string;
}

export interface ActiveVoucher {
  id: string;
  code: string;
  type: string;
  value: number;
  endDate: string | null;
}

export interface MembershipData {
  points: number;
  tier: string;
  totalSpent: number;
  lastDailyLoginAt?: string | null;
  streakCount?: number;
  recentTransactions?: PointTransaction[];
  activeVouchers?: ActiveVoucher[];
  nextTierInfo?: {
    nextTier: string | null;
    remainingSpend: number;
    message: string;
  } | null;
}

export interface UseMembershipReturn {
  points: number;
  totalSpent: number;
  currentTier: Tier;
  nextTier: Tier | null;
  progressPct: number;
  hasClaimed: boolean;
  isLoading: boolean;
  isClaiming: boolean;
  isRedeeming: boolean;
  recentTransactions: PointTransaction[];
  activeVouchers: ActiveVoucher[];
  remainingSpend: number;
  claim: () => Promise<void>;
  redeem: (points: number) => Promise<{ voucherCode: string; discountValue: number }>;
  refresh: () => Promise<void>;
}

async function fetchMembership(): Promise<MembershipData> {
  const res = await apiClient.get("/membership/me");
  const raw = res.data?.data ?? res.data;
  const membership = raw?.membership ?? raw;
  return {
    points: membership?.points ?? 0,
    tier: membership?.tier ?? "bronze",
    totalSpent: Number(membership?.totalSpent ?? 0),
    lastDailyLoginAt: membership?.lastDailyLoginAt ?? null,
    streakCount: membership?.streakCount ?? 0,
    recentTransactions: raw?.recentTransactions ?? [],
    activeVouchers: raw?.activeVouchers ?? [],
    nextTierInfo: raw?.nextTierInfo ?? null,
  };
}

async function postClaimDaily(): Promise<{
  pointsAdded: number;
  alreadyClaimed?: boolean;
  streakCount?: number;
  isStreakBonus?: boolean;
  message?: string;
}> {
  const res = await apiClient.post("/membership/daily-login");
  const raw = res.data?.data ?? res.data;
  return {
    pointsAdded: raw?.pointsEarned ?? raw?.pointsAdded ?? 0,
    alreadyClaimed: raw?.alreadyClaimed ?? false,
    streakCount: raw?.streakCount ?? 0,
    isStreakBonus: raw?.isStreakBonus ?? false,
    message: raw?.message,
  };
}

function hasClaimedToday(isoDate?: string | null): boolean {
  if (!isoDate) return false;
  return new Date(isoDate).toDateString() === new Date().toDateString();
}

export function useMembership(
  onSuccess?: (msg: string) => void,
  onError?: (msg: string) => void,
): UseMembershipReturn {
  const [data, setData] = useState<MembershipData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await fetchMembership();
      setData(d);
    } catch {
      setData({ points: 0, tier: "bronze", totalSpent: 0 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const points = data?.points ?? 0;

  const claim = async () => {
    if (!data) return;
    if (hasClaimedToday(data.lastDailyLoginAt)) {
      onError?.("Kamu sudah klaim poin hari ini.");
      return;
    }
    setIsClaiming(true);
    try {
      const res = await postClaimDaily();
      if (res.alreadyClaimed) {
        onError?.("Kamu sudah klaim poin hari ini.");
        return;
      }
      setData((prev) =>
        prev
          ? {
              ...prev,
              points: prev.points + res.pointsAdded,
              lastDailyLoginAt: new Date().toISOString(),
              recentTransactions: [
                {
                  id: `daily-${Date.now()}`,
                  points: res.pointsAdded,
                  type: "daily_login",
                  description: res.message ?? `Daily check-in +${res.pointsAdded} poin`,
                  createdAt: new Date().toISOString(),
                },
                ...(prev.recentTransactions ?? []).slice(0, 9),
              ],
            }
          : prev,
      );
      onSuccess?.(res.message ?? `Yeay! Berhasil klaim ${res.pointsAdded} Poin!`);
    } catch {
      onError?.("Gagal klaim poin hari ini.");
    } finally {
      setIsClaiming(false);
    }
  };

  const redeem = async (redeemPoints: number) => {
    setIsRedeeming(true);
    try {
      const res = await apiClient.post("/membership/points/redeem", { points: redeemPoints });
      const raw = res.data?.data ?? res.data;
      const voucherCode: string = raw?.voucher?.code ?? raw?.voucherCode ?? "";
      const discountValue: number = raw?.discountValue ?? 0;

      // Refresh full data setelah redeem
      await load();

      onSuccess?.(`Berhasil redeem ${redeemPoints} poin! Voucher: ${voucherCode}`);
      return { voucherCode, discountValue };
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Gagal redeem poin.";
      onError?.(msg);
      throw err;
    } finally {
      setIsRedeeming(false);
    }
  };

  const currentTierObj = getCurrentTier(points);
  const nextTierObj = getNextTier(points);

  // Remaining spend ke tier berikutnya (dalam rupiah, dari backend)
  const remainingSpend = data?.nextTierInfo?.remainingSpend ?? 0;

  return {
    points,
    totalSpent: data?.totalSpent ?? 0,
    currentTier: currentTierObj,
    nextTier: nextTierObj,
    progressPct: getTierProgress(points),
    hasClaimed: hasClaimedToday(data?.lastDailyLoginAt),
    isLoading,
    isClaiming,
    isRedeeming,
    recentTransactions: data?.recentTransactions ?? [],
    activeVouchers: data?.activeVouchers ?? [],
    remainingSpend,
    claim,
    redeem,
    refresh: load,
  };
}