"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";
import { useShopFilters } from "@/hooks/useShopFilters";

/** Debounced sidebar search — only used on /products (Phase 2B) */
export default function FilterSidebarSearch() {
  const { filters, updateFilter } = useShopFilters();
  const [query, setQuery] = useState(filters.q ?? "");
  const debouncedQuery = useDebounce(query, 300);

  const urlQ = (filters.q ?? "").trim();
  const syncingFromUrl = useRef(false);

  useEffect(() => {
    syncingFromUrl.current = true;
    setQuery(filters.q ?? "");
  }, [filters.q]);

  useEffect(() => {
    if (syncingFromUrl.current) {
      if (query.trim() === debouncedQuery.trim()) {
        syncingFromUrl.current = false;
      }
      return;
    }

    if (query.trim() !== debouncedQuery.trim()) return;

    const trimmed = debouncedQuery.trim();
    if (trimmed === urlQ) return;

    updateFilter({ q: trimmed || null });
  }, [debouncedQuery, urlQ, query, updateFilter]);

  return (
    <section>
      <Label className="text-sm font-semibold text-brown">Search</Label>
      <div className="relative mt-2">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 rounded-lg border-border bg-white pr-9 pl-9 text-sm text-brown placeholder:text-muted-foreground"
          aria-label="Filter products by keyword"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              updateFilter({ q: null });
            }}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-brown"
            aria-label="Clear filter search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </section>
  );
}
