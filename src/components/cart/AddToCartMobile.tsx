"use client"
import {useState, useEffect, React} from 'react';
import Link from "next/link";
import {useCart} from "@/hooks/useCart";
import { CartItem } from "@/types/index";
import {Product} from "@/types/index";
import { nanoid } from 'nanoid';
const AddToCartMobile = ({ productId, product }: { productId: string; product: Product }) => {
  const { addItem, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="flex justify-between items-center md:hidden fixed bottom-0 left-0 right-0 bg-dark-pink p-4 border-t shadow-md cursor-pointer gap-2 z-50 transition duration-300">
      <div className='flex items-center gap-2'>
        <span onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</span>
        <span className='font-bold bg-white text-black p-3 rounded-full'>{quantity}</span>
        <span onClick={() => setQuantity(quantity + 1)}>+</span>
      </div>

      <button
        onClick={() => {
          addItem({
            id: nanoid(),
            productId: product.id,
            name: product.name,
            basePrice: Number(product.basePrice),
            discountPrice: product.discountPrice
              ? Number(product.discountPrice)
              : undefined,
            image: product.images ? product.images[0].imageUrl : '/Logo Mamabear.png',
            quantity: quantity,
          } as CartItem);
          alert("Item added to cart!");
        }}
        className="text-white hover:underline transition duration-300 flex items-center gap-1 cursor-pointer"
      >
        <img src='/cart.svg' className='w-[20px] h-[20px]' alt="Add to Cart" />
        Add To Cart
      </button>
      <Link href="#"><h2 className='text-white hover:underline transition duration-300'>Checkout</h2></Link>
    </div>
  );
};

export default AddToCartMobile;