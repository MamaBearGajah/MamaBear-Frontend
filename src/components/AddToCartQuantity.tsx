"use client"

import {useState, useEffect, React} from 'react';


export default function AddToCartQuantity({price}:{price:number}){
    const [Quantity, setQuantity] = useState(1);
    return(
        <div>
            <div className='flex justify-start items-center w-full'>
                <div className='flex md:w-[25%] justify-center items-center border border-gray-300 rounded-full p-2'>
                    <span className="border-r text-center p-1" onClick={() => {
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
                    <span className='pl-3 pr-3'>{Quantity}</span>
                    <span className="border-l text-center p-1" onClick={() => 
                        setQuantity(Quantity+1)
                        }
                        >
                            +
                    </span>
                </div>
                <div className='p-3 md:w-[60%] ml-3 flex justify-center items-center rounded-full bg-[var(--mamabear-dark-pink)] text-white'>
                        <img className='w-[20px]' src="/cart.svg"/>Add To Cart
                </div>
                <div className='border ml-3 rounded-full p-3'>
                        <img className='w-[20px]' src="/heart.svg"></img>
                </div>
            </div>
            <br></br>
            <div className='text-[var(--mamabear-dark-pink)] font-bold border border-2 border-black rounded-full w-full pt-2 pb-2 hover:bg-gray-300 flex justify-center items-center'>
                Buy Now - {Quantity * price}
            </div>
        </div>
    )
}