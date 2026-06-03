import {
  buildCategoryTree,
  type CategoryTreeNode,
} from "@/lib/categories/buildCategoryTree";
import type { Category, ProductListItem } from "@/types";

function findNode(
  nodes: CategoryTreeNode[],
  categoryId: string,
): CategoryTreeNode | null {
  for (const node of nodes) {
    if (node.id === categoryId) return node;
    const child = findNode(node.children, categoryId);
    if (child) return child;
  }
  return null;
}

function collectDescendantIds(node: CategoryTreeNode): string[] {
  const ids = [node.id];
  for (const child of node.children) {
    ids.push(...collectDescendantIds(child));
  }
  return ids;
}

/** Category id plus all descendant ids (for parent category filters). */
export function getCategoryScopeIds(
  categoryId: string,
  categories: Category[],
): Set<string> {
  const node = findNode(buildCategoryTree(categories), categoryId);
  if (!node) return new Set([categoryId]);
  return new Set(collectDescendantIds(node));
}

export function filterProductsByCategoryScope(
  products: ProductListItem[],
  categoryId: string | undefined,
  categories: Category[],
): ProductListItem[] {
  if (!categoryId || categoryId === "cat-root") return products;
  const scope = getCategoryScopeIds(categoryId, categories);
  return products.filter(
    (product) => product.categoryId && scope.has(product.categoryId),
  );
}
