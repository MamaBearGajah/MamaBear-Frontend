"use client";

import {
  buildCategoryTree,
  type CategoryTreeNode,
} from "@/lib/categories/buildCategoryTree";
import { getTreeNodeProductCount } from "@/lib/categories/category-tree-counts";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryTreeFilterProps {
  categories: Category[];
  categoryCounts: Record<string, number>;
  selectedCategoryId?: string;
  onSelect: (categoryId: string | null) => void;
}

function CategoryTreeNodeItem({
  node,
  depth,
  selectedCategoryId,
  categoryCounts,
  onSelect,
}: {
  node: CategoryTreeNode;
  depth: number;
  selectedCategoryId?: string;
  categoryCounts: Record<string, number>;
  onSelect: (categoryId: string | null) => void;
}) {
  const isRoot = node.id === "cat-root";
  const isSelected = isRoot
    ? !selectedCategoryId
    : selectedCategoryId === node.id;
  const count = isRoot
    ? Object.values(categoryCounts).reduce((sum, value) => sum + value, 0)
    : getTreeNodeProductCount(node, categoryCounts);
  const paddingClass =
    depth === 0 ? "" : depth === 1 ? "pl-4" : "pl-6";

  return (
    <li>
      <label
        className={cn(
          "flex cursor-pointer items-start gap-2.5 text-sm text-brown",
          paddingClass,
          isSelected && "font-medium text-dark-pink",
        )}
      >
        <input
          type="radio"
          name="shop-category"
          checked={isSelected}
          onChange={() => onSelect(isRoot ? null : node.id)}
          className="mt-1 size-4 shrink-0 accent-dark-pink"
        />
        <span className="leading-snug">
          {node.name}{" "}
          <span className="text-muted-foreground">({count})</span>
        </span>
      </label>
      {node.children.length > 0 && (
        <ul className="mt-2 space-y-2">
          {node.children.map((child) => (
            <CategoryTreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedCategoryId={selectedCategoryId}
              categoryCounts={categoryCounts}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function CategoryTreeFilter({
  categories,
  categoryCounts,
  selectedCategoryId,
  onSelect,
}: CategoryTreeFilterProps) {
  const tree = buildCategoryTree(categories);

  return (
    <ul className="space-y-2">
      {tree.map((node) => (
        <CategoryTreeNodeItem
          key={node.id}
          node={node}
          depth={0}
          selectedCategoryId={selectedCategoryId}
          categoryCounts={categoryCounts}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
