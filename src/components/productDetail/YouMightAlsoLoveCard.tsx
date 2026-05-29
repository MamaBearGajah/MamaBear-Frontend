import {React} from 'react';
import Stars from './Stars';
import Link from 'next/link';
import {useCart} from "@/hooks/useCart";
import { nanoid } from 'nanoid';
import { CartItem } from "@/types";

import { Heart, ShoppingCart } from "lucide-react";
import { Product } from '../../types';


// type Product = {
//     name:string;
//     rating:number;
//     slug:string;
//     price:string;
//     imageUrl: string;
//     stock:number;
//     createdAt:string;

// }


const YouMightAlsoLoveCard = ({product}:{product:Product}) => {
    const { addItem} = useCart();
  return (
    <div className='border rounded-lg flex flex-col justify-start p-5 items-start w-[100%] md:w-[80%] hover:shadow-lg transition duration-300 cursor-pointer hover:scale-102'>
      <Link href={`/products/${product.slug}`} className='w-[60%]'>
        <img className='w-[full]'  src="/Logo Mamabear.png"></img>
        <h2 className='mt-2 mb-2 font-bold text-xs md:text-lg'>{product.name}</h2>
        <div className='flex justify-start items-center mt-2 mb-2 md:text-lg text-xs'><Stars rating={3} /><span className='ml-3 md:text-lg text-xs'>{product.rating}</span></div>
        {/* <p>{product.rating}</p> */}
        <p className='mt-2 mb-2 font-bold'>Rp {product.price}</p>
      </Link>
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
              quantity: product.quantity,
            } as CartItem);
            alert("Item added to cart!");
          }}
          className="text-white bg-[var(--mamabear-dark-pink)] p-3 rounded-full hover:underline transition duration-300 flex items-center gap-1 cursor-pointer"
        >
          <img src='/cart.svg' className='w-[20px] h-[20px]' alt="Add to Cart" />
          Add To Cart
        </button>
    </div>
  );
};

export default YouMightAlsoLoveCard;