// Single Responsibility: hanya menampilkan poin + tombol daily claim

import { Star, Gift } from "lucide-react";

interface Props {
  points: number;
  hasClaimed: boolean;
  isClaiming: boolean;
  onClaim: () => void;
}

export function PointsCard({ points, hasClaimed, isClaiming, onClaim }: Props) {
  return (
    <div className="bg-[#F05A89] p-6 sm:p-8 text-white relative overflow-hidden">
      {/* Decorative stars */}
      <Star className="absolute top-4 right-8 opacity-20" size={20} fill="currentColor" />
      <Star className="absolute bottom-8 right-4 opacity-15" size={14} fill="currentColor" />
      <Star className="absolute top-10 left-4 opacity-10" size={28} fill="currentColor" />

      <div className="relative z-10">
        <p className="text-white/80 text-sm font-medium mb-1">My Points</p>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-5xl font-black tracking-tight">
            {points.toLocaleString()}
          </span>
          <div className="w-9 h-9 bg-[#FFD15B] rounded-full flex items-center justify-center shadow">
            <Star size={16} className="text-white" fill="currentColor" />
          </div>
        </div>

        <div className="border-t border-white/20 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Gift size={16} className="opacity-80" />
            <p className="text-white/80 text-sm font-semibold">Daily Login Reward</p>
          </div>
          <button
            onClick={onClaim}
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
  );
}