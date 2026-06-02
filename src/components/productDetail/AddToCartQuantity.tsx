"use client"

import {useState} from 'react';
import {useCart} from '@/hooks/useCart';
import { CartItem } from '@/types';
import {Product} from '@/types/index';


export default function AddToCartQuantity({price,product}:{price:number, product: Product}){
    const [Quantity, setQuantity] = useState(1);
    const { addItem } = useCart();

    function AddToFavourite(){
        console.log("add to favourite")
    }

    const handleAddToCart = () => {
        const newItem: CartItem = {
            id: `temp-id-${Date.now()}`,
            productId: product.id,
            quantity: Quantity,
            name: product.name,
            basePrice: Number(product.basePrice),
            discountPrice: product.discountPrice ? Number(product.discountPrice) : undefined,
            image: product.images[0].imageUrl,
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