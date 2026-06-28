"use client";

import { useMemo } from "react";

import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import { formatPrice } from "@/lib/utils";
import type { TopCategoryReport } from "@/types";

type TopCategoryRow = TopCategoryReport & { rank: number };

type TopCategoriesTableProps = {
  categories: TopCategoryReport[];
};

export default function TopCategoriesTable({
  categories,
}: TopCategoriesTableProps) {
  const rows = useMemo<TopCategoryRow[]>(
    () =>
      [...categories]
        .sort((left, right) => right.revenue - left.revenue)
        .slice(0, 10)
        .map((category, index) => ({ ...category, rank: index + 1 })),
    [categories],
  );

  const columns = useMemo<DataTableColumn<TopCategoryRow>[]>(
    () => [
      {
        id: "rank",
        header: "#",
        accessorKey: "rank",
        sortable: true,
        sortValue: (row) => row.rank,
        className: "w-12 font-semibold text-[#4B2F2F]",
      },
      {
        id: "name",
        header: "Category",
        accessorKey: "name",
        sortable: true,
        className: "max-w-[320px] whitespace-normal",
      },
      {
        id: "revenue",
        header: "Revenue",
        sortable: true,
        sortValue: (row) => row.revenue,
        cell: (row) => (
          <span className="font-semibold text-foreground">
            {formatPrice(row.revenue)}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="rounded-[32px] border border-[#F1E9EB] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold text-foreground">Top Categories</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Categories ranked by revenue for the selected period
        </p>
      </div>

      <DataTable
        data={rows}
        columns={columns}
        getRowId={(row) => row.categoryId}
        searchPlaceholder="Cari kategori..."
        searchKeys={["name"]}
        pageSize={10}
        emptyMessage="Belum ada data kategori untuk periode ini."
      />
    </div>
  );
}
