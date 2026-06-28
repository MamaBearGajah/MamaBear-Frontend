"use client";

import Image from "next/image";
import { useShopFilters } from "@/hooks/useShopFilters";
import { Card } from "@/components/ui/card";
import { buildCategoryTree } from "@/lib/categories/buildCategoryTree";
import type { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const { filters, updateFilter } = useShopFilters();
  const currentCategoryId = filters.categoryId;

  // Pakai buildCategoryTree supaya urutan ikut sortOrder dari backend,
  // lalu flatten dengan DFS (root → children → grandchildren dst.)
  // sehingga urutan grid = Moms & Baby → Maternity → AlmonMix → ZoyaMix → ASI Booster → Teh → Kookie → Kapsul
  function flattenTree(cats: Category[]): Category[] {
    const tree = buildCategoryTree(cats);
    const result: Category[] = [];

    function dfs(nodes: typeof tree) {
      for (const node of nodes) {
        const { children, ...cat } = node;
        result.push(cat);
        if (children.length > 0) dfs(children);
      }
    }

    dfs(tree);
    return result;
  }

  const sorted = flattenTree(
    categories.filter(
      (c) =>
        c.id !== "cat-root" &&
        c.id !== "all" &&
        c.name.toLowerCase() !== "semua produk"
    )
  ).slice(0, 8);

  if (sorted.length === 0) return null;

  return (
    <div className="mt-2 mb-4 w-full md:mb-6">
      <div className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto px-2 pt-3 pb-5 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-4 lg:justify-between [&::-webkit-scrollbar]:hidden">
        {sorted.map((category) => {
          const isActive = category.id === currentCategoryId;

          return (
            <div
              key={category.id}
              className="group flex w-[92px] shrink-0 cursor-pointer snap-start flex-col items-center gap-2 sm:w-[100px] md:w-[112px] lg:w-auto lg:max-w-[130px] lg:flex-1"
              onClick={() => {
                if (isActive) {
                  updateFilter({ categoryId: null });
                } else {
                  updateFilter({ categoryId: category.id });
                }
              }}
            >
              <Card
                className={`relative aspect-square w-full overflow-hidden rounded-xl bg-white transition-all duration-300 md:rounded-2xl ${
                  isActive
                    ? "scale-105 shadow-md ring-2 shadow-pink-500/40 ring-pink-500"
                    : "border-transparent shadow-sm group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-pink-500/40"
                }`}
              >
                <Image
                  src={category.imageUrl || "/images/placeholder-category.png"}
                  alt={category.name}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 92px, (max-width: 768px) 112px, 130px"
                  priority={isActive}
                />
              </Card>

              <span
                className={`line-clamp-2 px-1 text-center text-[10px] leading-tight font-medium transition-colors duration-200 md:text-xs ${
                  isActive
                    ? "font-bold text-pink-600"
                    : "text-muted-foreground group-hover:text-pink-500"
                }`}
              >
                {category.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
