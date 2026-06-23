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

  if (meta.totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <nav
      className="border-border flex items-center justify-between border-t pt-4"
      aria-label="Pagination"
    >
      <p className="text-muted-foreground text-sm">
        Page {meta.page} of {meta.totalPages} ({meta.totalItems} products)
      </p>
      <div className="flex gap-2">
        <Link
          href={buildHref(Math.max(1, meta.page - 1))}
          aria-disabled={meta.page <= 1}
          className={cn(
            "border-border hover:bg-muted inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors",
            meta.page <= 1 && "pointer-events-none opacity-40"
          )}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Link>
        <Link
          href={buildHref(Math.min(meta.totalPages, meta.page + 1))}
          aria-disabled={meta.page >= meta.totalPages}
          className={cn(
            "border-border hover:bg-muted inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors",
            meta.page >= meta.totalPages && "pointer-events-none opacity-40"
          )}
        >
          Next
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </nav>
  );
}
