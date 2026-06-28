// Single Responsibility: hanya menampilkan progress track antar tier

import { TIERS, Tier } from "@/config/Tiers";

interface Props {
  totalSpent: number;
  currentTier: Tier;
  nextTier: Tier | null;
  progressPct: number;
}

export function TierProgressTrack({ totalSpent, currentTier, nextTier, progressPct }: Props) {
  return (
    <div className="rounded-2xl border border-[#F8D7E3] bg-white p-5 sm:p-6">
      <p className="text-sm font-bold text-gray-700 mb-5">Tier Progress</p>

      <div className="relative flex items-center mb-2">
        <div className="absolute left-0 right-0 h-1.5 bg-pink-100 rounded-full" />
        <div
          className="absolute left-0 h-1.5 bg-[#F05A89] rounded-full transition-all duration-700"
          style={{ width: `${Math.min(progressPct, 100)}%` }}
        />
        <div className="relative flex justify-between w-full">
          {TIERS.map((tier) => {
            const reached = totalSpent >= tier.minSpend;
            const isCurrent = tier.key === currentTier.key;
            const Icon = tier.icon;
            return (
              <div key={tier.key} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCurrent ? "scale-110 shadow-md" : ""
                  }`}
                  style={{
                    backgroundColor: reached ? tier.color : "#F3F4F6",
                    borderColor: reached ? tier.color : "#E5E7EB",
                  }}
                >
                  <Icon size={14} color={reached ? "#fff" : "#9CA3AF"} />
                </div>
                <span className="text-xs font-bold" style={{ color: reached ? tier.color : "#9CA3AF" }}>
                  {tier.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Min spend labels */}
      <div className="flex justify-between mt-1">
        {TIERS.map((tier) => (
          <span key={tier.key} className="text-[10px] text-gray-400 font-medium">
            {tier.minSpend === 0 ? "Rp0" : `Rp${tier.minSpend / 1_000_000}jt`}
          </span>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-pink-50">
        {nextTier ? (
          <p className="text-sm text-gray-600">
            Butuh belanja{" "}
            <span className="font-bold text-[#F05A89]">
              Rp{(nextTier.minSpend - totalSpent).toLocaleString("id-ID")}
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
  );
}