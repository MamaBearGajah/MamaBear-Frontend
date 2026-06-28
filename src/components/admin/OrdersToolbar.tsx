"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import type { Order, PaginationMeta } from "@/types";

type OrderStatus = Order["status"] | "all";

const STATUS_TABS: { value: OrderStatus; label: string }[] = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

interface OrdersToolbarProps {
  meta: PaginationMeta;
  activeStatus: OrderStatus;
}

export default function OrdersToolbar({
  meta,
  activeStatus,
}: OrdersToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebounce(search, 300);

  // Sync debounced search → URL
  useEffect(() => {
    const currentQ = searchParams.get("q") ?? "";
    if (debouncedSearch === currentQ) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) params.set("q", debouncedSearch);
    else params.delete("q");
    params.set("page", "1");
    router.push(`/admin/orders?${params.toString()}`);
  }, [debouncedSearch, router, searchParams]);

  const handleTabChange = (status: OrderStatus) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") params.delete("status");
    else params.set("status", status);
    params.set("page", "1");
    router.push(`/admin/orders?${params.toString()}`);
  };

  const handleExportCsv = () => {
    // Placeholder — wire to API endpoint when available
    const params = new URLSearchParams(searchParams.toString());
    params.set("format", "csv");
    window.open(`/api/admin/orders/export?${params.toString()}`, "_blank");
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Top row: count + export */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-foreground text-lg font-semibold">
          Total Pesanan ({meta.total})
        </h2>
        <Button
          type="button"
          variant="outline"
          className="gap-1.5"
          onClick={handleExportCsv}
        >
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-x-1 gap-y-1">
        {STATUS_TABS.map((tab) => {
          const isActive = tab.value === activeStatus;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                "cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--mamabear-dark-pink)] text-white shadow-sm"
                  : "text-muted-foreground bg-[var(--mamabear-light-pink)] hover:bg-[var(--mamabear-dark-pink)] hover:text-white"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search bar */}
      <div className="relative max-w-md">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          type="search"
          placeholder="Search by order # or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}
