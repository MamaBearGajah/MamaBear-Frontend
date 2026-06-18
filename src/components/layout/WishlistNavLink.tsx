"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

type WishlistNavLinkProps = {
  className?: string;
  iconClassName?: string;
};

export default function WishlistNavLink({
  className,
  iconClassName,
}: WishlistNavLinkProps) {
  const { count } = useWishlist();

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
