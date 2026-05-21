"use client";

import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/shared/emptystate";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="Produk tidak ditemukan"
        description="Coba ubah filter, kategori, harga, atau kata kunci pencarian."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 min-[425px]:gap-4 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={(selectedProduct) => {
            console.log("Add to cart:", selectedProduct);
          }}
          onToggleWishlist={(selectedProduct) => {
            console.log("Toggle wishlist:", selectedProduct);
          }}
        />
      ))}
    </div>
  );
}