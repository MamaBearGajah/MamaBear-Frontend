"use client"

import { useState } from "react";
import { getProductId } from "../../server";
import { mockProducts } from "../../lib/MockProducts";
import Stars from "./Stars";

export default function ProductCard({
  productId,
}: {
  productId: number;
})  {
  const [selected, setSelected] = useState<string | null>(null)
  // const fetchedProduct = await getProductId(productId);
  return (
    <div className="bg-white border border-zinc-300 md:flex md:items-start rounded transition-transform duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg">
        <div>
            {/* <img src={fetchedProduct.images[0]}   className="w-[400px]"/> */}
            <img src={mockProducts[0].images[0].imageUrl}   className="w-[400px]"/>
        </div>
        <div className='p-2 rounded-md'>
            {/* <h2>{fetchedProduct.title}</h2>
            <p>{fetchedProduct.price}</p>
            <p>{fetchedProduct.description}</p> */}
            <h4 className='text-xs text-[var(--mamabear-dark-pink)]'>{mockProducts[0].category.name}</h4>
            <h2 className='text-2xl font-bold'>{mockProducts[0].name}</h2>
            <div className='flex justify-start items-center'> <Stars rating={mockProducts[0].rating}/>{mockProducts[0].bestseller ? (<span className='bg-pink-400 rounded-lg p-2 ml-2'>🏆Bestseller</span>) : null}</div>

            <p className='text-[var(--mamabear-dark-pink)] text-4xl font-bold font-[var(--font-quicksand)]'>${mockProducts[0].price}</p>
            <p>In Stock</p>
            <p>{mockProducts[0].description}</p>
            <p>Flavour : <span className='text-[var(--mamabear-dark-pink)] font-bold'>{mockProducts[0].variants[0].value}</span></p>
            <div className='mt-2 mb-2'>
              {
                mockProducts[0].variants.map((item,index) =>{
                  return(
                    <span 
                    key={item.value} 
                    onClick={()=>setSelected(item.value)} 
                    className={
                      `rounded-lg p-2 ml-2 border 
                          ${selected===item.value ? "bg-[var(--mamabear-dark-pink)] text-white" : "bg-white text-black"}
                      `}>
                        {item.value}
                    </span>
                  )
                })
              }
            </div>
            <div>Add To Cart</div>
        </div>

    </div>
  );
}
