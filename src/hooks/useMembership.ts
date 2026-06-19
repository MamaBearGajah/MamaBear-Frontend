// Single Responsibility: semua state + side-effect membership di satu hook
// Dependency Inversion : komponen tidak tahu dari mana data berasal (API/mock)

"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { getCurrentTier, getNextTier, getTierProgress, Tier } from "@/config/Tiers";

export interface MembershipData {
  points: number;
  tier: string;
  totalSpent: number;
  lastDailyLoginAt?: string | null;
  streakCount?: number;
}

export interface UseMembershipReturn {
  points: number;
  currentTier: Tier;
  nextTier: Tier | null;
  progressPct: number;
  hasClaimed: boolean;
  isLoading: boolean;
  isClaiming: boolean;
  claim: () => Promise<void>;
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
  };
}

async function postClaimDaily(): Promise<{ pointsAdded: number; alreadyClaimed?: boolean }> {
  const res = await apiClient.post("/membership/daily-login");
  const raw = res.data?.data ?? res.data;
  return {
    pointsAdded: raw?.pointsEarned ?? raw?.pointsAdded ?? 0,
    alreadyClaimed: raw?.alreadyClaimed ?? false,
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

  useEffect(() => {
    fetchMembership()
      .then(setData)
      .catch(() => {
        // fallback ke data kosong kalau gagal fetch
        setData({ points: 0, tier: "bronze", totalSpent: 0 });
      })
      .finally(() => setIsLoading(false));
  }, []);

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
            }
          : prev,
      );
      onSuccess?.(`Yeay! Berhasil klaim ${res.pointsAdded} Poin!`);
    } catch {
      onError?.("Gagal klaim poin hari ini.");
    } finally {
      setIsClaiming(false);
    }
  };

  return {
    points,
    currentTier: getCurrentTier(points),
    nextTier: getNextTier(points),
    progressPct: getTierProgress(points),
    hasClaimed: hasClaimedToday(data?.lastDailyLoginAt),
    isLoading,
    isClaiming,
    claim,
  };
}