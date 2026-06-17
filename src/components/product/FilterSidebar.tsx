"use client";

import { Suspense, useState } from "react";
import { Funnel, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useShopFilters } from "@/hooks/useShopFilters";
import { DEFAULT_PRICE_BOUNDS } from "@/lib/shop/product-list-params";
import { cn } from "@/lib/utils";
import type { Category, ShopPriceBounds } from "@/types";
import CategoryTreeFilter from "./CategoryTreeFilter";
import FilterSidebarSearch from "./FilterSidebarSearch";
import PriceRangePresets from "./PriceRangePresets";
import PriceRangeSlider from "./PriceRangeSlider";

export type ShopFilterBasePath = "/products" | "/search";

export interface VariantOption {
  name: string;
  value: string;
}

interface FilterSidebarProps {
  categories: Category[];
  categoryCounts: Record<string, number>;
  basePath: ShopFilterBasePath;
  priceBounds?: ShopPriceBounds;
  variantOptions?: VariantOption[];
}

interface FilterPanelProps {
  categories: Category[];
  categoryCounts: Record<string, number>;
  showSidebarSearch: boolean;
  priceBounds: ShopPriceBounds;
  variantOptions?: VariantOption[];
  inStockId?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  onClearAll?: () => void;
}

function FilterPanel({
  categories,
  categoryCounts,
  showSidebarSearch,
  priceBounds,
  variantOptions = [],
  inStockId = "in-stock-only",
  showCloseButton = false,
  onClose,
  onClearAll,
}: FilterPanelProps) {
  const { filters, updateFilter, clearAllFilters } = useShopFilters();

  const selectCategory = (categoryId: string | null) => {
    // Reset variant filter saat ganti kategori supaya tidak stuck
    updateFilter({ categoryId, categoryIds: null, variantName: null, variantValue: null });
  };

  const handlePriceChange = (min: number | null, max: number | null) => {
    updateFilter({
      minPrice: min != null ? String(min) : null,
      maxPrice: max != null ? String(max) : null,
    });
  };

  const handleVariantClick = (name: string, value: string) => {
    const isActive =
      filters.variantName === name && filters.variantValue === value;

    updateFilter({
      variantName:  isActive ? null : name,
      variantValue: isActive ? null : value,
    });
  };

  const handleClearAll = () => {
    clearAllFilters();
    onClearAll?.();
  };

  // Group variants by name untuk tampilan yang lebih rapi
  const groupedVariants = variantOptions.reduce<Record<string, string[]>>(
    (acc, { name, value }) => {
      if (!acc[name]) acc[name] = [];
      if (!acc[name].includes(value)) acc[name].push(value);
      return acc;
    },
    {},
  );

  const hasVariantFilter = !!(filters.variantName || filters.variantValue);

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-heading text-xl font-semibold text-brown">Filters</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm font-medium text-dark-pink hover:underline"
          >
            Clear all
          </button>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md p-1 text-brown hover:bg-light-pink"
              aria-label="Close filters"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {showSidebarSearch && (
        <div className="mt-5">
          <Suspense fallback={null}>
            <FilterSidebarSearch />
          </Suspense>
        </div>
      )}

      {/* Category */}
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

      {/* Price Range */}
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

      {/* Variant Filter — hanya tampil kalau ada data */}
      {Object.keys(groupedVariants).length > 0 && (
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-brown">Variant</h3>
            {hasVariantFilter && (
              <button
                type="button"
                onClick={() => updateFilter({ variantName: null, variantValue: null })}
                className="text-xs text-dark-pink hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-3 space-y-3">
            {Object.entries(groupedVariants).map(([name, values]) => (
              <div key={name}>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">{name}</p>
                <div className="flex flex-wrap gap-1.5">
                  {values.map((value) => {
                    const isActive =
                      filters.variantName === name &&
                      filters.variantValue === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleVariantClick(name, value)}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                          isActive
                            ? "border-dark-pink bg-light-pink text-dark-pink"
                            : "border-border bg-white text-brown hover:border-dark-pink hover:bg-light-pink/50",
                        )}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* In Stock Only */}
      <section className="mt-6 flex items-center justify-between border-t border-border/80 pt-5">
        <Label htmlFor={inStockId} className="text-sm font-medium text-brown">
          In Stock Only
        </Label>
        <Switch
          id={inStockId}
          checked={filters.inStock === true}
          onCheckedChange={(checked) =>
            updateFilter({ inStock: checked ? "true" : null })
          }
        />
      </section>
    </>
  );
}

export default function FilterSidebar({
  categories,
  categoryCounts,
  basePath,
  priceBounds = DEFAULT_PRICE_BOUNDS,
  variantOptions = [],
}: FilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const showSidebarSearch = basePath === "/products";

  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-brown shadow-sm"
          aria-expanded={mobileOpen}
          aria-haspopup="dialog"
        >
          <Funnel className="size-4" />
          Filters
        </button>
      </div>

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-[94vw] max-w-[420px] gap-0 overflow-hidden rounded-2xl border-0 p-0"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <div className="max-h-[85dvh] overflow-y-auto p-5 pb-8">
            <FilterPanel
              categories={categories}
              categoryCounts={categoryCounts}
              showSidebarSearch={showSidebarSearch}
              priceBounds={priceBounds}
              variantOptions={variantOptions}
              inStockId="in-stock-only-mobile"
              showCloseButton
              onClose={() => setMobileOpen(false)}
              onClearAll={() => setMobileOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Desktop sidebar */}
      <aside className="hidden w-[280px] shrink-0 lg:block">
        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-sm">
          <FilterPanel
            categories={categories}
            categoryCounts={categoryCounts}
            showSidebarSearch={showSidebarSearch}
            priceBounds={priceBounds}
            variantOptions={variantOptions}
          />
        </div>
      </aside>
    </>
  );
}