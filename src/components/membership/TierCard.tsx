// Single Responsibility: hanya menampilkan tier saat ini + daftar benefit

import { CheckCircle } from "lucide-react";
import { Tier } from "@/config/Tiers";

interface Props {
  currentTier: Tier;
  nextTier: Tier | null;
}

export function TierCard({ currentTier, nextTier }: Props) {
  const Icon = currentTier.icon;

  return (
    <div
      className="p-6 sm:p-8 flex flex-col"
      style={{
        backgroundColor: currentTier.bgLight,
        borderLeft: `1px solid ${currentTier.borderColor}`,
      }}
    >
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Membership Level
      </p>

      {/* Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: currentTier.color + "22",
            border: `2px solid ${currentTier.color}`,
          }}
        >
          <Icon size={18} style={{ color: currentTier.color }} />
        </div>
        <span className="text-2xl font-black" style={{ color: currentTier.color }}>
          {currentTier.label}
        </span>
      </div>

      {/* Benefits */}
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Benefit</p>
      <ul className="space-y-1.5 overflow-y-auto max-h-36 pr-1 flex-1">
        {currentTier.benefits.map((benefit, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle
              size={14}
              className="mt-0.5 shrink-0"
              style={{ color: currentTier.color }}
            />
            {benefit}
          </li>
        ))}
      </ul>

      {nextTier && (
        <p className="text-xs text-gray-400 mt-3">
          Raih{" "}
          <span className="font-bold" style={{ color: nextTier.color }}>
            {nextTier.label}
          </span>{" "}
          di {nextTier.minPoints.toLocaleString()} poin
        </p>
      )}
    </div>
  );
}