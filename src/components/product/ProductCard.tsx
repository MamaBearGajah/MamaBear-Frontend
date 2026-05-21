"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/skeleton";
import { cn, formatPrice } from "@/lib/utils";

const ProductGallery = dynamic(() => import("./ProductGallery"), {
  ssr: false,
  loading: () => (
    <Skeleton className="aspect-[1.08/1] rounded-b-none rounded-t-[1.5rem]" />
  ),
});

type ProductCardProps = {
  product: Product;
  className?: string;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
};

function getDiscountPercentage(price: number, discountPrice?: number | null) {
  if (!discountPrice || discountPrice >= price) return null;
  return Math.round(((price - discountPrice) / price) * 100);
}

function getEffectivePrice(product: Product) {
  return product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;
}

export function ProductCard({
  product,
  className,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const discountPercentage = getDiscountPercentage(
    product.price,
    product.discountPrice
  );

  const effectivePrice = getEffectivePrice(product);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const visibleFlavors = product.flavors?.slice(0, 3) ?? [];
  const hiddenFlavorCount = Math.max((product.flavors?.length ?? 0) - 3, 0);

  return (
    <article
  className={cn(
    "group overflow-hidden rounded-[1.25rem] border border-[#F6CEDA] bg-white shadow-[0_8px_22px_rgba(213,85,126,0.10)] transition-all duration-300 min-[425px]:rounded-[1.5rem]",
    "hover:-translate-y-1 hover:border-[var(--mamabear-light-pink)] hover:shadow-[0_18px_36px_rgba(213,85,126,0.20)]",
    className
  )}
>
      <div className="relative">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <ProductGallery
            images={product.images}
            productName={product.name}
            className="aspect-square rounded-t-[1.25rem] min-[425px]:aspect-[1.08/1] min-[425px]:rounded-t-[1.5rem]"
          />
        </Link>

        <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5 min-[425px]:left-4 min-[425px]:top-4 min-[425px]:gap-2">
          {product.badgeLabel && (
            <span className="rounded-full bg-[var(--mamabear-dark-pink)] px-3 py-1 text-[10px] font-extrabold text-white shadow-sm min-[425px]:px-4 min-[425px]:py-1.5 min-[425px]:text-xs">
              {product.badgeLabel}
            </span>
          )}

          {product.isBestSeller && !product.badgeLabel && (
            <span className="rounded-full bg-[var(--mamabear-dark-pink)] px-3 py-1 text-[10px] font-extrabold text-white shadow-sm min-[425px]:px-4 min-[425px]:py-1.5 min-[425px]:text-xs">
              Best Seller
            </span>
          )}

          {product.isNew && !product.badgeLabel && (
            <span className="rounded-full bg-[var(--mamabear-dark-pink)] px-3 py-1 text-[10px] font-extrabold text-white shadow-sm min-[425px]:px-4 min-[425px]:py-1.5 min-[425px]:text-xs">
              New
            </span>
          )}

          {discountPercentage && (
            <span className="rounded-full bg-[#FF2B3A] px-4 py-1.5 text-xs font-extrabold text-white shadow-sm">
              -{discountPercentage}%
            </span>
          )}

          {isOutOfStock && (
            <span className="rounded-full bg-[var(--mamabear-brown)] px-4 py-1.5 text-xs font-extrabold text-white shadow-sm">
              Habis
            </span>
          )}

          {!isOutOfStock && isLowStock && (
            <span className="rounded-full bg-[#FFF1B8] px-4 py-1.5 text-xs font-extrabold text-[#C45B00] shadow-sm">
              Low Stock
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onToggleWishlist?.(product)}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#98A2B3] shadow-[0_8px_20px_rgba(0,0,0,0.14)] transition hover:text-[var(--mamabear-dark-pink)] min-[425px]:right-4 min-[425px]:top-4 min-[425px]:h-11 min-[425px]:w-11"
          aria-label="Add to wishlist"
        >
          <Heart className="h-4 w-4 min-[425px]:h-5 min-[425px]:w-5" />
        </button>

        <div className="absolute inset-x-6 bottom-5 z-10 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            className="h-11 w-full rounded-full bg-[var(--mamabear-dark-pink)] text-sm font-extrabold text-white shadow-lg hover:bg-[#BF466E]"
            disabled={isOutOfStock}
            onClick={() => onAddToCart?.(product)}
          >
            <ShoppingCart className="h-4 w-4" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>

      <div className="space-y-2 p-3 min-[425px]:p-4 sm:p-5">
        <Link
          href={`/product?categories=${product.category.slug}`}
          className="inline-block text-xs font-extrabold text-[var(--mamabear-dark-pink)] transition hover:text-[#BF466E] min-[425px]:text-sm"
        >
          {product.category.name}
        </Link>

        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[38px] font-heading text-sm font-extrabold leading-snug text-[var(--mamabear-brown)] transition hover:text-[var(--mamabear-dark-pink)] min-[425px]:min-h-[44px] min-[425px]:text-base sm:min-h-[48px] sm:text-lg">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          {product.averageRating && product.reviewCount ? (
            <>
              <span className="text-sm leading-none text-[#F6A400] min-[425px]:text-base">
  ★★★★★
</span>
<span className="text-xs font-semibold text-[#667085] min-[425px]:text-sm">
  {product.averageRating.toFixed(1)} ({product.reviewCount})
</span>
            </>
          ) : (
            <span className="text-sm font-semibold text-[#98A2B3]">
              Belum ada ulasan
            </span>
          )}
        </div>

        {visibleFlavors.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleFlavors.map((flavor) => (
              <span
                key={flavor.id}
                className="rounded-full bg-[var(--mamabear-light-pink)] px-2.5 py-1 text-[11px] font-semibold text-[var(--mamabear-brown)] min-[425px]:px-3 min-[425px]:text-xs"
              >
                {flavor.name}
              </span>
            ))}

            {hiddenFlavorCount > 0 && (
              <span className="text-sm font-semibold text-[#98A2B3]">
                +{hiddenFlavorCount} more
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-end gap-2 pt-1">
          <span className="font-heading text-base font-extrabold text-[var(--mamabear-brown)] min-[425px]:text-lg sm:text-xl">
  {formatPrice(effectivePrice)}
</span>

          {product.discountPrice && product.discountPrice < product.price && (
            <span className="text-xs font-semibold text-[#98A2B3] line-through min-[425px]:text-sm">
  {formatPrice(product.price)}
</span>
          )}
        </div>
      </div>
    </article>
  );
}