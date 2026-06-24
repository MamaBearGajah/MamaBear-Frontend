// Single Responsibility: hanya menampilkan riwayat transaksi poin

import { ArrowUpCircle, ArrowDownCircle, Gift, Zap, Star, RotateCcw } from "lucide-react";
import type { PointTransaction } from "@/hooks/useMembership";

interface Props {
  transactions: PointTransaction[];
  isLoading?: boolean;
}

const TYPE_CONFIG: Record<
  PointTransaction["type"],
  { label: string; icon: React.ElementType; color: string; bg: string; sign: "+" | "-" }
> = {
  purchase:    { label: "Pembelian",    icon: ArrowUpCircle,   color: "#10B981", bg: "#ECFDF5", sign: "+" },
  daily_login: { label: "Daily Login",  icon: Gift,            color: "#F05A89", bg: "#FFF1F6", sign: "+" },
  bonus:       { label: "Bonus",        icon: Zap,             color: "#F59E0B", bg: "#FFFBEB", sign: "+" },
  redeem:      { label: "Redeem",       icon: ArrowDownCircle, color: "#6366F1", bg: "#EEF2FF", sign: "-" },
  expired:     { label: "Expired",      icon: RotateCcw,       color: "#9CA3AF", bg: "#F9FAFB", sign: "-" },
  refund:      { label: "Refund",       icon: Star,            color: "#3B82F6", bg: "#EFF6FF", sign: "+" },
};

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

export function PointHistoryCard({ transactions, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#F8D7E3] bg-white p-5">
        <div className="h-4 w-32 bg-gray-100 animate-pulse rounded mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className="w-9 h-9 bg-gray-100 animate-pulse rounded-full" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-24 bg-gray-100 animate-pulse rounded" />
              <div className="h-2.5 w-40 bg-gray-100 animate-pulse rounded" />
            </div>
            <div className="h-4 w-12 bg-gray-100 animate-pulse rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#F8D7E3] bg-white p-5 sm:p-6">
      <p className="text-sm font-bold text-gray-700 mb-4">Riwayat Poin</p>

      {transactions.length === 0 ? (
        <div className="py-8 text-center text-gray-400 text-sm">
          <Star size={28} className="mx-auto mb-2 opacity-30" />
          Belum ada transaksi poin
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {transactions.map((tx) => {
            const cfg = TYPE_CONFIG[tx.type] ?? TYPE_CONFIG.bonus;
            const Icon = cfg.icon;
            const isPositive = tx.points > 0;

            return (
              <div key={tx.id} className="flex items-center gap-3 py-3">
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: cfg.bg }}
                >
                  <Icon size={15} style={{ color: cfg.color }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {tx.description ?? cfg.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(tx.createdAt)}</p>
                </div>

                {/* Points */}
                <span
                  className="text-sm font-bold shrink-0"
                  style={{ color: isPositive ? "#10B981" : "#EF4444" }}
                >
                  {isPositive ? "+" : ""}{tx.points.toLocaleString("id-ID")} poin
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}