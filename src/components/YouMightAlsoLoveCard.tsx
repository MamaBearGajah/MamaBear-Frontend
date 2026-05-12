import {React} from 'react';

type Product = {
    name:string;
    rating:number;
    price:number;
    imageUrl: string;
    stock:number;
    createdAt:Date;

}


const YouMightAlsoLoveCard = ({product}:{product:Product}) => {
  return (
    <div className='border rounded-lg flex flex-col justify-center items-center md:w-[70%]'>
        <img className='w-[full]' src={product.imageUrl}></img>
        <h2>{product.name}</h2>
        <p>{product.rating}</p>
        <p>$ {product.price}</p>
    </div>
  );
};

export default YouMightAlsoLoveCard;