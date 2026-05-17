import { memo } from 'react';
import YouMightAlsoLoveCard from './YouMightAlsoLoveCard';
import { mockBestSellingProducts } from '../../lib/MockBestSelling';
import { fetchProducts } from '../../services';
import { Product } from '../../types';

const YouMightAlsoLove = ({product}:{product:Product[]}) => {

  return (
    <div className='mt-3'>
      <h2 className='font-bold text-2xl flex justify-start items-center'><img className='w-[20px] mr-1' src='/heart.svg'/>You Might Also Love</h2>
      <div className='md:flex md:justify-start md:items- inline md:w-[60%]'>
        {product.map((item, index)=>{
          return(
            <div key={index}>
              <YouMightAlsoLoveCard product={{name:item.name, rating:1, price:item.discountPrice, imageUrl: item.images[0].imageUrl, stock: item.stock, createdAt: item.createdAt, slug:item.slug}}/>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default YouMightAlsoLove;