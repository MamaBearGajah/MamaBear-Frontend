"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Mail, PartyPopper } from "lucide-react";
import OrderEmailPreview from "@/components/order/OrderEmailPreview";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import { useAuth } from "@/context/AuthContext";
import { useOrderPolling } from "@/hooks/useOrderPolling";
import { membershipApi } from "@/lib/api/membership";
import {
  formatDisplayOrderId,
  getDeliveryEstimateLabel,
} from "@/lib/shop/order-delivery";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

interface OrderSuccessViewProps {
  orderId?: string;
  initialOrder: Order | null;
}

function formatPaymentLabel(order: Order): string {
  if (order.paymentMethod) {
    const method = order.paymentMethod;
    if (method === "xendit") return "Xendit";
    if (method === "midtrans") return "Midtrans";
    return method;
  }
  if (order.paymentProvider) {
    return order.paymentProvider.charAt(0).toUpperCase() + order.paymentProvider.slice(1);
  }
  return "Online Payment";
}

function formatShippingLabel(order: Order): string {
  const courier = order.courier?.toUpperCase() || "—";
  if (!order.service) return courier;
  return `${courier} ${order.service.toUpperCase()}`;
}

export default function OrderSuccessView({
  orderId,
  initialOrder,
}: OrderSuccessViewProps) {
  const { state } = useAuth();
  const { order, isPolling, pollTimedOut } = useOrderPolling(
    orderId,
    initialOrder,
  );
  const [hasRedeemedOrderPoints, setHasRedeemedOrderPoints] = useState(false);
  console.log("order",order);
  useEffect(() => {
    if (!order || hasRedeemedOrderPoints) return;
    if (order.paymentStatus !== "paid") return;
    if (!state.user?.id) return;

    const points = Math.floor(order.total / 1000);
    if (points <= 0) return;

    membershipApi
      .givePoints(state.user.id, points)
      .then(() => setHasRedeemedOrderPoints(true))
      .catch((err) => {
        console.error("Failed to give order points:", err);
      });
  }, [order, hasRedeemedOrderPoints, state.user?.id]);

  if (!orderId) {
    return (
      <div className="rounded-2xl border border-pink-100 bg-white p-8 text-center shadow-sm">
        <p className="text-brown">
          No order ID found. Please return to checkout or check your order
          history.
        </p>
        <Link
          href="/account/orders"
          className="mt-4 inline-block text-sm font-semibold text-dark-pink underline"
        >
          View my orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-2xl border border-pink-100 bg-white p-8 text-center shadow-sm">
        <p className="text-brown">
          We could not load order details. The order may still be processing.
        </p>
        {pollTimedOut && (
          <p className="mt-2 text-sm text-brown/70">
            Payment status could not be confirmed within 30 seconds. Check your
            email or order history shortly.
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={`/account/orders/${orderId}`}
            className="rounded-full border-2 border-dark-pink bg-white px-6 py-2.5 text-sm font-semibold text-dark-pink"
          >
            Track Order
          </Link>
          <Link
            href="/products"
            className="rounded-full bg-dark-pink px-6 py-2.5 text-sm font-semibold text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const displayId = formatDisplayOrderId(order.id);
  const { etaText, estimatedDate } = getDeliveryEstimateLabel(
    order.createdAt,
    order.courier,
  );
  const userName = state.user?.name?.split(" ")[0] ?? "Mama";
  const pointsEarned = Math.max(0, Math.floor(order.total / 1000));

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <PartyPopper
            className="size-8 text-dark-pink"
            aria-hidden
          />
          <span className="flex size-10 items-center justify-center rounded-full bg-dark-pink text-white">
            <Check className="size-5" strokeWidth={3} aria-hidden />
          </span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-brown">
          Order Placed! 🐻
        </h1>
        <p className="mt-2 text-sm text-brown/80">
          Thank you, {userName}! Your order has been received.
        </p>
        <p className="mt-2 text-sm text-dark-pink">
          You earned <strong>{pointsEarned.toLocaleString()}</strong> membership point{pointsEarned === 1 ? "" : "s"} from this order.
        </p>
        <div className="mt-3 flex justify-center">
          <OrderStatusBadge
            status={order.status}
            paymentStatus={order.paymentStatus}
            preferPaymentStatus
            isPolling={isPolling}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-light-pink/50 px-6 py-4 text-center">
        <p className="font-mono text-lg font-bold tracking-wide text-dark-pink">
          {displayId}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
        <div className="divide-y divide-pink-50 px-5 py-1 text-sm">
          <div className="flex items-center justify-between py-3">
            <span className="text-brown/70">Payment Method</span>
            <span className="font-medium text-brown">
              {formatPaymentLabel(order)}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-brown/70">Shipping</span>
            <span className="font-medium text-brown">
              {formatShippingLabel(order)}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-brown/70">Total</span>
            <span className="font-bold text-dark-pink">
              {formatPrice(order.total)}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-brown/70">Membership points earned</span>
            <span className="font-medium text-dark-pink">
              {pointsEarned.toLocaleString()} point{pointsEarned === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      {order.items.length > 0 && (
        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-brown">Items</h2>
          <ul className="space-y-3">
            {order.items.map((item) => {
              const unitPrice = item.variant?.discountPrice ?? item.discountPrice ?? item.price;
              return (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="line-clamp-2 font-medium text-brown">
                      {item.name}
                    </p>
                    <p className="text-xs text-brown/60">Qty {item.quantity}</p>
                  </div>
                  <p className="shrink-0 font-semibold text-brown">
                    {formatPrice(unitPrice * item.quantity)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-pink-100 bg-white px-5 py-4 shadow-sm">
        <p className="text-sm font-semibold text-brown">Estimated delivery</p>
        <p className="mt-1 text-sm text-brown">
          {estimatedDate.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="mt-1 text-xs text-brown/60">{etaText}</p>
      </div>

      <div className="flex gap-3 rounded-2xl border border-pink-100 bg-light-pink/30 px-4 py-4">
        <Mail className="mt-0.5 size-5 shrink-0 text-dark-pink" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-brown">
            Confirmation email sent!
          </p>
          <p className="mt-1 text-xs leading-relaxed text-brown/70">
            Check your inbox for payment instructions and order details.
            Payment expires in <strong>24 hours</strong>.
          </p>
        </div>
      </div>

      <OrderEmailPreview
        order={order}
        recipientEmail={state.user?.email}
        recipientName={state.user?.name ?? "Mama"}
      />

      {pollTimedOut && order.paymentStatus === "pending" && (
        <p className="text-center text-xs text-amber-800">
          Payment confirmation is taking longer than usual. Refresh this page or
          check My Orders in a few minutes.
        </p>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Link
          href={`/account/orders/${order.id}`}
          className="flex-1 rounded-full border-2 border-dark-pink bg-white py-3 text-center text-sm font-semibold text-dark-pink transition hover:bg-light-pink/30"
        >
          Track Order
        </Link>
        <Link
          href="/products"
          className="flex-1 rounded-full bg-dark-pink py-3 text-center text-sm font-semibold text-white transition hover:bg-dark-pink/90"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
