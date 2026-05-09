"use client"
import {useState, React} from 'react';
import { mockProducts } from '../../lib/MockProducts';

export default function ReviewCard({navValue, productId}:{navValue:string, productId:number}) {
  switch (navValue){
    case "Description":
        return(
        <div className='flex flex-col justify-start items-center'>
            <h2 className='font-bold'>{mockProducts[productId].name}</h2>
          
            {mockProducts[productId].description}
        </div>)
       

    case "Ingredients":
        return(
        <div className=''>
            
        {mockProducts[productId].ingredients}
        </div>)
        
    case "How To Use":
        return(
        <div className='flex flex-col justify-start items-center'>
            
            This is the How To Use
        </div>)
        
      case "Review":
        return(
        <div className='flex flex-col justify-start items-center'>
      
            This is the Review
        </div>)
        
      default:
          return <p>No Content</p>
  }

}
