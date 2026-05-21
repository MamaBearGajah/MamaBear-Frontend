"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Grid2X2, List } from "lucide-react";
import { ProductSort } from "@/types/product";
import { cn } from "@/lib/utils";

type SortBarProps = {
  total: number;
  currentSort: ProductSort;
  className?: string;
  showTitle?: boolean;
};

const sortOptions: Array<{
  label: string;
  value: ProductSort;
}> = [
  {
    label: "Newest First",
    value: "newest",
  },
  {
    label: "Price Low to High",
    value: "price-asc",
  },
  {
    label: "Price High to Low",
    value: "price-desc",
  },
  {
    label: "Highest Rated",
    value: "rating",
  },
  {
    label: "Most Popular",
    value: "popular",
  },
];

export function SortBar({
  total,
  currentSort,
  className,
  showTitle = true,
}: SortBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);

  const selectedOption =
    sortOptions.find((option) => option.value === currentSort) ??
    sortOptions[0];

  function handleSortChange(value: ProductSort) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("sort", value);
    params.set("page", "1");

    setOpen(false);
    router.push(`${pathname}?${params.toString()}`);
    router.refresh();
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      {showTitle && (
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-[var(--mamabear-brown)]">
            All Products
          </h1>

          <p className="mt-1 text-sm font-semibold text-[#8B6352]">
            {total} products found
          </p>
        </div>
      )}

      <div className="flex w-full items-center gap-2 md:w-auto md:gap-3">
        <div className="relative min-w-0 flex-1 md:flex-none">
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="flex h-12 w-full min-w-0 items-center justify-between gap-2 rounded-full border border-[#F3B8CA] bg-white px-4 text-sm font-extrabold text-[var(--mamabear-brown)] shadow-sm transition hover:bg-[#FFF5F8] min-[425px]:h-14 min-[425px]:px-5 min-[425px]:text-base md:h-12 md:min-w-48 md:px-5 md:text-sm"
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span className="truncate">{selectedOption.label}</span>

            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-transform",
                open && "rotate-180"
              )}
            />
          </button>

          {open && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-20 cursor-default"
                aria-label="Close sort dropdown"
                onClick={() => setOpen(false)}
              />

              <div
                className="absolute right-0 top-14 z-30 w-56 overflow-hidden rounded-2xl border border-[#F3B8CA] bg-white p-2 shadow-[0_18px_40px_rgba(213,85,126,0.18)]"
                role="listbox"
              >
                {sortOptions.map((option) => {
                  const selected = option.value === currentSort;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSortChange(option.value)}
                      className={cn(
                        "flex w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition",
                        selected
                          ? "bg-[var(--mamabear-dark-pink)] text-white"
                          : "text-[var(--mamabear-brown)] hover:bg-[#FFF5F8]"
                      )}
                      role="option"
                      aria-selected={selected}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

       <div className="flex shrink-0 overflow-hidden rounded-full border border-[#F3B8CA] bg-white">
  <button
    type="button"
    className="flex h-11 w-11 items-center justify-center bg-[var(--mamabear-dark-pink)] text-white md:h-12 md:w-12"
    aria-label="Grid view"
  >
    <Grid2X2 className="h-5 w-5" />
  </button>

  <button
    type="button"
    className="flex h-11 w-11 items-center justify-center text-[var(--mamabear-brown)] transition hover:bg-[#FFF5F8] md:h-12 md:w-12"
    aria-label="List view"
  >
    <List className="h-5 w-5" />
  </button>
</div>
      </div>
    </div>
  );
}