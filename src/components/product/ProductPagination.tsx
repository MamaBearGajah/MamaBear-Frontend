"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type ProductPaginationProps = {
  page: number;
  totalPages: number;
};

function getPages(page: number, totalPages: number) {
  const pages = new Set<number>();

  pages.add(1);
  pages.add(totalPages);
  pages.add(page);
  pages.add(page - 1);
  pages.add(page + 1);

  return Array.from(pages)
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b);
}

export function ProductPagination({
  page,
  totalPages,
}: ProductPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));

    router.push(`${pathname}?${params.toString()}`);
    router.refresh();
  }

  if (totalPages <= 1) return null;

  const pages = getPages(page, totalPages);

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-3 pt-8"
      aria-label="Product pagination"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => goToPage(page - 1)}
        className={cn(
          "h-12 rounded-full border-2 px-6 text-base font-extrabold transition-all",
          "border-[var(--mamabear-brown)] text-[var(--mamabear-brown)] hover:bg-[#FFF5F8]",
          "disabled:border-[#B7A29A] disabled:bg-white disabled:text-[#B7A29A] disabled:opacity-70 disabled:hover:bg-white"
        )}
      >
        Prev
      </button>

      {pages.map((item, index) => {
        const previous = pages[index - 1];
        const showDots = previous && item - previous > 1;
        const isActive = item === page;

        return (
          <div key={item} className="flex items-center gap-3">
            {showDots && (
              <span className="px-1 text-sm font-extrabold text-[var(--mamabear-brown)]">
                ...
              </span>
            )}

            <button
              type="button"
              onClick={() => goToPage(item)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "h-12 min-w-12 rounded-full border-2 px-4 text-base font-extrabold transition-all",
                isActive
                  ? "border-[var(--mamabear-dark-pink)] bg-[var(--mamabear-dark-pink)] text-white shadow-[0_10px_24px_rgba(213,85,126,0.28)] hover:bg-[#BF466E]"
                  : "border-[var(--mamabear-brown)] bg-white text-[var(--mamabear-brown)] hover:border-[var(--mamabear-dark-pink)] hover:bg-[#FFF5F8] hover:text-[var(--mamabear-dark-pink)]"
              )}
            >
              {item}
            </button>
          </div>
        );
      })}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => goToPage(page + 1)}
        className={cn(
          "h-12 rounded-full border-2 px-6 text-base font-extrabold transition-all",
          page >= totalPages
            ? "border-[#B7A29A] bg-white text-[#B7A29A] opacity-70"
            : "border-[var(--mamabear-brown)] bg-white text-[var(--mamabear-brown)] hover:border-[var(--mamabear-dark-pink)] hover:bg-[#FFF5F8] hover:text-[var(--mamabear-dark-pink)]"
        )}
      >
        Next
      </button>
    </nav>
  );
}