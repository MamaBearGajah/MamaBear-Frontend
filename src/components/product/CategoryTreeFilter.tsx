"use client";

import {
  buildCategoryTree,
  type CategoryTreeNode,
} from "@/lib/categories/buildCategoryTree";
import { getTreeNodeProductCount } from "@/lib/categories/category-tree-counts";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
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
  const hasChildren = node.children.length > 0;
  const count = isRoot
    ? Object.values(categoryCounts).reduce((sum, v) => sum + v, 0)
    : getTreeNodeProductCount(node, categoryCounts);

  // Expand HANYA kalau node ini sendiri yang selected — bukan descendant-nya
  const [expanded, setExpanded] = useState(() => isSelected && hasChildren);

  const paddingLeft = depth * 16;

  return (
    <li>
      <div className="flex items-center gap-1" style={{ paddingLeft: `${paddingLeft}px` }}>
        <label
          className={cn(
            "flex flex-1 cursor-pointer items-start gap-2 text-sm text-brown",
            isSelected && "font-medium text-dark-pink",
          )}
        >
          <input
            type="radio"
            name="shop-category"
            checked={isSelected}
            onChange={() => {
              onSelect(isRoot ? null : node.id);
              if (hasChildren) setExpanded(true);
            }}
            className="mt-1 size-4 shrink-0 accent-dark-pink"
          />
          <span className="leading-snug">
            {node.name}{" "}
            <span className="text-muted-foreground">({count})</span>
          </span>
        </label>

        {hasChildren && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded p-0.5 text-brown/40 hover:text-dark-pink transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <ChevronRight
              className={cn(
                "size-3.5 transition-transform duration-200",
                expanded && "rotate-90",
              )}
            />
          </button>
        )}
      </div>

      {hasChildren && expanded && (
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