"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingCart, Heart, ArrowLeft, Loader2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/types";

function formatPrice(price: number) {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export default function WishlistPage() {
  const { items, isLoading, toggle } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item: (typeof items)[0]) => {
    const product = item.product;
    const cartItem: CartItem = {
      id: "",
      productId: product.id,
      name: product.name,
      basePrice: product.basePrice,
      discountPrice: product.discountPrice ?? undefined,
      quantity: 1,
      image: product.images?.[0]?.imageUrl ?? "/Logo Mamabear.png",
    };
    addItem(cartItem);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="p-2 rounded-full hover:bg-gray-200 transition"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              Wishlist Saya
              <span className="text-base font-normal text-gray-400">
                ({items.length})
              </span>
            </h1>
          </div>

          {items.length > 0 && (
            <p className="text-sm text-gray-400">
              {items.length} produk tersimpan
            </p>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              Wishlist kamu kosong
            </h2>
            <p className="text-gray-400 mb-6">
              Simpan produk yang kamu suka untuk dibeli nanti
            </p>
            <Link
              href="/products"
              className="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
            >
              Lihat Produk
            </Link>
          </div>
        )}

        {/* Wishlist Grid */}
        {items.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((item) => {
              const product = item.product;
              const price = product.discountPrice ?? product.basePrice;
              const hasDiscount =
                product.discountPrice != null &&
                product.discountPrice < product.basePrice;
              const imgSrc =
                product.images?.[0]?.imageUrl ?? "/Logo Mamabear.png";
              const isOutOfStock = product.status !== "active";

              return (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl shadow flex gap-4 hover:shadow-md transition"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="shrink-0"
                  >
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={imgSrc}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${product.slug}`}>
                      <h2 className="font-semibold text-gray-900 hover:text-pink-600 transition truncate">
                        {product.name}
                      </h2>
                    </Link>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-bold text-gray-900">
                        {formatPrice(price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm line-through text-gray-400">
                          {formatPrice(product.basePrice)}
                        </span>
                      )}
                    </div>

                    {isOutOfStock && (
                      <span className="text-xs text-red-500 mt-1 block">
                        Stok habis
                      </span>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={isOutOfStock}
                        className="flex items-center gap-1.5 bg-pink-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Keranjang
                      </button>

                      <button
                        onClick={() => toggle(item.productId, product.name)}
                        className="flex items-center gap-1.5 text-red-500 border border-red-200 px-3 py-1.5 rounded-lg text-sm hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer CTA */}
        {items.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/products"
              className="text-sm text-pink-600 hover:underline"
            >
              ← Lanjut belanja
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}