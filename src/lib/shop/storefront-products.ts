import type { ProductListItem, ProductStatus } from "@/types";

export const STOREFRONT_PRODUCT_STATUS: ProductStatus = "active";

export function isStorefrontActiveProduct(product: ProductListItem): boolean {
  return (product.status ?? "active") === "active";
}

export function filterStorefrontProducts(
  products: ProductListItem[],
): ProductListItem[] {
  return products.filter(isStorefrontActiveProduct);
}
