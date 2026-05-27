"use client"
import {useState, React, useEffect} from 'react';
import { mockProducts } from '../../lib/MockProducts';
import { Product } from '../../../types';
import USPCard from './USPCard';
import YouMightAlsoLove from '../YouMightAlsoLove';
import {reviewsApi}  from '../../lib/api/reviews';

export default function ReviewCard({navValue, productId, product}:{navValue:string, productId:number, product: Product}) {
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        async function fetchReviews() {
            try {
                const response = await reviewsApi.getList(productId.toString());
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        }
        fetchReviews();
    }, [productId]);

    console.log("reviews", reviews)

  switch (navValue){
    case "Description":
        return(
        <div className='flex flex-col justify-start items-start mt-2 md:w-[60%] md:h-[400px]'>
            <p className="text-left font-bold">{product.name}</p>
            <br></br>
            <p className=' text-gray-400'>{product.description}</p>
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
      
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 py-4 w-full">  
                        <p className="font-semibold">{review.user.name}</p>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                        <p className="text-sm text-gray-600">Rating: {review.rating} / 5</p>
                    </div>  
                ))
            ) : (
                <p>No reviews yet.</p>
            )}
        </div>)
        
      default:
          return <p>No Content</p>
  }


}
