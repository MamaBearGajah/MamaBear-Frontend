import { memo } from 'react';
import YouMightAlsoLoveCard from './YouMightAlsoLoveCard';
import { mockBestSellingProducts } from '../../lib/MockBestSelling';

const YouMightAlsoLove = () => {
  return (
    <div className='mt-3'>
      <h2 className='font-bold text-2xl flex justify-start items-center'><img className='w-[20px] mr-3' src='/heart.svg'/>You Might Also Love</h2>
      <div className='md:flex md:justify-start md:items-center inline'>
        {mockBestSellingProducts.map((item, index)=>{
          return(
            <div key={index}>
              <YouMightAlsoLoveCard product={{name:item.name, rating:item.rating, price:item.price, imageUrl: item.images[0].imageUrl, stock: item.stock, createdAt: item.createdAt}}/>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default YouMightAlsoLove;