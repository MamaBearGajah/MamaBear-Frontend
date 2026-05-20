"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseShopListParams } from "@/lib/shop/product-list-params";

type FilterUpdate = Record<string, string | null | undefined>;

export function useShopFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = parseShopListParams(searchParams);

  const updateFilter = useCallback(
    (updates: FilterUpdate, options?: { resetPage?: boolean }) => {
      const params = new URLSearchParams(searchParams.toString());
      const resetPage = options?.resetPage !== false;

      if (resetPage) {
        params.delete("page");
      }

      for (const [key, value] of Object.entries(updates)) {
        if (value == null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      // On /search, keep q unless this update explicitly clears it
      if (pathname.startsWith("/search") && !("q" in updates)) {
        const existingQ = searchParams.get("q")?.trim();
        if (existingQ) params.set("q", existingQ);
      }

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  /** Clears filters; keeps sort (and view). On /search keeps q from header. */
  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (pathname.startsWith("/search") && filters.q?.trim()) {
      params.set("q", filters.q.trim());
    }

    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");
    const view = searchParams.get("view");
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    if (view) params.set("view", view);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [filters.q, pathname, router, searchParams]);

  return { filters, updateFilter, clearAllFilters, searchParams };
}
