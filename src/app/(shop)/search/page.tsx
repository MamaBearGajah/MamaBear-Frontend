import type { Metadata } from "next";
import { Suspense } from "react";
import ActiveFilterBadges from "@/components/product/ActiveFilterBadges";
import FilterSidebar from "@/components/product/FilterSidebar";
import ProductListToolbar from "@/components/product/ProductListToolbar";
import SearchEmptyState from "@/components/product/SearchEmptyState";
import SearchPageHeader from "@/components/product/SearchPageHeader";
import ShopProductGrid from "@/components/product/ShopProductGrid";
import Pagination from "@/components/shared/Pagination";
import { getSearchResults } from "@/lib/api/search";
import { getProductList } from "@/lib/api/products";
import { getCategoryList } from "@/lib/api/categories";
import {
  DEFAULT_PRICE_BOUNDS,
  needsStorefrontClientCatalog,
  parseShopListParamsFromRecord,
  toStorefrontClientCatalogParams,
  toStorefrontSearchListParams,
} from "@/lib/shop/product-list-params";
import { computeCategoryCounts } from "@/lib/shop/category-counts";
import {
  applyStorefrontSort,
  filterProductsByCategoryScope,
  filterProductsByEffectivePrice,
  filterStorefrontProducts,
} from "@/lib/shop/storefront-products";
import type { PaginationMeta, ProductListItem } from "@/types";

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
      <main className="bg-light-pink/25 min-h-[60vh] py-6 md:py-10">
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
  const needsClientCatalog = needsStorefrontClientCatalog(filters);
  const clientCatalogParams = toStorefrontClientCatalogParams(filters);

  const [productsRes, categoriesRes, allProductsRes] = await Promise.all([
    getSearchResults(needsClientCatalog ? clientCatalogParams : listParams),
    getCategoryList(),
    getProductList({ page: 1, limit: 100 }),
  ]);

  const normalizedProducts = (productsRes.data || []).map((p) => ({
    ...p,
    basePrice: Number((p as any).basePrice ?? 0),
    discountPrice: (p as any).discountPrice
      ? Number((p as any).discountPrice)
      : undefined,
    avgRating: (p as any).avgRating ? Number((p as any).avgRating) : undefined,
    ratingCount: (p as any).reviewCount
      ? Number((p as any).reviewCount)
      : undefined,
  })) as ProductListItem[];

  const categories = categoriesRes.data;
  const storefrontProducts = filterProductsByCategoryScope(
    filterStorefrontProducts(normalizedProducts),
    filters.categoryId,
    categories,
  );
  const priceFilteredProducts = applyStorefrontSort(
    filterProductsByEffectivePrice(
      storefrontProducts,
      filters.minPrice,
      filters.maxPrice,
    ),
    filters.sortBy,
    filters.sortOrder,
  );
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const start = (page - 1) * limit;
  const products = needsClientCatalog
    ? priceFilteredProducts.slice(start, start + limit)
    : priceFilteredProducts;
  const countProducts = filterProductsByEffectivePrice(
    filterStorefrontProducts(allProductsRes.data).filter((product) => {
      const needle = q.toLowerCase();
      const matchesQuery =
        product.name.toLowerCase().includes(needle) ||
        product.slug.toLowerCase().includes(needle);
      const matchesStock = filters.inStock === true ? product.stock > 0 : true;
      return matchesQuery && matchesStock;
    }),
    filters.minPrice,
    filters.maxPrice,
  );
  const categoryCounts = computeCategoryCounts(countProducts);

  const meta: PaginationMeta = needsClientCatalog
    ? {
        page,
        limit,
        totalItems: priceFilteredProducts.length,
        totalPages: Math.max(1, Math.ceil(priceFilteredProducts.length / limit)),
      }
    : (productsRes.meta ?? {
        page,
        limit,
        totalItems: products.length,
        totalPages: 1,
      });

  return (
    <main className="bg-light-pink/25 min-h-[60vh] py-6 md:py-10">
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
