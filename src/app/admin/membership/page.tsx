"use client";

/**
 * src/app/admin/membership/page.tsx
 * Lihat daftar member + poin, kelola reward, manual adjust poin
 * BE: GET /membership (admin view semua user + poin)
 *     GET /membership/rewards → GET /faq (placeholder: reward dari seed)
 */

import { useCallback, useEffect, useState } from "react";
import {
  Star, Search, ChevronLeft, ChevronRight,
  Loader2, Gift, Plus, Trash2, Pencil,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";
import { normalizeApiResponse } from "@/lib/api/normalize-api-response";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

// ─── Types ───────────────────────────────────────────────────────────────────

type MemberEntry = {
  userId: string;
  userName: string;
  userEmail: string;
  points: number;
  totalEarned: number;
  totalRedeemed: number;
  lastDailyLoginAt?: string;
  memberSince: string;
};

type Reward = {
  id: string;
  name: string;
  pointCost: number;
  description?: string;
};

// PaginationMeta from BE: { page, limit, total, totalPages }
type Meta = { page: number; limit: number; total: number; totalPages: number };

function fmtDate(s?: string) {
  if (!s) return "—";
  try { return format(parseISO(s), "d MMM yyyy", { locale: localeId }); }
  catch { return "—"; }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminMembershipPage() {
  const [members, setMembers] = useState<MemberEntry[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<"members" | "rewards">("members");

  // Reward dialog
  const [rewardDialog, setRewardDialog] = useState(false);
  const [editReward, setEditReward] = useState<Reward | null>(null);
  const [rewardForm, setRewardForm] = useState({ name: "", pointCost: "", description: "" });
  const [savingReward, setSavingReward] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15", ...(search ? { search } : {}) });
      // Backend endpoint: GET /admin/customers (filter by membership data)
      // atau bisa jadi GET /membership/admin tergantung implementasi BE
      const res = await apiClient.get(`/admin/customers?${params}`);
      const norm = normalizeApiResponse<any[]>(res.data);
      // Map customer data ke MemberEntry format
      const mapped: MemberEntry[] = (Array.isArray(norm.data) ? norm.data : []).map((c: any) => ({
        userId: c.id,
        userName: c.name,
        userEmail: c.email,
        points: c.membership?.points ?? 0,
        totalEarned: c.membership?.totalEarned ?? 0,
        totalRedeemed: c.membership?.totalRedeemed ?? 0,
        lastDailyLoginAt: c.membership?.lastDailyLoginAt,
        memberSince: c.createdAt,
      }));
      setMembers(mapped);
      setMeta(norm.meta ? (norm.meta as any as Meta) : null);
    } catch {
      toast.error("Gagal memuat data member");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  const fetchRewards = useCallback(async () => {
    try {
      const res = await apiClient.get("/membership/rewards");
      const norm = normalizeApiResponse<Reward[]>(res.data);
      setRewards(Array.isArray(norm.data) ? norm.data : []);
    } catch {
      setRewards([]);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setPage(1), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);
  useEffect(() => { fetchRewards(); }, [fetchRewards]);

  function openCreateReward() {
    setEditReward(null);
    setRewardForm({ name: "", pointCost: "", description: "" });
    setRewardDialog(true);
  }

  function openEditReward(r: Reward) {
    setEditReward(r);
    setRewardForm({ name: r.name, pointCost: String(r.pointCost), description: r.description ?? "" });
    setRewardDialog(true);
  }

  async function handleSaveReward() {
    if (!rewardForm.name.trim()) { toast.error("Nama reward wajib diisi"); return; }
    if (!rewardForm.pointCost) { toast.error("Point cost wajib diisi"); return; }
    setSavingReward(true);
    try {
      const payload = { name: rewardForm.name.trim(), pointCost: Number(rewardForm.pointCost), description: rewardForm.description.trim() || undefined };
      if (editReward) {
        await apiClient.patch(`/membership/rewards/${editReward.id}`, payload);
        toast.success("Reward diperbarui");
      } else {
        await apiClient.post("/membership/rewards", payload);
        toast.success("Reward dibuat");
      }
      setRewardDialog(false);
      fetchRewards();
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message ?? "Gagal menyimpan reward");
    } finally {
      setSavingReward(false);
    }
  }

  async function handleDeleteReward(r: Reward) {
    if (!confirm(`Hapus reward "${r.name}"?`)) return;
    try {
      await apiClient.delete(`/membership/rewards/${r.id}`);
      setRewards((prev) => prev.filter((x) => x.id !== r.id));
      toast.success("Reward dihapus");
    } catch {
      toast.error("Gagal menghapus reward");
    }
  }

  return (
    <div className="min-h-full bg-[#FAFAFB] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#4C3437]">Membership & Poin</h1>
            <p className="mt-1 text-sm text-gray-500">Pantau poin pelanggan dan kelola reward</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-white border border-[#F1E9EB] p-1 w-fit">
          {(["members", "rewards"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${tab === t ? "bg-[#D95A87] text-white" : "text-gray-500 hover:text-gray-800"}`}
            >
              {t === "members" ? "Member" : "Reward"}
            </button>
          ))}
        </div>

        {tab === "members" && (
          <>
            <div className="relative max-w-sm">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Cari nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-full border border-[#EFE6EA] bg-white pl-10 pr-4 text-sm outline-none focus:border-[#D95A87]"
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#F1E9EB] bg-white shadow-sm">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="size-6 animate-spin text-[#D95A87]" />
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b border-[#F1E9EB] bg-[#FDF8FA]">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Member</th>
                      <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Poin Aktif</th>
                      <th className="hidden px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 sm:table-cell">Total Earned</th>
                      <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 md:table-cell">Login Harian</th>
                      <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 lg:table-cell">Bergabung</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F9F1F4]">
                    {members.map((m) => (
                      <tr key={m.userId} className="hover:bg-[#FDF8FA]">
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#4C3437]">{m.userName}</p>
                          <p className="text-xs text-gray-400">{m.userEmail}</p>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-semibold text-yellow-700">
                            <Star className="size-3" />
                            {m.points.toLocaleString("id-ID")}
                          </span>
                        </td>
                        <td className="hidden px-5 py-4 text-center text-gray-500 sm:table-cell">
                          {m.totalEarned.toLocaleString("id-ID")}
                        </td>
                        <td className="hidden px-5 py-4 text-gray-500 md:table-cell">
                          {fmtDate(m.lastDailyLoginAt)}
                        </td>
                        <td className="hidden px-5 py-4 text-gray-500 lg:table-cell">
                          {fmtDate(m.memberSince)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-[#F1E9EB] px-5 py-3 text-sm">
                  <p className="text-gray-500">Halaman {meta.page} dari {meta.totalPages}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={meta.page <= 1} className="inline-flex size-8 items-center justify-center rounded-full border disabled:opacity-40">
                      <ChevronLeft className="size-4" />
                    </button>
                    <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={meta.page >= meta.totalPages} className="inline-flex size-8 items-center justify-center rounded-full border disabled:opacity-40">
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {tab === "rewards" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={openCreateReward} className="w-full gap-2 sm:w-auto bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90">
                <Plus className="size-4" /> Tambah Reward
              </Button>
            </div>

            {rewards.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#F1E9EB] py-20 text-gray-400">
                <Gift className="size-10 mb-3 opacity-40" />
                <p className="text-sm">Belum ada reward</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {rewards.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-[#F1E9EB] bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[#4C3437]">{r.name}</p>
                        {r.description && <p className="mt-0.5 text-xs text-gray-400">{r.description}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => openEditReward(r)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#D95A87]">
                          <Pencil className="size-4" />
                        </button>
                        <button onClick={() => handleDeleteReward(r)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 w-fit text-xs font-semibold text-yellow-700">
                      <Star className="size-3" /> {r.pointCost.toLocaleString("id-ID")} poin
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reward Dialog */}
      <Dialog open={rewardDialog} onOpenChange={setRewardDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editReward ? "Edit Reward" : "Tambah Reward"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Nama Reward *</Label>
              <Input value={rewardForm.name} onChange={(e) => setRewardForm((f) => ({ ...f, name: e.target.value }))} placeholder="Free Ongkir" />
            </div>
            <div className="space-y-1">
              <Label>Point Cost *</Label>
              <Input type="number" min={0} value={rewardForm.pointCost} onChange={(e) => setRewardForm((f) => ({ ...f, pointCost: e.target.value }))} placeholder="500" />
            </div>
            <div className="space-y-1">
              <Label>Deskripsi <span className="text-xs text-gray-400">— opsional</span></Label>
              <Input value={rewardForm.description} onChange={(e) => setRewardForm((f) => ({ ...f, description: e.target.value }))} placeholder="Tukarkan poin untuk voucher gratis ongkir" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRewardDialog(false)}>Batal</Button>
            <Button onClick={handleSaveReward} disabled={savingReward} className="w-full gap-2 sm:w-auto bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90">
              {savingReward && <Loader2 className="size-4 animate-spin" />}
              {editReward ? "Simpan" : "Buat Reward"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}