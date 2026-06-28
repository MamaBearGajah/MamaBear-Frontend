"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  Loader2,
  RotateCcw,
  Shield,
  Trash2,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { wishlistApi } from "@/lib/api/wishlist";
import { setWishlist } from "@/lib/wishlist";
import { resolveProductImageUrl } from "@/lib/images/resolve-product-image";
import { formatPrice } from "@/lib/utils";

type WishlistProduct = {
  id: string;
  name: string;
  slug: string;
  basePrice: string | number;
  discountPrice: string | number | null;
  status: string;
  stock?: number;
  images: { imageUrl: string; altText: string }[];
};

type WishlistItem = {
  id: string;
  productId: string;
  addedAt: string;
  product: WishlistProduct;
};

function toNumber(value: string | number | null | undefined): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function effectiveWishlistPrice(product: WishlistProduct): number {
  const discount = toNumber(product.discountPrice);
  if (discount > 0) return discount;
  return toNumber(product.basePrice);
}

const PAGE_BG = "#FFF5F8";
const BROWN = "#6C4735";
const MUTED = "#8B6352";
const PINK = "#D5557E";
const BORDER = "#FACBD8";

export default function WishlistPageContent() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await wishlistApi.getAll();
      const raw = data?.data ?? data;
      const wishlistItems: WishlistItem[] = Array.isArray(raw?.items) ? raw.items : [];
      setItems(wishlistItems);
    } catch {
      toast.error("Failed to load wishlist");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);



  useEffect(() => {
    void Promise.resolve().then(() => loadWishlist());
  }, [loadWishlist]);

  const handleDelete = async (productId: string) => {
    try {
      await wishlistApi.remove(productId);
      setItems((prev) => {
        const updated = prev.filter((item) => item.productId !== productId);
        setWishlist(updated.map((item) => item.productId));
        return updated;
      });
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleClearAll = async () => {
    try {
      await Promise.all(items.map((item) => wishlistApi.remove(item.productId)));
      setItems([]);
      setWishlist([]);
      toast.success("Wishlist cleared");
    } catch {
      toast.error("Failed to clear wishlist");
    }
  };

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: PAGE_BG }}
      >
        <div className="flex items-center gap-2" style={{ color: MUTED }}>
          <Loader2 className="size-5 animate-spin" style={{ color: PINK }} />
          <span>Loading wishlist...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{ backgroundColor: PAGE_BG, fontFamily: "'Urbanist', sans-serif" }}
      >
        <div className="w-full max-w-md rounded-3xl border border-pink-100 bg-white p-10 text-center shadow-sm">
          <Heart size={42} className="mx-auto mb-4" style={{ color: PINK }} fill={PINK} />
          <h1 className="mb-3 text-3xl font-black" style={{ color: BROWN }}>
            Your Wishlist is Empty
          </h1>
          <p className="mb-6 text-sm" style={{ color: MUTED }}>
            Save items you love and come back to them anytime.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white transition hover:scale-105"
            style={{ backgroundColor: PINK }}
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ backgroundColor: PAGE_BG, fontFamily: "'Urbanist', sans-serif" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs" style={{ color: MUTED }}>
          <Link href="/" className="hover:text-pink-600">Home</Link>
          <ChevronRight size={12} />
          <span style={{ color: PINK }}>Wishlist</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-black" style={{ color: BROWN }}>
            My Wishlist
          </h1>
          <p className="text-sm" style={{ color: MUTED }}>
            {items.length} item{items.length !== 1 ? "s" : ""} saved for later
          </p>
        </div>

        {/* Trust badges */}
        <div className="mb-8 grid gap-3 md:grid-cols-3">
          {[
            { icon: Truck, text: "Free shipping for orders > Rp 200K" },
            { icon: Shield, text: "Secure payment guaranteed" },
            { icon: RotateCcw, text: "7-day return & exchange" },
          ].map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-2.5 rounded-xl border bg-white p-3 text-xs"
              style={{ borderColor: BORDER, color: MUTED }}
            >
              <badge.icon size={16} style={{ color: PINK }} className="shrink-0" />
              {badge.text}
            </div>
          ))}
        </div>

        {/* Product list */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-100 px-5 py-4">
              <h2 className="text-[15px] font-bold" style={{ color: BROWN }}>
                Saved Products
              </h2>
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 text-sm font-medium transition hover:opacity-80"
                style={{ color: PINK }}
              >
                <Trash2 size={16} />
                Clear All
              </button>
            </div>

            <div className="divide-y divide-pink-50 px-5">
              {items.map((item) => {
                const { product } = item;
                const price = effectiveWishlistPrice(product);
                const imageUrl = resolveProductImageUrl(product.images?.[0]?.imageUrl);
                const outOfStock = (product.stock ?? 1) <= 0;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"
                  >
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-pink-100"
                    >
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${product.slug}`}
                        className="line-clamp-2 text-[15px] font-bold transition hover:opacity-80"
                        style={{ color: BROWN }}
                      >
                        {product.name}
                      </Link>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-lg font-black" style={{ color: PINK }}>
                          {formatPrice(price)}
                        </p>
                        {toNumber(product.discountPrice) > 0 && (
                          <p className="text-sm text-gray-400 line-through">
                            {formatPrice(toNumber(product.basePrice))}
                          </p>
                        )}
                      </div>
                      {outOfStock && (
                        <p className="mt-1 text-xs font-medium text-red-500">Out of stock</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 sm:shrink-0">
                      <Link
                        href={`/products/${product.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                        style={{ backgroundColor: PINK }}
                      >
                        <ExternalLink size={16} />
                        View Product
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.productId)}
                        className="inline-flex items-center gap-1.5 rounded-2xl border px-4 py-2 text-sm font-medium transition hover:bg-[#FFF5F8]"
                        style={{ borderColor: BORDER, color: PINK }}
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-1 pt-1">
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold transition hover:underline"
              style={{ color: PINK }}
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
