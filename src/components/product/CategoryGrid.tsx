"use client";

import Image from "next/image";
import { useShopFilters } from "@/hooks/useShopFilters";
import { Card } from "@/components/ui/card";
import type { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const { filters, updateFilter } = useShopFilters();
  const currentCategoryId = filters.categoryId;

  const validCategories = categories.filter(
    (c) => c.id !== "all" && c.name.toLowerCase() !== "semua produk"
  );

  const displayCategories = validCategories.filter(
    (category, index, self) =>
      index === self.findIndex((c) => c.id === category.id)
  ).slice(0, 8);

  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-4 md:mb-6 mt-2">
      <div className="flex w-full overflow-x-auto lg:justify-between gap-3 md:gap-4 pt-3 pb-5 px-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {displayCategories.map((category) => {
          const isActive = category.id === currentCategoryId;

          return (
            <div 
              key={category.id}
              className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0 lg:flex-1 snap-start w-[75px] md:w-[100px] lg:w-auto lg:max-w-[130px]"
              // FIX: Tambahkan logika toggle di onClick
              onClick={() => {
                if (isActive) {
                  // Jika diklik lagi saat sedang aktif, hapus filter (kembali ke All Products)
                  updateFilter({ categoryId: null });
                } else {
                  // Jika belum aktif, pasang filternya
                  updateFilter({ categoryId: category.id });
                }
              }}
            >
              <Card
                className={`relative overflow-hidden w-full aspect-square bg-white rounded-xl md:rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? "ring-2 ring-pink-500 shadow-md shadow-pink-500/40 scale-105" 
                    : "border-transparent shadow-sm group-hover:shadow-lg group-hover:shadow-pink-500/40 group-hover:-translate-y-1"
                }`}
              >
                <Image
                  src={category.imageUrl || "/images/placeholder-category.png"}
                  alt={category.name}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 1024px) 100px, 130px"
                  priority={isActive}
                />
              </Card>

              <span className={`text-center text-[10px] md:text-xs font-medium leading-tight px-1 line-clamp-2 transition-colors duration-200 ${
                isActive ? "text-pink-600 font-bold" : "text-muted-foreground group-hover:text-pink-500"
              }`}>
                {category.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}