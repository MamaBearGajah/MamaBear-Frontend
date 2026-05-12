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
    <div className='borded rounded-full flex flex-col justify-center items-center md:w-[30%]'>
        <img className='w-[800px]' src={product.imageUrl}></img>
        <h2>{product.name}</h2>
        <p>{product.rating}</p>
        <p>$ {product.price}</p>
    </div>
  );
};

export default YouMightAlsoLoveCard;