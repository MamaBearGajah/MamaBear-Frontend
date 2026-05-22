import { filterStorefrontProducts } from "@/lib/shop/storefront-products";
import { effectivePrice } from "@/lib/utils";
import type { ApiResponse, ProductListItem, ProductListParams } from "@/types";
import { getMockProductsStore } from "./mock-data";

export function fetchMockProductList(
  params: ProductListParams = {},
): ApiResponse<ProductListItem[]> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  let items = [...getMockProductsStore()];

  if (params.status === "active") {
    items = filterStorefrontProducts(items);
  }

  if (params.q) {
    const q = params.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
    );
  }

  if (params.categoryId) {
    items = items.filter((p) => p.categoryId === params.categoryId);
  } else if (params.categoryIds && params.categoryIds.length > 0) {
    const idSet = new Set(params.categoryIds);
    items = items.filter(
      (p) => p.categoryId != null && idSet.has(p.categoryId),
    );
  }

  if (params.inStock === true) {
    items = items.filter((p) => p.stock > 0);
  }

  if (params.minPrice != null) {
    items = items.filter((p) => effectivePrice(p) >= params.minPrice!);
  }

  if (params.maxPrice != null) {
    items = items.filter((p) => effectivePrice(p) <= params.maxPrice!);
  }

  const sortBy = params.sortBy ?? "createdAt";
  const sortOrder = params.sortOrder ?? "desc";
  const dir = sortOrder === "asc" ? 1 : -1;

  items.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name) * dir;
      case "price":
        return (effectivePrice(a) - effectivePrice(b)) * dir;
      case "avgRating":
        return ((a.avgRating ?? 0) - (b.avgRating ?? 0)) * dir;
      default:
        return a.id.localeCompare(b.id) * dir;
    }
  });

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);

  return {
    success: true,
    data,
    meta: { page, limit, totalItems, totalPages },
  };
}