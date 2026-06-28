
import YouMightAlsoLoveCard from './YouMightAlsoLoveCard';
import { Product } from '../../types';

const YouMightAlsoLove = ({product}:{product:Product[]}) => {

  return (
    <div className='mt-3'>
      <h2 className='font-bold text-2xl flex justify-start items-center'><img className='w-[20px] mr-1' src='/heart.svg'/>You Might Also Love</h2>
        <div className='grid grid-cols-2 md:grid-cols-5 gap-4 w-full mt-4'>
            {product.map((item, index) => {
              return (
                <YouMightAlsoLoveCard
                  key={index}
                  product={{
                    id: item.id,
                    name: item.name,
                    avgRating: item.avgRating ?? 0,
                    basePrice: item.basePrice,
                    discountPrice: item.discountPrice ?? item.basePrice,
                    image: item.images[0].imageUrl,
                    stock: item.stock,
                    slug: item.slug,
                    ratingCount: item.reviewCount,
                  }}
                />
              );
            })}
          </div>
    </div>
  );
};

export default YouMightAlsoLove;