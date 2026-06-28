"use client";

import WishlistButton from "@/components/cart/WishilistButton";

export default function BestsellerWishlistButton({
  productId,
}: {
  productId: string;
}) {
  return (
    <div className="absolute top-4 right-4 z-20">
      <WishlistButton productId={productId} variant="overlay" />
    </div>
  );
}
