"use client";

import React, { useState, useEffect } from "react";
import { Gift, Star, CheckCircle, AlertCircle, Crown, Shield, Gem, Award } from "lucide-react";
import { AccountPageWrapper } from "@/components/layout/AccountPageWrapper";

// ── Config ─────────────────────────────────────────────────────────────────────
const TIERS = [
  {
    key: "bronze",
    label: "Bronze",
    minPoints: 0,
    maxPoints: 999,
    color: "#CD7F32",
    bgLight: "#FDF6EE",
    borderColor: "#E8C49A",
    icon: Award,
    benefits: ["Akses ke promo eksklusif member", "Birthday reward 25 poin", "Free ongkir min. order Rp150k"],
  },
  {
    key: "silver",
    label: "Silver",
    minPoints: 1000,
    maxPoints: 2499,
    color: "#9CA3AF",
    bgLight: "#F9FAFB",
    borderColor: "#D1D5DB",
    icon: Shield,
    benefits: ["Semua benefit Bronze", "Cashback 2% setiap transaksi", "Birthday reward 50 poin", "Free ongkir min. order Rp100k"],
  },
  {
    key: "gold",
    label: "Gold",
    minPoints: 2500,
    maxPoints: 4999,
    color: "#F59E0B",
    bgLight: "#FFFBEB",
    borderColor: "#FCD34D",
    icon: Crown,
    benefits: ["Semua benefit Silver", "Cashback 5% setiap transaksi", "Birthday reward 100 poin", "Free ongkir tanpa min. order", "Akses flash sale lebih awal"],
  },
  {
    key: "platinum",
    label: "Platinum",
    minPoints: 5000,
    maxPoints: Infinity,
    color: "#8B5CF6",
    bgLight: "#F5F3FF",
    borderColor: "#C4B5FD",
    icon: Gem,
    benefits: ["Semua benefit Gold", "Cashback 10% setiap transaksi", "Birthday reward 200 poin", "Dedicated customer support", "Undangan event eksklusif"],
  },
];

const RESET_DATE = "31 Desember 2026";

const mockMembershipApi = {
  getMembership: async () => ({
    points: 2450,
    tier: "Silver",
    lastDailyLoginAt: "2024-05-01T10:00:00.000Z",
  }),
  claimDaily: async () =>
    new Promise((resolve) => setTimeout(() => resolve({ pointsAdded: 50 }), 800)),
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function getCurrentTier(points: number) {
  return [...TIERS].reverse().find((t) => points >= t.minPoints) ?? TIERS[0];
}
function getNextTier(points: number) {
  return TIERS.find((t) => t.minPoints > points) ?? null;
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function MembershipPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    mockMembershipApi.getMembership().then((res) => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

  const checkHasClaimedToday = (iso?: string) => {
    if (!iso) return false;
    return new Date(iso).toDateString() === new Date().toDateString();
  };

  const hasClaimed = checkHasClaimedToday(data?.lastDailyLoginAt);

  const handleClaim = async () => {
    if (hasClaimed) return;
    try {
      setIsClaiming(true);
      setToast(null);
      const res: any = await mockMembershipApi.claimDaily();
      setData((prev: any) => ({
        ...prev,
        points: prev.points + res.pointsAdded,
        lastDailyLoginAt: new Date().toISOString(),
      }));
      setToast({ type: "success", text: `Yeay! Berhasil klaim ${res.pointsAdded} Poin!` });
    } catch {
      setToast({ type: "error", text: "Gagal klaim poin hari ini." });
    } finally {
      setIsClaiming(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (isLoading)
    return <div className="py-20 text-center text-gray-500">Memuat data membership...</div>;

  const currentTier = getCurrentTier(data.points);
  const nextTier = getNextTier(data.points);
  const TierIcon = currentTier.icon;

  return (
    <AccountPageWrapper title="Membership" icon={Gift}>
      {/* Toast */}
      {toast && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 font-semibold text-sm mb-5 animate-in slide-in-from-top-2 ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.text}
        </div>
      )}

      {/* ── TOP CARD: Points + Level ───────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#F8D7E3] shadow-sm overflow-hidden mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2">

          {/* Left: Points + Daily Login */}
          <div className="bg-[#F05A89] p-6 sm:p-8 text-white relative overflow-hidden">
            {/* decorative stars */}
            <Star className="absolute top-4 right-8 opacity-20" size={20} fill="currentColor" />
            <Star className="absolute bottom-8 right-4 opacity-15" size={14} fill="currentColor" />
            <Star className="absolute top-10 left-4 opacity-10" size={28} fill="currentColor" />

            <div className="relative z-10">
              <p className="text-white/80 text-sm font-medium mb-1">My Points</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-5xl font-black tracking-tight">{data.points.toLocaleString()}</span>
                <div className="w-9 h-9 bg-[#FFD15B] rounded-full flex items-center justify-center shadow">
                  <Star size={16} className="text-white" fill="currentColor" />
                </div>
              </div>

              <div className="border-t border-white/20 pt-4">
                <p className="text-white/80 text-sm font-semibold mb-3">Daily Login Reward</p>
                <button
                  onClick={handleClaim}
                  disabled={hasClaimed || isClaiming}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                    hasClaimed
                      ? "bg-white/20 text-white/60 cursor-not-allowed"
                      : "bg-white text-[#F05A89] hover:scale-105 shadow-md"
                  }`}
                >
                  {isClaiming ? "Mengklaim..." : hasClaimed ? "✓ Diklaim" : "Klaim +50 Poin"}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Membership Level + Benefits */}
          <div
            className="p-6 sm:p-8 flex flex-col"
            style={{ backgroundColor: currentTier.bgLight, borderLeft: `1px solid ${currentTier.borderColor}` }}
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Membership Level
            </p>

            {/* Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: currentTier.color + "22", border: `2px solid ${currentTier.color}` }}
              >
                <TierIcon size={18} style={{ color: currentTier.color }} />
              </div>
              <span className="text-2xl font-black" style={{ color: currentTier.color }}>
                {currentTier.label}
              </span>
            </div>

            {/* Benefits — scrollable list */}
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Benefit</p>
            <ul className="space-y-1.5 overflow-y-auto max-h-36 pr-1">
              {currentTier.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: currentTier.color }} />
                  {b}
                </li>
              ))}
            </ul>

            {nextTier && (
              <p className="text-xs text-gray-400 mt-3">
                Raih <span className="font-bold" style={{ color: nextTier.color }}>{nextTier.label}</span> di{" "}
                {nextTier.minPoints.toLocaleString()} poin
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── TIER PROGRESS CHECKPOINT ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#F8D7E3] bg-white p-5 sm:p-6 mb-4">
        <p className="text-sm font-bold text-gray-700 mb-5">Tier Progress</p>

        {/* Track */}
        <div className="relative flex items-center mb-2">
          {/* Background line */}
          <div className="absolute left-0 right-0 h-1.5 bg-pink-100 rounded-full" />

          {/* Filled line up to current position */}
          {(() => {
            const totalRange = TIERS[TIERS.length - 1].minPoints;
            const clampedPoints = Math.min(data.points, totalRange);
            const pct = (clampedPoints / totalRange) * 100;
            return (
              <div
                className="absolute left-0 h-1.5 bg-[#F05A89] rounded-full transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            );
          })()}

          {/* Checkpoints */}
          <div className="relative flex justify-between w-full">
            {TIERS.map((tier) => {
              const reached = data.points >= tier.minPoints;
              const isCurrent = tier.key === currentTier.key;
              const Icon = tier.icon;
              return (
                <div key={tier.key} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCurrent
                        ? "scale-110 shadow-md"
                        : ""
                    }`}
                    style={{
                      backgroundColor: reached ? tier.color : "#F3F4F6",
                      borderColor: reached ? tier.color : "#E5E7EB",
                    }}
                  >
                    <Icon size={14} color={reached ? "#fff" : "#9CA3AF"} />
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: reached ? tier.color : "#9CA3AF" }}
                  >
                    {tier.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Points labels */}
        <div className="flex justify-between mt-1 px-0.5">
          {TIERS.map((tier) => (
            <span key={tier.key} className="text-[10px] text-gray-400 font-medium">
              {tier.minPoints === 0 ? "0" : tier.minPoints.toLocaleString()}
            </span>
          ))}
        </div>

        {/* Next tier info */}
        <div className="mt-4 pt-4 border-t border-pink-50">
          {nextTier ? (
            <p className="text-sm text-gray-600">
              Butuh{" "}
              <span className="font-bold text-[#F05A89]">
                {(nextTier.minPoints - data.points).toLocaleString()} poin
              </span>{" "}
              lagi untuk mencapai tier{" "}
              <span className="font-bold" style={{ color: nextTier.color }}>
                {nextTier.label}
              </span>
            </p>
          ) : (
            <p className="text-sm font-bold text-purple-600">🎉 Kamu sudah di tier tertinggi!</p>
          )}
        </div>
      </div>

      {/* ── RESET INFO ────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex items-start gap-3">
        <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-700">
          Poin kamu akan{" "}
          <span className="font-bold">direset pada {RESET_DATE}</span>. Gunakan poinmu sebelum
          kedaluwarsa!
        </p>
      </div>
    </AccountPageWrapper>
  );
}