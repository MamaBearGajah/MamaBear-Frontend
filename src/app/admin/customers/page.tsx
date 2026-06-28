import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "@/lib/auth/session";
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";
import { cookies } from "next/headers";
import CustomerExportButton from "@/components/admin/CustomerExportButton";
import Pagination from "@/components/shared/Pagination";
import { adminCustomersApi } from "@/lib/api/adminOrders";

interface CustomerOrder { total: string; }

interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count: { orders: number };
  orders: CustomerOrder[];
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseNumber(v: string | string[] | undefined, fallback: number): number {
  const s = Array.isArray(v) ? v[0] : v;
  if (!s) return fallback;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

// FIX: halaman customers sebelumnya pakai adminCustomerApi (/users endpoint tanpa pagination)
// yang mengambil SEMUA data sekaligus — lambat jika customer banyak.
// Sekarang pakai adminCustomersApi (/admin/customers dengan page + limit) 
// yang sudah support pagination dari backend (AdminCustomersController).
export default async function AdminCustomersPage({ searchParams }: PageProps) {
  const session = await getServerSession();
  const params = await searchParams;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const page = parseNumber(params.page, 1);
  const limit = parseNumber(params.limit, 20);
  const search = typeof params.search === "string" ? params.search : undefined;

  let customersData: Customer[] = [];
  let meta = { page, limit, total: 0, totalPages: 1, totalItems: 0 };

  try {
    const { data: res } = await adminCustomersApi.getAll({ page, limit, search });
    const payload = res?.data ?? res;

    if (Array.isArray(payload?.data)) {
      customersData = payload.data as Customer[];
      meta = {
        page: payload.meta?.page ?? page,
        limit: payload.meta?.limit ?? limit,
        total: payload.meta?.total ?? payload.meta?.totalItems ?? customersData.length,
        totalItems: payload.meta?.totalItems ?? payload.meta?.total ?? customersData.length,
        totalPages: payload.meta?.totalPages ?? 1,
      };
    } else if (Array.isArray(payload)) {
      customersData = payload as Customer[];
      meta = { page, limit, total: customersData.length, totalItems: customersData.length, totalPages: 1 };
    }
  } catch {
    customersData = [];
  }

  const paginationMeta = {
    page: meta.page,
    limit: meta.limit,
    totalItems: meta.totalItems,
    totalPages: meta.totalPages,
  };

  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <AdminPageHeader title="Pelanggan" userName={session?.user.name ?? "Admin"} />

      <div className="mt-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">
            Daftar Pelanggan
            {meta.totalItems > 0 && (
              <span className="ml-2 text-base font-normal text-muted-foreground">
                ({meta.totalItems} total)
              </span>
            )}
          </h2>
          <CustomerExportButton
            customers={customersData}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--mamabear-dark-pink)] px-4 py-2 text-sm font-medium text-[var(--mamabear-dark-pink)] hover:bg-pink-50 transition-colors"
          />
        </div>

        <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium">Customer</TableHead>
                <TableHead className="font-medium">Orders</TableHead>
                <TableHead className="font-medium">Total Spent</TableHead>
                <TableHead className="font-medium">Joined</TableHead>
                <TableHead className="text-right font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customersData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Belum ada customer
                  </TableCell>
                </TableRow>
              ) : (
                customersData.map((customer) => {
                  const totalSpent = customer.orders?.reduce(
                    (sum, order) => sum + Number(order.total), 0
                  ) ?? 0;
                  return (
                    <TableRow key={customer.id}>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="text-muted-foreground bg-primary/10 flex size-10 items-center justify-center rounded-full text-sm font-semibold uppercase">
                            {customer.name.substring(0, 2)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-foreground font-medium">{customer.name}</span>
                            <span className="text-muted-foreground text-sm">{customer.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {customer._count?.orders ?? 0}
                      </TableCell>
                      <TableCell className="font-medium">{formatPrice(totalSpent)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(customer.createdAt), "MMMM yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild
                          className="text-blue-500 hover:bg-blue-50 hover:text-blue-600">
                          <Link href={`/admin/customers/${customer.id}`}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination meta={paginationMeta} />
      </div>
    </div>
  );
}