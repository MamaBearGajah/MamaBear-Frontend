import type { Category } from "@/types";

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}

export function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const active = categories.filter((c) => c.isActive);
  const nodes = new Map<string, CategoryTreeNode>();

  for (const category of active) {
    nodes.set(category.id, { ...category, children: [] });
  }

  const roots: CategoryTreeNode[] = [];

  for (const node of nodes.values()) {
    const parentId = node.parentId ?? null;
    if (parentId && nodes.has(parentId)) {
      nodes.get(parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortNodes = (list: CategoryTreeNode[]) => {
    list.sort((a, b) => a.name.localeCompare(b.name));
    list.forEach((n) => sortNodes(n.children));
  };
  sortNodes(roots);

  return roots;
}
