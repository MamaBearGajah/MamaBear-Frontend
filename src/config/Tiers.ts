import { Award, Shield, Crown, Gem, LucideIcon } from "lucide-react";

export interface Tier {
  key: string;
  label: string;
  minSpend: number; // threshold totalSpent (Rupiah) — HARUS sinkron manual dengan
                     // TIER_THRESHOLDS di backend src/membership/membership.constants.ts
  color: string;
  bgLight: string;
  borderColor: string;
  icon: LucideIcon;
  benefits: string[];
}

export const TIERS: Tier[] = [
  {
    key: "bronze",
    label: "Bronze",
    minSpend: 0,
    color: "#CD7F32",
    bgLight: "#FDF6EE",
    borderColor: "#E8C49A",
    icon: Award,
    benefits: [
      "Akses ke promo eksklusif member",
      "Free ongkir min. order Rp150k",
    ],
  },
  {
    key: "silver",
    label: "Silver",
    minSpend: 1_000_000,
    color: "#9CA3AF",
    bgLight: "#F9FAFB",
    borderColor: "#D1D5DB",
    icon: Shield,
    benefits: [
      "Semua benefit Bronze",
      "Voucher gratis ongkir Rp5.000",
    ],
  },
  {
    key: "gold",
    label: "Gold",
    minSpend: 5_000_000,
    color: "#F59E0B",
    bgLight: "#FFFBEB",
    borderColor: "#FCD34D",
    icon: Crown,
    benefits: [
      "Semua benefit Silver",
      "Voucher gratis ongkir Rp10.000",
    ],
  },
  {
    key: "platinum",
    label: "Platinum",
    minSpend: 10_000_000,
    color: "#8B5CF6",
    bgLight: "#F5F3FF",
    borderColor: "#C4B5FD",
    icon: Gem,
    benefits: [
      "Semua benefit Gold",
      "Voucher gratis ongkir Rp15.000",
    ],
  },
];

/**
 * Ambil definisi tier (label, warna, benefit) berdasarkan key yang
 * dikembalikan backend (membership.tier). Sumber kebenaran tier SELALU
 * dari backend — fungsi ini hanya mapping tampilan, bukan penentu tier.
 */
export function getTierByKey(key: string): Tier {
  return TIERS.find((t) => t.key === key) ?? TIERS[0];
}

export function getNextTierByKey(key: string): Tier | null {
  const idx = TIERS.findIndex((t) => t.key === key);
  if (idx === -1 || idx === TIERS.length - 1) return null;
  return TIERS[idx + 1];
}

/** Returns 0–100 fill percentage for the tier progress track, berdasarkan totalSpent */
export function getTierProgress(totalSpent: number, currentKey: string): number {
  const current = getTierByKey(currentKey);
  const next = getNextTierByKey(currentKey);
  const segmentPct = 100 / (TIERS.length - 1);
  const currentIdx = TIERS.findIndex((t) => t.key === current.key);
  if (!next) return 100;
  const progressInSeg =
    (totalSpent - current.minSpend) / (next.minSpend - current.minSpend);
  return currentIdx * segmentPct + progressInSeg * segmentPct;
}