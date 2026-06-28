"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/types";

interface PaginationProps {
  meta: PaginationMeta;
}

export default function Pagination({ meta }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = meta.page ?? 1;
  const totalPages = meta.totalPages ?? 1;
  const totalItems = meta.totalItems ?? meta.total ?? 0;

  if (totalPages <= 1) return null;

  const buildHref = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <nav
      className="border-border flex items-center justify-between border-t pt-4"
      aria-label="Pagination"
    >
      <p className="text-muted-foreground text-sm">
        Page {page} of {totalPages} ({totalItems} products)
      </p>
      <div className="flex gap-2">
        <Link
          href={buildHref(Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className={cn(
            "border-border hover:bg-muted inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors",
            page <= 1 && "pointer-events-none opacity-40"
          )}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Link>
        <Link
          href={buildHref(Math.min(totalPages, page + 1))}
          aria-disabled={page >= totalPages}
          className={cn(
            "border-border hover:bg-muted inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors",
            page >= totalPages && "pointer-events-none opacity-40"
          )}
        >
          Next
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </nav>
  );
}