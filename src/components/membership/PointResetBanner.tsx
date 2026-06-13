// Single Responsibility: hanya menampilkan info kapan poin akan direset

import { AlertCircle } from "lucide-react";
import { POINTS_RESET_DATE } from "@/config/Tiers";

export function PointsResetBanner() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex items-start gap-3">
      <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
      <p className="text-sm text-amber-700">
        Poin kamu akan{" "}
        <span className="font-bold">direset pada {POINTS_RESET_DATE}</span>. Gunakan poinmu
        sebelum kedaluwarsa!
      </p>
    </div>
  );
}