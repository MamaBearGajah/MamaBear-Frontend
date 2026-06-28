"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getOrderById } from "@/lib/api/orders";
import type { Order, PaymentStatus } from "@/types";

export const ORDER_POLL_INTERVAL_MS = 3000;
export const ORDER_POLL_MAX_MS = 30000;

const TERMINAL_PAYMENT_STATUSES: PaymentStatus[] = [
  "paid",
  "failed",
  "expired",
  "refunded",
];

function shouldStopPolling(paymentStatus?: PaymentStatus): boolean {
  if (!paymentStatus) return false;
  return TERMINAL_PAYMENT_STATUSES.includes(paymentStatus);
}

export function useOrderPolling(
  orderId: string | undefined,
  initialOrder: Order | null,
) {
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [isPolling, setIsPolling] = useState(false);
  const [pollTimedOut, setPollTimedOut] = useState(false);
  const startedAtRef = useRef<number | null>(null);

  const refreshOrder = useCallback(async () => {
    if (!orderId) return null;
    const res = await getOrderById(orderId);
    const next = res.data ?? null;
    console.log("next", next);
    setOrder(next);
    return next;
  }, [orderId]);

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  useEffect(() => {
    if (!orderId) return;
    if (shouldStopPolling(initialOrder?.paymentStatus)) return;

    setIsPolling(true);
    setPollTimedOut(false);
    startedAtRef.current = Date.now();

    void refreshOrder();

    const interval = setInterval(async () => {
      const elapsed = Date.now() - (startedAtRef.current ?? Date.now());
      if (elapsed >= ORDER_POLL_MAX_MS) {
        setIsPolling(false);
        setPollTimedOut(true);
        clearInterval(interval);
        return;
      }

      try {
        const next = await refreshOrder();
        if (shouldStopPolling(next?.paymentStatus)) {
          setIsPolling(false);
          clearInterval(interval);
        }
      } catch {
        // Keep polling until timeout — webhook may be delayed
      }
    }, ORDER_POLL_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [orderId, initialOrder?.paymentStatus, refreshOrder]);

  return { order, isPolling, pollTimedOut, refreshOrder };
}
