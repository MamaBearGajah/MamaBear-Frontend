import { Award, Shield, Crown, Gem, LucideIcon } from "lucide-react";

export interface Tier {
  key: string;
  label: string;
  /** Minimum totalSpent (Rp) untuk mencapai tier ini — sesuai backend TIER_THRESHOLDS */
  minSpend: number;
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
      "Birthday reward 25 poin",
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
      "Cashback 2% setiap transaksi",
      "Birthday reward 50 poin",
      "Free ongkir min. order Rp100k",
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
      "Cashback 5% setiap transaksi",
      "Birthday reward 100 poin",
      "Free ongkir tanpa min. order",
      "Akses flash sale lebih awal",
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
      "Cashback 10% setiap transaksi",
      "Birthday reward 200 poin",
      "Dedicated customer support",
      "Undangan event eksklusif",
    ],
  },
];

export const POINTS_RESET_DATE = "31 Desember 2026";

/** Tentukan tier berdasarkan totalSpent (Rp) — sesuai backend determineTier() */
export function getCurrentTier(totalSpent: number): Tier {
  return [...TIERS].reverse().find((t) => totalSpent >= t.minSpend) ?? TIERS[0];
}

/** Tier berikutnya, null jika sudah platinum */
export function getNextTier(totalSpent: number): Tier | null {
  return TIERS.find((t) => t.minSpend > totalSpent) ?? null;
}

/** Progress 0–100 untuk progress track, berbasis totalSpent */
export function getTierProgress(totalSpent: number): number {
  const current = getCurrentTier(totalSpent);
  const next = getNextTier(totalSpent);
  const segmentPct = 100 / (TIERS.length - 1);
  const currentIdx = TIERS.findIndex((t) => t.key === current.key);
  if (!next) return 100;
  const progressInSeg =
    (totalSpent - current.minSpend) / (next.minSpend - current.minSpend);
  return currentIdx * segmentPct + progressInSeg * segmentPct;
}

/** Format Rp singkat: 1.500.000 → "Rp 1,5 jt" */
export function formatSpend(amount: number): string {
  if (amount >= 1_000_000) {
    const juta = amount / 1_000_000;
    return `Rp ${juta % 1 === 0 ? juta.toFixed(0) : juta.toFixed(1)} jt`;
  }
  return `Rp ${amount.toLocaleString("id-ID")}`;
}