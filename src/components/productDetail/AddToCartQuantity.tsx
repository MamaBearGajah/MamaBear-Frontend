"use client"

import {useState, useEffect, React} from 'react';
import {useCart} from '@/hooks/useCart';
import { CartItem } from '@/types';
import {Product} from '@/types/index';
import { ProductVariant } from '@/types';

export default function AddToCartQuantity({price, product, variant}:{price:number, product: Product, variant: ProductVariant | null}){
    const [Quantity, setQuantity] = useState(1);
    const { addItem, state, updateQuantity, itemCount, setGuestCartId, clearCart} = useCart();

    function AddToFavourite(){
        console.log("add to favourite")
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
                quantity: Quantity,
                name: product.name,
                basePrice: Number(variant.basePrice ?? product.basePrice),
                discountPrice: variant.discountPrice ? Number(variant.discountPrice) : product.discountPrice ? Number(product.discountPrice) : undefined,
                image: variant.imageUrl ?? (product.images?.[0]?.imageUrl ?? '/Logo Mamabear.png'),
            };
        addItem(newItem);
    }
    return(
        <div>
            <div className='flex justify-start items-center w-full'>
                <div className='flex w-[25%] md:w-[25%] justify-center items-center border border-gray-300 rounded-full p-2'>
                    <span className="border-r text-center p-1 w-[1  0%] md:w-[20%] cursor-pointer text-center hover:scale-102 transition duration-300" onClick={() => {
                            if(Quantity>1){
                                setQuantity(Quantity-1)
                            }else if(Quantity===0){
                                return
                            }
                        }
                    }
                    >
                        -
                    </span>
                    <span className='md:w-[50%] w-[50%] text-center'>{Quantity}</span>
                    <span className="border-l text-center p-1 w-[30%] md:w-[20%] cursor-pointer text-center hover:scale-102 transition duration-300" onClick={() => 
                        setQuantity(Quantity+1)
                        }
                        >
                            +
                    </span>
                </div>
                <div onClick={handleAddToCart} className='p-3 w-[55%] md:w-[60%] ml-3 flex justify-center items-center cursor-pointer hover:shadow-lg duration transition-300 rounded-full bg-[var(--mamabear-dark-pink)] text-white'>
                        <img className='w-[20px]' src="/cart.svg"/>Add To Cart
                </div>
                <div className='border ml-3 rounded-full cursor-pointer p-3 hover:shadow-lg transition duration-300' onClick={AddToFavourite}>
                        <img className='w-[20px]' src="/heart.svg"></img>
                </div>
            </div>
            <br></br>
            <div className='text-[var(--mamabear-dark-pink)] font-bold border border-2 border-black rounded-full w-full pt-2 pb-2 hover:bg-gray-300 flex justify-center items-center'>
                Buy Now - Rp {Quantity * price}
            </div>
        </div>
    )
}