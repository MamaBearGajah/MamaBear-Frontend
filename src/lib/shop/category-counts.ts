import type { Category, ProductListItem } from "@/types";

export function getFilterCategories(categories: Category[]): Category[] {
  return categories.filter((c) => c.id !== "cat-root" && c.isActive);
}

export function computeCategoryCounts(
  products: ProductListItem[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const product of products) {
    if (!product.categoryId) continue;
    counts[product.categoryId] = (counts[product.categoryId] ?? 0) + 1;
  }
  return counts;
}
