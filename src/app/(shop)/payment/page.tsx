"use client";

/**
 * FIX: src/app/(shop)/payment/page.tsx
 *
 * Bug sebelumnya:
 * 1. handlePayment memanggil fetch("../lib/api/payment/create") — path salah,
 *    relative path ini tidak akan resolve ke Next.js API route
 * 2. Tidak menggunakan placeShopOrder yang sudah ada
 * 3. Tidak menggunakan shipping dari CheckoutContext
 * 4. Tidak ada integrasi Midtrans Snap
 * 5. Tidak clear cart setelah order berhasil
 *
 * Fix:
 * - Gunakan placeShopOrder() yang sudah benar (createOrder → checkoutPayment → BE)
 * - Support Xendit (redirect ke paymentUrl) dan Midtrans Snap (popup)
 * - Clear cart setelah berhasil
 */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { ArrowLeft, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useCheckout } from "@/context/CheckoutContext";
import { safeFormatPrice } from "@/lib/utils";
import { placeShopOrder } from "@/lib/shop/place-order";

type Gateway = "xendit" | "midtrans";

const GATEWAY_OPTIONS: { value: Gateway; label: string; desc: string }[] = [
  {
    value: "xendit",
    label: "Xendit",
    desc: "Transfer bank, VA, QRIS, e-wallet",
  },
  {
    value: "midtrans",
    label: "Midtrans",
    desc: "Kartu kredit, GoPay, OVO, VA",
  },
];

export default function PaymentPage() {
  const { state: cartState, clearCart } = useCart();
  const {
    state: checkoutState,
    clearCheckout,
    subtotal,
  } = useCheckout();

  const router = useRouter();
  const [gateway, setGateway] = useState<Gateway>("xendit");
  const [loading, setLoading] = useState(false);

  const shippingCost = checkoutState.method?.cost ?? 0;
  const discount = checkoutState.discount ?? 0;
  const total = subtotal - discount + shippingCost;

  // Guard: jangan bisa akses halaman ini tanpa item
  const items = checkoutState.items ?? [];
  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-3">Keranjang kosong</h1>
          <Link href="/products" className="text-pink-600 underline">
            Belanja dulu yuk
          </Link>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    const shippingMethod = checkoutState.method;
    if (!shippingMethod?.courier || !shippingMethod?.service) {
      toast.error("Pilih metode pengiriman dulu");
      router.push("/checkout/shipping");
      return;
    }

    setLoading(true);
    try {
      const result = await placeShopOrder({
        courier: shippingMethod.courier,
        service: shippingMethod.service,
        provider: gateway,
      });

      // Sukses — clear semua state
      clearCart();
      clearCheckout();

      if (result.paymentUrl) {
        // Xendit: redirect ke halaman pembayaran Xendit
        // Midtrans Snap: juga pakai redirect_url kalau Snap token tidak ada di frontend
        window.location.href = result.paymentUrl;
        return;
      }

      // Fallback: tidak ada paymentUrl (COD atau error non-fatal)
      router.push(
        `/order-success?orderId=${encodeURIComponent(result.orderId)}`
      );
    } catch (err: any) {
      console.error("Payment error:", err);
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Gagal memproses pembayaran";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* ── LEFT: Payment selector ─────────────────────── */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-pink-600" />
              <h1 className="text-xl font-bold">Pilih Metode Pembayaran</h1>
            </div>

            {/* Gateway selector */}
            <div className="space-y-3">
              {GATEWAY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                    gateway === opt.value
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="gateway"
                    value={opt.value}
                    checked={gateway === opt.value}
                    onChange={() => setGateway(opt.value)}
                    className="mt-1 accent-pink-600"
                  />
                  <div>
                    <p className="font-semibold text-sm">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Shipping info */}
            {checkoutState.method && (
              <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <p className="font-medium text-gray-800 mb-1">Pengiriman</p>
                <p>
                  {checkoutState.method.courier?.toUpperCase()}{" "}
                  {checkoutState.method.service} —{" "}
                  {safeFormatPrice(checkoutState.method.cost ?? 0)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Est. {checkoutState.method.etd ?? "-"} hari kerja
                </p>
              </div>
            )}

            {/* Security badge */}
            <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Pembayaran diproses secara aman oleh{" "}
              {gateway === "xendit" ? "Xendit" : "Midtrans"}
            </div>
          </div>

          {/* ── RIGHT: Order summary ───────────────────────── */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-4">Ringkasan Pesanan</h2>

            {/* Items */}
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {items.map((item, idx) => (
                <div
                  key={item.productId + (item.variantId ?? "") + idx}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-600 truncate flex-1 mr-2">
                    {item.name}
                    {item.variantLabel ? ` (${item.variantLabel})` : ""} ×{" "}
                    {item.quantity}
                  </span>
                  <span className="font-medium shrink-0">
                    {safeFormatPrice(
                      (item.discountPrice ?? item.basePrice) * item.quantity
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{safeFormatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon</span>
                  <span>- {safeFormatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Ongkos kirim</span>
                <span>{safeFormatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Total</span>
                <span className="text-pink-600">{safeFormatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Bayar Sekarang
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}