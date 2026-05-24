"use client";

import { Suspense, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useShopFilters } from "@/hooks/useShopFilters";
import { DEFAULT_PRICE_BOUNDS } from "@/lib/shop/product-list-params";
import type { Category, ShopPriceBounds } from "@/types";
import CategoryTreeFilter from "./CategoryTreeFilter";
import FilterSidebarSearch from "./FilterSidebarSearch";
import PriceRangePresets from "./PriceRangePresets";
import PriceRangeSlider from "./PriceRangeSlider";

export type ShopFilterBasePath = "/products" | "/search";

interface FilterSidebarProps {
  categories: Category[];
  categoryCounts: Record<string, number>;
  basePath: ShopFilterBasePath;
  priceBounds?: ShopPriceBounds;
}

export default function FilterSidebar({
  categories,
  categoryCounts,
  basePath,
  priceBounds = DEFAULT_PRICE_BOUNDS,
}: FilterSidebarProps) {
  const { filters, updateFilter, clearAllFilters } = useShopFilters();
  const showSidebarSearch = basePath === "/products";

  const selectCategory = (categoryId: string | null) => {
    updateFilter({ categoryId, categoryIds: null });
  };

  const handlePriceChange = useCallback(
    (min: number | null, max: number | null) => {
      updateFilter({
        minPrice: min != null ? String(min) : null,
        maxPrice: max != null ? String(max) : null,
      });
    },
    [updateFilter],
  );

  return (
    <aside className="w-full shrink-0 lg:w-[280px]">
      <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-heading text-xl font-semibold text-brown">
            Filters
          </h2>
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm font-medium text-dark-pink hover:underline"
          >
            Clear all
          </button>
        </div>

        {showSidebarSearch && (
          <div className="mt-5">
            <Suspense fallback={null}>
              <FilterSidebarSearch />
            </Suspense>
          </div>
        )}

        <section className={showSidebarSearch ? "mt-6" : "mt-5"}>
          <h3 className="text-sm font-semibold text-brown">Category</h3>
          <div className="mt-3">
            <CategoryTreeFilter
              categories={categories}
              categoryCounts={categoryCounts}
              selectedCategoryId={filters.categoryId}
              onSelect={selectCategory}
            />
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-sm font-semibold text-brown">Price Range</h3>
          <div className="mt-3 space-y-4">
            <PriceRangePresets
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onSelect={handlePriceChange}
            />
            <PriceRangeSlider
              bounds={priceBounds}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onDebouncedChange={handlePriceChange}
            />
          </div>
        </section>

        <section className="mt-6 flex items-center justify-between border-t border-border/80 pt-5">
          <Label htmlFor="in-stock-only" className="text-sm font-medium text-brown">
            In Stock Only
          </Label>
          <Switch
            id="in-stock-only"
            checked={filters.inStock === true}
            onCheckedChange={(checked) =>
              updateFilter({ inStock: checked ? "true" : null })
            }
          />
        </section>
      </div>
    </aside>
  );
}
