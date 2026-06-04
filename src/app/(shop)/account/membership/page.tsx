"use client";

import React, { useState, useEffect } from "react";
import { Gift, Star, CheckCircle, AlertCircle } from "lucide-react";
import { AccountPageWrapper } from "@/components/layout/AccountPageWrapper";

const mockMembershipApi = {
  getMembership: async () => ({
    points: 2450,
    tier: "Silver",
    nextTier: "Gold",
    lastDailyLoginAt: "2024-05-01T10:00:00.000Z", // Set tanggal lama agar bisa diklaim
  }),
  claimDaily: async () => new Promise((resolve) => {
    setTimeout(() => {
      resolve({ pointsAdded: 50 });
    }, 800);
  })
};

const MAX_POINTS_TIER = 4000;

export default function MembershipPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error", text: string } | null>(null);

  useEffect(() => {
    mockMembershipApi.getMembership().then(res => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

  const checkHasClaimedToday = (lastLoginIso?: string) => {
    if (!lastLoginIso) return false;
    return new Date(lastLoginIso).toDateString() === new Date().toDateString();
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
        lastDailyLoginAt: new Date().toISOString() 
      }));
      setToast({ type: "success", text: `Yeay! Berhasil klaim ${res.pointsAdded} Poin!` });
    } catch (error: any) {
      setToast({ type: "error", text: "Gagal klaim poin hari ini." });
    } finally {
      setIsClaiming(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (isLoading) return <div className="py-20 text-center text-gray-500">Memuat data membership...</div>;

  const progressPercent = Math.min((data.points / MAX_POINTS_TIER) * 100, 100);
  const pointsNeeded = MAX_POINTS_TIER - data.points;

  return (
    <AccountPageWrapper title="Membership" icon={Gift}>
      {toast && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-semibold text-sm mb-6 animate-in slide-in-from-top-2 ${toast.type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.text}
        </div>
      )}

      {/* MEMBERSHIP CARD */}
      <div className="rounded-3xl border border-[#F8D7E3] shadow-sm mb-4">
        
        {/* Top Pink Section */}
        <div className="bg-[#F05A89] rounded-t-3xl p-8 sm:p-10 text-white relative overflow-hidden">
          {/* Ornamen Bintang */}
          <Star className="absolute top-6 left-1/2 opacity-20" size={24} fill="currentColor" />
          <Star className="absolute bottom-10 right-1/4 opacity-30" size={16} fill="currentColor" />
          <Star className="absolute top-12 right-12 opacity-40" size={32} fill="currentColor" />

          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
            <div>
              <p className="text-white/90 text-lg font-medium mb-1">Your Points</p>
              <div className="flex items-center gap-3 mb-2">
                {/* ANGKA POIN BERWARNA PUTIH MURNI */}
                <h3 className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                  {data.points.toLocaleString()}
                </h3>
                <div className="w-10 h-10 bg-[#FFD15B] rounded-full flex items-center justify-center shadow-sm">
                  <Star size={18} className="text-white" fill="currentColor" />
                </div>
              </div>
              <p className="text-white/90 text-sm max-w-[250px] leading-relaxed">
                Keep earning to unlock exciting rewards!
              </p>
            </div>

            {/* Gift Icon & Claim Box */}
            <div className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-6 text-center">
              <Gift size={48} className="mx-auto mb-4 text-white opacity-90 drop-shadow-md" strokeWidth={1.5} />
              
              {/* TEKS DI ATAS BUTTON BERWARNA PUTIH */}
              <p className="text-sm font-bold mb-4 text-white">Daily Login Reward</p>
              
              <button
                onClick={handleClaim}
                disabled={hasClaimed || isClaiming}
                className={`w-full sm:w-40 py-2.5 rounded-full text-sm font-bold transition-all ${
                  hasClaimed 
                    ? "bg-white/30 text-white/70 cursor-not-allowed" 
                    : "bg-white text-[#F05A89] hover:scale-105 shadow-md"
                }`}
              >
                {isClaiming ? "Mengklaim..." : hasClaimed ? "Diklaim" : "Klaim Poin"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar Section (Putih) */}
        <div className="bg-white rounded-b-3xl p-6 sm:p-8">
          <div className="flex justify-between items-end mb-4">
            <p className="text-sm font-semibold text-gray-800">
              <span className="text-[#F05A89]">{pointsNeeded.toLocaleString()} points</span> to reach {data.nextTier} Tier
            </p>
            <p className="text-sm font-bold text-gray-500">{MAX_POINTS_TIER.toLocaleString()}</p>
          </div>

          <div className="relative h-4 bg-pink-100 rounded-full w-full">
            {/* Animasi Progress Bar Pink */}
            <div 
              className="absolute top-0 left-0 h-full bg-[#F05A89] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Thumb Star */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 bg-[#F05A89] text-white rounded-full p-1.5 border-4 border-white shadow-md transition-all duration-1000 ease-out z-10"
              style={{ left: `calc(${progressPercent}% - 18px)` }}
            >
              <Star size={16} fill="currentColor" />
            </div>
          </div>
        </div>
      </div>
    </AccountPageWrapper>
  );
}