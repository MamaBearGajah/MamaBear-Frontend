"use client"

import {useState,useEffect, React} from 'react';

import ReviewCard from "./ReviewCard"
// import ReviewModal from "../ReviewModal"
import Search from "../Search"
import { Product } from '@/types';
import ProductDetailNav from "./ProductDetailNav"
import USPCard from './USPCard';
import YouMightAlsoLove from './YouMightAlsoLove';

export default function ReviewSection({ productId, product, slicedData }: { productId: string, product: Product, slicedData: Product[] }) {
    const [navValue, setnavValue] = useState("Description")
    return(
        <div className='h-full md:h-full w-full flex flex-col justify-start items-start pt-3 pb-5 gap-5'>
            <ProductDetailNav setParentNavValue={setnavValue}/>
            <ReviewCard navValue={navValue} productId={productId} product={product}/>
            <USPCard/>
            <YouMightAlsoLove product={slicedData}/>
            {/* <ReviewModal/> */}
        </div>
    )
    }