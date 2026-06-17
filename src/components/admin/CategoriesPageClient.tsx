"use client";

import CategoryTree from "@/components/admin/CategoryTree";
import type { CategoryTreeNode } from "@/lib/categories/buildCategoryTree";
import type { Category } from "@/types";

type CategoriesPageClientProps = {
  tree: CategoryTreeNode[];
  flatCategories: Category[];
};

export default function CategoriesPageClient({
  tree,
  flatCategories,
}: CategoriesPageClientProps) {
  return (
    <div className="mt-6">
      <CategoryTree tree={tree} flatCategories={flatCategories} />
    </div>
  );
}
