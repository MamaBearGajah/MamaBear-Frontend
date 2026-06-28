import { mapOrderFromApi } from "@/lib/api/map-order";
import type { Order } from "@/types";

/** Dev fallback when GET /orders is unavailable — matches list UI sample data. */
const FALLBACK_ORDER_ROWS = [
  {
    id: "ORD-2026-8921",
    userId: "mock-user",
    addressId: "mock-address",
    status: "delivered",
    paymentStatus: "paid",
    total: 98000,
    shippingCost: 15000,
    courier: "jne",
    service: "reg",
    trackingNumber: "JNE987654321",
    createdAt: new Date().toISOString(),
    items: [
      {
        id: "item-1",
        productId: "p1",
        name: "ASI Booster Tea – Thai Milk Tea",
        quantity: 2,
        price: 49000,
      },
    ],
  },
  {
    id: "ORD-2026-7732",
    userId: "mock-user",
    addressId: "mock-address",
    status: "processing",
    paymentStatus: "paid",
    total: 176000,
    shippingCost: 15000,
    courier: "pos",
    service: "reg",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    items: [
      {
        id: "item-2",
        productId: "p2",
        name: "Kookie Bites – Chocolate Chip",
        quantity: 3,
        price: 39000,
      },
      {
        id: "item-3",
        productId: "p3",
        name: "Almon Mix – Vanilla",
        quantity: 1,
        price: 59000,
      },
    ],
  },
] as const;

const FALLBACK_ORDERS: Order[] = FALLBACK_ORDER_ROWS.map((row) =>
  mapOrderFromApi(row),
);

export function getFallbackOrders(): Order[] {
  return FALLBACK_ORDERS;
}

export function getFallbackOrderById(id: string): Order | null {
  return FALLBACK_ORDERS.find((order) => order.id === id) ?? null;
}
