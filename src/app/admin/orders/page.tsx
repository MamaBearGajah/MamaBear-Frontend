import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import OrdersPageClient from "@/components/admin/OrdersPageClient";
import { getOrderList } from "@/lib/api/orders";
import { getServerSession } from "@/lib/auth/session";
import type { Order, OrderListParams } from "@/types";
import { adminOrdersApi } from "../../../lib/api/adminOrders";

export const metadata: Metadata = {
  title: "Orders",
};

type OrderStatus = Order["status"];
const VALID_STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

interface OrdersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export default async function AdminOrdersPage({
  searchParams,
}: OrdersPageProps) {
  const params = await searchParams;
  const session = await getServerSession();

  const page = parseNumber(parseParam(params.page)) ?? 1;
  const limit = parseNumber(parseParam(params.limit)) ?? 20;
  const statusParam = parseParam(params.status) as OrderStatus | undefined;
  const activeStatus =
    statusParam && VALID_STATUSES.includes(statusParam) ? statusParam : "all";
  const q = parseParam(params.q);

  const listParams: OrderListParams = { page, limit };
  if (activeStatus !== "all") listParams.status = activeStatus;
  if (q) listParams.q = q;

  let ordersData: Order[] = [];
  let meta = { page: 1, limit: 20, totalItems: 0, totalPages: 1 };

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const { data: ordersRes } = await adminOrdersApi.getAll({
    params: listParams,
    headers: { Cookie: cookieHeader },
  });
  ordersData = ordersRes?.data ?? [];
  meta = ordersRes?.meta ?? {
    page: 1,
    limit: 20,
    totalItems: ordersData.length,
    totalPages: 1,
  };

  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <AdminPageHeader
        title="Pesanan"
        userName={session?.user.name ?? "Admin"}
      />

      <div className="mt-8">
        <Suspense fallback={<OrdersListFallback />}>
          <OrdersPageClient
            orders={ordersData}
            meta={meta}
            activeStatus={activeStatus}
          />
        </Suspense>
      </div>
    </div>
  );
}

function OrdersListFallback() {
  return (
    <div className="space-y-4 py-4">
      <div className="bg-muted h-10 w-48 animate-pulse rounded-lg" />
      <div className="bg-muted h-64 animate-pulse rounded-xl" />
    </div>
  );
}
