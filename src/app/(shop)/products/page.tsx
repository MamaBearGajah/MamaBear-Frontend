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
  needsStorefrontClientCatalog,
  parseShopListParamsFromRecord,
  toStorefrontClientCatalogParams,
  toStorefrontProductListParams,
} from "@/lib/shop/product-list-params";
import {
  applyStorefrontSort,
  filterProductsByCategoryScope,
  filterProductsByEffectivePrice,
  filterStorefrontProducts,
} from "@/lib/shop/storefront-products";
import type { PaginationMeta, ProductListItem, VariantOption } from "@/types";

export const metadata: Metadata = {
  title: "All Products | MamaBear",
  description: "Browse all MamaBear superfood products",
};

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Extract distinct variant name+value dari semua produk di halaman */
function extractVariantOptions(products: ProductListItem[]): VariantOption[] {
  const seen = new Set<string>();
  const options: VariantOption[] = [];

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

function filterProductsByVariant(
  products: ProductListItem[],
  variantName?: string,
  variantValue?: string,
): ProductListItem[] {
  if (!variantName && !variantValue) return products;

  return products.filter((product) => {
    const variants = product.variantOptions ?? [];

    return variants.some((variant) => {
      const matchesName = variantName ? variant.name === variantName : true;
      const matchesValue = variantValue ? variant.value === variantValue : true;
      return matchesName && matchesValue;
    });
  });
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const filters = parseShopListParamsFromRecord(params);
  const listParams = toStorefrontProductListParams(filters);
  const needsClientCatalog = needsStorefrontClientCatalog(filters);
  const clientCatalogParams = toStorefrontClientCatalogParams(filters);

  const activeCategoryId =
    filters.categoryId && filters.categoryId !== "cat-root"
      ? filters.categoryId
      : undefined;

  const [productsRes, categoriesRes, allProductsRes] = await Promise.all([
    activeCategoryId
      ? getCategoryProducts(
          activeCategoryId,
          needsClientCatalog
            ? {
                page: 1,
                limit: 1000,
                q: clientCatalogParams.q,
                sortBy: clientCatalogParams.sortBy,
                sortOrder: clientCatalogParams.sortOrder,
                inStock: clientCatalogParams.inStock,
              }
            : {
                page: listParams.page,
                limit: listParams.limit,
                q: listParams.q,
                sortBy: listParams.sortBy,
                sortOrder: listParams.sortOrder,
                inStock: listParams.inStock,
                minPrice: listParams.minPrice,
                maxPrice: listParams.maxPrice,
                variantName: listParams.variantName,
                variantValue: listParams.variantValue,
              },
        )
      : getProductList(needsClientCatalog ? clientCatalogParams : listParams),
    getCategoryList(),
    getProductList({ page: 1, limit: 100 }),
  ]);

  const products = filterStorefrontProducts(productsRes.data);
  const storefrontProducts = filterProductsByCategoryScope(
    products,
    filters.categoryId,
    categoriesRes.data,
  );
  const priceFilteredProducts = filterProductsByEffectivePrice(
    storefrontProducts,
    filters.minPrice,
    filters.maxPrice,
  );
  const variantFilteredProducts = filterProductsByVariant(
    priceFilteredProducts,
    filters.variantName,
    filters.variantValue,
  );
  const sortedProducts = applyStorefrontSort(
    variantFilteredProducts,
    filters.sortBy,
    filters.sortOrder,
  );
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const start = (page - 1) * limit;
  const paginatedProducts = needsClientCatalog
    ? sortedProducts.slice(start, start + limit)
    : sortedProducts;
  const variantOptions = extractVariantOptions(sortedProducts);
  const categoryCounts = computeCategoryCounts(allProductsRes.data);

  // Backend category endpoint pakai key 'total', products endpoint pakai 'totalItems'

  const meta: PaginationMeta = {
    page: needsClientCatalog ? page : productsRes.meta?.page ?? page,
    limit: needsClientCatalog ? limit : productsRes.meta?.limit ?? limit,
    totalItems: needsClientCatalog
      ? sortedProducts.length
      : productsRes.meta?.totalItems ?? productsRes.meta?.total ?? sortedProducts.length,
    totalPages: needsClientCatalog
      ? Math.max(1, Math.ceil(sortedProducts.length / limit))
      : productsRes.meta?.totalPages ?? 1,
  };


  return (
    <main className="bg-light-pink/25 min-h-[60vh] py-6 md:py-10">
      <div className="container-main space-y-4">
        <Suspense fallback={null}>
          <ProductsPageHeader
            totalItems={meta.totalItems ?? 0}
            categories={categoriesRes.data}
          />
        </Suspense>

        <Suspense fallback={null}>
          <ActiveFilterBadges categories={categoriesRes.data} />
        </Suspense>

        <Suspense fallback={null}>
          <CategoryGrid categories={categoriesRes.data} />
        </Suspense>

        <div className="space-y-6">
          <div className="-mt-4 flex items-start gap-2 lg:hidden">
            <FilterSidebar
              categories={categoriesRes.data}
              categoryCounts={categoryCounts}
              basePath="/products"
              priceBounds={DEFAULT_PRICE_BOUNDS}
              variantOptions={variantOptions}
            />

            <div className="min-w-0 flex-1 self-start">
              <Suspense fallback={null}>
                <ProductListToolbar />
              </Suspense>
            </div>
          </div>

          <div className="hidden flex-col gap-6 lg:flex lg:flex-row lg:items-start">
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
                products={paginatedProducts}
                categories={categoriesRes.data}
              />

              <Suspense fallback={null}>
                <Pagination meta={meta} />
              </Suspense>
            </div>
          </div>

          <div className="space-y-4 lg:hidden">
            <ShopProductGrid
              products={paginatedProducts}
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
