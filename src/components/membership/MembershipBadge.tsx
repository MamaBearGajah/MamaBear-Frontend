// Interface Segregation: komponen kecil ini hanya butuh `points`, tidak perlu
// tahu seluruh data membership. Bisa dipakai di profile page, navbar, dll.

import { getCurrentTier } from "@/config/Tiers";

interface Props {
  points: number;
}

export function MembershipBadge({ points }: Props) {
  const tier = getCurrentTier(points);
  const Icon = tier.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-sm whitespace-nowrap"
      style={{
        backgroundColor: tier.bgLight,
        color: tier.color,
        borderColor: tier.borderColor,
      }}
    >
      <Icon size={11} />
      {tier.label}
    </span>
  );
}