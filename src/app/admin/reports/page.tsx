import { cookies } from "next/headers";

import AdminReportsClient from "@/components/admin/AdminReportsClient";
import { getInitialReportsPageData } from "@/lib/admin/reports-server";

export default async function AdminReportsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const { initialRange, initialData, initialUsingDemoData } =
    await getInitialReportsPageData({ cookieHeader });

  return (
    <AdminReportsClient
      initialRange={initialRange}
      initialData={initialData}
      initialUsingDemoData={initialUsingDemoData}
    />
  );
}
