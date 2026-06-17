import type { Category } from "@/types";

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}

export type NestedCategory = Category & { children?: NestedCategory[] };

function sortTreeNodes(list: CategoryTreeNode[]) {
  list.sort((a, b) => {
    const aOrder = a.sortOrder ?? 999;
    const bOrder = b.sortOrder ?? 999;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.name.localeCompare(b.name);
  });
  list.forEach((node) => sortTreeNodes(node.children));
}

export function mapNestedCategoriesToTree(
  items: NestedCategory[],
): CategoryTreeNode[] {
  const mapNode = (item: NestedCategory): CategoryTreeNode => {
    const { children, ...rest } = item;
    const childNodes = Array.isArray(children) ? children.map(mapNode) : [];
    sortTreeNodes(childNodes);
    return {
      ...rest,
      isActive: rest.isActive ?? true,
      children: childNodes,
    };
  };

  const roots = items.map(mapNode);
  sortTreeNodes(roots);
  return roots;
}

export function flattenCategoryTree(nodes: CategoryTreeNode[]): Category[] {
  const flat: Category[] = [];

  function walk(list: CategoryTreeNode[]) {
    for (const node of list) {
      const { children, ...rest } = node;
      flat.push(rest);
      if (children.length > 0) walk(children);
    }
  }

  walk(nodes);
  return flat;
}

export function findCategoryNode(
  nodes: CategoryTreeNode[],
  id: string,
): CategoryTreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findCategoryNode(node.children, id);
    if (found) return found;
  }
  return null;
}

export function collectDescendantIds(node: CategoryTreeNode): Set<string> {
  const ids = new Set<string>();

  function walk(current: CategoryTreeNode) {
    ids.add(current.id);
    current.children.forEach(walk);
  }

  walk(node);
  return ids;
}

/** BE nested GET /categories can return stale isActive; overlay from GET /categories/:id. */
export async function syncCategoryTreeActiveStates(
  nodes: CategoryTreeNode[],
  fetchById: (id: string) => Promise<Pick<Category, "isActive">>,
): Promise<CategoryTreeNode[]> {
  const ids = new Set<string>();

  function collect(list: CategoryTreeNode[]) {
    for (const node of list) {
      ids.add(node.id);
      collect(node.children);
    }
  }

  collect(nodes);

  const activeById = new Map<string, boolean>();
  await Promise.all(
    [...ids].map(async (id) => {
      try {
        const category = await fetchById(id);
        activeById.set(id, category.isActive ?? true);
      } catch {
        // Keep nested-tree value when detail fetch fails.
      }
    }),
  );

  function patch(list: CategoryTreeNode[]): CategoryTreeNode[] {
    return list.map((node) => ({
      ...node,
      isActive: activeById.get(node.id) ?? node.isActive,
      children: patch(node.children),
    }));
  }

  return patch(nodes);
}

export function buildCategoryTree(
  categories: Category[],
  options?: { includeInactive?: boolean },
): CategoryTreeNode[] {
  const source = options?.includeInactive
    ? categories
    : categories.filter((c) => c.isActive);
  const nodes = new Map<string, CategoryTreeNode>();

  for (const category of source) {
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

  // Sort by sortOrder (dari backend), fallback ke name alphabetical
  const sortNodes = (list: CategoryTreeNode[]) => {
    list.sort((a, b) => {
      const aOrder = a.sortOrder ?? 999;
      const bOrder = b.sortOrder ?? 999;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.name.localeCompare(b.name);
    });
    list.forEach((n) => sortNodes(n.children));
  };
  sortNodes(roots);

  return roots;
}