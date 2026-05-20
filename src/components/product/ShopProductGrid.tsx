"use client";

import { useSearchParams } from "next/navigation";
import type { Category, ProductListItem } from "@/types";
import ShopProductCard from "./ShopProductCard";

interface ShopProductGridProps {
  products: ProductListItem[];
  categories: Category[];
}

export default function ShopProductGrid({
  products,
  categories,
}: ShopProductGridProps) {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") === "list" ? "list" : "grid";

  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.id, c.name]),
  );

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center shadow-sm">
        <p className="font-heading text-lg text-brown">No products found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your filters or search term.
        </p>
      </div>
    );
  }

  return (
    <ul
      className={
        view === "list"
          ? "flex flex-col gap-4"
          : "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      }
    >
      {products.map((product) => (
        <li key={product.id}>
          <ShopProductCard
            product={product}
            categoryName={
              product.categoryId
                ? categoryMap[product.categoryId]
                : undefined
            }
            layout={view}
          />
        </li>
      ))}
    </ul>
  );
}
