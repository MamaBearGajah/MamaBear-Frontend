import Link from "next/link";
import { Search } from "lucide-react";

export default function SearchEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center shadow-sm">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-light-pink">
        <Search className="size-7 text-dark-pink" strokeWidth={1.75} />
      </div>
      <h2 className="mt-4 font-heading text-xl font-semibold text-brown">
        Start searching
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-brown/80">
        Type a product name in the search bar at the top of the page, then
        press Enter or pick a suggestion to see results here.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-block text-sm font-medium text-dark-pink hover:underline"
      >
        Browse all products
      </Link>
    </div>
  );
}
