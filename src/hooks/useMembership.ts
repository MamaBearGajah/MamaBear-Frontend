// Single Responsibility: semua state + side-effect membership di satu hook
// Dependency Inversion : komponen tidak tahu dari mana data berasal (API/mock)

"use client";

import { useState, useEffect } from "react";
import { getCurrentTier, getNextTier, getTierProgress, Tier } from "@/config/Tiers";

export interface MembershipData {
  points: number;
  lastDailyLoginAt: string;
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

// Ganti fungsi ini dengan API asli (authApi.getMembership, dll)
async function fetchMembership(): Promise<MembershipData> {
  // await authApi.getMembership()
  return {
    points: 2450,
    lastDailyLoginAt: "2024-05-01T10:00:00.000Z",
  };
}

async function postClaimDaily(): Promise<{ pointsAdded: number }> {
  // await apiClient.post("/membership/claim-daily")
  return new Promise((resolve) => setTimeout(() => resolve({ pointsAdded: 50 }), 800));
}

function hasClaimedToday(isoDate?: string): boolean {
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
      .finally(() => setIsLoading(false));
  }, []);

  const points = data?.points ?? 0;

  const claim = async () => {
    if (!data || hasClaimedToday(data.lastDailyLoginAt)) return;
    setIsClaiming(true);
    try {
      const res = await postClaimDaily();
      setData((prev) =>
        prev
          ? { ...prev, points: prev.points + res.pointsAdded, lastDailyLoginAt: new Date().toISOString() }
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