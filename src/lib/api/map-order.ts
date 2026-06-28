import type {
  Order,
  OrderAddress,
  OrderItem,
  OrderStatus,
  OrderStatusHistoryEntry,
  PaymentStatus,
} from "@/types";

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
  const raw = String(value ?? "").trim().toLowerCase();
  return allowed.includes(raw as T) ? (raw as T) : fallback;
}

function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toOptionalString(value: unknown): string | undefined {
  if (value == null || value === "") return undefined;
  return String(value);
}

function toOptionalDate(value: unknown): string | null {
  if (value == null || value === "") return null;
  return String(value);
}

function resolveItemName(row: Record<string, unknown>): string {
  const product = row.product as Record<string, unknown> | undefined;
  const variant = row.variant as Record<string, unknown> | undefined;
  const variantProduct = variant?.product as Record<string, unknown> | undefined;

  return String(
    // Prioritas: productName (disimpan saat order) > name > product.name > variant.product.name
    row.productName ??
      row.name ??
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
    productName: item.productName ? String(item.productName) : undefined,
    variantName: item.variantName ? String(item.variantName) : null,
    quantity: toNumber(item.quantity ?? item.qty, 1),
    price: toNumber(item.price),
    discountPrice: toNumber(variant?.discountPrice),
    notes: item.notes ? String(item.notes) : null,
    variant: variant
      ? ({
          basePrice: toNumber(variant.basePrice),
          discountPrice: toNumber(variant.discountPrice),
          priceAdjustment: toNumber(variant.priceAdjustment),
        } as unknown as any)
      : undefined,
    // name = backward compat alias
    name: resolveItemName(item),
  };
}

function mapOrderAddress(raw: unknown): OrderAddress | null {
  if (!raw || typeof raw !== "object") return null;
  const a = raw as Record<string, unknown>;
  return {
    id: String(a.id ?? ""),
    receiverName: String(a.receiverName ?? ""),
    phone: String(a.phone ?? ""),
    address: String(a.address ?? ""),
    cityId: String(a.cityId ?? ""),
    provinceId: String(a.provinceId ?? ""),
    postalCode: String(a.postalCode ?? ""),
    label: a.label ? String(a.label) : undefined,
    notes: a.notes ? String(a.notes) : undefined,
  };
}

function mapStatusHistory(raw: unknown): OrderStatusHistoryEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((entry) => {
    const e = (entry ?? {}) as Record<string, unknown>;
    return {
      id: String(e.id ?? ""),
      orderId: String(e.orderId ?? ""),
      status: normalizeEnum(e.status, ORDER_STATUSES, "pending"),
      note: e.note ? String(e.note) : null,
      createdAt: String(e.createdAt ?? new Date().toISOString()),
    };
  });
}

/** Normalize BE order payload → storefront Order type. */
export function mapOrderFromApi(raw: unknown): Order {
  const row = (raw ?? {}) as Record<string, unknown>;
  const itemsRaw = Array.isArray(row.items) ? row.items : [];
  const userRaw = row.user as Record<string, unknown> | undefined;
  const paymentRaw = row.payment as Record<string, unknown> | undefined;
  const voucherRaw = row.voucher as Record<string, unknown> | undefined;

  // paymentProvider: dari payment.provider kalau ada, fallback dari row langsung
  const paymentProvider = (() => {
    const raw =
      paymentRaw?.provider ?? row.paymentProvider ?? row.paymentMethod;
    if (raw === "xendit" || raw === "midtrans") return raw;
    return undefined;
  })();

  return {
    id: String(row.id ?? row.orderId ?? ""),
    // ── BARU: orderNumber dari BE (format ORB-YYYYMMDD-XXXX)
    orderNumber: row.orderNumber ? String(row.orderNumber) : undefined,
    userId: String(row.userId ?? ""),
    addressId: String(row.addressId ?? ""),
    status: normalizeEnum(row.status, ORDER_STATUSES, "pending"),
    paymentStatus: normalizeEnum(
      row.paymentStatus ?? paymentRaw?.status,
      PAYMENT_STATUSES,
      "pending",
    ),
    // ── BARU: financial fields dari BE
    subtotal: row.subtotal != null ? toNumber(row.subtotal) : undefined,
    discountAmount: row.discountAmount != null ? toNumber(row.discountAmount) : undefined,
    total: toNumber(row.total),
    shippingCost: toNumber(row.shippingCost),
    courier: String(row.courier ?? row.kurir ?? ""),
    service: String(row.service ?? ""),
    trackingNumber: toOptionalString(row.trackingNumber ?? row.resi),
    // ── BARU: delivery & lifecycle dates
    estimatedDelivery: toOptionalDate(row.estimatedDelivery),
    deliveredAt: toOptionalDate(row.deliveredAt),
    cancelledAt: toOptionalDate(row.cancelledAt),
    cancelReason: row.cancelReason ? String(row.cancelReason) : null,
    notes: row.notes ? String(row.notes) : null,
    // ── BARU: deadline fields
    paymentDeadline: toOptionalDate(row.paymentDeadline),
    cancelDeadline: toOptionalDate(row.cancelDeadline),
    paymentMethod: toOptionalString(
      paymentRaw?.paymentMethod ?? row.paymentMethod,
    ),
    paymentProvider,
    items: itemsRaw.map(mapOrderItem),
    // ── BARU: address object
    address: mapOrderAddress(row.address),
    // ── BARU: status history
    statusHistory: mapStatusHistory(row.statusHistory),
    createdAt: String(row.createdAt ?? row.date ?? new Date().toISOString()),
    updatedAt: row.updatedAt ? String(row.updatedAt) : undefined,
    user: userRaw?.name
      ? {
          name: String(userRaw.name),
          email: userRaw.email ? String(userRaw.email) : undefined,
          phone: userRaw.phone ? String(userRaw.phone) : undefined,
        }
      : undefined,
    voucher:
      voucherRaw?.code
        ? {
            code: String(voucherRaw.code),
            type: String(voucherRaw.type ?? ""),
            value: toNumber(voucherRaw.value),
          }
        : null,
  };
}

export function mapOrdersFromApi(raw: unknown): Order[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(mapOrderFromApi);
}