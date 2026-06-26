"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { ArrowLeft, ShoppingBag, Loader2, ExternalLink, Shield, Truck } from "lucide-react";
import { toast } from "sonner";
import { useCheckout } from "@/context/CheckoutContext";
import { safeFormatPrice } from "@/lib/utils";
import { placeShopOrder } from "@/lib/shop/place-order";
import { apiClient } from "@/lib/api/client";

const POLL_INTERVAL_MS = 3000;

const PaymentPage = () => {
  const { clearCart } = useCart();
  const router = useRouter();
  const { state: checkoutState, clearCheckout, subtotal, hydrated } = useCheckout();
  const {
    items,
    method: shippingMethod,
    discount,
    discountShipping,
    voucherId,
    voucherShippingId,
  } = checkoutState;

  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const shipping = shippingMethod?.cost ?? 0;
  const total = subtotal - (discount ?? 0) - (discountShipping ?? 0) + shipping;

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0 && !paymentUrl) router.replace("/cart");
  }, [hydrated, items.length, paymentUrl, router]);

  useEffect(() => {
    if (!orderId || !paymentUrl) return;

    setPolling(true);
    pollRef.current = setInterval(async () => {
      try {
        const res = await apiClient.get(`/orders/${orderId}`);
        const paymentStatus = res.data?.data?.paymentStatus;

        if (paymentStatus === "paid") {
          clearInterval(pollRef.current!);
          setPolling(false);
          router.push(`/order-success?orderId=${encodeURIComponent(orderId)}`);
        } else if (paymentStatus === "expired" || paymentStatus === "failed") {
          clearInterval(pollRef.current!);
          setPolling(false);
          toast.error("Pembayaran gagal atau kedaluwarsa. Silakan coba lagi.");
          setPaymentUrl(null);
          setOrderId(null);
        }
      } catch {
        // abaikan error sementara, polling tetap jalan
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [orderId, paymentUrl, router]);

  if (!hydrated) return null;

  if (items.length === 0 && !paymentUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-3">Keranjang kosong</h1>
          <Link href="/products" className="text-pink-600 underline">Belanja dulu</Link>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    const courier = shippingMethod?.courier;
    const service = shippingMethod?.service;

    if (!courier || !service) {
      toast.error("Pilih metode pengiriman dulu");
      router.push("/checkout/method");
      return;
    }

    setLoading(true);
    try {
      const result = await placeShopOrder({
        courier,
        service,
        provider: "xendit",
        voucherId: voucherId || undefined,
        voucherShippingId: voucherShippingId || undefined,
      });

      clearCart();
      clearCheckout();

      if (result.paymentUrl) {
        setPaymentUrl(result.paymentUrl);
        setOrderId(result.orderId);
        return;
      }

      router.push(`/order-success?orderId=${encodeURIComponent(result.orderId)}`);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.error?.message ??
        err?.message ??
        "Pembayaran gagal, coba lagi"
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── View: Xendit iframe ──────────────────────────────────────────────────
  if (paymentUrl) {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-800">Selesaikan Pembayaran</h1>
            {polling && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-pink-500" />
                Menunggu konfirmasi...
              </div>
            )}
          </div>

          <div className="w-full rounded-2xl overflow-hidden shadow-lg bg-white border border-pink-100">
            <iframe
              src={paymentUrl}
              className="w-full"
              style={{ height: "75vh", border: "none" }}
              title="Xendit Payment"
              allow="payment"
            />
          </div>

          <p className="text-xs text-slate-400 mt-3 text-center">
            Halaman tidak tampil?{" "}
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 underline inline-flex items-center gap-1"
            >
              Buka di tab baru <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      </div>
    );
  }

  // ─── View: Ringkasan + tombol bayar ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/95 px-8 py-8 shadow-lg">
            <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
            <div className="text-center">
              <div className="text-lg font-semibold text-slate-900">Membuat pesanan...</div>
              <div className="text-sm text-slate-500">Mohon tunggu sebentar</div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="rounded-full p-2 text-pink-600 hover:bg-pink-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Ringkasan Pembayaran</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Items */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag size={18} className="text-pink-500" />
              <h2 className="font-semibold text-slate-800">Produk</h2>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => {
                const price = item.discountPrice ?? item.basePrice;
                return (
                  <div key={item.productId + (item.variantId ?? "") + idx} className="flex justify-between text-sm">
                    <span className="text-slate-600 flex-1 mr-3 line-clamp-1">
                      {item.name}
                      {item.variantLabel ? ` (${item.variantLabel})` : ""}
                      <span className="text-slate-400"> ×{item.quantity}</span>
                    </span>
                    <span className="font-medium text-slate-800 shrink-0">
                      {safeFormatPrice(price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pengiriman */}
          {shippingMethod && (
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <Truck size={16} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Pengiriman</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">
                  {shippingMethod.courier?.toUpperCase()} {shippingMethod.service}
                  {shippingMethod.etd && (
                    <span className="text-slate-400"> · {shippingMethod.etd} hari kerja</span>
                  )}
                </span>
                <span className="font-medium text-slate-800">
                  {safeFormatPrice(shippingMethod.cost ?? 0)}
                </span>
              </div>
            </div>
          )}

          {/* Kalkulasi */}
          <div className="px-6 py-4 space-y-2.5 text-sm border-b border-gray-100">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{safeFormatPrice(subtotal)}</span>
            </div>
            {(discount ?? 0) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Diskon produk</span>
                <span>- {safeFormatPrice(discount ?? 0)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Ongkos kirim</span>
              <span>{shipping === 0 ? "GRATIS" : safeFormatPrice(shipping)}</span>
            </div>
            {(discountShipping ?? 0) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Diskon ongkir</span>
                <span>- {safeFormatPrice(discountShipping ?? 0)}</span>
              </div>
            )}
          </div>

          {/* Total + tombol */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-slate-800">Total</span>
              <span className="text-2xl font-bold text-pink-600">{safeFormatPrice(total)}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-pink-600 text-white font-bold text-base hover:bg-pink-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Memproses...</>
              ) : (
                <>Bayar Sekarang · {safeFormatPrice(total)}</>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Shield size={14} />
              <span>Pembayaran aman diproses oleh Xendit</span>
            </div>

            <p className="mt-3 text-xs text-center text-slate-400">
              Setelah klik "Bayar Sekarang", pilih metode pembayaran di halaman Xendit
              (Transfer Bank, GoPay, OVO, DANA, Kartu Kredit, dll)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;