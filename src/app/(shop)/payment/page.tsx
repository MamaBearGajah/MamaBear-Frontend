"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { ArrowLeft, CreditCard, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import PaymentSelector, { PaymentMethod } from "@/components/checkout/PaymentSelector";
import { useCheckout } from "@/context/CheckoutContext";
import { safeFormatPrice } from "@/lib/utils";
import { placeShopOrder } from "@/lib/shop/place-order";
import { apiClient } from "@/lib/api/client";

const POLL_INTERVAL_MS = 3000;

const PaymentPage = () => {
  const { clearCart } = useCart();
  const router = useRouter();
  const { state: checkoutState, clearCheckout, subtotal, hydrated } = useCheckout();
  const { items, method: shippingMethod, discount, voucherId } = checkoutState;

  const [method, setMethod] = useState<PaymentMethod>("va");
  const [loading, setLoading] = useState(false);

  // State setelah order dibuat — tampilkan iframe
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const shipping = shippingMethod?.cost ?? 0;
  const total = subtotal - (discount ?? 0) + shipping;

  // ─── Guard: redirect jika cart kosong ────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0 && !paymentUrl) router.replace("/cart");
  }, [hydrated, items.length, paymentUrl, router]);

  // ─── Polling status pembayaran ────────────────────────────────────────────
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

  // ─── Hydration guard ──────────────────────────────────────────────────────
  if (!hydrated) return null;

  if (items.length === 0 && !paymentUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-3">Keranjang kosong</h1>
          <Link href="/products" className="text-pink-600 underline">
            Belanja dulu
          </Link>
        </div>
      </div>
    );
  }

  // ─── Handler: buat order & tampilkan iframe ───────────────────────────────
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
        voucherId: voucherId ?? undefined, // diteruskan ke createOrder → usedCount++
      });

      clearCart();
      clearCheckout();

      if (result.paymentUrl) {
        // Simpan ke state — tampilkan iframe, jangan redirect
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

  // ─── View: iframe Xendit ──────────────────────────────────────────────────
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

  // ─── View: halaman pilih metode pembayaran ────────────────────────────────
  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">

      {/* Loading overlay */}
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

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">

        {/* LEFT — PAYMENT METHOD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => router.back()} className="text-pink-600 hover:text-pink-700">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-bold">Pembayaran</h1>
          </div>

          <h2 className="font-semibold mb-4">Pilih Metode Pembayaran</h2>

          <PaymentSelector selected={method} onSelect={setMethod} />

          <div className="mt-6 rounded-2xl border border-pink-200 bg-pink-50 p-4 text-sm text-slate-700">
            <strong>Xendit:</strong> Pembayaran diproses secara aman melalui Xendit.
            Form pembayaran akan muncul langsung di halaman ini via{" "}
            {method === "va" ? "Virtual Account"
              : method === "card" ? "Kartu Kredit/Debit"
              : method.toUpperCase()}.
          </div>

          {shippingMethod && (
            <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-800 mb-1">Pengiriman</p>
              <p>
                {shippingMethod.courier?.toUpperCase()} {shippingMethod.service}{" "}
                — {safeFormatPrice(shippingMethod.cost ?? 0)}
              </p>
              {shippingMethod.etd && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Estimasi {shippingMethod.etd} hari kerja
                </p>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>

          <div className="space-y-2 text-sm mb-6 max-h-52 overflow-y-auto">
            {items.map((item, idx) => {
              const price = item.discountPrice ?? item.basePrice;
              return (
                <div key={item.productId + (item.variantId ?? "") + idx} className="flex justify-between">
                  <span className="text-slate-600 truncate flex-1 mr-2">
                    {item.name}{item.variantLabel ? ` (${item.variantLabel})` : ""} × {item.quantity}
                  </span>
                  <span className="font-medium shrink-0">
                    {safeFormatPrice(price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal</span>
              <span>{safeFormatPrice(subtotal)}</span>
            </div>
            {(discount ?? 0) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Diskon</span>
                <span>- {safeFormatPrice(discount ?? 0)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-600">Ongkos kirim</span>
              <span>{shipping === 0 ? "GRATIS" : safeFormatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span className="text-pink-600">{safeFormatPrice(total)}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-6 inline-flex items-center justify-center gap-2 bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Memproses...</>
            ) : (
              <><CreditCard className="h-5 w-5" /> Bayar via Xendit</>
            )}
          </button>

          <p className="text-xs text-gray-400 mt-3 text-center">
            Pembayaran aman diproses oleh Xendit
          </p>
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;