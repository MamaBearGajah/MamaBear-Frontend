"use client";

import { useMemo } from "react";

import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import { formatPrice } from "@/lib/utils";
import type { TopProductReport } from "@/types";

type TopProductRow = TopProductReport & { rank: number };

type TopProductsTableProps = {
  products: TopProductReport[];
};

export default function TopProductsTable({ products }: TopProductsTableProps) {
  const rows = useMemo<TopProductRow[]>(
    () =>
      [...products]
        .sort((left, right) => right.revenue - left.revenue)
        .slice(0, 10)
        .map((product, index) => ({ ...product, rank: index + 1 })),
    [products],
  );

  const columns = useMemo<DataTableColumn<TopProductRow>[]>(
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
        header: "Product",
        accessorKey: "name",
        sortable: true,
        className: "max-w-[320px] whitespace-normal",
      },
      {
        id: "qty",
        header: "Qty",
        accessorKey: "qty",
        sortable: true,
        sortValue: (row) => row.qty,
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
        <p className="text-sm font-semibold text-foreground">Top 10 Products</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Best sellers by revenue for the selected period
        </p>
      </div>

      <DataTable
        data={rows}
        columns={columns}
        getRowId={(row) => row.productId}
        searchPlaceholder="Cari produk..."
        searchKeys={["name"]}
        pageSize={10}
        emptyMessage="Belum ada data produk untuk periode ini."
      />
    </div>
  );
}
