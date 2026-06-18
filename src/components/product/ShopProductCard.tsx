import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import StarRating from "./StarRating";
import { cn, effectivePrice, formatPrice } from "@/lib/utils";
import { resolveProductImageUrl } from "@/lib/images/resolve-product-image";
import type { ProductBadgeType, ProductListItem } from "@/types";

const BADGE_LABELS: Record<ProductBadgeType, string> = {
  "best-seller": "Best Seller",
  "fan-favorite": "Fan Favorite",
  new: "New",
};

interface ShopProductCardProps {
  product: ProductListItem;
  categoryName?: string;
  layout?: "grid" | "list";
}

export default function ShopProductCard({
  product,
  categoryName,
  layout = "grid",
}: ShopProductCardProps) {
  const price = effectivePrice(product);
  const hasDiscount =
    product.discountPrice != null && product.discountPrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.basePrice - product.discountPrice!) / product.basePrice) * 100
      )
    : null;
  const imageUrl = resolveProductImageUrl(product.images?.[0]?.imageUrl);
  const rating = product.avgRating ?? 0;
  const isLowStock = product.stock > 0 && product.stock <= 20;
  const tags = product.flavorTags ?? [];
  const visibleTags = tags.slice(0, 3);
  const moreTags = tags.length - visibleTags.length;
  const inStock = product.stock > 0;

  return (
    <article
      className={cn(
        "group border-border/80 flex overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-lg",
        layout === "list" ? "flex-row" : "flex-col"
      )}
    >
      <div
        className={cn(
          "bg-light-pink/30 relative shrink-0 overflow-hidden",
          layout === "list"
            ? "aspect-square w-40 sm:w-48"
            : "aspect-square w-full rounded-t-2xl"
        )}
      >
        <Link
          href={`/products/${product.slug}`}
          className="block h-full w-full"
        >
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        <div
          className="from-brown/50 via-brown/10 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />

        <button
          type="button"
          aria-label="Add to wishlist"
          className="text-brown hover:bg-light-pink hover:text-dark-pink absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition-colors"
        >
          <Heart className="size-4" strokeWidth={1.75} />
        </button>

        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.badge && (
            <span className="bg-dark-pink rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
              {BADGE_LABELS[product.badge]}
            </span>
          )}
          {discountPercent != null && (
            <span className="w-fit rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
              -{discountPercent}%
            </span>
          )}
        </div>

        {isLowStock && (
          <span className="text-brown absolute bottom-16 left-3 z-10 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-semibold">
            Low Stock
          </span>
        )}

        {!inStock && (
          <span className="bg-brown/50 absolute inset-0 z-10 flex items-center justify-center text-sm font-medium text-white">
            Out of Stock
          </span>
        )}

        {inStock && (
          <Link
            href={`/products/${product.slug}`}
            className={cn(
              "bg-dark-pink absolute inset-x-3 bottom-3 z-20 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold text-white shadow-md",
              "translate-y-full opacity-0 transition-all duration-300 ease-out",
              "group-hover:translate-y-0 group-hover:opacity-100",
              "hover:bg-dark-pink/90"
            )}
          >
            <ShoppingCart className="size-4" strokeWidth={2} />
            Buy Now
          </Link>
        )}
      </div>

      <Link
        href={`/products/${product.slug}`}
        className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4"
      >
        {categoryName && (
          <p className="text-dark-pink text-[10px] font-medium sm:text-xs">
            {categoryName}
          </p>
        )}
        <h3 className="text-brown group-hover:text-dark-pink sm:font-heading line-clamp-2 text-[12px] leading-[1.25] font-semibold transition-colors sm:text-base">
          {product.name}
        </h3>

        {rating > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <StarRating rating={rating} />
            <span className="text-brown text-[10px] sm:text-xs">
              {rating.toFixed(1)}
              {product.ratingCount != null && (
                <span className="text-muted-foreground">
                  {" "}
                  ({product.ratingCount})
                </span>
              )}
            </span>
          </div>
        )}

        {visibleTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="bg-light-pink text-brown rounded-full px-1.5 py-0.5 text-[9px] font-medium sm:px-2 sm:text-[10px]"
              >
                {tag}
              </span>
            ))}
            {moreTags > 0 && (
              <span className="text-dark-pink text-[9px] font-medium sm:text-[10px]">
                +{moreTags} more
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-baseline gap-1.5 pt-1 sm:gap-2">
          <span className="text-brown sm:font-heading text-[13px] font-bold sm:text-lg">
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="text-muted-foreground text-[10px] line-through sm:text-sm">
              {formatPrice(product.basePrice)}
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}
