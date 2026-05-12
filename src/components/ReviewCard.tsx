"use client"
import {useState, React} from 'react';
import { mockProducts } from '../../lib/MockProducts';
import USPCard from './USPCard';
import YouMightAlsoLove from './YouMightAlsoLove';

export default function ReviewCard({navValue, productId}:{navValue:string, productId:number}) {
  switch (navValue){
    case "Description":
        return(
        <div className='flex flex-col justify-start items-center md:w-[60%]'>
            <p className="text-left">{mockProducts[productId].name}</p>
          
            <p>{mockProducts[productId].description}</p>
            <USPCard/>
            <YouMightAlsoLove/>
        </div>)
       

    case "Ingredients":
        return(
        <div className='flex flex-col justify-start items-center md:w-[60%]'>
            
        {mockProducts[productId].ingredients}
        <USPCard/>
        <YouMightAlsoLove/>
        </div>)
        
    case "How To Use":
        return(
        <div className='flex flex-col justify-start items-center md:w-[60%]'>
            
            This is the How To Use
            <USPCard/>
            <YouMightAlsoLove/>
        </div>)
        
      case "Review":
        return(
        <div className='flex flex-col justify-start items-center md:w-[60%]'>
      
            This is the Review
            <USPCard/>
            <YouMightAlsoLove/>
        </div>)
        
      default:
          return <p>No Content</p>
  }


}
