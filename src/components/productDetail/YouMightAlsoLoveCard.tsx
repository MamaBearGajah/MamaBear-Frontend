import {React} from 'react';
import Stars from './Stars';
import Link from 'next/link';
// import { Product } from '../../types';


type Product = {
    name:string;
    rating:number;
    slug:string;
    price:string;
    imageUrl: string;
    stock:number;
    createdAt:string;

}


const YouMightAlsoLoveCard = ({product}:{product:Product}) => {
  return (
    <div className='border rounded-lg flex flex-col justify-start p-5 mb-5 items-start w-[100%] md:w-[80%] hover:shadow-lg transition duration-300 cursor-pointer hover:scale-102'>
      <Link href={`/products/${product.slug}`} className='w-[60%]'>
        <img className='w-[full]'  src={product.imageUrl} alt={product.name}></img>
        <h2 className='mt-2 mb-2 font-bold text-xs md:text-lg'>{product.name}</h2>
        <div className='flex justify-start items-center mt-2 mb-2 md:text-lg text-xs'><Stars rating={3} /><span className='ml-3 md:text-lg text-xs'>{product.rating}</span></div>
        {/* <p>{product.rating}</p> */}
        <p className='mt-2 mb-2 font-bold'>Rp {product.price}</p>
      </Link>
    </div>
  );
};

export default YouMightAlsoLoveCard;