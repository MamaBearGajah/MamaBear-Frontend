"use client";

import * as React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCategory } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "@/components/product/ProductFilters";

type ProductFilterDrawerProps = {
  categories: ProductCategory[];
  total: number;
};

export function ProductFilterDrawer({
  categories,
  total,
}: ProductFilterDrawerProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-11 rounded-full border-[var(--mamabear-dark-pink)] bg-white px-4 text-sm font-extrabold text-[var(--mamabear-dark-pink)] hover:bg-[#FFF5F8] lg:hidden"
      >
        <SlidersHorizontal className="h-5 w-5" />
        Filters
      </Button>

      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            aria-label="Close filter overlay"
            className="absolute inset-0 bg-black/55"
            onClick={() => setOpen(false)}
          />

          <aside className="absolute right-0 top-0 h-full w-[86%] max-w-[420px] overflow-y-auto rounded-l-[1.75rem] bg-white px-5 py-6 shadow-2xl">
            <div className="mb-7 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-extrabold text-[var(--mamabear-brown)] min-[425px]:text-3xl">
                Filters
              </h2>

              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--mamabear-brown)] transition hover:bg-[#FFF5F8]"
              >
                <X className="h-6 w-6 min-[425px]:h-7 min-[425px]:w-7" />
              </button>
            </div>

            <ProductFilters
              categories={categories}
              resultCount={total}
              variant="drawer"
              onShowResults={() => setOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}