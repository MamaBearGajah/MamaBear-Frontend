import type { Metadata } from "next";
import { Suspense } from "react";
import ActiveFilterBadges from "@/components/product/ActiveFilterBadges";
import FilterSidebar from "@/components/product/FilterSidebar";
import ProductsPageHeader from "@/components/product/ProductsPageHeader";
import ProductListToolbar from "@/components/product/ProductListToolbar";
import ShopProductGrid from "@/components/product/ShopProductGrid";
import Pagination from "@/components/shared/Pagination";
import CategoryGrid from "@/components/product/CategoryGrid";
import { getCategoryList, getCategoryProducts } from "@/lib/api/categories";
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

<<<<<<< HEAD
/** Extract distinct variant name+value dari semua produk di halaman */
function extractVariantOptions(products: any[]): Array<{ name: string; value: string }> {
  const seen = new Set<string>();
  const options: Array<{ name: string; value: string }> = [];

  for (const product of products) {
    for (const v of product.variantOptions ?? []) {
      const key = `${v.name}::${v.value}`;
      if (!seen.has(key)) {
        seen.add(key);
        options.push({ name: v.name, value: v.value });
      }
    }
  }

  return options;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
=======
export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
>>>>>>> e2235cf15fce7010a2619a2e84377f3de0a499f5
  const params = await searchParams;
  const filters = parseShopListParamsFromRecord(params);
  const listParams = toStorefrontProductListParams(filters);

  const activeCategoryId =
    filters.categoryId && filters.categoryId !== "cat-root"
      ? filters.categoryId
      : undefined;

  const [productsRes, categoriesRes, allProductsRes] = await Promise.all([
    activeCategoryId
      ? getCategoryProducts(activeCategoryId, {
          page: listParams.page,
          limit: listParams.limit,
          q: listParams.q,
          sortBy: listParams.sortBy,
          sortOrder: listParams.sortOrder,
          inStock: listParams.inStock,
          minPrice: listParams.minPrice,
          maxPrice: listParams.maxPrice,
          variantName:  listParams.variantName,
          variantValue: listParams.variantValue,
        })
      : getProductList(listParams),
    getCategoryList(),
    getProductList({ page: 1, limit: 100 }),
  ]);

  const products = filterStorefrontProducts(productsRes.data);
  const categoryCounts = computeCategoryCounts(allProductsRes.data);

<<<<<<< HEAD
  // Selalu pakai allProductsRes (semua produk tanpa filter)
  // supaya variant chips tampil lengkap dari semua produk, bukan hanya kategori aktif
  const variantOptions = extractVariantOptions(allProductsRes.data);

  // Backend category endpoint pakai key 'total', products endpoint pakai 'totalItems'
  const rawMeta = productsRes.meta as any;
  const meta: PaginationMeta = {
    page: rawMeta?.page ?? filters.page,
    limit: rawMeta?.limit ?? filters.limit,
    totalItems: rawMeta?.totalItems ?? rawMeta?.total ?? products.length,
    totalPages: rawMeta?.totalPages ?? 1,
=======
  const meta: PaginationMeta = productsRes.meta ?? {
    page: filters.page,
    limit: filters.limit,
    total: products.length,
    totalPages: 1,
>>>>>>> e2235cf15fce7010a2619a2e84377f3de0a499f5
  };

  return (
    <main className="bg-light-pink/25 min-h-[60vh] py-6 md:py-10">
      <div className="container-main space-y-4">
        <Suspense fallback={null}>
          <ProductsPageHeader
            totalItems={meta.total}
            categories={categoriesRes.data}
          />
        </Suspense>

        <Suspense fallback={null}>
          <ActiveFilterBadges categories={categoriesRes.data} />
        </Suspense>

        <Suspense fallback={null}>
          <CategoryGrid categories={categoriesRes.data} />
        </Suspense>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <FilterSidebar
            categories={categoriesRes.data}
            categoryCounts={categoryCounts}
            basePath="/products"
            priceBounds={DEFAULT_PRICE_BOUNDS}
            variantOptions={variantOptions}
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
<<<<<<< HEAD
}
=======
}
>>>>>>> e2235cf15fce7010a2619a2e84377f3de0a499f5
