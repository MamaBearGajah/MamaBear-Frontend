import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  ArrowLeft,
  Box,
  CreditCard,
  MapPin,
  Package,
  Truck,
  User,
} from "lucide-react";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { getServerSession } from "@/lib/auth/session";
import { adminOrdersApi } from "@/lib/api/adminOrders";
import { mapOrderFromApi } from "@/lib/api/map-order";
import { formatPrice, cn } from "@/lib/utils";
import type { Order } from "@/types";

export const metadata: Metadata = { title: "Order Detail" };

/* ── helpers ─────────────────────────────────────────────── */

type OrderStatus = Order["status"];
type PaymentStatus = Order["paymentStatus"];

const ORDER_STATUS_STYLES: Record<
  OrderStatus,
  { label: string; dot: string; badge: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  paid: {
    label: "Paid",
    dot: "bg-green-400",
    badge: "bg-green-50 text-green-700 ring-green-200",
  },
  processing: {
    label: "Processing",
    dot: "bg-blue-400",
    badge: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  shipped: {
    label: "Shipped",
    dot: "bg-purple-400",
    badge: "bg-purple-50 text-purple-700 ring-purple-200",
  },
  delivered: {
    label: "Delivered",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-700 ring-red-200",
  },
};

const PAYMENT_STATUS_STYLES: Record<
  PaymentStatus,
  { label: string; dot: string; badge: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  paid: {
    label: "Paid",
    dot: "bg-green-400",
    badge: "bg-green-50 text-green-700 ring-green-200",
  },
  failed: {
    label: "Failed",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-700 ring-red-200",
  },
  expired: {
    label: "Expired",
    dot: "bg-gray-400",
    badge: "bg-gray-50 text-gray-700 ring-gray-200",
  },
  refunded: {
    label: "Refunded",
    dot: "bg-orange-400",
    badge: "bg-orange-50 text-orange-700 ring-orange-200",
  },
};

function StatusBadge({
  status,
  map,
}: {
  status: string;
  map: Record<string, { label: string; dot: string; badge: string }>;
}) {
  const style = map[status] ?? {
    label: status,
    dot: "bg-gray-400",
    badge: "bg-gray-50 text-gray-700 ring-gray-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        style.badge,
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {style.label}
    </span>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value ?? "—"}</span>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-4 text-[var(--mamabear-dark-pink)]" />
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

/* ── page ─────────────────────────────────────────────────── */

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession();

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  let order: Order | null = null;
  try {
    const { data: res } = await adminOrdersApi.getById(id, {
      headers: { Cookie: cookieHeader },
    });
    // Try admin endpoint first; fall back to customer endpoint shape
    const raw = res?.data ?? res;
    order = mapOrderFromApi(raw);
  } catch {
    // will 404 below if still null
  }

  if (!order || !order.id) notFound();

  const createdAt = format(
    new Date(order.createdAt),
    "EEEE, d MMMM yyyy · HH:mm",
    { locale: localeId },
  );

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <AdminPageHeader
        title="Detail Pesanan"
        userName={session?.user.name ?? "Admin"}
      />

      <div className="mt-8 space-y-6">
        {/* Back + order ID header */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Kembali
          </Link>

          <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Order ID</p>
              <p className="font-mono text-sm font-semibold text-foreground">
                {order.id}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                status={order.status}
                map={ORDER_STATUS_STYLES}
              />
              <StatusBadge
                status={order.paymentStatus}
                map={PAYMENT_STATUS_STYLES}
              />
            </div>
          </div>
        </div>

        {/* 2-column grid on md+ */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Order Info */}
          <SectionCard icon={Box} title="Informasi Pesanan">
            <InfoRow label="Tanggal" value={createdAt} />
            <InfoRow
              label="Status Pesanan"
              value={
                <StatusBadge status={order.status} map={ORDER_STATUS_STYLES} />
              }
            />
            <InfoRow
              label="Status Pembayaran"
              value={
                <StatusBadge
                  status={order.paymentStatus}
                  map={PAYMENT_STATUS_STYLES}
                />
              }
            />
            {order.paymentMethod && (
              <InfoRow label="Metode Pembayaran" value={order.paymentMethod} />
            )}
            {order.paymentProvider && (
              <InfoRow
                label="Payment Provider"
                value={
                  <span className="capitalize">{order.paymentProvider}</span>
                }
              />
            )}
          </SectionCard>

          {/* Customer Info */}
          <SectionCard icon={User} title="Informasi Customer">
            <InfoRow
              label="Nama"
              value={order.user?.name ?? "—"}
            />
            {order.user?.email && (
              <InfoRow label="Email" value={order.user.email} />
            )}
            <InfoRow label="User ID" value={
              <span className="font-mono text-xs">{order.userId}</span>
            } />
            <InfoRow label="Address ID" value={
              <span className="font-mono text-xs">{order.addressId}</span>
            } />
          </SectionCard>

          {/* Shipping Info */}
          <SectionCard icon={Truck} title="Informasi Pengiriman">
            <InfoRow label="Kurir" value={order.courier || "—"} />
            <InfoRow label="Layanan" value={order.service || "—"} />
            {order.trackingNumber && (
              <InfoRow label="No. Resi" value={
                <span className="font-mono">{order.trackingNumber}</span>
              } />
            )}
            <InfoRow
              label="Biaya Pengiriman"
              value={formatPrice(order.shippingCost)}
            />
          </SectionCard>

          {/* Payment Summary */}
          <SectionCard icon={CreditCard} title="Ringkasan Pembayaran">
            <InfoRow label="Subtotal" value={formatPrice(subtotal)} />
            <InfoRow
              label="Biaya Pengiriman"
              value={formatPrice(order.shippingCost)}
            />
            <div className="flex items-center justify-between gap-4 pt-3 text-sm font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-[var(--mamabear-dark-pink)]">
                {formatPrice(order.total)}
              </span>
            </div>
          </SectionCard>
        </div>

        {/* Order Items */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Package className="size-4 text-[var(--mamabear-dark-pink)]" />
            <h3 className="font-semibold text-foreground">
              Item Pesanan ({order.items.length})
            </h3>
          </div>

          {order.items.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              Tidak ada item.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {/* Header */}
              <div className="grid grid-cols-[1fr_80px_100px_100px] gap-4 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span>Produk</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Harga</span>
                <span className="text-right">Subtotal</span>
              </div>

              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_80px_100px_100px] items-center gap-4 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.name}
                    </p>
                    {item.variantId && (
                      <p className="truncate text-xs text-muted-foreground">
                        Variant ID: {item.variantId}
                      </p>
                    )}
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    {item.quantity}
                  </p>
                  <p className="text-right text-sm text-muted-foreground">
                    {formatPrice(item.price)}
                  </p>
                  <p className="text-right text-sm font-semibold text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}

              {/* Footer totals */}
              <div className="px-5 py-4 space-y-1.5">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Ongkir</span>
                  <span>{formatPrice(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
                  <span>Total</span>
                  <span className="text-[var(--mamabear-dark-pink)]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
