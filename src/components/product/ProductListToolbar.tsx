"use client";

import { LayoutGrid, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShopFilters } from "@/hooks/useShopFilters";
import { cn } from "@/lib/utils";
import type { ProductSortBy, SortOrder } from "@/types";

const SORT_OPTIONS: {
  value: string;
  sortBy: ProductSortBy;
  sortOrder: SortOrder;
  label: string;
}[] = [
  {
    value: "price-asc",
    sortBy: "price",
    sortOrder: "asc",
    label: "Price: Low to High",
  },
  {
    value: "price-desc",
    sortBy: "price",
    sortOrder: "desc",
    label: "Price: High to Low",
  },
  {
    value: "createdAt-desc",
    sortBy: "createdAt",
    sortOrder: "desc",
    label: "Newest",
  },
  {
    value: "avgRating-desc",
    sortBy: "avgRating",
    sortOrder: "desc",
    label: "Top Rated",
  },
  {
    value: "name-asc",
    sortBy: "name",
    sortOrder: "asc",
    label: "Name: A–Z",
  },
];

export default function ProductListToolbar() {
  const { filters, updateFilter, searchParams } = useShopFilters();
  const current = `${filters.sortBy}-${filters.sortOrder}`;
  const view = searchParams.get("view") === "list" ? "list" : "grid";

  return (
    <div className="mb-4 flex items-center justify-end gap-2 sm:flex-wrap sm:gap-3">
      <Select
        value={current}
        onValueChange={(value) => {
          const option = SORT_OPTIONS.find((o) => o.value === value);
          if (!option) return;
          updateFilter({
            sortBy: option.sortBy,
            sortOrder: option.sortOrder,
          });
        }}
      >
        <SelectTrigger className="border-border text-brown h-10 w-[160px] rounded-full bg-white text-sm sm:w-[220px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="border-border flex overflow-hidden rounded-full border bg-white">
        <button
          type="button"
          aria-label="Grid view"
          onClick={() => updateFilter({ view: "grid" }, { resetPage: false })}
          className={cn(
            "p-2.5 transition-colors",
            view === "grid"
              ? "bg-dark-pink text-white"
              : "text-brown hover:bg-light-pink/50"
          )}
        >
          <LayoutGrid className="size-4" />
        </button>
        <button
          type="button"
          aria-label="List view"
          onClick={() => updateFilter({ view: "list" }, { resetPage: false })}
          className={cn(
            "border-border border-l p-2.5 transition-colors",
            view === "list"
              ? "bg-dark-pink text-white"
              : "text-brown hover:bg-light-pink/50"
          )}
        >
          <List className="size-4" />
        </button>
      </div>
    </div>
  );
}
