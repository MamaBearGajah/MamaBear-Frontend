"use client"

import { useState } from "react";
import { getProductId } from "../../server";
import { mockProducts } from "../../lib/MockProducts";
import ProductCarousel from "./ProductCarousel";
import AddToCartQuantity from "./AddToCartQuantity";
import Stars from "./Stars";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function ProductCard({
  productId,
}: {
  productId: number;
})  {
  const [selected, setSelected] = useState<string | null>(null)
  const imageArray = mockProducts[0].images.map((item) => item.imageUrl)
  // const fetchedProduct = await getProductId(productId);
  return (
    <div>
        <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/product">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{mockProducts[0].category.name}</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{mockProducts[0].name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <br></br>
          <hr></hr>
          <br></br>

    <div className="bg-white md:flex md:items-start rounded transition-transform duration-200">

        <div>
            {/* <img src={fetchedProduct.images[0]}   className="w-[400px]"/> */}
            <ProductCarousel images={imageArray}/>
            {/* <img src={mockProducts[0].images[0].imageUrl}   className="w-[400px]"/> */}
        </div>
        <div className='p-2 md:pl-10 rounded-md w-[90%] md:w-[50%] flex flex-col gap-2'>
            {/* <h2>{fetchedProduct.title}</h2>
            <p>{fetchedProduct.price}</p>
            <p>{fetchedProduct.description}</p> */}

            <h4 className='text-xs text-[var(--mamabear-dark-pink)]'>{mockProducts[0].category.name}</h4>
            <h2 className='text-2xl font-bold'>{mockProducts[0].name}</h2>
            <div className='flex justify-start items-center'> <Stars rating={mockProducts[0].rating}/><div className='ml-2 mr-2 md:ml-6 md:mr-6'>(284 reviews)</div>{mockProducts[0].bestseller ? (<span className='bg-pink-300 text-[var(--mamabear-dark-pink)] rounded-full md:pl-4 md:pr-4 pl-5 pr-5 pt-2 pb-2 ml-2'>🏆Bestseller</span>) : null}</div>

            <div className='flex items-end justify-start'><p className='text-[var(--mamabear-dark-pink)] text-4xl font-bold font-[var(--font-quicksand)]'>${mockProducts[0].price}</p><p className='text-xl ml-4 opacity-35'><s>${mockProducts[0].fullprice}</s></p><div className='ml-4 pl-6 pr-6 pt-2 pb-2 font-bold rounded-full bg-[var(--mamabear-dark-pink)] text-[var(--mamabear-light-pink)]'>Save {(((mockProducts[0].fullprice - mockProducts[0].price) / mockProducts[0].fullprice) * 100).toFixed(1)}%</div></div>
            <p>{mockProducts[0].stock>0 ? 
                (
                  <span className="flex items-center gap-1">
                    <img className="w-[20px]" src="/check.svg" alt="check" />
                    In Stock
                  </span>
                ) :
                (
                  <span className="flex items-center gap-1">
                    <img className="w-[20px]" src="/cross.svg" alt="check" />
                    Not Available
                  </span>
                )
              }
            </p>
            <p className='mt-2 mb-2'>{mockProducts[0].description}</p>
            <p>Flavour : <span className='text-[var(--mamabear-dark-pink)] font-bold'>{mockProducts[0].variants[0].value}</span></p>
            <div className='mt-2 mb-2'>
              {
                mockProducts[0].variants.map((item,index) =>{
                  return(
                    <span 
                    key={item.value} 
                    onClick={()=>setSelected(item.value)} 
                    className={
                      `rounded-full pl-8 pr-8 pt-2 pb-2 ml-2 mb-3 mt-3 border 
                          ${selected===item.value ? "bg-[var(--mamabear-dark-pink)] text-white" : "bg-white text-black"}
                          cursor-pointer
                      `}>
                        {item.value}
                    </span>
                  )
                })
              }
              <br></br><br></br>
              <div className='grid grid-cols-2 grid-rows-3 mt-3 border bg-gray-100 rounded-lg p-4 gap-2'>
                <div className='col-start-1 col-end-3 row-start-1 row-end-2 font-bold text-[var(--mamabear-dark-pink)]'>KEY BENEFIT</div>
                <div className='col-start-1 col-end-2 row-start-2 row-end-3'>Affordable Items</div>
                <div className='col-start-2 col-end-3 row-start-2 row-end-3'>High Quality</div>
                <div className='col-start-1 col-end-2 row-start-3 row-end-4'>Many Variants</div>
                <div className='col-start-2 col-end-3 row-start-3 row-end-4'>Nutritious</div>
              </div>
              <br></br>
              <div className='flex justify-start items-center'>
                <img src='/package-svgrepo-com.svg' className='w-[20px]'></img>{mockProducts[0].weight} gram (15 sacks)
              </div>
            </div>
            <div></div>
            <AddToCartQuantity price={mockProducts[0].price}/>
        </div>

    </div>
    </div>
  );
}
