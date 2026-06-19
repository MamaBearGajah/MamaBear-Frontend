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

const MOCK_CUSTOMERS = [
  {
    id: "1",
    name: "Siti Rahma",
    email: "siti@example.com",
    city: "Jakarta",
    orders: 8,
    totalSpent: "Rp 980.000",
    joined: "Jan 2024",
    initials: "SR",
    color: "bg-pink-500",
  },
  {
    id: "2",
    name: "Dewi Anggraeni",
    email: "dewi@example.com",
    city: "Surabaya",
    orders: 5,
    totalSpent: "Rp 650.000",
    joined: "Feb 2024",
    initials: "DA",
    color: "bg-rose-500",
  },
  {
    id: "3",
    name: "Putri Maharani",
    email: "putri@example.com",
    city: "Bandung",
    orders: 12,
    totalSpent: "Rp 1.450.000",
    joined: "Dec 2023",
    initials: "PM",
    color: "bg-red-400",
  },
  {
    id: "4",
    name: "Ayu Permata",
    email: "ayu@example.com",
    city: "Yogyakarta",
    orders: 3,
    totalSpent: "Rp 350.000",
    joined: "Mar 2024",
    initials: "AP",
    color: "bg-pink-400",
  },
  {
    id: "5",
    name: "Nadia Safira",
    email: "nadia@example.com",
    city: "Medan",
    orders: 6,
    totalSpent: "Rp 720.000",
    joined: "Jan 2024",
    initials: "NS",
    color: "bg-rose-400",
  },
];

interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  totalOrder: number;
  totalSpent: number;
}

const { cookies } = await import("next/headers");
const cookieStore = await cookies();
const cookieHeader = cookieStore.toString();

const { data: customerRes } = await adminCustomerApi.getAll({
  headers: { Cookie: cookieHeader },
});
const customersData = customerRes?.data?.user ?? [];

export default async function AdminCustomersPage() {
  const session = await getServerSession();

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
              {customersData.map((customer: Customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground bg-primary/10 flex size-10 items-center justify-center rounded-full text-sm font-medium">
                        {customer.name.charAt(0) + customer.name.charAt(1)}
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
                    {customer.totalOrder}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(customer.totalSpent)}
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
