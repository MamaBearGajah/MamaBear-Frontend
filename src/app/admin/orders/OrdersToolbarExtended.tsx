"use client";

/**
 * src/app/admin/orders/OrdersToolbarExtended.tsx
 *
 * Tombol tambahan untuk halaman orders admin:
 * - Export CSV (GET /admin/orders/export)
 * - Tombol Refund di detail order (POST /payments/:orderId/refund)
 *
 * Import component ini di OrdersToolbar atau OrderEditForm yang sudah ada.
 */

import { useState } from "react";
import { Download, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { adminOrdersApi } from "@/lib/api/adminOrders";
import { apiClient } from "@/lib/api/client";

// ─── Export CSV button ────────────────────────────────────────────────────────

export function ExportOrdersCsvButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await adminOrdersApi.exportCsv();
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV berhasil didownload");
    } catch {
      toast.error("Gagal export CSV");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-[#EFE6EA] bg-white px-4 text-sm font-medium text-gray-600 hover:border-[#D95A87] hover:text-[#D95A87] disabled:opacity-50 transition-colors"
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
      Export CSV
    </button>
  );
}

// ─── Refund button (untuk detail order admin) ─────────────────────────────────

interface RefundButtonProps {
  orderId: string;
  canRefund: boolean; // true jika paymentStatus === 'paid'
  onSuccess?: () => void;
}

export function RefundButton({ orderId, canRefund, onSuccess }: RefundButtonProps) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reason, setReason] = useState("");

  if (!canRefund) return null;

  async function handleRefund() {
    setLoading(true);
    try {
      await apiClient.post(`/payments/${orderId}/refund`, { reason: reason || undefined });
      toast.success("Refund berhasil diajukan ke Xendit");
      setConfirmOpen(false);
      onSuccess?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message ?? "Gagal memproses refund");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setConfirmOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
      >
        <RotateCcw className="size-4" />
        Refund
      </button>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-gray-800">Konfirmasi Refund</h3>
            <p className="mt-1 text-sm text-gray-500">
              Refund akan dikirim ke Xendit dan tidak bisa dibatalkan.
            </p>
            <div className="mt-4 space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Alasan <span className="text-xs text-gray-400">— opsional</span>
              </label>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Customer request refund..."
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setConfirmOpen(false)} className="rounded-lg border px-4 py-2 text-sm">Batal</button>
              <button
                onClick={handleRefund}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading && <Loader2 className="size-4 animate-spin" />}
                Konfirmasi Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}