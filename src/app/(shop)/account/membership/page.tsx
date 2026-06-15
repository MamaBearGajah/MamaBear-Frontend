"use client";

import { useState } from "react";
import { Gift, CheckCircle, AlertCircle } from "lucide-react";
import { AccountPageWrapper } from "@/components/layout/AccountPageWrapper";
import { useMembership } from "@/hooks/useMembership";
import { PointsCard } from "@/components/membership/PointsCard";
import { TierCard } from "@/components/membership/TierCard";
import { TierProgressTrack } from "@/components/membership/TierProgressTrack";
import { PointsResetBanner } from "@/components/membership/PointResetBanner";

type ToastState = { type: "success" | "error"; text: string } | null;

export default function MembershipPage() {
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const membership = useMembership(
    (msg) => showToast("success", msg),
    (msg) => showToast("error", msg),
  );

  if (membership.isLoading) {
    return (
      <div className="py-20 text-center text-gray-500">Memuat data membership...</div>
    );
  }

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

      {/* Top card: Points (left) + Tier & Benefits (right) */}
      <div className="rounded-3xl border border-[#F8D7E3] shadow-sm overflow-hidden mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <PointsCard
            points={membership.points}
            hasClaimed={membership.hasClaimed}
            isClaiming={membership.isClaiming}
            onClaim={membership.claim}
          />
          <TierCard
            currentTier={membership.currentTier}
            nextTier={membership.nextTier}
          />
        </div>
      </div>

      {/* Progress checkpoint */}
      <div className="mb-4">
        <TierProgressTrack
          points={membership.points}
          currentTier={membership.currentTier}
          nextTier={membership.nextTier}
          progressPct={membership.progressPct}
        />
      </div>

      {/* Reset banner */}
      <PointsResetBanner />
    </AccountPageWrapper>
  );
}