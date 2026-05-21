"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { ProductCategory } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ProductFiltersProps = {
  categories: ProductCategory[];
  className?: string;
  variant?: "sidebar" | "drawer";
  resultCount?: number;
  onShowResults?: () => void;
};

const priceRanges = [
  {
    label: "Under Rp 70.000",
    value: "under-70000",
  },
  {
    label: "Rp 70.000 – Rp 100.000",
    value: "70000-100000",
  },
  {
    label: "Rp 100.000 – Rp 150.000",
    value: "100000-150000",
  },
  {
    label: "Above Rp 150.000",
    value: "above-150000",
  },
];

export function ProductFilters({
  categories,
  className,
  variant = "sidebar",
  resultCount,
  onShowResults,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategories =
    searchParams.get("categories")?.split(",").filter(Boolean) ?? [];

  const currentSearch = searchParams.get("search") ?? "";
  const currentPrice = searchParams.get("price") ?? "";
  const inStockOnly = searchParams.get("stock") === "in-stock";

  const [searchValue, setSearchValue] = React.useState(currentSearch);

  React.useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  function updateParams(nextValues: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(nextValues).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    params.set("page", "1");

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
    router.refresh();
  }

  function handleCategoryChange(categorySlug: string) {
    const nextCategories = selectedCategories.includes(categorySlug)
      ? selectedCategories.filter((slug) => slug !== categorySlug)
      : [...selectedCategories, categorySlug];

    updateParams({
      categories: nextCategories.length ? nextCategories.join(",") : null,
    });
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateParams({
      search: searchValue.trim() || null,
    });
  }

  function handlePriceChange(priceValue: string) {
    updateParams({
      price: currentPrice === priceValue ? null : priceValue,
    });
  }

  function handleClearFilters() {
    router.push(pathname);
    router.refresh();
  }

  const activeFilterCount =
    selectedCategories.length +
    Number(Boolean(currentSearch)) +
    Number(Boolean(currentPrice)) +
    Number(inStockOnly);

  const isDrawer = variant === "drawer";

  return (
    <div
      className={cn(
        !isDrawer &&
          "sticky top-24 max-h-[calc(100vh-7rem)] self-start overflow-y-auto rounded-[1.5rem] border border-[#F6CEDA] bg-white p-6 shadow-[0_8px_22px_rgba(213,85,126,0.08)]",
        isDrawer && "space-y-0 bg-white",
        className
      )}
    >
      {!isDrawer && (
        <h2 className="font-heading text-2xl font-extrabold text-[var(--mamabear-brown)]">
          Filters
        </h2>
      )}

      <form onSubmit={handleSearchSubmit} className="mt-6 space-y-3">
        <label className="text-lg font-extrabold text-[var(--mamabear-brown)]">
          Search
        </label>

        <Input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search products..."
          leftIcon={<Search className="h-5 w-5" />}
          className="h-14 rounded-3xl border-[#F3B8CA] text-base focus:border-[var(--mamabear-dark-pink)]"
        />
      </form>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-extrabold text-[var(--mamabear-brown)]">
          Category
        </h3>

        <div className="space-y-3">
          {categories.map((category) => {
            const checked = selectedCategories.includes(category.slug);

            return (
              <label
                key={category.id}
                className="flex cursor-pointer items-center justify-between gap-3 text-base font-semibold text-[var(--mamabear-brown)]"
              >
                <span className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleCategoryChange(category.slug)}
                    className="peer sr-only"
                  />

                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-md border transition",
                      checked
                        ? "border-[var(--mamabear-dark-pink)] bg-[var(--mamabear-dark-pink)]"
                        : "border-[#F3B8CA] bg-white"
                    )}
                  >
                    {checked && (
                      <span className="h-2 w-2 rounded-sm bg-white" />
                    )}
                  </span>

                  {category.name}
                </span>

                {typeof category.productCount === "number" && (
                  <span className="text-sm font-semibold text-[#98A2B3]">
                    ({category.productCount})
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-extrabold text-[var(--mamabear-brown)]">
          Price Range
        </h3>

        <div className="space-y-3">
          {priceRanges.map((range) => {
            const checked = currentPrice === range.value;

            return (
              <label
                key={range.value}
                className="flex cursor-pointer items-center gap-4 text-base font-semibold text-[var(--mamabear-brown)]"
              >
                <input
                  type="radio"
                  name="price"
                  checked={checked}
                  onChange={() => handlePriceChange(range.value)}
                  className="peer sr-only"
                />

                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border transition",
                    checked
                      ? "border-[var(--mamabear-dark-pink)] bg-[var(--mamabear-dark-pink)]"
                      : "border-[#F3B8CA] bg-white"
                  )}
                >
                  {checked && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>

                {range.label}
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-extrabold text-[var(--mamabear-brown)]">
          Availability
        </h3>

        <label className="flex cursor-pointer items-center gap-4 text-base font-semibold text-[var(--mamabear-brown)]">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() =>
              updateParams({
                stock: inStockOnly ? null : "in-stock",
              })
            }
            className="peer sr-only"
          />

          <span
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-md border transition",
              inStockOnly
                ? "border-[var(--mamabear-dark-pink)] bg-[var(--mamabear-dark-pink)]"
                : "border-[#F3B8CA] bg-white"
            )}
          >
            {inStockOnly && <span className="h-2 w-2 rounded-sm bg-white" />}
          </span>

          In Stock Only
        </label>
      </div>

      {activeFilterCount > 0 && !isDrawer && (
        <Button
          type="button"
          variant="outline"
          className="mt-8 w-full rounded-full border-[var(--mamabear-dark-pink)] text-[var(--mamabear-dark-pink)] hover:bg-[#FFF5F8]"
          onClick={handleClearFilters}
        >
          Clear All Filters ({activeFilterCount})
        </Button>
      )}

      {isDrawer && (
        <div className="mt-12 space-y-4">
          <Button
            type="button"
            className="h-16 w-full rounded-full bg-[var(--mamabear-dark-pink)] text-xl font-extrabold text-white hover:bg-[#BF466E]"
            onClick={onShowResults}
          >
            Show {resultCount ?? 0} Results
          </Button>

          {activeFilterCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              className="h-12 w-full rounded-full text-[var(--mamabear-dark-pink)]"
              onClick={handleClearFilters}
            >
              Clear All Filters ({activeFilterCount})
            </Button>
          )}
        </div>
      )}
    </div>
  );
}