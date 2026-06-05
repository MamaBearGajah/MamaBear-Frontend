import type { Order, OrderItem, OrderStatus, PaymentStatus } from "@/types";

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "expired",
  "refunded",
];

function normalizeEnum<T extends string>(
  value: unknown,
  allowed: T[],
  fallback: T,
): T {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase();
  return allowed.includes(raw as T) ? (raw as T) : fallback;
}

function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function resolveItemName(row: Record<string, unknown>): string {
  const product = row.product as Record<string, unknown> | undefined;
  const variant = row.variant as Record<string, unknown> | undefined;
  const variantProduct = variant?.product as Record<string, unknown> | undefined;

  return String(
    row.name ??
      row.productName ??
      product?.name ??
      variantProduct?.name ??
      variant?.name ??
      "Product",
  );
}

function mapOrderItem(row: unknown, index: number): OrderItem {
  const item = (row ?? {}) as Record<string, unknown>;
  const product = item.product as Record<string, unknown> | undefined;
  const variant = item.variant as Record<string, unknown> | undefined;
  const productId = String(item.productId ?? product?.id ?? "");
  const variantId = item.variantId
    ? String(item.variantId)
    : variant?.id
      ? String(variant.id)
      : undefined;

  return {
    id: String(item.id ?? `${productId || "item"}-${index}`),
    productId,
    variantId,
    quantity: toNumber(item.quantity ?? item.qty, 1),
    price: toNumber(item.price),
    name: resolveItemName(item),
  };
}

/** Normalize BE order payload → storefront Order type. */
export function mapOrderFromApi(raw: unknown): Order {
  const row = (raw ?? {}) as Record<string, unknown>;
  const itemsRaw = Array.isArray(row.items) ? row.items : [];

  return {
    id: String(row.id ?? row.orderId ?? ""),
    userId: String(row.userId ?? ""),
    addressId: String(row.addressId ?? ""),
    status: normalizeEnum(row.status, ORDER_STATUSES, "pending"),
    paymentStatus: normalizeEnum(
      row.paymentStatus,
      PAYMENT_STATUSES,
      "pending",
    ),
    total: toNumber(row.total),
    shippingCost: toNumber(row.shippingCost),
    courier: String(row.courier ?? row.kurir ?? ""),
    service: String(row.service ?? ""),
    trackingNumber: row.trackingNumber
      ? String(row.trackingNumber)
      : row.resi
        ? String(row.resi)
        : undefined,
    paymentMethod: row.paymentMethod
      ? String(row.paymentMethod)
      : undefined,
    paymentProvider:
      row.paymentProvider === "xendit" || row.paymentProvider === "midtrans"
        ? row.paymentProvider
        : undefined,
    items: itemsRaw.map(mapOrderItem),
    createdAt: String(row.createdAt ?? row.date ?? new Date().toISOString()),
  };
}

export function mapOrdersFromApi(raw: unknown): Order[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(mapOrderFromApi);
}
