import { getOrderById } from "@/lib/api/orders";
import { getFallbackOrderById } from "@/lib/shop/fallback-orders";
import type { Order } from "@/types";

type FetchOrderOptions = {
  cookieHeader?: string;
};

/** Fetch order from BE; use dev fallback when BE is unavailable or order is mock-only. */
export async function fetchOrderWithFallback(
  id: string,
  options?: FetchOrderOptions,
): Promise<Order | null> {
  try {
    const res = await getOrderById(id, options);
    if (res.data?.id) return res.data;
  } catch {
    // Fall through to dev fallback below
  }

  return getFallbackOrderById(id);
}
