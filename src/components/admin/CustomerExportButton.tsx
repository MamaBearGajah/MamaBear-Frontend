"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerOrder {
  total: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count: { orders: number };
  orders: CustomerOrder[];
}

function formatCsvValue(value: string | number | boolean | null | undefined) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function getTotalSpent(customer: Customer) {
  return customer.orders.reduce((sum, order) => sum + Number(order.total), 0);
}

export default function CustomerExportButton({
  customers,
  className,
}: {
  customers: Customer[];
  className?: string;
}) {
  const handleExport = () => {
    const header = ["Name", "Email", "Orders", "Total Spent", "Joined"];
    const rows = customers.map((customer) => [
      customer.name,
      customer.email,
      customer._count.orders,
      getTotalSpent(customer),
      new Date(customer.createdAt).toISOString().slice(0, 10),
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map(formatCsvValue).join(","))
      .join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `customers-export-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleExport}
    >
      <Download className="size-4" />
      Export
    </Button>
  );
}
