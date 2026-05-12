"use client"

import {useState,useEffect, React} from 'react';

import ReviewCard from "./ReviewCard"
import ReviewModal from "./ReviewModal"
import Search from "./Search"
import ProductDetailNav from "./ProductDetailNav"
import USPCard from './USPCard';
import YouMightAlsoLove from './YouMightAlsoLove';

export default function ReviewSection({ productId }: { productId: number }) {
    const [navValue, setnavValue] = useState("Description")
    return(
        <div className='h-[800px] md:h-[700px] w-full flex flex-col justify-start items-start'>
            <ProductDetailNav setParentNavValue={setnavValue}/>
        
                <ReviewCard navValue={navValue} productId={productId}/>
         
            <USPCard/>
            <YouMightAlsoLove/>
            {/* <ReviewModal/> */}
        </div>
    )
    }