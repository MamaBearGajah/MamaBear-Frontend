"use client";

import { useEffect, useState } from "react";
import { Tag, X, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { voucherApi } from "@/lib/api/voucher";
import { formatPrice } from "@/lib/utils";
import { useCheckout } from "@/context/CheckoutContext";

interface VoucherInputProps {
  subtotal: number;
  shippingCost?: number;
  mode?: "product" | "shipping";
  requireShipping?: boolean;
}

export function VoucherInput({
  subtotal,
  shippingCost = 0,
  mode = "product",
  requireShipping = false,
}: VoucherInputProps) {
  const {
    state,
    setVoucher,
    clearVoucher,
    setVoucherShipping,
    clearVoucherShipping,
  } = useCheckout();

  const isShippingMode  = mode === "shipping";
  const appliedCode     = isShippingMode ? state.voucherShippingCode : state.voucherCode;
  const appliedDiscount = isShippingMode ? state.discountShipping    : state.discount;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Re-validate otomatis saat user ganti kurir
  useEffect(() => {
    if (!isShippingMode || !state.voucherShippingCode || shippingCost === 0) return;
    async function revalidate() {
      try {
        const res = await voucherApi.validate(state.voucherShippingCode, subtotal, shippingCost);
        if (res.valid) setVoucherShipping(state.voucherShippingCode, res.voucher.id, res.discountAmount);
      } catch { /* biarkan user hapus manual */ }
    }
    revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingCost]);

  async function handleApply() {
    if (!code.trim()) { toast.error("Masukkan kode voucher"); return; }
    if (isShippingMode && requireShipping && shippingCost === 0) {
      toast.error("Pilih metode pengiriman dulu sebelum pakai voucher ongkir");
      return;
    }

    setLoading(true);
    try {
      const res = await voucherApi.validate(
        code.trim().toUpperCase(),
        subtotal,
        isShippingMode ? shippingCost : 0,
      );

      if (!res.valid) { toast.error("Voucher tidak valid"); return; }

      if (isShippingMode) {
        if (res.voucher.type !== "free_shipping") {
          toast.error("Voucher ini bukan voucher ongkir. Masukkan di kolom diskon produk.");
          return;
        }
        setVoucherShipping(code.trim().toUpperCase(), res.voucher.id, res.discountAmount);
      } else {
        if (res.voucher.type === "free_shipping") {
          toast.error("Voucher ini adalah voucher ongkir. Masukkan di kolom voucher ongkir.");
          return;
        }
        setVoucher(code.trim().toUpperCase(), res.voucher.id, res.discountAmount);
      }

      setCode("");
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
    isShippingMode ? clearVoucherShipping() : clearVoucher();
  }

  const label = isShippingMode ? "Kode Voucher Ongkir" : "Kode Voucher Diskon";
  const placeholder = isShippingMode ? "Kode voucher ongkir" : "Kode voucher diskon";
  const isInputDisabled = isShippingMode && requireShipping && shippingCost === 0;
  const isButtonDisabled = loading || !code.trim() || isInputDisabled;

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <Tag className="size-4" />
        {label}
      </label>

      {/* Applied badge — selalu tampil kalau ada, tidak menggantikan input */}
      {appliedCode && (
        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 shrink-0 text-green-600" />
            <div>
              <p className="font-mono text-sm font-semibold text-green-800">{appliedCode}</p>
              <p className="text-xs text-green-600">Hemat {formatPrice(appliedDiscount)}</p>
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
      )}

      {/* Input — hanya tampil kalau BELUM ada voucher applied untuk slot ini */}
      {!appliedCode && (
        <>
          {isInputDisabled && (
            <p className="text-xs text-amber-600">
              ⚠️ Pilih metode pengiriman dulu agar voucher ongkir bisa dihitung
            </p>
          )}
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              placeholder={placeholder}
              disabled={isInputDisabled}
              className="h-10 flex-1 rounded-lg border border-input bg-background px-3 font-mono text-sm uppercase outline-none focus:border-[#D95A87] disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={handleApply}
              disabled={isButtonDisabled}
              className="flex h-10 items-center gap-1.5 rounded-lg bg-[var(--mamabear-dark-pink)] px-4 text-sm font-medium text-white transition-opacity hover:bg-[var(--mamabear-dark-pink)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Pakai"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}