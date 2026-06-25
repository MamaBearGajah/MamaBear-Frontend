"use client";

import { useEffect, useState, useCallback } from "react";
import { Award, Crown, Gem, Shield, Search, RefreshCw, Users, Star, TrendingUp, Plus, Minus } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type MembershipTier = "bronze" | "silver" | "gold" | "platinum";

interface MemberItem {
  userId: string;
  tier: MembershipTier;
  points: number;
  totalSpent: number | string;
  lastDailyLoginAt: string | null;
  lastTierUpAt: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string; createdAt: string };
}

interface StatsData {
  totalMembers: number;
  totalPointsCirculating: number;
  totalPointsRedeemed: number;
  tierStats: Record<MembershipTier, { count: number; totalPoints: number }>;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<MembershipTier, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  bronze:   { label: "Bronze",   icon: Award,  color: "#CD7F32", bg: "#FDF6EE" },
  silver:   { label: "Silver",   icon: Shield, color: "#9CA3AF", bg: "#F9FAFB" },
  gold:     { label: "Gold",     icon: Crown,  color: "#F59E0B", bg: "#FFFBEB" },
  platinum: { label: "Platinum", icon: Gem,    color: "#8B5CF6", bg: "#F5F3FF" },
};

function TierBadge({ tier }: { tier: MembershipTier }) {
  const cfg = TIER_CONFIG[tier];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border"
      style={{ backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.color + "40" }}
    >
      <Icon size={10} />
      {cfg.label}
    </span>
  );
}

function formatRp(amount: number | string): string {
  return "Rp " + Number(amount).toLocaleString("id-ID");
}

function formatDate(iso: string | null): string {
  if (!iso) return "-";
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

// ─── Adjust Points Modal ──────────────────────────────────────────────────────

interface AdjustModalProps {
  member: MemberItem;
  onClose: () => void;
  onSuccess: () => void;
}

function AdjustPointsModal({ member, onClose, onSuccess }: AdjustModalProps) {
  const [points, setPoints] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const parsed = parseInt(points, 10);
    if (!parsed || isNaN(parsed)) {
      toast.error("Masukkan jumlah poin yang valid");
      return;
    }
    setLoading(true);
    try {
      await apiClient.post("/membership/admin/adjust-points", {
        userId: member.userId,
        points: parsed,
        description: description || undefined,
      });
      toast.success(`Point user ${member.user.name} berhasil disesuaikan`);
      onSuccess();
      onClose();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Gagal menyesuaikan poin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="font-bold text-gray-800 mb-1">Sesuaikan Poin</h3>
        <p className="text-sm text-gray-500 mb-4">
          {member.user.name} · Poin saat ini:{" "}
          <span className="font-bold text-[#F05A89]">{member.points.toLocaleString("id-ID")}</span>
        </p>

        <div className="space-y-3 mb-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Poin (+ untuk tambah, - untuk kurangi)
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="Contoh: 100 atau -50"
              className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:border-[#F05A89]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Alasan <span className="text-gray-400 font-normal">— opsional</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kompensasi delay pengiriman..."
              className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:border-[#F05A89]"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-[#F05A89] text-white text-sm font-semibold hover:bg-[#d94a7a] disabled:opacity-50 transition-colors"
          >
            {loading ? "Memproses..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Cards ──────────────────────────────────────────────────────────────

function StatsCards({ stats }: { stats: StatsData | null }) {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="rounded-2xl bg-white border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users size={15} className="text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Total Member</span>
        </div>
        <p className="text-2xl font-black text-gray-800">{stats.totalMembers.toLocaleString("id-ID")}</p>
      </div>
      <div className="rounded-2xl bg-white border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Star size={15} className="text-[#F05A89]" />
          <span className="text-xs text-gray-400 font-medium">Poin Beredar</span>
        </div>
        <p className="text-2xl font-black text-gray-800">{stats.totalPointsCirculating.toLocaleString("id-ID")}</p>
      </div>
      <div className="rounded-2xl bg-white border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={15} className="text-emerald-500" />
          <span className="text-xs text-gray-400 font-medium">Poin Diredeem</span>
        </div>
        <p className="text-2xl font-black text-gray-800">{stats.totalPointsRedeemed.toLocaleString("id-ID")}</p>
      </div>
      <div className="rounded-2xl bg-white border border-gray-100 p-4">
        <p className="text-xs text-gray-400 font-medium mb-2">Distribusi Tier</p>
        <div className="space-y-1">
          {(["platinum", "gold", "silver", "bronze"] as MembershipTier[]).map((tier) => {
            const cfg = TIER_CONFIG[tier];
            const count = stats.tierStats?.[tier]?.count ?? 0;
            return (
              <div key={tier} className="flex items-center justify-between text-xs">
                <span style={{ color: cfg.color }} className="font-semibold">{cfg.label}</span>
                <span className="text-gray-600 font-bold">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminMembershipPage() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<MembershipTier | "">("");
  const [adjustTarget, setAdjustTarget] = useState<MemberItem | null>(null);

  const fetchData = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const params: Record<string, any> = { page, limit: 20 };
      if (search) params.search = search;
      if (tierFilter) params.tier = tierFilter;

      const [membersRes, statsRes] = await Promise.all([
        apiClient.get("/membership", { params }),
        apiClient.get("/membership/stats"),
      ]);

      const mData = membersRes.data?.data ?? membersRes.data;
      setMembers(mData?.data ?? []);
      setMeta(mData?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 });

      const sData = statsRes.data?.data ?? statsRes.data;
      setStats(sData);
    } catch {
      toast.error("Gagal memuat data membership");
    } finally {
      setIsLoading(false);
    }
  }, [search, tierFilter]);

  useEffect(() => {
    const t = setTimeout(() => fetchData(1), 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Membership</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola member, poin, dan tier</p>
        </div>
        <button
          onClick={() => fetchData(meta.page)}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-[#F05A89] hover:text-[#F05A89] transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau email member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-xl border border-gray-200 pl-9 pr-3 text-sm focus:outline-none focus:border-[#F05A89]"
          />
        </div>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value as MembershipTier | "")}
          className="h-10 rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:border-[#F05A89]"
        >
          <option value="">Semua Tier</option>
          <option value="bronze">Bronze</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Member</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Tier</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Poin</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Total Belanja</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Bergabung</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Naik Tier</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3.5 bg-gray-100 animate-pulse rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    Tidak ada member ditemukan
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.userId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800">{m.user.name}</p>
                      <p className="text-xs text-gray-400">{m.user.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <TierBadge tier={m.tier} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-bold text-[#F05A89]">{m.points.toLocaleString("id-ID")}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-gray-700 font-medium">
                      {formatRp(m.totalSpent)}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      {formatDate(m.user.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      {formatDate(m.lastTierUpAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setAdjustTarget(m)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#F05A89] transition-colors"
                      >
                        <Star size={12} />
                        Sesuaikan Poin
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              {meta.total} member · Hal {meta.page} dari {meta.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchData(meta.page - 1)}
                disabled={meta.page === 1}
                className="h-8 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 hover:border-[#F05A89] disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => fetchData(meta.page + 1)}
                disabled={meta.page === meta.totalPages}
                className="h-8 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 hover:border-[#F05A89] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Adjust Points Modal */}
      {adjustTarget && (
        <AdjustPointsModal
          member={adjustTarget}
          onClose={() => setAdjustTarget(null)}
          onSuccess={() => fetchData(meta.page)}
        />
      )}
    </div>
  );
}