"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ProductsToolbar from "@/components/admin/ProductsToolbar";
import ProductsTable from "@/components/admin/ProductsTable";
import Pagination from "@/components/shared/Pagination";
import {
  applyProductListRefresh,
  clearProductListRefresh,
  resolveProductListRefresh,
} from "@/lib/admin/product-list-refresh";
import { getProductList } from "@/lib/api/products";
import type {
  Category,
  PaginationMeta,
  ProductListItem,
  ProductListParams,
} from "@/types";
import type { ProductFilters } from "@/components/admin/ProductFilterDialog";

interface ProductsPageClientProps {
  products: ProductListItem[];
  meta: PaginationMeta;
  categories: Category[];
  categoryMap: Record<string, string>;
  initialFilters: ProductFilters;
  listParams: ProductListParams;
  accessToken?: string;
}

function ProductsPageContent({
  products: initialProducts,
  meta: initialMeta,
  categories,
  categoryMap,
  initialFilters,
  listParams,
  accessToken,
}: ProductsPageClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const refreshKey = searchParams.get("updated") ?? "";
  const productId = searchParams.get("productId");
  const productName = searchParams.get("productName");
  const productSlug = searchParams.get("productSlug");
  const listPatch = useMemo(
    () =>
      productId && productName
        ? {
            id: productId,
            name: productName,
            ...(productSlug ? { slug: productSlug } : {}),
          }
        : resolveProductListRefresh(searchParams),
    [productId, productName, productSlug, refreshKey, searchParams],
  );
  const [products, setProducts] = useState(() =>
    listPatch
      ? applyProductListRefresh(initialProducts, listPatch)
      : initialProducts,
  );
  const [meta, setMeta] = useState(initialMeta);

  const {
    page = 1,
    limit = 20,
    q,
    categoryId,
    inStock,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  } = listParams;

  useEffect(() => {
    let cancelled = false;

    getProductList(listParams)
      .then((response) => {
        if (cancelled) return;
        let nextProducts = response.data;
        if (listPatch) {
          nextProducts = applyProductListRefresh(nextProducts, listPatch);
        }
        setProducts(nextProducts);
        if (response.meta) setMeta(response.meta);
        clearProductListRefresh();
      })
      .catch(() => {
        if (cancelled) return;
        if (listPatch) {
          setProducts((current) => applyProductListRefresh(current, listPatch));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    listPatch,
    pathname,
    refreshKey,
    page,
    limit,
    q,
    categoryId,
    inStock,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  ]);

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
        <div className="py-8 text-center h-[100vh] text-sm text-muted-foreground">Loading…</div>
      }
    >
      <ProductsPageContent {...props} />
    </Suspense>
  );
}
