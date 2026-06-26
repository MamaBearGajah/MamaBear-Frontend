"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, Loader2, Tag, Copy, Check,
  ToggleLeft, ToggleRight, Info,
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
  DialogDescription,
} from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

type DiscountType = "percentage" | "fixed" | "free_shipping";

type Voucher = {
  id: string;
  code: string;
  type: DiscountType;
  source: string;
  value: string;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  owner: { id: string; name: string; email: string };
};

type FormState = {
  code: string;
  source: string;
  type: DiscountType;
  value: number | "";
  minPurchase: number | "";
  maxDiscount: number | "";
  usageLimit: number | "";
  isActive: boolean;
  startDate: string;
  endDate: string;
};

const EMPTY_FORM: FormState = {
  code: "",
  type: "percentage",
  source: "",
  value: "",
  minPurchase: "",
  maxDiscount: "",
  usageLimit: "",
  isActive: true,
  startDate: "",
  endDate: "",
};

const AUTO_MIN_MULTIPLIER = 2;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(s?: string) {
  if (!s) return "—";
  try { return format(parseISO(s), "d MMM yyyy", { locale: localeId }); }
  catch { return s; }
}

function fmtDiscount(v: Voucher) {
  if (v.type === "free_shipping") return "Gratis ongkir";
  return v.type === "percentage"
    ? `${v.value}%`
    : `Rp ${Number(v.value).toLocaleString("id-ID")}`;
}

function generateCode() {
  return "MB" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

/** Hitung auto minPurchase = 2x nilai voucher (hanya untuk fixed & percentage) */
function getAutoMinPurchase(type: DiscountType, value: number | ""): number | null {
  if (type === "free_shipping" || value === "") return null;
  return Number(value) * AUTO_MIN_MULTIPLIER;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Voucher | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/vouchers");
      const norm = normalizeApiResponse<Voucher[]>(res.data);
      setVouchers(Array.isArray(norm.data) ? norm.data : []);
    } catch {
      toast.error("Gagal memuat voucher");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVouchers(); }, [fetchVouchers]);

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(v: Voucher) {
    setEditTarget(v);
    setForm({
      code: v.code,
      type: v.type,
      value: Number(v.value),
      source: v.source,
      minPurchase: v.minPurchase ?? "",
      maxDiscount: v.maxDiscount ?? "",
      usageLimit: v.usageLimit ?? "",
      isActive: v.isActive,
      startDate: v.startDate?.slice(0, 10) ?? "",
      endDate: v.endDate?.slice(0, 10) ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.code.trim()) { toast.error("Kode voucher wajib diisi"); return; }
    if (form.value === "") { toast.error("Nilai diskon wajib diisi"); return; }

    setSaving(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: Number(form.value),
        source: form.source.trim() || undefined,
        // Kalau minPurchase tidak diisi, kirim undefined → backend auto 2x nilai voucher
        minPurchase: form.minPurchase !== "" ? Number(form.minPurchase) : undefined,
        maxDiscount: form.maxDiscount !== "" ? Number(form.maxDiscount) : undefined,
        usageLimit: form.usageLimit !== "" ? Number(form.usageLimit) : undefined,
        isActive: form.isActive,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      };

      if (editTarget) {
        await apiClient.patch(`/vouchers/${editTarget.id}`, payload);
        toast.success("Voucher diperbarui");
      } else {
        await apiClient.post("/vouchers", payload);
        toast.success("Voucher dibuat");
      }
      setDialogOpen(false);
      fetchVouchers();
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message ?? "Gagal menyimpan voucher");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(v: Voucher) {
    if (togglingId === v.id) return;
    setTogglingId(v.id);
    // Optimistic update
    setVouchers((prev) =>
      prev.map((x) => x.id === v.id ? { ...x, isActive: !v.isActive } : x)
    );
    try {
      await apiClient.patch(`/vouchers/${v.id}`, { isActive: !v.isActive });
      toast.success(!v.isActive ? "Voucher diaktifkan" : "Voucher dinonaktifkan");
      fetchVouchers();
    } catch {
      // Rollback
      setVouchers((prev) =>
        prev.map((x) => x.id === v.id ? { ...x, isActive: v.isActive } : x)
      );
      toast.error("Gagal mengubah status voucher");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(v: Voucher) {
    if (!confirm(`Hapus voucher "${v.code}"?`)) return;
    try {
      await apiClient.delete(`/vouchers/${v.id}`);
      setVouchers((prev) => prev.filter((x) => x.id !== v.id));
      toast.success("Voucher dihapus");
    } catch {
      toast.error("Gagal menghapus voucher");
    }
  }

  function copyCode(v: Voucher) {
    navigator.clipboard.writeText(v.code);
    setCopiedId(v.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  // Hitung preview auto minPurchase untuk ditampilkan di form
  const autoMinPreview = getAutoMinPurchase(form.type, form.value);

  return (
    <div className="min-h-full bg-[#FAFAFB] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#4C3437]">Voucher</h1>
            <p className="mt-1 text-sm text-gray-500">{vouchers.length} voucher terdaftar</p>
          </div>
          <Button
            onClick={openCreate}
            className="w-full gap-2 sm:w-auto bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90"
          >
            <Plus className="h-4 w-4" /> Buat Voucher
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[#F1E9EB] bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-[#D95A87]" />
            </div>
          ) : vouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Tag className="size-10 mb-3 opacity-40" />
              <p className="text-sm">Belum ada voucher</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-[#F1E9EB] bg-[#FDF8FA]">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Kode</th>
                  <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:table-cell">Diskon</th>
                  <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 md:table-cell">Masa Berlaku</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Terpakai</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F9F1F4]">
                {vouchers.map((v) => {
                  const toggling = togglingId === v.id;
                  return (
                    <tr key={v.id} className={`transition-colors hover:bg-[#FDF8FA] ${!v.isActive ? "opacity-60" : ""}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-[#4C3437]">{v.code}</span>
                          <button onClick={() => copyCode(v)} className="text-gray-400 hover:text-[#D95A87]">
                            {copiedId === v.id ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-400">{v.type}</p>
                      </td>
                      <td className="hidden px-5 py-4 sm:table-cell">
                        <span className="rounded-full bg-pink-50 px-2 py-0.5 text-xs font-medium text-pink-700">
                          {fmtDiscount(v)}
                        </span>
                        {v.minPurchase ? (
                          <p className="mt-0.5 text-xs text-gray-400">
                            Min. Rp {Number(v.minPurchase).toLocaleString("id-ID")}
                          </p>
                        ) : null}
                      </td>
                      <td className="hidden px-5 py-4 text-xs text-gray-500 md:table-cell">
                        {fmtDate(v.startDate)} – {fmtDate(v.endDate)}
                      </td>
                      <td className="px-5 py-4 text-center text-sm text-gray-600">
                        {v.usedCount}{v.usageLimit ? `/${v.usageLimit}` : ""}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleToggle(v)}
                          disabled={toggling}
                          className="inline-flex disabled:cursor-not-allowed"
                        >
                          {toggling ? (
                            <Loader2 className="size-6 animate-spin text-gray-400" />
                          ) : v.isActive ? (
                            <ToggleRight className="size-6 text-green-500 hover:text-green-600" />
                          ) : (
                            <ToggleLeft className="size-6 text-gray-400 hover:text-gray-500" />
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(v)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#D95A87]">
                            <Pencil className="size-4" />
                          </button>
                          <button onClick={() => handleDelete(v)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Dialog create/edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Voucher" : "Buat Voucher Baru"}</DialogTitle>
            <DialogDescription>
              {editTarget ? "Edit data voucher yang sudah ada" : "Buat voucher promosi baru"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Kode */}
            <div className="space-y-1">
              <Label>Kode Voucher *</Label>
              <div className="flex gap-2">
                <Input
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="MAMABEAR10"
                  className="font-mono uppercase"
                />
                <Button type="button" variant="outline" size="sm"
                  onClick={() => setForm((f) => ({ ...f, code: generateCode() }))}>
                  Generate
                </Button>
              </div>
            </div>

            {/* Source */}
            <div className="space-y-1">
              <Label>Source <span className="text-xs text-gray-400">— opsional</span></Label>
              <Input
                value={form.source}
                onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                placeholder="membership / promosi / manual"
              />
            </div>

            {/* Tipe & Nilai */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Tipe Diskon *</Label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as DiscountType }))}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="percentage">Persentase (%)</option>
                  <option value="fixed">Nominal (Rp)</option>
                  <option value="free_shipping">Gratis Ongkir</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>Nilai *</Label>
                <Input
                  type="number" min={0}
                  max={form.type === "percentage" ? 100 : undefined}
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value === "" ? "" : Number(e.target.value) }))}
                  placeholder={form.type === "percentage" ? "10" : form.type === "free_shipping" ? "0" : "50000"}
                />
              </div>
            </div>

            {/* Min purchase */}
            <div className="space-y-1">
              <Label>Min. Pembelian <span className="text-xs text-gray-400">— opsional</span></Label>
              <Input
                type="number" min={0}
                value={form.minPurchase}
                onChange={(e) => setForm((f) => ({ ...f, minPurchase: e.target.value === "" ? "" : Number(e.target.value) }))}
                placeholder={
                  autoMinPreview !== null
                    ? `Otomatis: Rp ${autoMinPreview.toLocaleString("id-ID")} (2x nilai voucher)`
                    : "Kosongkan = tidak ada minimum"
                }
              />
              {/* Hint auto minPurchase */}
              {form.minPurchase === "" && autoMinPreview !== null && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600">
                  <Info className="size-3.5 shrink-0" />
                  <span>
                    Jika dikosongkan, backend otomatis set min. pembelian{" "}
                    <strong>Rp {autoMinPreview.toLocaleString("id-ID")}</strong> (2× nilai voucher)
                  </span>
                </div>
              )}
            </div>

            {/* Max discount — hanya untuk percentage */}
            {form.type === "percentage" && (
              <div className="space-y-1">
                <Label>Maks. Diskon <span className="text-xs text-gray-400">— opsional</span></Label>
                <Input
                  type="number" min={0}
                  value={form.maxDiscount}
                  onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value === "" ? "" : Number(e.target.value) }))}
                  placeholder="50000"
                />
              </div>
            )}

            {/* Batas pemakaian */}
            <div className="space-y-1">
              <Label>Maks. Penggunaan <span className="text-xs text-gray-400">— opsional</span></Label>
              <Input
                type="number" min={1}
                value={form.usageLimit}
                onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value === "" ? "" : Number(e.target.value) }))}
                placeholder="Kosongkan = unlimited"
              />
            </div>

            {/* Masa berlaku */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Berlaku Mulai</Label>
                <Input type="date" value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Berlaku Hingga</Label>
                <Input type="date" value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>

            {/* Status toggle */}
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}>
                {form.isActive
                  ? <ToggleRight className="size-6 text-green-500" />
                  : <ToggleLeft className="size-6 text-gray-400" />}
              </button>
              <Label className="cursor-pointer" onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}>
                {form.isActive ? "Aktif" : "Nonaktif"}
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90"
            >
              {saving && <Loader2 className="size-4 animate-spin mr-2" />}
              {editTarget ? "Simpan Perubahan" : "Buat Voucher"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}