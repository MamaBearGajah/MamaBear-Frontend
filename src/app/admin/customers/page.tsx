import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Download, Eye } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "@/lib/auth/session";
import { adminCustomerApi } from "../../../lib/api/customers";
import { format } from "date-fns";
import { formatPrice } from "../../../lib/utils";
import { cookies } from "next/headers";

interface CustomerOrder { total: string; }

interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count: { orders: number };
  orders: CustomerOrder[];
}

export default async function AdminCustomersPage() {
  const session = await getServerSession();
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  let customersData: Customer[] = [];

  try {
    const { data: customerRes } = await adminCustomerApi.getAll({
      headers: { Cookie: cookieHeader },
    });
    const payload = customerRes?.data ?? customerRes;

    if (Array.isArray(payload?.user)) {
      customersData = payload.user as Customer[];
    } else if (Array.isArray(payload?.users)) {
      customersData = payload.users as Customer[];
    } else if (Array.isArray(payload)) {
      customersData = payload as Customer[];
    }
  } catch {
    customersData = [];
  }

  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <AdminPageHeader title="Pelanggan" userName={session?.user.name ?? "Admin"} />

      <div className="mt-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">
            Daftar Pelanggan ({customersData.length})
          </h2>
          <a
            href="/api/admin/customers/export"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--mamabear-dark-pink)] px-4 py-2 text-sm font-medium text-[var(--mamabear-dark-pink)] hover:bg-pink-50 transition-colors"
          >
            <Download className="size-4" />
            Export
          </a>
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
                  const totalSpent = customer.orders.reduce(
                    (sum, order) => sum + Number(order.total), 0
                  );
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
                      <TableCell className="font-medium">{customer._count.orders}</TableCell>
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
      </div>
    </div>
  );
}
