import { Award, Shield, Crown, Gem, LucideIcon } from "lucide-react";

export interface Tier {
  key: string;
  label: string;
  minPoints: number;
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
    minPoints: 0,
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
    minPoints: 1000,
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
    minPoints: 2500,
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
    minPoints: 5000,
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

export function getCurrentTier(points: number): Tier {
  return [...TIERS].reverse().find((t) => points >= t.minPoints) ?? TIERS[0];
}

export function getNextTier(points: number): Tier | null {
  return TIERS.find((t) => t.minPoints > points) ?? null;
}

/** Returns 0–100 fill percentage for the tier progress track */
export function getTierProgress(points: number): number {
  const current = getCurrentTier(points);
  const next = getNextTier(points);
  const segmentPct = 100 / (TIERS.length - 1);
  const currentIdx = TIERS.findIndex((t) => t.key === current.key);
  if (!next) return 100;
  const progressInSeg =
    (points - current.minPoints) / (next.minPoints - current.minPoints);
  return currentIdx * segmentPct + progressInSeg * segmentPct;
}