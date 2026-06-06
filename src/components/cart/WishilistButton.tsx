"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import {
  toggleWishlist,
  isWishlisted,
} from "@/lib/wishlist";

export default function WishlistButton({
  productId,
}: {
  productId: string;
}) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(isWishlisted(productId));
  }, [productId]);

  const handleClick = () => {
    const updated = toggleWishlist(productId);
    const isNowLiked = updated.includes(productId);

    setLiked(isNowLiked);

    toast.success(
      isNowLiked
        ? "Added to wishlist ❤️"
        : "Removed from wishlist"
    );
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-full p-2 transition hover:bg-gray-100"
    >
      <Heart
        className={`h-5 w-5 transition ${
          liked ? "fill-red-500 text-red-500" : ""
        }`}
      />
    </button>
  );
}