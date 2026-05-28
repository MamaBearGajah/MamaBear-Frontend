"use client"
import {useState, useEffect} from 'react';
import { mockProducts } from '../../lib/MockProducts';
import { Product } from '@/types';
import {reviewsApi}  from '../../lib/api/reviews';

export default function ReviewCard({navValue, productId, product}:{navValue:string, productId:string, product: Product}) {
    const [reviews, setReviews] = useState();
      const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        async function fetchReviews() {
            try {
                const response = await reviewsApi.getList(productId);
                setReviews(response.data.data);
                console.log("response", response);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        }
        fetchReviews();
    }, [productId]);

    

// async function submitReview() {
//   try {

//     await reviewsApi.create(productId, {
//       rating,
//       comment,
//     });

//     alert("Review submitted");

//   } catch (error: any) {

//     const status = error.response?.status;

//     if (status === 403) {
//       alert("You must purchase this product first");
//     }

//     else if (status === 409) {
//       alert("You already reviewed this product");
//     }

//     else if (status === 400) {
//       alert("Please fill rating and comment");
//     }

//     else {
//       alert("Something went wrong");
//     }
//   }
// }







    function addHelpfulVote(reviewId: string, isHelpful: boolean) {
        reviewsApi.voteHelpful(productId, reviewId, isHelpful)
        .then(response => {
            console.log("Vote recorded:", response);
        })
        .catch(error => {
            console.error("Error recording vote:", error);
        });
    }

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
            <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-pink-500 text-white rounded">Add Review</button>

               {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                
                <div className="bg-white p-6 rounded-xl w-full max-w-md">
                    
                    <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        Add Review
                    </h2>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500"
                    >
                        ✕
                    </button>
                    </div>

                    {/* FORM */}
                    <form className="space-y-4">
                    
                    <div>
                        <label className="block mb-1">
                        Rating
                        </label>

                        <select className="w-full border p-2 rounded">
                        <option>5</option>
                        <option>4</option>
                        <option>3</option>
                        <option>2</option>
                        <option>1</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1">
                        Comment
                        </label>

                        <textarea
                        className="w-full border p-2 rounded"
                        rows={4}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-pink-500 text-white py-2 rounded"
                    >
                        Submit Review
                    </button>
                    </form>
                </div>
                </div>
            )}
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 py-4 w-full">  
                        <p className="font-semibold">{review.user.name}</p>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                        <p className="text-sm text-gray-600">Rating: {review.rating} / 5</p>

                        <button onClick={() => addHelpfulVote(review.id, true)} className="text-sm text-blue-500 mr-2">Helpful {review.helpfulCount}</button>
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
