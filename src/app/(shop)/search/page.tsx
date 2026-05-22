import type { Metadata } from "next";
import { Suspense } from "react";
import ActiveFilterBadges from "@/components/product/ActiveFilterBadges";
import FilterSidebar from "@/components/product/FilterSidebar";
import ProductListToolbar from "@/components/product/ProductListToolbar";
import SearchEmptyState from "@/components/product/SearchEmptyState";
import SearchPageHeader from "@/components/product/SearchPageHeader";
import ShopProductGrid from "@/components/product/ShopProductGrid";
import Pagination from "@/components/shared/Pagination";
import { getCategoryList } from "@/lib/api/categories";
import { getSearchResults } from "@/lib/api/search";
import {
  DEFAULT_PRICE_BOUNDS,
  parseShopListParamsFromRecord,
  toStorefrontSearchListParams,
} from "@/lib/shop/product-list-params";
import {
  filterStorefrontProducts,
  getSearchCategoryCounts,
} from "@/lib/shop/storefront-products";
import type { PaginationMeta } from "@/types";

export const metadata: Metadata = {
  title: "Search | MamaBear",
  description: "Search MamaBear products",
};

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const filters = parseShopListParamsFromRecord(params);
  const q = filters.q?.trim() ?? "";

  if (!q) {
    return (
      <main className="min-h-[60vh] bg-light-pink/25 py-6 md:py-10">
        <div className="container-main space-y-6">
          <Suspense fallback={null}>
            <SearchPageHeader totalItems={0} categories={[]} />
          </Suspense>
          <SearchEmptyState />
        </div>
      </main>
    );
  }

  const listParams = toStorefrontSearchListParams(filters);

  const [productsRes, categoriesRes] = await Promise.all([
    getSearchResults(listParams),
    getCategoryList(),
  ]);

  const products = filterStorefrontProducts(productsRes.data);
  const categoryCounts = getSearchCategoryCounts(filters);

  const meta: PaginationMeta = productsRes.meta ?? {
    page: filters.page,
    limit: filters.limit,
    totalItems: products.length,
    totalPages: 1,
  };

  return (
    <main className="min-h-[60vh] bg-light-pink/25 py-6 md:py-10">
      <div className="container-main space-y-4">
        <Suspense fallback={null}>
          <SearchPageHeader
            totalItems={meta.totalItems}
            categories={categoriesRes.data}
          />
        </Suspense>

        <Suspense fallback={null}>
          <ActiveFilterBadges categories={categoriesRes.data} />
        </Suspense>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <FilterSidebar
            categories={categoriesRes.data}
            categoryCounts={categoryCounts}
            basePath="/search"
            priceBounds={DEFAULT_PRICE_BOUNDS}
          />

          <div className="min-w-0 flex-1 space-y-4">
            <Suspense fallback={null}>
              <ProductListToolbar />
            </Suspense>

            <ShopProductGrid
              products={products}
              categories={categoriesRes.data}
            />

            <Suspense fallback={null}>
              <Pagination meta={meta} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
