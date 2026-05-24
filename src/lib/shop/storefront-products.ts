import { fetchMockProductList } from "@/lib/api/mock-products";
import {
  getMockProductsStore,
  isMockProductsEnabled,
} from "@/lib/api/mock-data";
import type { ProductListItem, ProductStatus, ShopFiltersState } from "@/types";
import { computeCategoryCounts } from "./category-counts";
import { toStorefrontSearchListParams } from "./product-list-params";

export const STOREFRONT_PRODUCT_STATUS: ProductStatus = "active";

export function isStorefrontActiveProduct(product: ProductListItem): boolean {
  return (product.status ?? "active") === "active";
}

export function filterStorefrontProducts(
  products: ProductListItem[],
): ProductListItem[] {
  return products.filter(isStorefrontActiveProduct);
}

export function getStorefrontCategoryCounts(): Record<string, number> {
  if (!isMockProductsEnabled()) return {};
  return computeCategoryCounts(
    filterStorefrontProducts(getMockProductsStore()),
  );
}

export function getSearchCategoryCounts(
  filters: ShopFiltersState,
): Record<string, number> {
  if (!isMockProductsEnabled()) return {};
  const q = filters.q?.trim();
  if (!q) return {};

  const res = fetchMockProductList({
    ...toStorefrontSearchListParams(filters),
    page: 1,
    limit: 500,
  });
  return computeCategoryCounts(res.data);
}
