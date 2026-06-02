import type { Category } from "@/types";

type CategoryNode = Category & { children?: CategoryNode[] };

/** Flatten nested category tree from BE into a flat list for buildCategoryTree. */
export function flattenCategories(nodes: CategoryNode[]): Category[] {
  const flat: Category[] = [];

  function walk(items: CategoryNode[]) {
    for (const item of items) {
      const { children, ...rest } = item;
      flat.push({
        ...rest,
        isActive: rest.isActive ?? true,
      });
      if (children?.length) walk(children);
    }
  }

  walk(nodes);
  return flat;
}

export const ALL_PRODUCTS_CATEGORY: Category = {
  id: "cat-root",
  parentId: null,
  name: "Semua Produk",
  slug: "all",
  isActive: true,
};
