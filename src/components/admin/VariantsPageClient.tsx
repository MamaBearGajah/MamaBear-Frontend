"use client";

import { Suspense } from "react";
import ProductsToolbar from "@/components/admin/ProductsToolbar";
import ProductsTable from "@/components/admin/ProductsTable";
import Pagination from "@/components/shared/Pagination";
import type { Category, PaginationMeta, ProductVariant } from "@/types";
import type { ProductFilters } from "@/components/admin/ProductFilterDialog";
import VariantsTable from "./VariantsTable";

interface VariantsPageClientProps {
  variants: ProductVariant[];
  meta: PaginationMeta;
  categories: Category[];
  categoryMap: Record<string, string>;
  initialFilters: ProductFilters;
  accessToken?: string;
}

function VariantsPageContent({
  variants,
  meta,
  categories,
  categoryMap,
  initialFilters,
  accessToken,
}: VariantsPageClientProps) {
  return (
    <>
      <ProductsToolbar
        meta={meta}
        categories={categories}
        accessToken={accessToken}
        initialFilters={initialFilters}
      />
      <VariantsTable variants={variants} categoryMap={categoryMap} />
      <div className="mt-6">
        <Pagination meta={meta} />
      </div>
    </>
  );
}

export default function VariantsPageClient(props: VariantsPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground py-8 text-center text-sm">
          Memuat…
        </div>
      }
    >
      <VariantsPageContent {...props} />
    </Suspense>
  );
}
