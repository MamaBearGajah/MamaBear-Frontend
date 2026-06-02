"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useShopFilters } from "@/hooks/useShopFilters";
import type { Category } from "@/types";

interface ProductsPageHeaderProps {
  totalItems: number;
  categories: Category[];
}

export default function ProductsPageHeader({
  totalItems,
  categories,
}: ProductsPageHeaderProps) {
  const { filters } = useShopFilters();

  const category =
    filters.categoryId && filters.categoryId !== "cat-root"
      ? categories.find((c) => c.id === filters.categoryId)
      : undefined;

  let resultsText = `${totalItems} product${totalItems === 1 ? "" : "s"} found`;
  if (category) {
    resultsText += ` in ${category.name}`;
  }

  return (
    <header className="mb-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/"
                className="text-dark-pink hover:text-dark-pink/80"
              >
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-dark-pink/50" />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-brown">
              Products
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-3 font-heading text-3xl font-bold text-brown md:text-4xl">
        All Products
      </h1>
      <p className="mt-1 text-sm text-brown/80">{resultsText}</p>
    </header>
  );
}
