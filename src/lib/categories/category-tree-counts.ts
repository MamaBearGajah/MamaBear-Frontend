import type { CategoryTreeNode } from "./buildCategoryTree";

export function getTreeNodeProductCount(
  node: CategoryTreeNode,
  categoryCounts: Record<string, number>,
): number {
  if (node.children.length === 0) {
    return categoryCounts[node.id] ?? 0;
  }
  return node.children.reduce(
    (sum, child) => sum + getTreeNodeProductCount(child, categoryCounts),
    0,
  );
}
