"use client";

import {useState} from 'react';
import {useCart} from '@/hooks/useCart';
import { CartItem } from '@/types';
import {Product} from '@/types/index';
import { ProductVariant } from '@/types';
import {ShoppingCart} from 'lucide-react';
import { toast } from "sonner";
import WishlistButton from '../cart/WishilistButton';

interface AddToCartQuantityProps {
  price: number;
  product: Product;
  variant?: ProductVariant | null;
}

export default function AddToCartQuantity({ price, product, variant }: AddToCartQuantityProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  function AddToFavourite() {
    console.log("add to favourite");
  }

    const handleAddToCart = () => {
            if(!variant){
                alert('please select a variant!')
                return;
            }
            const newItem: CartItem = {
                id: `temp-id-${Date.now()}`,
                productId: product.id,
                variantId: variant.id,
                variantName: variant.name,
                variantValue: variant.value,
                variantLabel: variant.name && variant.value ? `${variant.name}: ${variant.value}` : variant.name ?? variant.value,
                quantity: quantity,
                name: product.name,
                basePrice: Number(variant.basePrice ?? product.basePrice),
                discountPrice: variant.discountPrice ? Number(variant.discountPrice) : product.discountPrice ? Number(product.discountPrice) : undefined,
                image: variant.imageUrl ?? (product.images?.[0]?.imageUrl ?? '/Logo Mamabear.png'),
            };
        addItem(newItem);
        toast.success('Item added to cart!');
    }

    return(
        <div>
            <div className='flex justify-start items-center w-full'>
                <div className='flex w-[25%] md:w-[25%] justify-center items-center border border-gray-300 rounded-full p-2'>
                    <span className="border-r text-center p-1 w-[1  0%] md:w-[20%] cursor-pointer text-center hover:scale-102 transition duration-300" onClick={() => {
                            if(quantity>1){
                                setQuantity(quantity-1)
                            }else if(quantity===0){
                                return
                            }
                        }
                    }
                    >
                        -
                    </span>
                    <span className='md:w-[50%] w-[50%] text-center'>{quantity}</span>
                    <span className="border-l text-center p-1 w-[30%] md:w-[20%] cursor-pointer text-center hover:scale-102 transition duration-300" onClick={() => 
                        setQuantity(quantity+1)
                        }
                        >
                            +
                    </span>
                </div>
                <div onClick={handleAddToCart} className='p-3 w-[55%] md:w-[60%] ml-3 flex justify-center items-center cursor-pointer hover:shadow-lg duration transition-300 rounded-full bg-[var(--mamabear-dark-pink)] transition-all duration-300 text-white'>
                        <ShoppingCart className='w-[20px] h-[20px] mr-3' />
                        Add To Cart
                </div>
                <div className='border ml-3 rounded-full cursor-pointer p-3 hover:shadow-lg transition transition-all duration-300 duration-300' onClick={AddToFavourite}>
                        {/* <img className='w-[20px]' src="/heart.svg"></img> */}
                        <WishlistButton productId={product.id} />
                </div>
            </div>
        </div>
    )
}
