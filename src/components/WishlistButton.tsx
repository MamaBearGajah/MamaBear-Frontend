"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  productName?: string;
  className?: string;
  size?: "sm" | "md";
}

/**
 * WishlistButton
 * Terhubung ke WishlistContext (bukan localStorage langsung).
 * - Guest: simpan di localStorage
 * - Login: sync ke BE
 */
export default function WishlistButton({
  productId,
  productName,
  className,
  size = "md",
}: WishlistButtonProps) {
  const { isWishlisted, toggle } = useWishlist();
  const liked = isWishlisted(productId);

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      type="button"
      aria-label={liked ? "Hapus dari wishlist" : "Tambah ke wishlist"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void toggle(productId, productName);
      }}
      className={cn(
        "rounded-full p-2 transition hover:bg-gray-100",
        className
      )}
    >
      <Heart
        className={cn(
          iconSize,
          "transition",
          liked ? "fill-red-500 text-red-500" : "text-gray-400"
        )}
      />
    </button>
  );
}