import { filterProductsByCategoryScope } from "@/lib/categories/category-scope";
import type { Category, ProductListItem, ProductSortBy, ProductStatus, SortOrder } from "@/types";
import { effectivePrice } from "@/lib/utils";

export { filterProductsByCategoryScope };

export const STOREFRONT_PRODUCT_STATUS: ProductStatus = "active";

export function isStorefrontActiveProduct(product: ProductListItem): boolean {
  return (product.status ?? "active") === "active";
}

export function filterStorefrontProducts(
  products: ProductListItem[],
): ProductListItem[] {
  return products.filter(isStorefrontActiveProduct);
}

export function filterProductsByEffectivePrice(
  products: ProductListItem[],
  minPrice?: number,
  maxPrice?: number,
): ProductListItem[] {
  return products.filter((product) => {
    const price = effectivePrice(product);
    if (minPrice != null && price < minPrice) return false;
    if (maxPrice != null && price > maxPrice) return false;
    return true;
  });
}

/** BE uses basePrice; storefront "price" sort uses discount when present. */
export function sortProductsByEffectivePrice(
  products: ProductListItem[],
  sortOrder: SortOrder = "asc",
): ProductListItem[] {
  const sorted = [...products].sort(
    (a, b) => effectivePrice(a) - effectivePrice(b),
  );
  return sortOrder === "desc" ? sorted.reverse() : sorted;
}

export function applyStorefrontSort(
  products: ProductListItem[],
  sortBy: ProductSortBy,
  sortOrder: SortOrder,
): ProductListItem[] {
  if (sortBy === "price") {
    return sortProductsByEffectivePrice(products, sortOrder);
  }
  return products;
}
