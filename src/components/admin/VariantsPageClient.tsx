"use client";

import { Suspense } from "react";
import VariantsToolbar from "@/components/admin/VariantsToolbar";
import Pagination from "@/components/shared/Pagination";
import type { Category, PaginationMeta } from "@/types";
import type { ProductFilters } from "@/components/admin/ProductFilterDialog";
import VariantsTable from "./VariantsTable";
import { ProductVariantList } from "@/types";

interface VariantsPageClientProps {
  variants: ProductVariantList[];
  meta: PaginationMeta;
  categories: Category[];
  categoryMap: Record<string, string>;
  initialFilters: ProductFilters;
}

function VariantsPageContent({
  variants,
  meta,
  categories,
  categoryMap,
  initialFilters,
}: VariantsPageClientProps) {
  return (
    <>
      <VariantsToolbar
        meta={meta}
        categories={categories}
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
