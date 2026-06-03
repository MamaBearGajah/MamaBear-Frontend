import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import Stars from './Stars';
import { useCart } from '@/hooks/useCart';
import { nanoid } from 'nanoid';
import type { CartItem } from '@/types';
import {ProductYouMightLove} from '@/types'

type YouMightAlsoLoveCardProps = {
  product: {
    id?: string;
    name: string;
    avgRating?: number | string | null;
    discountPrice: number;
    images?: { imageUrl: string }[];
    stock?: number;
    slug: string;
    basePrice?: number;
    ratingCount?: number;
  };
};

const YouMightAlsoLoveCard = ({ product }: ProductYouMightLove) => {
  const { addItem } = useCart();
  const imageUrl = product.image ?? '/Logo Mamabear.png';
  const price = product.discountPrice;
  const hasDiscount = product.basePrice != null && product.basePrice > product.discountPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice! - product.discountPrice) / product.basePrice!) * 100)
    : null;
  const rating = typeof product.avgRating === 'number' ? product.avgRating : Number(product.avgRating);
  const isLowStock = (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 20;

  return (
    <article className={cn('group flex overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm transition-shadow hover:shadow-lg', 'flex-col')}>
      <div className={cn('relative shrink-0 overflow-hidden bg-light-pink/30', 'aspect-square w-full rounded-t-2xl')}>
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brown/50 via-brown/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />

        <button type="button" aria-label="Add to wishlist" className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/95 text-brown shadow-sm transition-colors hover:bg-light-pink hover:text-dark-pink">
          <Heart className="size-4" strokeWidth={1.75} />
        </button>

        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {discountPercent != null && (
            <span className="w-fit rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">-{discountPercent}%</span>
          )}
        </div>

        {isLowStock && (
          <span className="absolute bottom-16 left-3 z-10 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-semibold text-brown">Low Stock</span>
        )}

        {((product.stock ?? 0) > 0) && (
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

      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-heading text-base font-semibold text-brown transition-colors group-hover:text-dark-pink">{product.name}</h3>

        {Number.isFinite(rating) && (
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(rating)} />
            <span className="text-xs text-brown">
              {rating.toFixed(1)}
              {product.ratingCount != null && (
                <span className="text-muted-foreground"> ({product.ratingCount})</span>
              )}
            </span>
          </div>
        )}

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-heading text-lg font-bold text-brown">Rp {price.toLocaleString()}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">Rp {product.basePrice?.toLocaleString()}</span>
          )}
        </div>
      </Link>
    </article>
  );
};

export default YouMightAlsoLoveCard;
