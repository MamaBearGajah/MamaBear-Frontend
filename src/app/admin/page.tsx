import { cookies } from "next/headers";

import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { getInitialReportsPageData } from "@/lib/admin/reports-server";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const { initialRange, initialData, initialUsingDemoData } =
    await getInitialReportsPageData({ cookieHeader });

  return (
    <AdminDashboardClient
      initialRange={initialRange}
      initialData={initialData}
      initialUsingDemoData={initialUsingDemoData}
    />
  );
}
