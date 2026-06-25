"use client";

/**
 * src/components/checkout/VoucherInput.tsx
 * Input kode voucher di checkout — validasi ke BE dan hitung diskon
 * BE: POST /vouchers/validate
 *
 * Cara pakai di checkout page:
 *   <VoucherInput subtotal={subtotal} onApply={(result) => setDiscount(result.discountAmount)} />
 */

import { useState } from "react";
import { Tag, X, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { voucherApi, type VoucherValidateResult } from "@/lib/api/voucher";
import { formatPrice } from "@/lib/utils";

interface VoucherInputProps {
  subtotal: number;
  shippingCost?: number;
  onApply: (result: VoucherValidateResult & { code: string }) => void;
  onRemove: () => void;
  appliedCode?: string;
}

export function VoucherInput({
  subtotal,
  shippingCost = 0,
  onApply,
  onRemove,
  appliedCode,
}: VoucherInputProps) {
  const [code, setCode] = useState(appliedCode ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<(VoucherValidateResult & { code: string }) | null>(null);

  async function handleApply() {
    if (!code.trim()) {
      toast.error("Masukkan kode voucher");
      return;
    }
    setLoading(true);
    try {
      const res = await voucherApi.validate(
        code.trim().toUpperCase(),
        subtotal,
        shippingCost,
      );

      if (!res.valid) {
        toast.error("Voucher tidak valid");
        return;
      }

      const applied = { ...res, code: code.trim().toUpperCase() };
      setResult(applied);
      onApply(applied);
      toast.success(`Voucher berhasil! Hemat ${formatPrice(res.discountAmount)}`);
    } catch (e: any) {
      toast.error(
        e?.response?.data?.error?.message ??
        e?.response?.data?.message ??
        "Voucher tidak valid atau sudah habis"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleRemove() {
    setResult(null);
    setCode("");
    onRemove();
  }

  if (result) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="size-4 shrink-0 text-green-600" />
          <div>
            <p className="font-mono text-sm font-semibold text-green-800">
              {result.code}
            </p>
            <p className="text-xs text-green-600">
              Hemat {formatPrice(result.discountAmount)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="rounded-full p-1 text-green-600 hover:bg-green-100"
          aria-label="Hapus voucher"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <Tag className="size-4" />
        Kode Voucher
      </label>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          placeholder="Masukkan kode voucher"
          className="h-10 flex-1 rounded-lg border border-input bg-background px-3 font-mono text-sm uppercase outline-none focus:border-[#D95A87]"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="flex h-10 items-center gap-1.5 rounded-lg bg-[var(--mamabear-dark-pink)] px-4 text-sm font-medium text-white transition-opacity hover:bg-[var(--mamabear-dark-pink)]/90 disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Pakai"}
        </button>
      </div>
    </div>
  );
}