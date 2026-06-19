"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import PaymentSelector, { PaymentMethod } from "@/components/checkout/PaymentSelector";
import { useCheckout } from "@/context/CheckoutContext";
import { safeFormatPrice } from "@/lib/utils";
import { placeShopOrder } from "@/lib/shop/place-order";

const PaymentPage = () => {
  const { clearCart } = useCart();
  const router = useRouter();
  // FIX: ambil `hydrated` dari context — true setelah state checkout
  // selesai di-restore dari localStorage di client.
  const { state: checkoutState, clearCheckout, subtotal, hydrated } = useCheckout();
  const { items, method: shippingMethod, discount } = checkoutState;

  const [method, setMethod] = useState<PaymentMethod>("va");
  const [loading, setLoading] = useState(false);

  const shipping = shippingMethod?.cost ?? 0;
  const total = subtotal - (discount ?? 0) + shipping;

  // Guard: redirect jika cart kosong.
  // FIX: tunggu sampai `hydrated` true, supaya tidak salah redirect ke /cart
  // sebelum data checkout dari localStorage selesai dimuat (yang sebelumnya
  // juga jadi sumber hydration mismatch karena render pertama client &
  // server bisa berbeda).
  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0) router.replace("/cart");
  }, [hydrated, items.length, router]);

  // FIX: selama belum hydrated, render null (sama di server & client)
  // alih-alih langsung mengevaluasi items.length yang baru valid di client.
  if (!hydrated) {
    return null;
  }

  if (items.length === 0) {
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
      });

      clearCart();
      clearCheckout();

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
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

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/95 px-8 py-8 shadow-lg">
            <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
            <div className="text-center">
              <div className="text-lg font-semibold text-slate-900">Memproses pembayaran</div>
              <div className="text-sm text-slate-500">Mohon tunggu, kamu akan diarahkan ke halaman Xendit...</div>
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

          {/* Info Xendit */}
          <div className="mt-6 rounded-2xl border border-pink-200 bg-pink-50 p-4 text-sm text-slate-700">
            <strong>Xendit:</strong> Pembayaran diproses secara aman melalui Xendit.
            Kamu akan diarahkan ke halaman Xendit untuk menyelesaikan pembayaran via{" "}
            {method === "va" ? "Virtual Account"
              : method === "card" ? "Kartu Kredit/Debit"
              : method.toUpperCase()}.
          </div>

          {/* Info pengiriman */}
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