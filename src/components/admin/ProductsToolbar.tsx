"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, Filter, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { exportProducts } from "@/lib/api/admin";
import { handleApiError } from "@/lib/errorHandler";
import type { Category, PaginationMeta } from "@/types";
import ProductFilterDialog, { type ProductFilters } from "./ProductFilterDialog";

interface ProductsToolbarProps {
  meta: PaginationMeta;
  categories: Category[];
  accessToken?: string;
  initialFilters: ProductFilters;
}

export default function ProductsToolbar({
  meta,
  categories,
  accessToken,
  initialFilters,
}: ProductsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [filterOpen, setFilterOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  useEffect(() => {
    const currentQ = searchParams.get("q") ?? "";
    if (debouncedSearch === currentQ) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) params.set("q", debouncedSearch);
    else params.delete("q");
    params.set("page", "1");
    router.push(`/admin/products?${params.toString()}`);
  }, [debouncedSearch, router, searchParams]);

  const applyFilters = (filters: ProductFilters) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    else params.delete("categoryId");

    if (filters.inStock === true) params.set("inStock", "true");
    else if (filters.inStock === false) params.set("inStock", "false");
    else params.delete("inStock");

    if (filters.minPrice != null) params.set("minPrice", String(filters.minPrice));
    else params.delete("minPrice");

    if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
    else params.delete("maxPrice");

    params.set("page", "1");
    router.push(`/admin/products?${params.toString()}`);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const { downloadUrl } = await exportProducts();
      window.open(downloadUrl, "_blank");
      toast.success("Export berhasil dibuka.");
    } catch (error) {
      handleApiError(error);
    } finally {
      setExporting(false);
    }
  };

  const activeFilterCount = [
    initialFilters.categoryId,
    initialFilters.inStock != null ? "stock" : null,
    initialFilters.minPrice != null ? "min" : null,
    initialFilters.maxPrice != null ? "max" : null,
  ].filter(Boolean).length;

  return (
    <>
      <div className="mb-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Products ({meta.totalItems})
        </h2>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setFilterOpen(true)}>
              <Filter className="size-4" />
              Filter
              {activeFilterCount > 0 ? (
                <span className="ml-1 rounded-full bg-[var(--mamabear-dark-pink)] px-1.5 py-0.5 text-xs text-white">
                  {activeFilterCount}
                </span>
              ) : null}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={exporting}
              onClick={handleExport}
            >
              <Download className="size-4" />
              {exporting ? "Export…" : "Export"}
            </Button>
            <Button
              asChild
              className="bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90"
            >
              <Link href="/admin/products/new">
                <Plus className="size-4" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <ProductFilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        categories={categories}
        initialFilters={initialFilters}
        onApply={applyFilters}
      />
    </>
  );
}