"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/types";
import { Product } from "@/types/index";
import { ProductVariant } from "@/types";

interface AddToCartQuantityProps {
  price: number;
  product: Product;
  variant?: ProductVariant | null;
}

export default function AddToCartQuantity({
  price,
  product,
  variant,
}: AddToCartQuantityProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  function AddToFavourite() {
    console.log("add to favourite");
  }

  const handleAddToCart = () => {
    if (!variant) {
      alert("please select a variant!");
      return;
    }
    const newItem: CartItem = {
      id: `temp-id-${Date.now()}`,
      productId: product.id,
      variantId: variant.id,
      categoryName: product.category?.name,
      variantName: variant.name,
      variantValue: variant.value,
      variantLabel:
        variant.name && variant.value
          ? `${variant.name}: ${variant.value}`
          : (variant.name ?? variant.value),
      quantity: quantity,
      name: product.name,
      basePrice: Number(variant.basePrice ?? product.basePrice),
      discountPrice: variant.discountPrice
        ? Number(variant.discountPrice)
        : product.discountPrice
          ? Number(product.discountPrice)
          : undefined,
      image:
        variant.imageUrl ??
        product.images?.[0]?.imageUrl ??
        "/Logo Mamabear.png",
    };
    addItem(newItem);
  };
  return (
    <div>
      <div className="flex w-full items-center justify-start">
        <div className="flex w-[25%] items-center justify-center rounded-full border border-gray-300 p-2 md:w-[25%]">
          <span
            className="w-[1 0%] cursor-pointer border-r p-1 text-center transition duration-300 hover:scale-102 md:w-[20%]"
            onClick={() => {
              if (quantity > 1) {
                setQuantity(quantity - 1);
              } else if (quantity === 0) {
                return;
              }
            }}
          >
            -
          </span>
          <span className="w-[50%] text-center md:w-[50%]">{quantity}</span>
          <span
            className="w-[30%] cursor-pointer border-l p-1 text-center transition duration-300 hover:scale-102 md:w-[20%]"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </span>
        </div>
        <div
          onClick={handleAddToCart}
          className="duration transition-300 ml-3 flex w-[55%] cursor-pointer items-center justify-center rounded-full bg-[var(--mamabear-dark-pink)] p-3 text-white hover:shadow-lg md:w-[60%]"
        >
          <img className="w-[20px]" src="/cart.svg" />
          Add To Cart
        </div>
        <div
          className="ml-3 cursor-pointer rounded-full border p-3 transition duration-300 hover:shadow-lg"
          onClick={AddToFavourite}
        >
          <img className="w-[20px]" src="/heart.svg"></img>
        </div>
      </div>
      <br></br>
      <div className="flex w-full items-center justify-center rounded-full border border-2 border-black pt-2 pb-2 font-bold text-[var(--mamabear-dark-pink)] hover:bg-gray-300">
        Buy Now - Rp {quantity * price}
      </div>
    </div>
  );
}
