"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  Loader2,
  RotateCcw,
  Shield,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import { nanoid } from "nanoid";
import { toast } from "sonner";

import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { resolveProductImageUrl } from "@/lib/images/resolve-product-image";
import { fetchWishlistProducts } from "@/lib/wishlist/fetch-wishlist-products";
import { effectivePrice, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

const PAGE_BG = "#FFF5F8";
const BROWN = "#6C4735";
const MUTED = "#8B6352";
const PINK = "#D5557E";
const BORDER = "#FACBD8";

export default function WishlistPageContent() {
  const { ids, remove, clear, count } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async (productIds: string[]) => {
    if (productIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const fetched = await fetchWishlistProducts(productIds);
      const ordered = productIds
        .map((id) => fetched.find((product) => product.id === id))
        .filter((product): product is Product => Boolean(product));
      setProducts(ordered);
    } catch {
      toast.error("Failed to load wishlist products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts(ids);
  }, [ids, loadProducts]);

  const handleClearAll = () => {
    clear();
    toast.success("Wishlist cleared");
  };

  const handleRemove = (productId: string) => {
    remove(productId);
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    addItem({
      id: nanoid(),
      productId: product.id,
      quantity: 1,
      name: product.name,
      basePrice: product.basePrice,
      discountPrice: product.discountPrice ?? undefined,
      image: resolveProductImageUrl(product.images?.[0]?.imageUrl),
    });
    toast.success("Added to cart");
  };

  const isEmpty = ids.length === 0;

  if (!loading && isEmpty) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{ backgroundColor: PAGE_BG, fontFamily: "'Urbanist', sans-serif" }}
      >
        <div className="w-full max-w-md rounded-3xl border border-pink-100 bg-white p-10 text-center shadow-sm">
          <Heart size={42} className="mx-auto mb-4 text-[#D5557E]" fill="#D5557E" />
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
        <div
          className="mb-6 flex items-center gap-2 text-xs"
          style={{ color: MUTED }}
        >
          <Link href="/" className="hover:text-pink-600">
            Home
          </Link>
          <ChevronRight size={12} />
          <span style={{ color: PINK }}>Wishlist</span>
        </div>

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-black" style={{ color: BROWN }}>
            My Wishlist
          </h1>
          <p className="text-sm" style={{ color: MUTED }}>
            {count} item{count !== 1 ? "s" : ""} saved for later
          </p>
        </div>

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
              <badge.icon
                size={16}
                style={{ color: PINK }}
                className="shrink-0"
              />
              {badge.text}
            </div>
          ))}
        </div>

        {loading ? (
          <div
            className="flex items-center justify-center gap-2 rounded-3xl border border-pink-100 bg-white py-20 shadow-sm"
            style={{ color: MUTED }}
          >
            <Loader2 className="size-5 animate-spin" style={{ color: PINK }} />
            <span>Loading wishlist...</span>
          </div>
        ) : (
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
                {products.map((product) => {
                  const price = effectivePrice(product);
                  const imageUrl = resolveProductImageUrl(
                    product.images?.[0]?.imageUrl,
                  );
                  const outOfStock = product.stock <= 0;

                  return (
                    <div
                      key={product.id}
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
                        <p
                          className="mt-1 text-lg font-black"
                          style={{ color: PINK }}
                        >
                          {formatPrice(price)}
                        </p>
                        {outOfStock && (
                          <p className="mt-1 text-xs font-medium text-red-500">
                            Out of stock
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 sm:shrink-0">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          disabled={outOfStock}
                          className="inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                          style={{ backgroundColor: PINK }}
                        >
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(product.id)}
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

            {products.length < ids.length && (
              <p className="px-1 text-sm" style={{ color: MUTED }}>
                Some saved items could not be loaded and were skipped.
              </p>
            )}

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
        )}
      </div>
    </div>
  );
}
