import { cookies } from "next/headers";

import AdminReportsClient from "@/components/admin/AdminReportsClient";
import { adminOrdersApi } from "@/lib/api/adminOrders";
import { mapOrderFromApi } from "@/lib/api/map-order";
import { normalizeApiResponse } from "@/lib/api/normalize-api-response";
import { getServerSession } from "@/lib/auth/session";

type RawRecord = Record<string, unknown>;

type ReportOrder = ReturnType<typeof mapOrderFromApi> & {
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
};

function mapReportOrders(raw: unknown): ReportOrder[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((entry) => {
      const row = (entry ?? {}) as RawRecord;
      const order = mapOrderFromApi(row);
      const user = row.user as RawRecord | undefined;

      return {
        ...order,
        orderNumber: String(row.orderNumber ?? row.order_number ?? order.id),
        customerName: order.user?.name ?? String(user?.name ?? "Customer"),
        customerEmail: order.user?.email ?? (user?.email ? String(user.email) : undefined),
      };
    })
    .filter((order) => order.id);
}

/**
 * GET /orders/admin is paginated (BE default limit = 10, see
 * OrdersService.findAllAdmin). Fetching once with no params — like this page
 * used to do — only ever returns the 10 most recent orders, so every metric
 * below it (revenue, daily chart, top products, CSV export) was silently
 * computed from a tiny, arbitrary slice of the data. Page through every
 * order using the `meta.totalPages` the BE returns instead of assuming a
 * page size.
 */
const ORDERS_PAGE_SIZE = 100;

async function fetchAllAdminOrders(cookieHeader: string): Promise<unknown[]> {
  const requestConfig = { headers: { Cookie: cookieHeader } };

  const first = await adminOrdersApi.getAll({
    ...requestConfig,
    params: { page: 1, limit: ORDERS_PAGE_SIZE },
  });
  const firstNormalized = normalizeApiResponse<unknown>(first.data);
  const firstPage = Array.isArray(firstNormalized.data) ? firstNormalized.data : [];
  const totalPages = firstNormalized.meta?.totalPages ?? 1;

  if (totalPages <= 1) {
    return firstPage;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) => {
      const page = index + 2;
      return adminOrdersApi
        .getAll({
          ...requestConfig,
          params: { page, limit: ORDERS_PAGE_SIZE },
        })
        .then((res) => {
          const normalized = normalizeApiResponse<unknown>(res.data);
          return Array.isArray(normalized.data) ? normalized.data : [];
        });
    }),
  );

  return [firstPage, ...remainingPages].flat();
}

export default async function AdminReportsPage() {
  const session = await getServerSession();
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  let orders: ReportOrder[] = [];

  try {
    const rawOrders = await fetchAllAdminOrders(cookieHeader);
    // Align with the BE reports module (src/reports/reports.service.ts),
    // which only counts orders with paymentStatus === 'paid' as "sales".
    // Without this, cancelled/pending/expired orders would inflate revenue,
    // order count, and customer figures shown here relative to the BE.
    orders = mapReportOrders(rawOrders).filter(
      (order) => order.paymentStatus === "paid",
    );
  } catch {
    orders = [];
  }

  return (
    <AdminReportsClient
      orders={orders}
      userName={session?.user.name ?? "Admin"}
    />
  );
}