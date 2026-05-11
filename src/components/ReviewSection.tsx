"use client"

import {useState,useEffect, React} from 'react';

import ReviewCard from "./ReviewCard"
import ReviewModal from "./ReviewModal"
import Search from "./Search"
import ProductDetailNav from "./ProductDetailNav"
export default function ReviewSection({ productId }: { productId: number }) {
    const [navValue, setnavValue] = useState("Description")
    return(
        <div className='h-[20vh] md:h-full w-full flex flex-col justify-start items-start'>
            <ProductDetailNav setParentNavValue={setnavValue}/>

            <ReviewCard navValue={navValue} productId={productId}/>
            {/* <ReviewModal/> */}
        </div>
    )
    }