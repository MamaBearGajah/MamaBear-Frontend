"use client"
import {useState, React} from 'react';
import { mockProducts } from '../../lib/MockProducts';
import { Product } from '../../types';
import USPCard from './USPCard';
import YouMightAlsoLove from './YouMightAlsoLove';

export default function ReviewCard({navValue, productId, product}:{navValue:string, productId:number, product: Product}) {
  switch (navValue){
    case "Description":
        return(
        <div className='flex flex-col justify-start items-start mt-2 md:w-[60%] md:h-[400px]'>
            <p className="text-left font-bold">{product.name}</p>
            <br></br>
            <p>{product.description}</p>
            {/* <USPCard/>
            <YouMightAlsoLove/> */}
        </div>)
       

    case "Ingredients":
        return(
        <div className='flex flex-col justify-start items-start md:w-[60%] md:h-[400px]'>
            
        {mockProducts[1].ingredients}
        {/* <USPCard/>
        <YouMightAlsoLove/> */}
        </div>)
        
    case "How To Use":
        return(
        <div className='flex flex-col justify-start items-start md:w-[60%] md:h-[60%]'>
            
            This is the How To Use
            {/* <USPCard/>
            <YouMightAlsoLove/> */}
        </div>)
        
      case "Review":
        return(
        <div className='flex flex-col justify-start items-start md:w-[60%] md:h-[60%]'>
      
            This is the Review
            {/* <USPCard/>
            <YouMightAlsoLove/> */}
        </div>)
        
      default:
          return <p>No Content</p>
  }


}
