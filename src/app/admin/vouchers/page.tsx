"use client";

/**
 * src/app/admin/vouchers/page.tsx
 * CRUD voucher: list, create, edit, toggle active, delete
 * BE endpoints: GET/POST/PATCH/DELETE /voucher
 */

import { useCallback, useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, Loader2, Tag, Copy, Check,
  ToggleLeft, ToggleRight,
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

// ─── Types ───────────────────────────────────────────────────────────────────

type DiscountType = "percentage" | "fixed" | "free_shipping";

type Voucher = {
  id: string;
  code: string;
  // description?: string;
  // discountType: DiscountType;
  type: DiscountType;
  source: string;
  value: string;
  // discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  owner: Owner;
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

type Owner = {
  id: string;
  name: string;
  email: string;
};

const EMPTY_FORM: FormState = {
  code: "",
  // description: "",
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
  return v.type === "percentage"
    ? `${v.value}%`
    : `Rp ${Number(v.value).toLocaleString("id-ID")}`;
}

function generateCode() {
  return "MB" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Voucher | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    if (!form.value) { toast.error("Nilai diskon wajib diisi"); return; }

    setSaving(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        // description: form.description.trim() || undefined,
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
        await apiClient.patch(`/vouchers/${editTarget.id}`, payload);
        toast.success("Voucher diperbarui");
      } else {
        await apiClient.post("/vouchers", payload);
        toast.success("Voucher dibuat");
      }
      setDialogOpen(false);
      fetchVouchers();
    } catch (e) {
      const error = e as any;
      toast.error(error?.response?.data?.error?.message ?? "Gagal menyimpan voucher");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(v: Voucher) {
    try {
      await apiClient.patch(`/voucher/${v.id}`, { isActive: !v.isActive });
      setVouchers((prev) =>
        prev.map((x) => x.id === v.id ? { ...x, isActive: !v.isActive } : x)
      );
      toast.success(v.isActive ? "Voucher dinonaktifkan" : "Voucher diaktifkan");
    } catch {
      toast.error("Gagal mengubah status voucher");
    }
  }

  async function handleDelete(v: Voucher) {
    if (!confirm(`Hapus voucher "${v.code}"?`)) return;
    try {
      await apiClient.delete(`/voucher/${v.id}`);
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

  return (
    <div className="min-h-full bg-[#FAFAFB] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#4C3437]">Voucher</h1>
            <p className="mt-1 text-sm text-gray-500">
              {vouchers.length} voucher terdaftar
            </p>
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
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Pakai</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F9F1F4]">
                {vouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-[#FDF8FA]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-[#4C3437]">{v.code}</span>
                        <button onClick={() => copyCode(v)} className="text-gray-400 hover:text-[#D95A87]">
                          {copiedId === v.id ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
                        </button>
                      </div>
                      {v.type && <p className="mt-0.5 text-xs text-gray-400">{v.type}</p>}
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
                      <button onClick={() => handleToggle(v)} className="inline-flex">
                        {v.isActive
                          ? <ToggleRight className="size-6 text-green-500" />
                          : <ToggleLeft className="size-6 text-gray-400" />}
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
                ))}
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
                <Button type="button" variant="outline" size="sm" onClick={() => setForm((f) => ({ ...f, code: generateCode() }))}>
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
                placeholder="Source Voucher"
              />
            </div>

            {/* Deskripsi */}
            {/* <div className="space-y-1">
              <Label>Deskripsi <span className="text-xs text-gray-400">— opsional</span></Label>
              <Input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Diskon spesial pelanggan baru"
              />
            </div> */}

            {/* Tipe & Nilai */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Tipe Diskon *</Label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as DiscountType }))}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="percentage">Persentase (%)</option>
                  <option value="fixed">Nominal (Rp)</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>Nilai *</Label>
                <Input
                  type="number"
                  min={0}
                  max={form.type === "percentage" ? 100 : undefined}
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value === "" ? "" : Number(e.target.value) }))}
                  placeholder={form.type === "percentage" ? "10" : "50000"}
                />
              </div>
            </div>

            {/* Min purchase & max discount */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Min. Pembelian <span className="text-xs text-gray-400">— opsional</span></Label>
                <Input
                  type="number" min={0}
                  value={form.minPurchase}
                  onChange={(e) => setForm((f) => ({ ...f, minPurchase: e.target.value === "" ? "" : Number(e.target.value) }))}
                  placeholder="100000"
                />
              </div>
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
              <div className="space-y-1">
                <Label>Maks. Penggunaan <span className="text-xs text-gray-400">— opsional</span></Label>
                <Input
                  type="number" min={0}
                  value={form.usageLimit}
                  onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value === "" ? "" : Number(e.target.value) }))}
                  placeholder="100"
                />
              </div>
            </div>

            {/* Masa berlaku */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Mulai</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Berakhir</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                className="inline-flex"
              >
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
              className="w-full gap-2 sm:w-auto bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              {editTarget ? "Simpan" : "Buat Voucher"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
