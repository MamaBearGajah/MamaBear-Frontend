import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import OrderEditForm from "@/components/admin/OrderEditForm";
import { getServerSession } from "@/lib/auth/session";
import { adminOrdersApi } from "@/lib/api/adminOrders";
import { mapOrderFromApi } from "@/lib/api/map-order";
import type { Order } from "@/types";

export const metadata: Metadata = { title: "Edit Pesanan" };

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_BADGE: Record<
  Order["status"],
  { dot: string; badge: string }
> = {
  pending: { dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700 ring-amber-200" },
  paid: { dot: "bg-green-400", badge: "bg-green-50 text-green-700 ring-green-200" },
  processing: { dot: "bg-blue-400", badge: "bg-blue-50 text-blue-700 ring-blue-200" },
  shipped: { dot: "bg-purple-400", badge: "bg-purple-50 text-purple-700 ring-purple-200" },
  delivered: { dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  cancelled: { dot: "bg-red-400", badge: "bg-red-50 text-red-700 ring-red-200" },
};

export default async function AdminOrderEditPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession();
  const accessToken = session?.accessToken;

  let order: Order | null = null;
  try {
    const { data: res } = await adminOrdersApi.getById(id, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });
    const raw = res?.data ?? res;
    order = mapOrderFromApi(raw);
  } catch {
    /* fall through to notFound */
  }

  if (!order || !order.id) notFound();

  const createdAt = format(new Date(order.createdAt), "d MMMM yyyy", {
    locale: localeId,
  });

  const badge = STATUS_BADGE[order.status];

  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <AdminPageHeader
        title="Edit Pesanan"
        userName={session?.user.name ?? "Admin"}
      />

      <div className="mt-8 space-y-6 max-w-2xl">
        {/* Breadcrumb / back */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pesanan
          </Link>
          <span className="text-muted-foreground text-sm">/</span>
          <Link
            href={`/admin/orders/${order.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-mono">{order.id.slice(0, 8)}…</span>
          </Link>
          <span className="text-muted-foreground text-sm">/</span>
          <span className="text-sm font-medium text-foreground">Edit</span>
        </div>

        {/* Order summary card */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Order ID
              </p>
              <p className="font-mono text-sm font-semibold text-foreground">
                {order.id}
              </p>
              <p className="text-xs text-muted-foreground">
                Dibuat: {createdAt}
                {order.user?.name ? ` · ${order.user.name}` : ""}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${badge.badge}`}
            >
              <span className={`size-1.5 rounded-full ${badge.dot}`} />
              {STATUS_LABELS[order.status]}
            </span>
          </div>
        </div>

        {/* Edit form */}
        <OrderEditForm order={order} />
      </div>
    </div>
  );
}
