import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Eye } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "@/lib/auth/session";
import { adminCustomerApi } from "../../../lib/api/customers";
import { format } from "date-fns";
import { formatPrice } from "../../../lib/utils";
import { cookies } from "next/headers";

interface CustomerOrder {
  total: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count: {
    orders: number;
  };
  orders: CustomerOrder[];
}

export default async function AdminCustomersPage() {
  const session = await getServerSession();

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const { data: customerRes } = await adminCustomerApi.getAll({
    headers: { Cookie: cookieHeader },
  });

  const customersData: Customer[] = customerRes?.data ?? [];

  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <AdminPageHeader
        title="Pelanggan"
        userName={session?.user.name ?? "Admin"}
      />

      <div className="mt-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Daftar Pelanggan</h2>
          <Button
            variant="outline"
            className="border-[var(--mamabear-dark-pink)] text-[var(--mamabear-dark-pink)] hover:bg-[var(--mamabear-pink)]/10 hover:text-[var(--mamabear-dark-pink)]"
          >
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>

        <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium">Customer</TableHead>
                <TableHead className="font-medium">Orders</TableHead>
                <TableHead className="font-medium">Total Spent</TableHead>
                <TableHead className="font-medium">Joined</TableHead>
                <TableHead className="text-right font-medium">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customersData.map((customer) => {
                const totalSpent = customer.orders.reduce(
                  (sum, order) => sum + Number(order.total),
                  0
                );

                return (
                  <TableRow key={customer.id}>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-muted-foreground bg-primary/10 flex size-10 items-center justify-center rounded-full text-sm font-medium uppercase">
                          {customer.name.substring(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-foreground font-medium">
                            {customer.name}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {customer.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {customer._count.orders}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(totalSpent)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(customer.createdAt), "MMMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="text-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                      >
                        <Link href={`#`}>
                          <Eye className="size-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
