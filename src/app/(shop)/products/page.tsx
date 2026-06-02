import type { Metadata } from "next";
import { Suspense } from "react";
import ActiveFilterBadges from "@/components/product/ActiveFilterBadges";
import FilterSidebar from "@/components/product/FilterSidebar";
import ProductsPageHeader from "@/components/product/ProductsPageHeader";
import ProductListToolbar from "@/components/product/ProductListToolbar";
import ShopProductGrid from "@/components/product/ShopProductGrid";
import Pagination from "@/components/shared/Pagination";
import { getCategoryList } from "@/lib/api/categories";
import { getProductList } from "@/lib/api/products";
import { computeCategoryCounts } from "@/lib/shop/category-counts";
import {
  DEFAULT_PRICE_BOUNDS,
  parseShopListParamsFromRecord,
  toStorefrontProductListParams,
} from "@/lib/shop/product-list-params";
import { filterStorefrontProducts } from "@/lib/shop/storefront-products";
import type { PaginationMeta } from "@/types";


export const metadata: Metadata = {
  title: "All Products | MamaBear",
  description: "Browse all MamaBear superfood products",
};

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  
  const params = await searchParams;
  const filters = parseShopListParamsFromRecord(params);
  const listParams = toStorefrontProductListParams(filters);

  // const accessToken = await getShopAccessToken();

  const [productsRes, categoriesRes, allProductsRes] = await Promise.all([
    getProductList(listParams),
    getCategoryList(),
    getProductList({ page: 1, limit: 100 }),
  ]);

  const products = filterStorefrontProducts(productsRes.data);
  const categoryCounts = computeCategoryCounts(allProductsRes.data);

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
          <ProductsPageHeader
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
            basePath="/products"
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