"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Package } from "lucide-react";
import { CancelOrderDialog } from "@/components/common/CancelOrderDialog";
import { ReviewSection } from "@/components/common/ReviewSection";
import { AccountPageWrapper } from "@/components/layout/AccountPageWrapper";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import OrderTimeline from "@/components/order/OrderTimeline";
import TrackingInfo from "@/components/order/TrackingInfo";
import { isOrderCancellable } from "@/config/order-status";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

interface OrderDetailContentProps {
  order: Order;
}

// ─── Payment Deadline Countdown ───────────────────────────────────────────────
function PaymentDeadlineCountdown({ deadline }: { deadline: string }) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor((new Date(deadline).getTime() - Date.now()) / 1000)),
  );

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  if (secondsLeft <= 0) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
        <Clock className="size-4 shrink-0" />
        <span className="font-medium">Batas waktu pembayaran telah habis</span>
      </div>
    );
  }

  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;
  const timeStr = [
    h > 0 ? `${h}j` : null,
    `${String(m).padStart(2, "0")}m`,
    `${String(s).padStart(2, "0")}d`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <Clock className="size-4 shrink-0 animate-pulse" />
      <span>
        Selesaikan pembayaran dalam{" "}
        <span className="font-bold tabular-nums">{timeStr}</span>
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function OrderDetailContent({ order }: OrderDetailContentProps) {
  const itemCount = order.items.reduce((count, item) => count + item.quantity, 0);

  // Gunakan subtotal dari BE kalau ada, fallback hitung manual
  const itemsSubtotal =
    order.subtotal ??
    order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Nomor order: pakai orderNumber dari BE kalau ada
  const displayOrderNumber = order.orderNumber ?? order.id;

  const showPaymentDeadline =
    order.status === "pending" &&
    order.paymentStatus === "pending" &&
    order.paymentDeadline;

  return (
    <AccountPageWrapper
      title="Detail Pesanan"
      icon={Package}
      actionButton={
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 rounded-full border border-[#F8D7E3] bg-white px-4 py-2 text-sm font-bold text-[#F05A89] transition-colors hover:bg-[#FDF2F5]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Kembali ke pesanan
        </Link>
      }
    >
      {/* ── Order header ──────────────────────────────────────────────────── */}
      <div className="mb-6 space-y-3 border-b border-dashed border-[#F8D7E3] pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge
            status={order.status}
            paymentStatus={order.paymentStatus}
          />
        </div>
        <div>
          <p className="font-mono text-base font-bold text-gray-800 sm:text-lg">
            {displayOrderNumber}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Dipesan{" "}
            {new Date(order.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {" · "}
            {itemCount} item{itemCount > 1 ? "s" : ""}
          </p>
        </div>

        {/* Payment deadline countdown */}
        {showPaymentDeadline && (
          <PaymentDeadlineCountdown deadline={order.paymentDeadline!} />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="space-y-6">
          {/* ── Items ───────────────────────────────────────────────────── */}
          <section className="rounded-2xl border border-[#F8D7E3] bg-[#FFFBFC]">
            <div className="border-b border-[#F8D7E3] px-5 py-4">
              <h3 className="font-bold text-gray-800">Item dalam pesanan ini</h3>
            </div>
            <ul className="divide-y divide-[#F8D7E3] px-5">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800">
                      {/* Prioritas: productName (dari BE saat order) > name (fallback) */}
                      {item.productName ?? item.name}
                    </p>
                    {item.variantName && (
                      <p className="mt-0.5 text-xs text-gray-500">{item.variantName}</p>
                    )}
                    <p className="mt-0.5 text-sm text-gray-500">
                      Qty {item.quantity}
                    </p>
                    {item.notes && (
                      <p className="mt-0.5 text-xs italic text-gray-400">
                        Catatan: {item.notes}
                      </p>
                    )}
                  </div>
                  <p className="shrink-0 text-sm font-bold text-gray-800">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Timeline dengan statusHistory ─────────────────────────── */}
          <OrderTimeline
            currentStatus={order.status}
            orderDate={order.createdAt}
            statusHistory={order.statusHistory}
          />

          {/* ── Tracking ────────────────────────────────────────────────── */}
          <TrackingInfo
            order={{
              status: order.status,
              courier: order.courier,
              service: order.service,
              trackingNumber: order.trackingNumber,
              estimatedDelivery: order.estimatedDelivery,
              deliveredAt: order.deliveredAt,
            }}
          />

          {/* ── Shipping address ─────────────────────────────────────────── */}
          {order.address && (
            <section className="rounded-2xl border border-[#F8D7E3] bg-white">
              <div className="flex items-center gap-2 border-b border-[#F8D7E3] px-5 py-4">
                <MapPin className="size-4 text-[#F05A89]" aria-hidden />
                <h3 className="font-bold text-gray-800">Alamat Pengiriman</h3>
              </div>
              <div className="px-5 py-4 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">
                  {order.address.receiverName}
                </p>
                <p className="text-gray-500">{order.address.phone}</p>
                <p className="mt-1">{order.address.address}</p>
                {order.address.notes && (
                  <p className="mt-1 text-xs italic text-gray-400">
                    Catatan: {order.address.notes}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* ── Review (hanya kalau sudah delivered) ────────────────────── */}
          <ReviewSection order={order} />
        </div>

        {/* ── Sidebar: Order summary ───────────────────────────────────── */}
        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className="rounded-2xl border border-[#F8D7E3] bg-white">
            <div className="border-b border-[#F8D7E3] px-5 py-4">
              <h3 className="font-bold text-gray-800">Ringkasan pesanan</h3>
            </div>
            <div className="space-y-4 px-5 py-4">
              <div className="space-y-2 rounded-xl bg-[#FDF2F5] px-4 py-3 text-sm text-gray-700">
                <div className="flex justify-between gap-3">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(itemsSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Ongkos kirim</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(order.shippingCost)}
                  </span>
                </div>
                {order.discountAmount != null && order.discountAmount > 0 && (
                  <div className="flex justify-between gap-3 text-emerald-700">
                    <span>
                      Diskon
                      {order.voucher ? ` (${order.voucher.code})` : ""}
                    </span>
                    <span className="font-medium">
                      −{formatPrice(order.discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between gap-3 border-t border-[#F8D7E3] pt-2 font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-[#F05A89]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Terima kasih sudah belanja di MamaBear 🐻
              </p>
            </div>
          </section>

          {isOrderCancellable(order.status) && (
            <CancelOrderDialog orderId={order.id} />
          )}
        </aside>
      </div>
    </AccountPageWrapper>
  );
}