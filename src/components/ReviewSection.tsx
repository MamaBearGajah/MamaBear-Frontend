"use client"

import {useState,useEffect, React} from 'react';

import ReviewCard from "./ReviewCard"
import ReviewModal from "./ReviewModal"
import Search from "./Search"
import ProductDetailNav from "./ProductDetailNav"
export default function ReviewSection() {
    const [navValue, setnavValue] = useState("Description")
    return(
        <div className='h-[20vh] md:h-[40vh] flex flex-col justify-center items-start'>
            <ProductDetailNav setParentNavValue={setnavValue}/>
            {navValue}
            <ReviewCard navValue={navValue}/>
            <ReviewModal/>
        </div>
    )
    }