import {React} from 'react';
import Stars from './Stars';
// import { Product } from '../../types';


type Product = {
    name:string;
    rating:number;
    price:string;
    imageUrl: string;
    stock:number;
    createdAt:string;

}


const YouMightAlsoLoveCard = ({product}:{product:Product}) => {
  return (
    <div className='border rounded-lg flex flex-col justify-start p-5 items-start md:w-[90%]'>
        <img className='w-[full]'  src="/Logo Mamabear.png"></img>
        <h2 className='mt-2 mb-2 font-bold'>{product.name}</h2>
        <div className='flex justify-start items-center mt-2 mb-2'><Stars rating={3} /><span className='ml-3'>{product.rating}</span></div>
        {/* <p>{product.rating}</p> */}
        <p className='mt-2 mb-2 font-bold'>Rp {product.price}</p>
    </div>
  );
};

export default YouMightAlsoLoveCard;