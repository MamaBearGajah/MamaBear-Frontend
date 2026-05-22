import { memo } from 'react';
import YouMightAlsoLoveCard from './YouMightAlsoLoveCard';
import { mockBestSellingProducts } from '../../lib/MockBestSelling';
import { fetchProducts } from '../../services';
import { Product } from '../../types';

const YouMightAlsoLove = ({product}:{product:Product[]}) => {

  return (
    <div className='mt-3'>
      <h2 className='font-bold text-2xl flex justify-start items-center'><img className='w-[20px] mr-1' src='/heart.svg'/>You Might Also Love</h2>
        <div className='grid grid-cols-2 gap-4 w-full md:flex md:justify-start md:items-center md:w-[60%] mt-4'>
            {product.map((item, index) => {
              return (
                <YouMightAlsoLoveCard
                  key={index}
                  product={{
                    name: item.name,
                    rating: 1,
                    price: item.discountPrice,
                    imageUrl: item.images[0].imageUrl,
                    stock: item.stock,
                    createdAt: item.createdAt,
                    slug: item.slug
                  }}
                />
              );
            })}
          </div>
    </div>
  );
};

export default YouMightAlsoLove;