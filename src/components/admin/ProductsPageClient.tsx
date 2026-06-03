"use client";

import { Suspense } from "react";
import ProductsToolbar from "@/components/admin/ProductsToolbar";
import ProductsTable from "@/components/admin/ProductsTable";
import Pagination from "@/components/shared/Pagination";
import type { Category, PaginationMeta, ProductListItem } from "@/types";
import type { ProductFilters } from "@/components/admin/ProductFilterDialog";

interface ProductsPageClientProps {
  products: ProductListItem[];
  meta: PaginationMeta;
  categories: Category[];
  categoryMap: Record<string, string>;
  initialFilters: ProductFilters;
  accessToken?: string;
}

function ProductsPageContent({
  products,
  meta,
  categories,
  categoryMap,
  initialFilters,
  accessToken,
}: ProductsPageClientProps) {
  return (
    <>
      <ProductsToolbar
        meta={meta}
        categories={categories}
        accessToken={accessToken}
        initialFilters={initialFilters}
      />
      <ProductsTable products={products} categoryMap={categoryMap} />
      <div className="mt-6">
        <Pagination meta={meta} />
      </div>
    </>
  );
}

export default function ProductsPageClient(props: ProductsPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="py-8 text-center text-sm text-muted-foreground">Memuat…</div>
      }
    >
      <ProductsPageContent {...props} />
    </Suspense>
  );
}