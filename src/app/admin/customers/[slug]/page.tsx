import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  ArrowLeft, MapPin, Package, ShoppingBag,
  User, Mail, Phone, CheckCircle, XCircle, Star,
} from "lucide-react";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { getServerSession } from "@/lib/auth/session";
import { formatPrice, cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";
import { normalizeApiResponse } from "@/lib/api/normalize-api-response";

export const metadata: Metadata = { title: "Detail Customer" };

// ─── Types ───────────────────────────────────────────────────────────────────

interface Address {
  id: string;
  label?: string;
  receiverName: string;
  phone: string;
  address: string;
  cityId: string;
  provinceId: string;
  postalCode: string;
  isDefault: boolean;
}

interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number | string;
  createdAt: string;
  _count: { items: number };
}

interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  createdAt: string;
  addresses: Address[];
  orders: OrderSummary[];
  _count: { orders: number };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(s: string, fmt = "d MMMM yyyy") {
  try { return format(new Date(s), fmt, { locale: localeId }); }
  catch { return "—"; }
}

const ORDER_STATUS: Record<string, { label: string; badge: string }> = {
  pending:    { label: "Pending",    badge: "bg-amber-50 text-amber-700 ring-amber-200" },
  paid:       { label: "Paid",       badge: "bg-green-50 text-green-700 ring-green-200" },
  processing: { label: "Processing", badge: "bg-blue-50 text-blue-700 ring-blue-200" },
  shipped:    { label: "Shipped",    badge: "bg-purple-50 text-purple-700 ring-purple-200" },
  delivered:  { label: "Delivered",  badge: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  cancelled:  { label: "Cancelled",  badge: "bg-red-50 text-red-700 ring-red-200" },
};

function StatusBadge({ status }: { status: string }) {
  const s = ORDER_STATUS[status] ?? { label: status, badge: "bg-gray-50 text-gray-600 ring-gray-200" };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", s.badge)}>
      {s.label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value ?? "—"}</span>
    </div>
  );
}

function SectionCard({
  icon: Icon, title, children,
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

// ─── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminCustomerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await getServerSession();

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  let customer: CustomerDetail | null = null;
  try {
    const res = await apiClient.get(`/admin/customers/${slug}`, {
      headers: { Cookie: cookieHeader },
    });
    const norm = normalizeApiResponse<CustomerDetail>(res.data);
    customer = norm.data ?? null;
  } catch {
    // fall through to notFound
  }

  if (!customer) notFound();

  const totalSpent = customer.orders.reduce(
    (sum, o) => sum + Number(o.total), 0
  );

  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <AdminPageHeader
        title="Detail Customer"
        userName={session?.user.name ?? "Admin"}
      />

      <div className="mt-8 space-y-6">

        {/* Back + header */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Kembali
          </Link>

          <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex size-12 items-center justify-center rounded-full bg-[var(--mamabear-light-pink)] text-lg font-bold text-[var(--mamabear-dark-pink)]">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-foreground">{customer.name}</p>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
              </div>
            </div>

            {/* Verified badge */}
            <div className="flex items-center gap-2">
              {customer.isVerified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200">
                  <CheckCircle className="size-3.5" /> Terverifikasi
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-200">
                  <XCircle className="size-3.5" /> Belum terverifikasi
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-[var(--mamabear-dark-pink)]">
              {customer._count.orders}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Total Orders</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-lg font-bold text-foreground">
              {formatPrice(totalSpent)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Total Belanja</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center col-span-2 sm:col-span-1">
            <p className="text-2xl font-bold text-foreground">
              {customer.addresses.length}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Alamat</p>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid gap-4 md:grid-cols-2">

          {/* Profile */}
          <SectionCard icon={User} title="Informasi Customer">
            <InfoRow label="Nama" value={customer.name} />
            <InfoRow
              label="Email"
              value={
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5 text-muted-foreground" />
                  {customer.email}
                </span>
              }
            />
            {customer.phone && (
              <InfoRow
                label="Telepon"
                value={
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-3.5 text-muted-foreground" />
                    {customer.phone}
                  </span>
                }
              />
            )}
            <InfoRow label="Bergabung" value={fmtDate(customer.createdAt, "d MMMM yyyy")} />
            <InfoRow
              label="Status"
              value={
                customer.isVerified
                  ? <span className="text-green-600 font-medium">Terverifikasi</span>
                  : <span className="text-yellow-600 font-medium">Belum terverifikasi</span>
              }
            />
            <InfoRow
              label="Customer ID"
              value={<span className="font-mono text-xs">{customer.id}</span>}
            />
          </SectionCard>

          {/* Addresses */}
          <SectionCard icon={MapPin} title={`Alamat (${customer.addresses.length})`}>
            {customer.addresses.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground text-center">
                Belum ada alamat
              </p>
            ) : (
              customer.addresses.map((addr) => (
                <div key={addr.id} className="py-3 text-sm space-y-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-foreground">{addr.receiverName}</p>
                    {addr.isDefault && (
                      <span className="shrink-0 rounded-full bg-[var(--mamabear-light-pink)] px-2 py-0.5 text-[10px] font-medium text-[var(--mamabear-dark-pink)]">
                        Utama
                      </span>
                    )}
                  </div>
                  {addr.label && (
                    <p className="text-xs text-muted-foreground">{addr.label}</p>
                  )}
                  <p className="text-muted-foreground">{addr.phone}</p>
                  <p className="text-muted-foreground">
                    {addr.address}, {addr.cityId}, {addr.provinceId} {addr.postalCode}
                  </p>
                </div>
              ))
            )}
          </SectionCard>
        </div>

        {/* Order history */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Package className="size-4 text-[var(--mamabear-dark-pink)]" />
            <h3 className="font-semibold text-foreground">
              Riwayat Order ({customer._count.orders})
            </h3>
          </div>

          {customer.orders.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
              <ShoppingBag className="size-8 opacity-30" />
              <p className="text-sm">Belum ada order</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {/* Header */}
              <div className="grid grid-cols-[1fr_100px_80px_110px_110px] gap-4 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span>Order</span>
                <span>Status</span>
                <span className="text-center">Item</span>
                <span className="text-right">Total</span>
                <span className="text-right">Tanggal</span>
              </div>

              {customer.orders.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-[1fr_100px_80px_110px_110px] items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-colors"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono text-sm font-medium text-foreground hover:text-[var(--mamabear-dark-pink)] transition-colors"
                    >
                      {order.orderNumber}
                    </Link>
                    <p className="text-xs text-muted-foreground capitalize">
                      Payment: {order.paymentStatus}
                    </p>
                  </div>
                  <div>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    {order._count.items}
                  </p>
                  <p className="text-right text-sm font-semibold text-foreground">
                    {formatPrice(Number(order.total))}
                  </p>
                  <p className="text-right text-xs text-muted-foreground">
                    {fmtDate(order.createdAt, "d MMM yyyy")}
                  </p>
                </div>
              ))}

              {/* Footer total */}
              <div className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-muted-foreground">
                  Total belanja ({customer._count.orders} order)
                </span>
                <span className="font-bold text-[var(--mamabear-dark-pink)]">
                  {formatPrice(totalSpent)}
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}