"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  className?: string;
  headerClassName?: string;
};

export type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T, index: number) => string;
  searchPlaceholder?: string;
  searchKeys?: Array<keyof T>;
  pageSize?: number;
  emptyMessage?: string;
  className?: string;
};

function compareValues(a: string | number, b: string | number) {
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  return String(a).localeCompare(String(b), "id-ID", { sensitivity: "base" });
}

export default function DataTable<T>({
  data,
  columns,
  getRowId,
  searchPlaceholder = "Cari...",
  searchKeys,
  pageSize = 10,
  emptyMessage = "Tidak ada data.",
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sortColumnId, setSortColumnId] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return data;

    return data.filter((row) => {
      const keys =
        searchKeys ??
        columns
          .map((column) => column.accessorKey)
          .filter((key): key is keyof T => key !== undefined);

      return keys.some((key) =>
        String(row[key] ?? "")
          .toLowerCase()
          .includes(normalizedQuery),
      );
    });
  }, [columns, data, query, searchKeys]);

  const sortedData = useMemo(() => {
    if (!sortColumnId) return filteredData;

    const column = columns.find((item) => item.id === sortColumnId);
    if (!column) return filteredData;

    const getValue = (row: T) => {
      if (column.sortValue) return column.sortValue(row);
      if (column.accessorKey) return row[column.accessorKey] as string | number;
      return "";
    };

    return [...filteredData].sort((left, right) => {
      const result = compareValues(getValue(left), getValue(right));
      return sortDirection === "asc" ? result : -result;
    });
  }, [columns, filteredData, sortColumnId, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageRows = sortedData.slice(pageStart, pageStart + pageSize);

  const handleSort = (column: DataTableColumn<T>) => {
    if (!column.sortable) return;

    if (sortColumnId !== column.id) {
      setSortColumnId(column.id);
      setSortDirection("asc");
      setPage(1);
      return;
    }

    if (sortDirection === "asc") {
      setSortDirection("desc");
      setPage(1);
      return;
    }

    setSortColumnId(null);
    setSortDirection("asc");
    setPage(1);
  };

  const SortIcon = ({ columnId }: { columnId: string }) => {
    if (sortColumnId !== columnId) {
      return <ArrowUpDown className="size-3.5 opacity-40" aria-hidden />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="size-3.5" aria-hidden />
    ) : (
      <ArrowDown className="size-3.5" aria-hidden />
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder={searchPlaceholder}
          className="h-10 max-w-sm rounded-full border-[#E9D9DF] bg-white px-4"
          aria-label="Filter table"
        />
        <p className="text-sm text-muted-foreground">
          {sortedData.length} item{sortedData.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[#F2E4E9] bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn("px-4 py-3", column.headerClassName)}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(column)}
                      className="inline-flex items-center gap-1.5 font-semibold text-foreground"
                    >
                      {column.header}
                      <SortIcon columnId={column.id} />
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row, index) => (
                <TableRow key={getRowId(row, pageStart + index)}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={cn("px-4 py-3", column.className)}
                    >
                      {column.cell
                        ? column.cell(row, pageStart + index)
                        : column.accessorKey
                          ? String(row[column.accessorKey] ?? "—")
                          : "—"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {sortedData.length > pageSize && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {pageStart + 1}–
            {Math.min(pageStart + pageSize, sortedData.length)} dari{" "}
            {sortedData.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage <= 1}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-[#E9D9DF] px-3 text-sm font-medium disabled:opacity-40"
            >
              <ChevronLeft className="size-4" aria-hidden />
              Prev
            </button>
            <span className="min-w-16 text-center text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={currentPage >= totalPages}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-[#E9D9DF] px-3 text-sm font-medium disabled:opacity-40"
            >
              Next
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
