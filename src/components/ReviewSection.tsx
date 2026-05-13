"use client"

import {useState,useEffect, React} from 'react';

import ReviewCard from "./ReviewCard"
import ReviewModal from "./ReviewModal"
import Search from "./Search"
import { Product } from '../../types';
import ProductDetailNav from "./ProductDetailNav"
import USPCard from './USPCard';
import YouMightAlsoLove from './YouMightAlsoLove';

export default function ReviewSection({ productId, product }: { productId: number, product: Product }) {
    const [navValue, setnavValue] = useState("Description")
    return(
        <div className='h-[800px] md:h-[800px] w-full flex flex-col justify-start items-start'>
            <ProductDetailNav setParentNavValue={setnavValue}/>
        
                <ReviewCard navValue={navValue} productId={productId} product={product}/>
         
            <USPCard/>
            <YouMightAlsoLove/>
            {/* <ReviewModal/> */}
        </div>
    )
    }