"use client";

/**
 * src/components/checkout/VoucherInput.tsx
 * Input kode voucher di checkout — validasi ke BE dan hitung diskon
 * BE: POST /vouchers/validate
 *
 * FIX: sekarang pakai setVoucher() dari CheckoutContext supaya
 * voucherCode & voucherId tersimpan di state dan terkirim ke BE saat place order.
 */

import { useEffect, useState } from "react";
import { Tag, X, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { voucherApi } from "@/lib/api/voucher";
import { formatPrice } from "@/lib/utils";
import { useCheckout } from "@/context/CheckoutContext";

interface VoucherInputProps {
  subtotal: number;
  shippingCost?: number;
}

export function VoucherInput({ subtotal, shippingCost = 0 }: VoucherInputProps) {
  const { state, setVoucher, clearVoucher } = useCheckout();

  const [code, setCode] = useState(state.voucherCode ?? "");
  const [loading, setLoading] = useState(false);

  // Sync input jika context berubah dari luar (misal clearCheckout)
  useEffect(() => {
    setCode(state.voucherCode ?? "");
  }, [state.voucherCode]);

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

      // FIX: simpan ke context — code (display), id (kirim ke BE), discount
      setVoucher(
        code.trim().toUpperCase(),
        res.voucher.id,
        res.discountAmount,
      );

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
    setCode("");
    clearVoucher();
  }

  // Sudah ada voucher di context → tampilkan state applied
  if (state.voucherCode) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="size-4 shrink-0 text-green-600" />
          <div>
            <p className="font-mono text-sm font-semibold text-green-800">
              {state.voucherCode}
            </p>
            <p className="text-xs text-green-600">
              Hemat {formatPrice(state.discount)}
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