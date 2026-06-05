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
        ((product.basePrice - product.discountPrice!) / product.basePrice) *
          100,
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
        "group flex overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm transition-shadow hover:shadow-lg",
        layout === "list" ? "flex-row" : "flex-col",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-light-pink/30",
          layout === "list"
            ? "aspect-square w-40 sm:w-48"
            : "aspect-square w-full rounded-t-2xl",
        )}
      >
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brown/50 via-brown/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />

        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/95 text-brown shadow-sm transition-colors hover:bg-light-pink hover:text-dark-pink"
        >
          <Heart className="size-4" strokeWidth={1.75} />
        </button>

        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.badge && (
            <span className="rounded-full bg-dark-pink px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
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
          <span className="absolute bottom-16 left-3 z-10 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-semibold text-brown">
            Low Stock
          </span>
        )}

        {!inStock && (
          <span className="absolute inset-0 z-10 flex items-center justify-center bg-brown/50 text-sm font-medium text-white">
            Out of Stock
          </span>
        )}

        {inStock && (
          <Link
            href={`/products/${product.slug}`}
            className={cn(
              "absolute inset-x-3 bottom-3 z-20 flex items-center justify-center gap-2 rounded-full bg-dark-pink py-2.5 text-sm font-semibold text-white shadow-md",
              "translate-y-full opacity-0 transition-all duration-300 ease-out",
              "group-hover:translate-y-0 group-hover:opacity-100",
              "hover:bg-dark-pink/90",
            )}
          >
            <ShoppingCart className="size-4" strokeWidth={2} />
            Buy Now
          </Link>
        )}
      </div>

      <Link
        href={`/products/${product.slug}`}
        className="flex flex-1 flex-col gap-2 p-4"
      >
        {categoryName && (
          <p className="text-xs font-medium text-dark-pink">{categoryName}</p>
        )}
        <h3 className="line-clamp-2 font-heading text-base font-semibold text-brown transition-colors group-hover:text-dark-pink">
          {product.name}
        </h3>

        {rating > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={rating} />
            <span className="text-xs text-brown">
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
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-light-pink px-2 py-0.5 text-[10px] font-medium text-brown"
              >
                {tag}
              </span>
            ))}
            {moreTags > 0 && (
              <span className="text-[10px] font-medium text-dark-pink">
                +{moreTags} more
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-heading text-lg font-bold text-brown">
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.basePrice)}
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}