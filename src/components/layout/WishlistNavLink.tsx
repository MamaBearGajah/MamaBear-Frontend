"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

import { WISHLIST_CHANGED_EVENT, getWishlist } from "@/lib/wishlist";
import { cn } from "@/lib/utils";

type WishlistNavLinkProps = {
  className?: string;
  iconClassName?: string;
};

export default function WishlistNavLink({
  className,
  iconClassName,
}: WishlistNavLinkProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const syncCount = () => setCount(getWishlist().length);

    syncCount();

    window.addEventListener(WISHLIST_CHANGED_EVENT, syncCount);
    window.addEventListener("storage", syncCount);

    return () => {
      window.removeEventListener(WISHLIST_CHANGED_EVENT, syncCount);
      window.removeEventListener("storage", syncCount);
    };
  }, []);

  return (
    <Link href="/wishlist" aria-label="Wishlist" className={className}>
      <div className="relative">
        <Heart className={cn("size-5", iconClassName)} strokeWidth={1.75} />
        {count > 0 && (
          <span
            key={count}
            className="absolute -top-1.5 -right-1.5 flex size-4.5 min-w-4.5 animate-[pop_0.2s_ease-out] items-center justify-center rounded-full bg-dark-pink px-0.5 text-[10px] font-bold text-white"
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </div>
    </Link>
  );
}
