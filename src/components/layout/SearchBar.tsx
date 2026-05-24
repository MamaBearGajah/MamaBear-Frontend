"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { SEARCH_SUGGESTIONS_MIN_LENGTH } from "@/lib/api/search";
import { resolveProductImageUrl } from "@/lib/images/resolve-product-image";
import { cn } from "@/lib/utils";
import type { SearchSuggestion } from "@/types";

/**
 * Header search — navigates to /search with autocomplete (Phase 2F).
 * Sidebar filter search on /products uses FilterSidebarSearch instead.
 */
export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);

  const trimmedQuery = query.trim();
  const showDropdown =
    open && trimmedQuery.length >= SEARCH_SUGGESTIONS_MIN_LENGTH;
  const showViewAll = !loading && suggestions.length > 0;
  const optionCount = suggestions.length + (showViewAll ? 1 : 0);

  const goToSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      setOpen(false);
      setHighlightedIndex(-1);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [router],
  );

  const selectOption = useCallback(
    (index: number) => {
      if (index < 0 || index >= optionCount) return;
      if (index < suggestions.length) {
        goToSearch(suggestions[index].name);
      } else {
        goToSearch(query);
      }
    },
    [goToSearch, optionCount, query, suggestions],
  );

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < SEARCH_SUGGESTIONS_MIN_LENGTH) {
      setSuggestions([]);
      setLoading(false);
      setHighlightedIndex(-1);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/shop/suggestions?q=${encodeURIComponent(trimmed)}`)
      .then((res) => res.json())
      .then((res: { data?: SearchSuggestion[] }) => {
        if (!cancelled) {
          setSuggestions(res.data ?? []);
          setHighlightedIndex(-1);
        }
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(
      `[data-option-index="${highlightedIndex}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (showDropdown && highlightedIndex >= 0) {
        selectOption(highlightedIndex);
      } else {
        goToSearch(query);
      }
      return;
    }

    if (!showDropdown || optionCount === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => (i < optionCount - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => (i > 0 ? i - 1 : optionCount - 1));
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          role="combobox"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="h-10 rounded-full border-border bg-white pr-9 pl-9 text-brown placeholder:text-muted-foreground"
          aria-label="Search products"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            highlightedIndex >= 0
              ? `${listboxId}-option-${highlightedIndex}`
              : undefined
          }
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setHighlightedIndex(-1);
            }}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-brown"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-border bg-white py-1 shadow-lg"
        >
          {loading && (
            <li
              role="presentation"
              className="px-4 py-3 text-sm text-muted-foreground"
            >
              Searching...
            </li>
          )}

          {!loading && suggestions.length === 0 && (
            <li
              role="presentation"
              className="px-4 py-3 text-sm text-muted-foreground"
            >
              No suggestions
            </li>
          )}

          {!loading &&
            suggestions.map((item, index) => {
              const isHighlighted = highlightedIndex === index;
              return (
                <li
                  key={item.id}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={isHighlighted}
                  data-option-index={index}
                >
                  <button
                    type="button"
                    onClick={() => goToSearch(item.name)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-brown",
                      isHighlighted
                        ? "bg-light-pink/70"
                        : "hover:bg-light-pink/50",
                    )}
                  >
                    <Image
                      src={resolveProductImageUrl(item.imageUrl)}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 shrink-0 rounded-md object-cover"
                    />
                    <span className="line-clamp-2">{item.name}</span>
                  </button>
                </li>
              );
            })}

          {showViewAll && (
            <li
              id={`${listboxId}-option-${suggestions.length}`}
              role="option"
              aria-selected={highlightedIndex === suggestions.length}
              data-option-index={suggestions.length}
              className="border-t border-border"
            >
              <button
                type="button"
                onClick={() => goToSearch(query)}
                onMouseEnter={() =>
                  setHighlightedIndex(suggestions.length)
                }
                className={cn(
                  "w-full px-4 py-2.5 text-left text-sm font-medium text-dark-pink",
                  highlightedIndex === suggestions.length
                    ? "bg-light-pink/70"
                    : "hover:bg-light-pink/40",
                )}
              >
                View all results for &ldquo;{trimmedQuery}&rdquo;
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
