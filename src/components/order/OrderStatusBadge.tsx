"use client";

import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_STYLES,
  type OrderStatus,
} from "@/config/order-status";
import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  /** Prefer payment label on confirmation page while payment is pending */
  preferPaymentStatus?: boolean;
  isPolling?: boolean;
  className?: string;
}

export default function OrderStatusBadge({
  status,
  paymentStatus,
  preferPaymentStatus = false,
  isPolling = false,
  className,
}: OrderStatusBadgeProps) {
  const showPayment =
    preferPaymentStatus &&
    paymentStatus &&
    (paymentStatus === "pending" || paymentStatus === "failed" || paymentStatus === "expired");

  const styles = showPayment
    ? PAYMENT_STATUS_STYLES[paymentStatus]
    : ORDER_STATUS_STYLES[status];

  const label = showPayment
    ? PAYMENT_STATUS_LABELS[paymentStatus]
    : ORDER_STATUS_LABELS[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        styles.bg,
        styles.text,
        styles.border,
        className,
      )}
    >
      {isPolling && (
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-40" />
          <span className="relative inline-flex size-2 rounded-full bg-current" />
        </span>
      )}
      {label}
    </span>
  );
}
