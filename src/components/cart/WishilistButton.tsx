"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import {
  WISHLIST_CHANGED_EVENT,
  getWishlist,
  isWishlisted,
  setWishlist,
} from "@/lib/wishlist";
import { wishlistApi } from "@/lib/api/wishlist";
import { cn } from "@/lib/utils";

type WishlistButtonProps = {
  productId: string;
  className?: string;
  variant?: "default" | "overlay";
};

export default function WishlistButton({
  productId,
  className,
  variant = "default",
}: WishlistButtonProps) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setLiked(isWishlisted(productId));
    });

    const handleChange = () => {
      setLiked(isWishlisted(productId));
    };

    window.addEventListener(WISHLIST_CHANGED_EVENT, handleChange);
    return () => window.removeEventListener(WISHLIST_CHANGED_EVENT, handleChange);
  }, [productId]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const previous = getWishlist();
    const wasLiked = previous.includes(productId);
    const updated = wasLiked
      ? previous.filter((id) => id !== productId)
      : Array.from(new Set([...previous, productId]));
    const isNowLiked = !wasLiked;
    setLiked(isNowLiked);

    void (async () => {
      try {
        if (!wasLiked) {
          await wishlistApi.create({ productId });
        } else {
          await wishlistApi.remove(productId);
        }

        setWishlist(updated);
      } catch {
        setWishlist(previous);
        setLiked(previous.includes(productId));
        toast.error("Failed to update wishlist");
      }
    })();

    toast.success(
      isNowLiked ? "Added to wishlist" : "Removed from wishlist",
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={liked}
      className={cn(
        variant === "overlay"
          ? "flex size-9 items-center justify-center rounded-full bg-white/95 text-brown shadow-sm transition-colors hover:bg-light-pink hover:text-dark-pink"
          : "rounded-full p-2 transition hover:bg-gray-100",
        liked &&
          (variant === "overlay"
            ? "bg-[#FFDCE7] text-[#D5557E] opacity-100 hover:bg-[#FFCFE0] hover:text-[#C94A73]"
            : "bg-[#FFEAF1] text-[#D5557E] hover:bg-[#FFDCE7]"),
        className,
      )}
    >
      <Heart
        className={cn(
          "transition",
          variant === "overlay" ? "size-4" : "h-5 w-5",
          liked ? "fill-red-500 text-red-500" : "",
        )}
        strokeWidth={1.75}
      />
    </button>
  );
}
