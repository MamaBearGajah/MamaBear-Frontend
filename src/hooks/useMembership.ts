"use client";

import { useState, useEffect } from "react";
import { getMembership } from "@/lib/api/membership";
import { getTierByKey, getNextTierByKey, getTierProgress, Tier } from "@/config/Tiers";

export interface UseMembershipReturn {
  points: number;
  totalSpent: number;
  pointsExpiredAt: string | null;
  currentTier: Tier;
  nextTier: Tier | null;
  progressPct: number;
  hasClaimed: boolean;
  isLoading: boolean;
  isClaiming: boolean;
  claim: () => Promise<void>;
}

function hasClaimedToday(isoDate?: string | null): boolean {
  if (!isoDate) return false;
  return new Date(isoDate).toDateString() === new Date().toDateString();
}

// TODO: ganti dengan POST /membership/daily-login begitu endpoint-nya
// tersedia di backend. Untuk sekarang fitur ini disengaja tetap mock,
// karena backend belum implement daily check-in.
async function postClaimDailyMock(): Promise<{ pointsAdded: number }> {
  return new Promise((resolve) => setTimeout(() => resolve({ pointsAdded: 50 }), 800));
}

export function useMembership(
  onSuccess?: (msg: string) => void,
  onError?: (msg: string) => void,
): UseMembershipReturn {
  const [points, setPoints] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [pointsExpiredAt, setPointsExpiredAt] = useState<string | null>(null);
  const [tierKey, setTierKey] = useState("bronze");
  const [lastDailyLoginAt, setLastDailyLoginAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    getMembership()
      .then((res) => {
        const { membership } = res.data;
        setPoints(membership.points);
        setTotalSpent(membership.totalSpent);
        setTierKey(membership.tier);
        setLastDailyLoginAt(membership.lastDailyLoginAt);
        setPointsExpiredAt(membership.pointsExpiredAt);
      })
      .catch(() => onError?.("Gagal memuat data membership."))
      .finally(() => setIsLoading(false));
  }, []);

  const claim = async () => {
    if (hasClaimedToday(lastDailyLoginAt)) return;
    setIsClaiming(true);
    try {
      const res = await postClaimDailyMock();
      setPoints((p) => p + res.pointsAdded);
      setLastDailyLoginAt(new Date().toISOString());
      onSuccess?.(`Yeay! Berhasil klaim ${res.pointsAdded} Poin!`);
    } catch {
      onError?.("Gagal klaim poin hari ini.");
    } finally {
      setIsClaiming(false);
    }
  };

  return {
    points,
    totalSpent,
    pointsExpiredAt,
    currentTier: getTierByKey(tierKey),
    nextTier: getNextTierByKey(tierKey),
    progressPct: getTierProgress(totalSpent, tierKey),
    hasClaimed: hasClaimedToday(lastDailyLoginAt),
    isLoading,
    isClaiming,
    claim,
  };
}