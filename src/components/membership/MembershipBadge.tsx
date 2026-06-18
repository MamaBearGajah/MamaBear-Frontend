// Interface Segregation: komponen kecil ini hanya butuh `tier`, tidak perlu
// tahu seluruh data membership. Bisa dipakai di profile page, navbar, dll.

import { getTierByKey } from "@/config/Tiers";

interface Props {
  tier: string; // "bronze" | "silver" | "gold" | "platinum" — key dari backend
}

export function MembershipBadge({ tier }: Props) {
  const tierInfo = getTierByKey(tier);
  const Icon = tierInfo.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-sm whitespace-nowrap"
      style={{
        backgroundColor: tierInfo.bgLight,
        color: tierInfo.color,
        borderColor: tierInfo.borderColor,
      }}
    >
      <Icon size={11} />
      {tierInfo.label}
    </span>
  );
}