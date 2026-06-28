import type { Order } from "@/types";

export type OrderStatus = Order["status"];
export type PaymentStatus = Order["paymentStatus"];

/** Timeline step order (happy path). */
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Payment Pending",
  paid: "Paid",
  failed: "Payment Failed",
  expired: "Payment Expired",
  refunded: "Refunded",
};

export const ORDER_STATUS_STYLES: Record<
  OrderStatus,
  { bg: string; text: string; border: string }
> = {
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  paid: {
    bg: "bg-sky-50",
    text: "text-sky-800",
    border: "border-sky-200",
  },
  processing: {
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  shipped: {
    bg: "bg-violet-50",
    text: "text-violet-800",
    border: "border-violet-200",
  },
  delivered: {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
  },
  cancelled: {
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-200",
  },
};

export const PAYMENT_STATUS_STYLES: Record<
  PaymentStatus,
  { bg: string; text: string; border: string }
> = {
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  paid: {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
  },
  failed: {
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-200",
  },
  expired: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
  },
  refunded: {
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
  },
};

export function isTrackingVisible(status: OrderStatus): boolean {
  return status === "shipped" || status === "delivered";
}

export function isOrderCancellable(status: OrderStatus): boolean {
  return status === "pending";
}

export function getOrderStatusIndex(status: OrderStatus): number {
  if (status === "cancelled") return -1;
  return ORDER_STATUS_FLOW.indexOf(status);
}
