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

export default async function AdminReportsPage() {
  const session = await getServerSession();
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  let orders: ReportOrder[] = [];

  try {
    const { data } = await adminOrdersApi.getAll({
      headers: { Cookie: cookieHeader },
    });
    const normalized = normalizeApiResponse<unknown>(data);
    orders = mapReportOrders(normalized.data);
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
