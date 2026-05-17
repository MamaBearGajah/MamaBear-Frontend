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
      className="flex items-center justify-between border-t border-border pt-4"
      aria-label="Pagination"
    >
      <p className="text-sm text-muted-foreground">
        Halaman {meta.page} dari {meta.totalPages} ({meta.totalItems} produk)
      </p>
      <div className="flex gap-2">
        <Link
          href={buildHref(Math.max(1, meta.page - 1))}
          aria-disabled={meta.page <= 1}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted",
            meta.page <= 1 && "pointer-events-none opacity-40",
          )}
        >
          <ChevronLeft className="size-4" />
          Sebelumnya
        </Link>
        <Link
          href={buildHref(Math.min(meta.totalPages, meta.page + 1))}
          aria-disabled={meta.page >= meta.totalPages}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted",
            meta.page >= meta.totalPages && "pointer-events-none opacity-40",
          )}
        >
          Berikutnya
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </nav>
  );
}