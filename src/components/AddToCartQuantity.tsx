"use client"

import {useState, useEffect, React} from 'react';


export default function AddToCartQuantity({price}:{price:number}){
    const [Quantity, setQuantity] = useState(1);
    return(
        <div>
            <div className='flex justify-start items-center'>
                <div className='flex md:w-[20%] justify-center items-center border border-gray-300 rounded-lg p-3'>
                    <span onClick={() => {
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
                    <span>{Quantity}</span>
                    <span onClick={() => 
                        setQuantity(Quantity+1)
                        }
                        >
                            +
                    </span>
                </div>
                <div className='p-3 md:w-[60%] flex justify-start items-center rounded-lg bg-[var(--mamabear-dark-pink)] text-white'>
                        <img className='w-[20px]' src="/cart.svg"/>Add To Cart
                </div>
                <div className='border md:w-[20%] rounded-full p-3'>
                        <img className='w-[20px]' src="/heart.svg"></img>
                </div>
            </div>
            <div className='border rounded-lg w-full hover:bg-gray-300'>
                Buy Now {Quantity * price}
            </div>
        </div>
    )
}