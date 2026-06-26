"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus, Pencil, Trash2, Loader2, Tag, Copy, Check,
  ToggleLeft, ToggleRight,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "sonner";
import { voucherApi, type Voucher, type CreateVoucherPayload } from "@/lib/api/voucher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

// ─── Types ───────────────────────────────────────────────────────────────────

type DiscountType = "percentage" | "fixed" | "free_shipping";
type FilterTab = "all" | "active" | "inactive" | "exhausted";

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function isExhausted(v: Voucher) {
  return v.usageLimit != null && v.usedCount >= v.usageLimit;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Voucher | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Always re-fetch from DB so usedCount is always the live value
  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await voucherApi.adminGetAll();
      setVouchers(data);
    } catch (err: any) {
      console.error("fetchVouchers error:", err?.response?.data ?? err);
      toast.error("Gagal memuat voucher");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVouchers(); }, [fetchVouchers]);

  // ─── Derived counts for tab badges ───────────────────────────────────────

  const counts = useMemo(() => ({
    all:       vouchers.length,
    active:    vouchers.filter((v) => v.isActive && !isExhausted(v)).length,
    inactive:  vouchers.filter((v) => !v.isActive).length,
    exhausted: vouchers.filter(isExhausted).length,
  }), [vouchers]);

  const filteredVouchers = useMemo(() => {
    switch (activeTab) {
      case "active":    return vouchers.filter((v) => v.isActive && !isExhausted(v));
      case "inactive":  return vouchers.filter((v) => !v.isActive);
      case "exhausted": return vouchers.filter(isExhausted);
      default:          return vouchers;
    }
  }, [vouchers, activeTab]);

  // ─── Handlers ────────────────────────────────────────────────────────────

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
      const payload: CreateVoucherPayload = {
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: Number(form.value),
        source: form.source.trim() || undefined,
        minPurchase: form.minPurchase !== "" ? Number(form.minPurchase) : undefined,
        maxDiscount: form.maxDiscount !== "" ? Number(form.maxDiscount) : undefined,
        usageLimit: form.usageLimit !== "" ? Number(form.usageLimit) : undefined,
        isActive: form.isActive,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      };

      if (editTarget) {
        await voucherApi.update(editTarget.id, payload);
        toast.success("Voucher diperbarui");
      } else {
        await voucherApi.create(payload);
        toast.success("Voucher dibuat");
      }

      setDialogOpen(false);
      fetchVouchers();
    } catch (err: any) {
      console.error("handleSave error:", err?.response?.data ?? err);
      toast.error(err?.response?.data?.error?.message ?? "Gagal menyimpan voucher");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(v: Voucher) {
    if (togglingId === v.id) return; // prevent double-click
    const next = !v.isActive;
    setTogglingId(v.id);

    // Optimistic update — icon flips immediately
    setVouchers((prev) =>
      prev.map((x) => x.id === v.id ? { ...x, isActive: next } : x)
    );

    try {
      await voucherApi.update(v.id, { isActive: next });
      toast.success(next ? "Voucher diaktifkan" : "Voucher dinonaktifkan");
      // Silent re-fetch to keep usedCount accurate
      fetchVouchers();
    } catch (err: any) {
      console.error("handleToggle error:", err?.response?.data ?? err);
      // Roll back on failure
      setVouchers((prev) =>
        prev.map((x) => x.id === v.id ? { ...x, isActive: v.isActive } : x)
      );
      toast.error(
        err?.response?.data?.error?.message ??
        "Gagal mengubah status voucher"
      );
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(v: Voucher) {
    if (!confirm(`Hapus voucher "${v.code}"?`)) return;
    try {
      await voucherApi.remove(v.id);
      toast.success("Voucher dihapus");
      setVouchers((prev) => prev.filter((x) => x.id !== v.id));
    } catch (err: any) {
      console.error("handleDelete error:", err?.response?.data ?? err);
      toast.error("Gagal menghapus voucher");
    }
  }

  function copyCode(v: Voucher) {
    navigator.clipboard.writeText(v.code);
    setCopiedId(v.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  // ─── Tab config ───────────────────────────────────────────────────────────

  const tabs: { key: FilterTab; label: string; dot?: string }[] = [
    { key: "all",       label: "Semua" },
    { key: "active",    label: "Aktif",    dot: "bg-green-500" },
    { key: "inactive",  label: "Nonaktif", dot: "bg-gray-400" },
    { key: "exhausted", label: "Habis",    dot: "bg-red-400" },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full bg-[#FAFAFB] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#4C3437]">Voucher</h1>
            <p className="mt-1 text-sm text-gray-500">
              {counts.all} voucher terdaftar
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="w-full gap-2 sm:w-auto bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90"
          >
            <Plus className="h-4 w-4" /> Buat Voucher
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 rounded-xl border border-[#F1E9EB] bg-white p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all sm:text-sm ${
                activeTab === tab.key
                  ? "bg-[var(--mamabear-dark-pink)] text-white shadow-sm"
                  : "text-gray-500 hover:bg-[#FDF8FA] hover:text-[#4C3437]"
              }`}
            >
              {tab.dot && (
                <span
                  className={`size-2 rounded-full shrink-0 ${tab.dot} ${
                    activeTab === tab.key ? "opacity-80" : ""
                  }`}
                />
              )}
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                  activeTab === tab.key
                    ? "bg-white/25 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[#F1E9EB] bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-[#D95A87]" />
            </div>
          ) : filteredVouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Tag className="size-10 mb-3 opacity-40" />
              <p className="text-sm">
                {activeTab === "all"
                  ? "Belum ada voucher"
                  : `Tidak ada voucher ${tabs.find((t) => t.key === activeTab)?.label.toLowerCase()}`}
              </p>
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
                {filteredVouchers.map((v) => {
                  const exhausted = isExhausted(v);
                  const toggling  = togglingId === v.id;

                  return (
                    <tr
                      key={v.id}
                      className={`transition-colors hover:bg-[#FDF8FA] ${!v.isActive ? "opacity-60" : ""}`}
                    >
                      {/* Code */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-[#4C3437]">{v.code}</span>
                          <button
                            onClick={() => copyCode(v)}
                            className="text-gray-400 hover:text-[#D95A87]"
                            title="Salin kode"
                          >
                            {copiedId === v.id
                              ? <Check className="size-3.5 text-green-500" />
                              : <Copy className="size-3.5" />}
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-400">{v.type}</p>
                      </td>

                      {/* Discount */}
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

                      {/* Validity */}
                      <td className="hidden px-5 py-4 text-xs text-gray-500 md:table-cell">
                        {fmtDate(v.startDate)} – {fmtDate(v.endDate)}
                      </td>

                      {/* Usage — always live from DB */}
                      <td className="px-5 py-4 text-center text-sm">
                        <span className={exhausted ? "font-semibold text-red-500" : "text-gray-600"}>
                          {v.usedCount}
                        </span>
                        <span className="text-gray-400">
                          {v.usageLimit != null ? `/${v.usageLimit}` : ""}
                        </span>
                        {exhausted && (
                          <p className="text-[10px] text-red-400 mt-0.5">Habis</p>
                        )}
                      </td>

                      {/* Toggle */}
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleToggle(v)}
                          disabled={toggling}
                          title={v.isActive ? "Klik untuk nonaktifkan" : "Klik untuk aktifkan"}
                          className="inline-flex items-center justify-center disabled:cursor-not-allowed"
                        >
                          {toggling ? (
                            <Loader2 className="size-6 animate-spin text-gray-400" />
                          ) : v.isActive ? (
                            <ToggleRight className="size-6 text-green-500 transition-colors hover:text-green-600" />
                          ) : (
                            <ToggleLeft className="size-6 text-gray-400 transition-colors hover:text-gray-500" />
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(v)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#D95A87]"
                            title="Edit"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(v)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                            title="Hapus"
                          >
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setForm((f) => ({ ...f, code: generateCode() }))}
                >
                  Generate
                </Button>
              </div>
            </div>

            {/* Tipe */}
            <div className="space-y-1">
              <Label>Tipe Diskon *</Label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as DiscountType }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="percentage">Persentase (%)</option>
                <option value="fixed">Nominal tetap (Rp)</option>
                <option value="free_shipping">Gratis ongkir</option>
              </select>
            </div>

            {/* Nilai */}
            <div className="space-y-1">
              <Label>Nilai Diskon *</Label>
              <Input
                type="number"
                value={form.value}
                onChange={(e) =>
                  setForm((f) => ({ ...f, value: e.target.value === "" ? "" : Number(e.target.value) }))
                }
                placeholder={form.type === "percentage" ? "10 (artinya 10%)" : "25000"}
              />
            </div>

            {/* Min & Max */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Min. Pembelian</Label>
                <Input
                  type="number"
                  value={form.minPurchase}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, minPurchase: e.target.value === "" ? "" : Number(e.target.value) }))
                  }
                  placeholder="50000"
                />
              </div>
              <div className="space-y-1">
                <Label>Maks. Diskon</Label>
                <Input
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, maxDiscount: e.target.value === "" ? "" : Number(e.target.value) }))
                  }
                  placeholder="100000"
                />
              </div>
            </div>

            {/* Batas pemakaian */}
            <div className="space-y-1">
              <Label>Batas Pemakaian</Label>
              <Input
                type="number"
                value={form.usageLimit}
                onChange={(e) =>
                  setForm((f) => ({ ...f, usageLimit: e.target.value === "" ? "" : Number(e.target.value) }))
                }
                placeholder="Kosongkan = unlimited"
              />
            </div>

            {/* Tanggal */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Berlaku Mulai</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Berlaku Hingga</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 accent-[#D95A87]"
              />
              <Label htmlFor="isActive" className="cursor-pointer">Aktif</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
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