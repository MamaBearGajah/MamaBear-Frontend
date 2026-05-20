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

interface SearchPageHeaderProps {
  totalItems: number;
  categories: Category[];
}

export default function SearchPageHeader({
  totalItems,
  categories,
}: SearchPageHeaderProps) {
  const { filters } = useShopFilters();
  const q = filters.q?.trim() ?? "";

  const category =
    filters.categoryId && filters.categoryId !== "cat-root"
      ? categories.find((c) => c.id === filters.categoryId)
      : undefined;

  let resultsText = `${totalItems} product${totalItems === 1 ? "" : "s"} found`;
  if (category) {
    resultsText += ` in ${category.name}`;
  }

  return (
    <header>
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
              Search
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-3 font-heading text-3xl font-bold text-brown md:text-4xl">
        {q ? (
          <>
            Results for{" "}
            <span className="text-dark-pink">&ldquo;{q}&rdquo;</span>
          </>
        ) : (
          "Search"
        )}
      </h1>
      <p className="mt-1 text-sm text-brown/80">
        {q ? resultsText : "Use the search bar in the header to find products"}
      </p>
    </header>
  );
}
